export default async function handler(req, res) {
  const { username } = req.query;
  const guildId = "1237055789441487021";

  try {
    let found = null;
    for (let p = 0; p < 10; p++) {
      const resp = await fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?page=${p}`);
      const data = await resp.json();
      const match = data.players.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (match) {
        found = { ...match, rank: match.rank + 1 };
        break;
      }
    }
    if (found) res.status(200).json(found);
    else res.status(404).json({ error: "Not found" });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
}
