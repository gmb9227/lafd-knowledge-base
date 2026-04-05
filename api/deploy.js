export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { password, content, commitMessage } = req.body;
  const deployPassword = process.env.DEPLOY_PASSWORD;
  if (!deployPassword || password !== deployPassword) return res.status(401).json({ error: 'Invalid deploy password' });
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;
  if (!githubToken || !githubRepo) return res.status(500).json({ error: 'GITHUB_TOKEN or GITHUB_REPO not configured' });
  if (!content || content.length < 100) return res.status(400).json({ error: 'Content too short' });
  const filePath = 'src/App.jsx';
  const message = commitMessage || 'Update App.jsx via deploy panel';
  try {
    const getRes = await fetch('https://api.github.com/repos/' + githubRepo + '/contents/' + filePath, { headers: { 'Authorization': 'Bearer ' + githubToken, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'LAFD-KB-Deploy' } });
    if (!getRes.ok) { const err = await getRes.json(); return res.status(500).json({ error: 'GitHub GET failed: ' + err.message }); }
    const fileData = await getRes.json();
    const updateRes = await fetch('https://api.github.com/repos/' + githubRepo + '/contents/' + filePath, { method: 'PUT', headers: { 'Authorization': 'Bearer ' + githubToken, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'LAFD-KB-Deploy', 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message, content: Buffer.from(content, 'utf-8').toString('base64'), sha: fileData.sha }) });
    if (!updateRes.ok) { const err = await updateRes.json(); return res.status(500).json({ error: 'GitHub PUT failed: ' + err.message }); }
    const result = await updateRes.json();
    return res.status(200).json({ success: true, commitSha: result.commit.sha, commitUrl: result.commit.html_url, message: 'Code pushed. Vercel will auto-deploy in 60 seconds.' });
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
