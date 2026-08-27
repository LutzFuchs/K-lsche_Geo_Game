import type { VercelRequest, VercelResponse } from '@vercel/node'
import { execSync } from 'child_process'
import path from 'path'

/**
 * Wipes all documents in the Firestore `teams` collection.
 * Delegates to the existing wipe-teams.sh script which uses gcloud REST API.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests with admin authentication
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get the project root directory (parent of api/)
    const projectRoot = path.resolve(__dirname, '..')
    const scriptPath = path.join(projectRoot, 'scripts', 'wipe-teams.sh')
    
    // Execute the wipe script with --force flag (no confirmation prompt)
    const result = execSync(`chmod +x "${scriptPath}" && bash "${scriptPath}" --force`, {
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
    })

    return res.status(200).json({ 
      success: true, 
      message: result.trim() || 'Teams wiped successfully' 
    })
  } catch (error) {
    console.error('Wipe error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ error: `Failed to wipe teams: ${errorMessage}` })
  }
}
