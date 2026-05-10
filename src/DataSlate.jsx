// Clapperboard-inspired data slate that lives at the top of every app panel.
// Black-and-white film-slate stripes + stamped scene/shot/take/date data,
// then a stat row showing the running totals across the shoot.

const PROD_CODE = String(Math.floor(Math.random() * 900) + 100); // visual flavor only
const today = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
};

export default function DataSlate({
  title,
  shootType,
  vibes,
  shots,
  moods,
  blocks,
  crew,
  active = 'shots'
}) {
  const stats = [
    { key: 'shots', lbl: 'Shots', val: shots.length },
    { key: 'moodboard', lbl: 'Refs', val: moods.length },
    { key: 'schedule', lbl: 'Blocks', val: blocks.length },
    { key: 'notes', lbl: 'Crew', val: crew.length }
  ];

  return (
    <div className="slate">
      <div className="slate-stripes" aria-hidden="true" />
      <div className="slate-meta">
        <div className="slate-cell wide">
          <div className="slate-lbl">Production</div>
          <div className="slate-val">{title || 'Untitled'}</div>
        </div>
        <div className="slate-cell">
          <div className="slate-lbl">Type</div>
          <div className="slate-val">{shootType}</div>
        </div>
        <div className="slate-cell">
          <div className="slate-lbl">Mood</div>
          <div className="slate-val">{vibes && vibes.length ? vibes.join(' · ') : '—'}</div>
        </div>
        <div className="slate-cell tight">
          <div className="slate-lbl">Roll</div>
          <div className="slate-val mono">A-{PROD_CODE}</div>
        </div>
        <div className="slate-cell tight">
          <div className="slate-lbl">Date</div>
          <div className="slate-val mono">{today()}</div>
        </div>
      </div>
      <div className="slate-stats">
        {stats.map((s) => (
          <div
            key={s.key}
            className={'slate-stat' + (active === s.key ? ' on' : '')}
          >
            <div className="slate-stat-num">{String(s.val).padStart(2, '0')}</div>
            <div className="slate-stat-lbl">{s.lbl}</div>
          </div>
        ))}
        <div className="slate-stat slate-rec">
          <span className="rec-dot" /> REC
        </div>
      </div>
    </div>
  );
}
