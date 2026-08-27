#!/usr/bin/env bash
#
# Wipes the entire Firestore `teams` collection.
#
# The client SDK can't delete (security rules block unauthenticated deletes),
# so this mints a gcloud access token and calls the Firestore REST API, which
# runs as a project owner/editor and bypasses the rules. Reusable for the
# pre-event re-wipe.
#
# One-time setup (already done on this machine):
#   gcloud auth login            # use the account that owns kope-schnitzeljagd
#
# Run:
#   ./scripts/wipe-teams.sh          # prompts for confirmation
#   ./scripts/wipe-teams.sh --force  # no prompt (for automation)
#
# Verify before/after with:  node scripts/list-teams.mjs
set -euo pipefail

PROJECT="kope-schnitzeljagd"
PREFIX="https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/teams"

TOKEN=$(gcloud auth print-access-token 2>/dev/null || true)
if [ -z "$TOKEN" ]; then
  echo "No gcloud access token. Run: gcloud auth login" >&2
  exit 1
fi

IDS_RAW=$(curl -s -H "Authorization: Bearer $TOKEN" "${PREFIX}?pageSize=300")
if echo "$IDS_RAW" | grep -q '/teams/'; then
  IDS=$(echo "$IDS_RAW" | grep -oE '/teams/[A-Za-z0-9_-]+' | sed 's#/teams/##' | sort -u)
else
  IDS=""
fi
COUNT=0
if [ -n "$IDS" ]; then
  COUNT=$(printf '%s\n' "$IDS" | wc -l | tr -d ' ')
fi

echo "Found ${COUNT} team(s) in project ${PROJECT}."
if [ "$COUNT" = "0" ]; then
  echo "Nothing to delete."
  exit 0
fi

if [ "${1:-}" != "--force" ]; then
  read -r -p "Permanently delete all ${COUNT} team(s)? Type yes to confirm: " ans
  [ "$ans" = "yes" ] || { echo "Aborted. No changes made."; exit 0; }
fi

printf '%s\n' "$IDS" | while IFS= read -r id; do
  [ -z "$id" ] && continue
  CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
    -H "Authorization: Bearer $TOKEN" "${PREFIX}/${id}")
  echo "  ${id} -> ${CODE}"
done

echo "Done. Verify with: node scripts/list-teams.mjs"
