import { useState, useCallback } from 'react';
import { LIGHTING, LENSES, MOODS, SHOOT_TYPES, VIBES, id } from './data.js';

export default function FRAMEApp({ plan }) {
  const [tab, setTab] = useState('shots');
  const [title, setTitle] = useState('My Shoot');
  const [shots, setShots] = useState([]);

  const [brief, setBrief] = useState('');
  const [shootType, setShootType] = useState('Fashion Editorial');
  const [countMode, setCountMode] = useState('8');
  const [customN, setCustomN] = useState('');
  const [vibes, setVibes] = useState(['Editorial']);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiAdded, setAiAdded] = useState({});
  const [aiErr, setAiErr] = useState('');

  const [moods, setMoods] = useState([]);
  const [uQ, setUQ] = useState('');
  const [uRes, setURes] = useState([]);
  const [urlIn, setUrlIn] = useState('');

  const [blocks, setBlocks] = useState([
    { id: id(), time: '7:00', activity: 'Load in & Setup', duration: '90m' },
    { id: id(), time: '8:30', activity: 'Hair, Makeup & Wardrobe', duration: '60m' },
    { id: id(), time: '9:30', activity: 'First Look — Shot 01', duration: '45m' }
  ]);

  const [dirN, setDirN] = useState('');
  const [gearN, setGearN] = useState('');
  const [crew, setCrew] = useState([]);

  const shotCount = () => {
    if (countMode === 'custom') {
      const n = parseInt(customN, 10);
      return !n || n < 1 ? 8 : Math.min(n, 30);
    }
    return parseInt(countMode, 10);
  };

  const generate = useCallback(async () => {
    setAiLoading(true);
    setAiResults([]);
    setAiAdded({});
    setAiErr('');
    const n = shotCount();
    const v = vibes.length ? vibes.join(', ') : 'Editorial';
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shootType, brief: brief || shootType, vibe: v, count: n })
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || 'Error ' + res.status);
      }
      const data = await res.json();
      const list = data.shots || [];
      if (!list.length) throw new Error('No shots returned — try again');
      setAiResults(list);
    } catch (e) {
      setAiErr(e.message || 'Something went wrong');
    } finally {
      setAiLoading(false);
    }
  }, [brief, shootType, countMode, customN, vibes]);

  const importOne = (i) => {
    if (aiAdded[i]) return;
    const s = aiResults[i];
    setShots((p) => [
      ...p,
      {
        id: id(),
        name: s.description,
        location: '',
        lighting: s.lighting || 'Natural',
        lens: s.lens || '50mm',
        notes: s.notes || '',
        done: false,
        tags: [s.mood].filter(Boolean),
        fromAI: true
      }
    ]);
    setAiAdded((p) => ({ ...p, [i]: true }));
  };
  const importAll = () => aiResults.forEach((_, i) => importOne(i));
  const addShot = () =>
    setShots((p) => [
      ...p,
      {
        id: id(),
        name: '',
        location: '',
        lighting: 'Natural',
        lens: '50mm',
        notes: '',
        done: false,
        tags: [],
        fromAI: false
      }
    ]);
  const upShot = (sid, k, v) =>
    setShots((p) => p.map((s) => (s.id === sid ? { ...s, [k]: v } : s)));
  const rmShot = (sid) => setShots((p) => p.filter((s) => s.id !== sid));
  const doneShot = (sid) =>
    setShots((p) => p.map((s) => (s.id === sid ? { ...s, done: !s.done } : s)));
  const togTag = (sid, t) =>
    setShots((p) =>
      p.map((s) =>
        s.id === sid
          ? {
              ...s,
              tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t]
            }
          : s
      )
    );

  const searchU = async () => {
    if (!uQ.trim()) return;
    try {
      const r = await fetch(
        '/api/unsplash?q=' + encodeURIComponent(uQ) + '&per_page=8'
      );
      const d = await r.json();
      setURes(d.results || []);
    } catch {
      setURes(
        [1, 2, 3, 4, 5, 6].map((i) => ({
          id: 'f' + i,
          urls: {
            small: `https://picsum.photos/seed/${uQ + i}/300/200`,
            regular: `https://picsum.photos/seed/${uQ + i}/800/600`
          },
          user: { name: 'Sample' }
        }))
      );
    }
  };
  const addMood = (url, credit) => {
    setMoods((p) => [{ id: id(), url, credit }, ...p]);
    setURes([]);
  };
  const addByUrl = () => {
    if (!urlIn.trim()) return;
    addMood(urlIn.trim(), 'Custom');
    setUrlIn('');
  };

  const addBlk = () =>
    setBlocks((p) => [...p, { id: id(), time: '', activity: '', duration: '' }]);
  const upBlk = (bid, k, v) =>
    setBlocks((p) => p.map((b) => (b.id === bid ? { ...b, [k]: v } : b)));
  const rmBlk = (bid) => setBlocks((p) => p.filter((b) => b.id !== bid));

  const addCrew = () => setCrew((p) => [...p, { id: id(), name: '', role: '' }]);
  const upCrew = (cid, k, v) =>
    setCrew((p) => p.map((c) => (c.id === cid ? { ...c, [k]: v } : c)));
  const rmCrew = (cid) => setCrew((p) => p.filter((c) => c.id !== cid));

  return (
    <>
      <div className="app-hdr">
        <div className="app-logo">
          FR<em>A</em>ME
        </div>
        <div className="app-hdr-right">
          {plan && (
            <div
              style={{
                fontSize: '8px',
                letterSpacing: '2px',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                textAlign: 'right',
                marginBottom: 2
              }}
            >
              ✦ {plan.name}
            </div>
          )}
          <div className="hdr-lbl">Shoot Name</div>
          <input
            className="hdr-inp"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="app-tabs">
        {[
          ['shots', 'Shot List'],
          ['moodboard', 'Moodboard'],
          ['schedule', 'Schedule'],
          ['notes', 'Notes & Crew']
        ].map(([k, lbl]) => (
          <button
            key={k}
            className={'app-tab' + (tab === k ? ' on' : '')}
            onClick={() => setTab(k)}
          >
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'shots' && (
        <div className="app-panel">
          <div className="ai-wrap">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 4
              }}
            >
              <div style={{ fontSize: 18, marginTop: 2 }}>✦</div>
              <div>
                <div className="ai-title">AI Shot Generator</div>
                <div className="ai-sub">
                  Describe your shoot — get a full list instantly
                </div>
              </div>
            </div>
            <input
              className="ai-inp"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="e.g. streetwear brand rooftop at golden hour..."
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 10
              }}
            >
              <div>
                <div className="flbl" style={{ color: '#666', marginBottom: 4 }}>
                  Shoot Type
                </div>
                <select
                  className="ai-sel"
                  value={shootType}
                  onChange={(e) => setShootType(e.target.value)}
                >
                  {SHOOT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flbl" style={{ color: '#666', marginBottom: 4 }}>
                  Shot Count
                </div>
                <select
                  className="ai-sel"
                  value={countMode}
                  onChange={(e) => setCountMode(e.target.value)}
                >
                  <option value="5">5 — Quick</option>
                  <option value="8">8 — Standard</option>
                  <option value="12">12 — Full Day</option>
                  <option value="15">15 — Epic</option>
                  <option value="custom">Custom...</option>
                </select>
                {countMode === 'custom' && (
                  <input
                    className="ai-custom-inp"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="Enter number (1–30)"
                    value={customN}
                    onChange={(e) => setCustomN(e.target.value)}
                    autoFocus
                  />
                )}
              </div>
            </div>
            <div className="flbl" style={{ color: '#666', marginBottom: 6 }}>
              Vibe / Mood
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 10
              }}
            >
              {VIBES.map((v) => (
                <span
                  key={v}
                  className={'ai-chip' + (vibes.includes(v) ? ' on' : '')}
                  onClick={() =>
                    setVibes((p) =>
                      p.includes(v) ? p.filter((x) => x !== v) : [...p, v]
                    )
                  }
                >
                  {v}
                </span>
              ))}
            </div>
            <button
              className="gen-btn"
              disabled={aiLoading}
              onClick={generate}
            >
              {aiLoading ? 'GENERATING...' : 'GENERATE SHOT LIST'}
            </button>
            {aiLoading && (
              <div style={{ textAlign: 'center', padding: '18px 0' }}>
                <div
                  style={{
                    fontSize: '9px',
                    letterSpacing: '2px',
                    color: 'var(--muted)',
                    textTransform: 'uppercase'
                  }}
                >
                  Crafting your shot list
                </div>
                <div className="dots">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            )}
            {aiErr && (
              <div className="err-box">
                <div style={{ fontSize: 22, marginBottom: 6 }}>⚠️</div>
                <div className="err-msg">{aiErr}</div>
                <div className="err-sub">Try again</div>
              </div>
            )}
            {aiResults.length > 0 && (
              <div>
                <div className="ai-res-bar">
                  <div className="ai-res-lbl">
                    ✦ {aiResults.length} shots generated
                  </div>
                  <button className="import-all-btn" onClick={importAll}>
                    Import All →
                  </button>
                </div>
                {aiResults.map((s, i) => (
                  <div className="ai-card" key={i}>
                    <div className="ai-card-top">
                      <div className="ai-num">
                        SHOT {String(i + 1).padStart(2, '0')}
                      </div>
                      <button
                        className={'ai-add-btn' + (aiAdded[i] ? ' done' : '')}
                        onClick={() => importOne(i)}
                      >
                        {aiAdded[i] ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                    <div className="ai-desc">{s.description}</div>
                    {s.notes && <div className="ai-note">{s.notes}</div>}
                    <div className="ai-pills">
                      <span className="pill pill-l">⚡ {s.lighting}</span>
                      <span className="pill pill-n">🔭 {s.lens}</span>
                      <span className="pill pill-m">✦ {s.mood}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="aadd-row" onClick={addShot}>
            ＋ Add Shot Manually
          </button>
          <div className="slbl">
            Shot List <span className="abadge">{shots.length}</span>
          </div>
          {shots.length === 0 && (
            <div className="aempty">
              <div className="aempty-ico">📷</div>
              Generate a shot list above or add manually
            </div>
          )}
          {shots.map((s) => (
            <div key={s.id} className={'shot-card' + (s.done ? ' done' : '')}>
              <div className="shot-hdr">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="shot-num">
                    SHOT {String(s.id).padStart(2, '0')}
                  </div>
                  {s.fromAI && <div className="ai-bdg">✦ AI</div>}
                </div>
                <div className="shot-acts">
                  <button
                    className={'act chk' + (s.done ? ' on' : '')}
                    onClick={() => doneShot(s.id)}
                  >
                    ✓
                  </button>
                  <button className="act" onClick={() => rmShot(s.id)}>
                    ×
                  </button>
                </div>
              </div>
              <div className="shot-body">
                <div className="flbl">Shot Description</div>
                <input
                  className="finp"
                  value={s.name}
                  placeholder="Describe the shot..."
                  onChange={(e) => upShot(s.id, 'name', e.target.value)}
                />
                <div className="flbl">Location / Set</div>
                <input
                  className="finp"
                  value={s.location}
                  placeholder="e.g. Rooftop, Studio A..."
                  onChange={(e) => upShot(s.id, 'location', e.target.value)}
                />
                <div className="shot-grid2">
                  <div>
                    <div className="flbl">Lighting</div>
                    <select
                      className="finp"
                      value={s.lighting}
                      onChange={(e) => upShot(s.id, 'lighting', e.target.value)}
                    >
                      {LIGHTING.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flbl">Lens</div>
                    <select
                      className="finp"
                      value={s.lens}
                      onChange={(e) => upShot(s.id, 'lens', e.target.value)}
                    >
                      {LENSES.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flbl">Vibe</div>
                <div className="atags">
                  {MOODS.map((t) => (
                    <span
                      key={t}
                      className={'atag' + (s.tags.includes(t) ? ' on' : '')}
                      onClick={() => togTag(s.id, t)}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flbl">Director Notes</div>
                <input
                  className="finp"
                  value={s.notes}
                  placeholder="Blocking, wardrobe, execution..."
                  onChange={(e) => upShot(s.id, 'notes', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'moodboard' && (
        <div className="app-panel">
          <div className="slbl">Search Unsplash</div>
          <div className="arow">
            <input
              className="ainp"
              value={uQ}
              onChange={(e) => setUQ(e.target.value)}
              placeholder="golden hour, editorial, moody..."
              onKeyDown={(e) => e.key === 'Enter' && searchU()}
            />
            <button className="abtn" onClick={searchU}>
              Search
            </button>
          </div>
          {uRes.length > 0 && (
            <div className="grid2" style={{ marginBottom: 16 }}>
              {uRes.map((p) => (
                <div
                  key={p.id}
                  className="thumb"
                  onClick={() => addMood(p.urls.regular, p.user.name)}
                >
                  <img src={p.urls.small} loading="lazy" alt="" />
                  <div className="ov">＋</div>
                </div>
              ))}
            </div>
          )}
          <div className="slbl">Add by URL</div>
          <div className="arow">
            <input
              className="ainp"
              value={urlIn}
              onChange={(e) => setUrlIn(e.target.value)}
              placeholder="Paste any image URL..."
            />
            <button className="abtn abtn-ghost" onClick={addByUrl}>
              Add
            </button>
          </div>
          <div className="slbl">
            Moodboard <span className="abadge">{moods.length}</span>
          </div>
          {moods.length === 0 ? (
            <div className="aempty">
              <div className="aempty-ico">🎞</div>Search Unsplash or paste a URL
            </div>
          ) : (
            <div className="grid2">
              {moods.map((m) => (
                <div key={m.id} className="mood-card">
                  <img
                    src={m.url}
                    loading="lazy"
                    alt=""
                    onError={(e) =>
                      (e.currentTarget.src =
                        'https://picsum.photos/seed/' + m.id + '/400/300')
                    }
                  />
                  <div className="mood-foot">
                    <span className="mood-cred">{m.credit}</span>
                    <button
                      className="arm"
                      onClick={() =>
                        setMoods((p) => p.filter((x) => x.id !== m.id))
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'schedule' && (
        <div className="app-panel">
          <div className="slbl">Day Schedule</div>
          <div className="sched-hdr">
            <div>Time</div>
            <div>Activity</div>
            <div>Duration</div>
            <div />
          </div>
          {blocks.map((b) => (
            <div key={b.id} className="blk">
              <input
                className="t-inp"
                value={b.time}
                placeholder="9:00"
                onChange={(e) => upBlk(b.id, 'time', e.target.value)}
              />
              <input
                className="tl-inp"
                value={b.activity}
                placeholder="Setup / Shot 01..."
                onChange={(e) => upBlk(b.id, 'activity', e.target.value)}
              />
              <input
                className="dur-inp"
                value={b.duration}
                placeholder="30m"
                onChange={(e) => upBlk(b.id, 'duration', e.target.value)}
              />
              <button className="arm" onClick={() => rmBlk(b.id)}>
                ×
              </button>
            </div>
          ))}
          <button className="add-blk" onClick={addBlk}>
            ＋ Add Time Block
          </button>
        </div>
      )}

      {tab === 'notes' && (
        <div className="app-panel">
          <div className="slbl">Director&apos;s Notes</div>
          <textarea
            className="notes-ta"
            value={dirN}
            onChange={(e) => setDirN(e.target.value)}
            placeholder="Mood, tone, client brief, technical notes..."
          />
          <div className="slbl">Gear List</div>
          <textarea
            className="notes-ta"
            style={{ minHeight: 100 }}
            value={gearN}
            onChange={(e) => setGearN(e.target.value)}
            placeholder="Camera body, lenses, lighting, grip..."
          />
          <div className="slbl">Crew</div>
          {crew.map((c) => (
            <div key={c.id} className="crew-card">
              <div className="crew-av">
                {c.name ? c.name.slice(0, 2).toUpperCase() : '?'}
              </div>
              <div className="crew-info">
                <input
                  className="crew-n"
                  value={c.name}
                  placeholder="Full Name"
                  onChange={(e) => upCrew(c.id, 'name', e.target.value)}
                />
                <input
                  className="crew-r"
                  value={c.role}
                  placeholder="Role / Department"
                  onChange={(e) => upCrew(c.id, 'role', e.target.value)}
                />
              </div>
              <button className="arm" onClick={() => rmCrew(c.id)}>
                ×
              </button>
            </div>
          ))}
          <button className="aadd-row" onClick={addCrew}>
            ＋ Add Crew Member
          </button>
        </div>
      )}
    </>
  );
}
