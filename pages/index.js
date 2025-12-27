import { useState } from 'react';

export default function GenLayerDashboard() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRankData = (lvl) => {
    if (lvl >= 54) return { label: 'SINGULARITY 🎖️🎊', color: '#22C55E', text: '54 upward' };
    if (lvl >= 36) return { label: 'BRAIN', color: '#A855F7', text: '36-53' };
    if (lvl >= 18) return { label: 'SYNAPSE', color: '#3B82F6', text: '18-35' };
    if (lvl >= 7)  return { label: 'NEURON', color: '#FB923C', text: '7-17' };
    return { label: 'MOLECULE', color: '#FACC15', text: '1-6' };
  };

  const getNextXP = (lvl) => 5 * (lvl ** 2) + 50 * lvl + 100;

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/stats?username=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) setUser(data);
      else setError("User not found in rankings.");
    } catch (e) { setError("Scan failed."); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '900', letterSpacing: '4px', marginBottom: '30px' }}>GENLAYER INTEL</h1>

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          
          {/* LEFT SIDE: SEARCH AND RESULT */}
          <div style={{ flex: '1', minWidth: '320px', maxWidth: '450px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #222', backgroundColor: '#111', color: '#fff' }}
                placeholder="Enter Username..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={handleSearch} style={{ padding: '0 20px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', border: 'none' }}>
                {loading ? '...' : 'SCAN'}
              </button>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {user && (
              <div style={{ background: '#080808', padding: '30px', borderRadius: '30px', border: `2px solid ${getRankData(user.level).color}`, textAlign: 'center' }}>
                <img 
                  src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`} 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', border: `3px solid ${getRankData(user.level).color}`, marginBottom: '15px' }}
                />
                
                {/* COLORED USERNAME */}
                <h2 style={{ color: getRankData(user.level).color, fontSize: '36px', fontWeight: '900', margin: '0' }}>{user.username}</h2>
                <p style={{ color: '#444', fontSize: '12px', margin: '5px 0' }}>RANK #{user.rank}</p>

                {/* XP PROGRESS BAR */}
                <div style={{ textAlign: 'left', margin: '20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888', marginBottom: '5px' }}>
                    <span>LVL {user.level}</span>
                    <span>{user.message_xp} / {getNextXP(user.level)} XP</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#1a1a1a', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((user.message_xp / getNextXP(user.level)) * 100, 100)}%`, height: '100%', background: getRankData(user.level).color }}></div>
                  </div>
                </div>

                <h1 style={{ color: getRankData(user.level).color, fontSize: '32px', fontWeight: '900', fontStyle: 'italic', margin: '0' }}>
                  {getRankData(user.level).label}
                </h1>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: THE LEGEND (LISTED OUT) */}
          <div style={{ minWidth: '250px', background: '#0a0a0a', padding: '25px', borderRadius: '25px', border: '1px solid #1a1a1a', height: 'fit-content' }}>
            <h3 style={{ fontSize: '14px', color: '#444', marginBottom: '20px', letterSpacing: '1px' }}>SYSTEM ROLES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontWeight: 'bold' }}>
              <div style={{ color: '#FACC15' }}>Molecule level 1-6</div>
              <div style={{ color: '#FB923C' }}>Neuron level 7-17</div>
              <div style={{ color: '#3B82F6' }}>Synapse level 18-35</div>
              <div style={{ color: '#A855F7' }}>Brain level 36-53</div>
              <div style={{ color: '#22C55E' }}>Singularity🎖️🎊 level 54 upward</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
      }
