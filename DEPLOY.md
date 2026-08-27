# Deploy KOPE to Google Cloud Run

Two paths. Both produce the same running service. Pick by how often you'll iterate.

| Path | When | Effort |
|------|------|--------|
| **A — `gcloud run deploy --source .`** | One-shot deploy, edits are rare, no GitHub | 5 min, single command |
| **B — GitHub → Cloud Build trigger** | You'll push fixes (meeting-point text, copy tweaks) up to and during the event | 10 min setup, then `git push` ships it |

Recommended: **B** for this event. You'll almost certainly want to flip `showMeetingPoint` to `true` shortly before 17:00 and have it live in 60 seconds with one command.

---

## Path A — Deploy directly from your machine

No GitHub, no triggers, just one command. Buildpacks read your `Dockerfile` automatically.

### One-time setup

```bash
# Install gcloud CLI if you don't have it (macOS)
brew install --cask google-cloud-sdk

# Login + pick a project
gcloud auth login
gcloud projects create kope-munich-2026   # or use an existing project
gcloud config set project kope-munich-2026

# Enable the APIs Cloud Run + Cloud Build need
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

### Deploy

```bash
cd /Users/tazaio/Projects/KOPE
gcloud run deploy kope \
  --source . \
  --region europe-west3 \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances 1 \
  --max-instances 10 \
  --memory 256Mi
```

First run takes ~3–4 minutes (Cloud Build packages the Dockerfile + pushes to Artifact Registry + rolls out a revision). Subsequent runs are ~90 seconds.

When it finishes, `gcloud` prints the public URL, e.g. `https://kope-abc123-ew.a.run.app`. Open it on your phone — that's the URL participants will visit.

### Re-deploy after edits

```bash
gcloud run deploy kope --source . --region europe-west3
```

That's the whole loop.

---

## Path B — GitHub-driven deploys (recommended)

`git push origin main` → Cloud Build builds the Dockerfile → Cloud Run rolls out a new revision. ~2 minutes from push to live.

### Step 1 · Push to GitHub

```bash
cd /Users/tazaio/Projects/KOPE

# Init repo
git init -b main
git add .
git commit -m "Initial commit"

# Create a private repo on GitHub (CLI; you can also use the website)
brew install gh                  # if you don't have it
gh auth login
gh repo create kope --private --source=. --remote=origin --push
```

If you don't want to use `gh`: create the repo at https://github.com/new, then:

```bash
git remote add origin git@github.com:YOURUSER/kope.git
git push -u origin main
```

### Step 2 · One-time Cloud connection (UI is easier here)

The first time you connect a GitHub repo to Cloud Build, Google needs you to authorize a GitHub App. Do that in the console — it's a 30-second click-through:

1. Open the Cloud Run console: https://console.cloud.google.com/run
2. **Create service** → choose **Continuously deploy from a repository (source or function)** → **Set up with Cloud Build**
3. Provider: **GitHub** → **Authenticate** → install the *Google Cloud Build* GitHub App on your account.
4. Pick the **kope** repository.
5. Branch: **`^main$`** (regex — exact main).
6. Build type: **Dockerfile**. Path: `/Dockerfile`.
7. Click **Save**.

You're back at the Create-service form, this time pre-filled. Set:

- **Region:** `europe-west3` (Frankfurt — closest to Munich)
- **Allow unauthenticated invocations:** ✅
- **CPU allocation:** Only during request processing (cheaper)
- **Min instances:** `1` (keeps a warm container so the 17:00 sharp first request doesn't pay cold-start)
- **Max instances:** `10`
- **Memory:** `256 MiB`
- **Container port:** `8080`

Click **Create**. The first build runs immediately. ~3 minutes later you have a live URL.

### Step 3 · Push to deploy

From now on:

```bash
# edit src/config.ts — flip showMeetingPoint to true, set finalMeetingPointText
git commit -am "reveal meeting point"
git push
```

Cloud Build picks it up within ~10 seconds, builds the Dockerfile, deploys a new revision, traffic moves over atomically. ~90 seconds from push to phone.

You can watch progress at https://console.cloud.google.com/cloud-build/builds.

### Optional · CLI version of Step 2

If you'd rather skip the console:

```bash
# Connect (needs the GitHub App authorization at least once via the web UI)
gcloud builds triggers create github \
  --name=kope-main \
  --repo-name=kope \
  --repo-owner=YOURUSER \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml
```

Add a `cloudbuild.yaml` to the repo:

```yaml
steps:
  - name: gcr.io/cloud-builders/docker
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/kope:$COMMIT_SHA', '.']
  - name: gcr.io/cloud-builders/docker
    args: ['push', 'gcr.io/$PROJECT_ID/kope:$COMMIT_SHA']
  - name: gcr.io/google.com/cloudsdktool/cloud-sdk
    entrypoint: gcloud
    args:
      - run
      - deploy
      - kope
      - --image=gcr.io/$PROJECT_ID/kope:$COMMIT_SHA
      - --region=europe-west3
      - --platform=managed
      - --allow-unauthenticated
      - --port=8080
      - --min-instances=1
      - --max-instances=10
options:
  logging: CLOUD_LOGGING_ONLY
```

---

## Custom domain (optional)

Cloud Run gives you a `*.a.run.app` URL by default. If you want `hunt.example.com` for participants:

```bash
gcloud beta run domain-mappings create \
  --service kope \
  --domain hunt.example.com \
  --region europe-west3
```

Then add the printed `CNAME` (or `A`/`AAAA`) records to your DNS. Cloud Run handles the TLS cert automatically.

---

## Pre-event checklist

Run through this 24 hours before the event so you don't discover surprises at 16:55:

- [ ] Service URL opens on **iPhone Safari** and **Android Chrome** over **mobile data** (not just Wi-Fi).
- [ ] Browser asks for **location permission** on first load.
- [ ] Browser asks for **camera permission** when you tap the team-photo button (iOS especially needs HTTPS *and* a user gesture — both are in place).
- [ ] At a real Munich coordinate, the first station auto-unlocks within 10 s.
- [ ] Long-press on the station title for 1.5 s opens the **Host-Übersteuerung** dialog.
- [ ] The countdown card shows the right Berlin time. (If it shows 18:00 instead of 17:00, you've got the UTC offset wrong — see `raceStartAt` in `src/config.ts`.)
- [ ] `showMeetingPoint = false` in production until you're ready to reveal it.
- [ ] `--min-instances 1` is set so the first 17:00 request doesn't cold-start.

## Cost

This app is tiny. Realistic costs for the event afternoon (assuming ~50 teams hitting the URL across the 60-minute window):

- Cloud Run: < €0.10 (free tier covers the day)
- Cloud Build: < €0.05 per deploy (free tier covers daily redeploys)
- Artifact Registry: < €0.05/month for the image

Set a budget alert at €5/month if you want a safety net:

```bash
gcloud billing budgets create --billing-account=XXXXXX-XXXXXX-XXXXXX \
  --display-name="kope guard" \
  --budget-amount=5EUR \
  --threshold-rule=percent=80
```

## Tear-down after the event

```bash
gcloud run services delete kope --region europe-west3
gcloud builds triggers delete kope-main
gcloud artifacts repositories delete kope --location europe-west3   # optional
```

The repo on GitHub stays as a portfolio record.
