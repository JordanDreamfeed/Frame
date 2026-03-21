import { useState, useCallback } from “react”;

// ═══════════════════════════════════════════════════
//  FRAME — Shoot Planner
//  Pricing · Auth · App  (single-file bundle)
// ═══════════════════════════════════════════════════

const PRICING_S = `
@import url(‘https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap’);

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
–ink: #0d0d0d;
–paper: #f4f0e8;
–cream: #ede8de;
–accent: #c8441a;
–blue: #1a4ec8;
–green: #1a7a4a;
–gold: #b8962e;
–muted: #8a8478;
–card: #faf8f3;
–border: #d4cfc4;
}

body {
background: var(–ink);
font-family: ‘DM Mono’, monospace;
font-size: 13px;
color: var(–paper);
min-height: 100vh;
}

@keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.5} }
@keyframes grain    { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1%,1%)} 50%{transform:translate(1%,-1%)} 75%{transform:translate(-1%,-1%)} }

/* ── Background ── */
.bg {
position: fixed; inset: 0; z-index: 0; overflow: hidden;
background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(200,68,26,.12) 0%, transparent 60%),
radial-gradient(ellipse 60% 50% at 80% 80%, rgba(26,78,200,.09) 0%, transparent 60%),
var(–ink);
}
.bg::after {
content: ‘’; position: absolute; inset: -50%;
width: 200%; height: 200%;
background-image: url(“data:image/svg+xml,%3Csvg viewBox=‘0 0 256 256’ xmlns=‘http://www.w3.org/2000/svg’%3E%3Cfilter id=‘noise’%3E%3CfeTurbulence type=‘fractalNoise’ baseFrequency=‘0.9’ numOctaves=‘4’ stitchTiles=‘stitch’/%3E%3C/filter%3E%3Crect width=‘100%25’ height=‘100%25’ filter=‘url(%23noise)’ opacity=‘0.04’/%3E%3C/svg%3E”);
animation: grain 4s steps(1) infinite;
opacity: .4;
pointer-events: none;
}

.wrap { position: relative; z-index: 1; max-width: 480px; margin: 0 auto; padding: 0 16px 60px; }

/* ── Header ── */
.pg-hdr {
text-align: center;
padding: 48px 0 36px;
animation: fadeUp .6s ease both;
}
.logo-mark {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 36px;
letter-spacing: 8px;
color: var(–paper);
margin-bottom: 6px;
}
.logo-mark em { color: var(–accent); font-style: normal; }
.pg-eyebrow {
font-size: 8px;
letter-spacing: 4px;
text-transform: uppercase;
color: var(–muted);
margin-bottom: 20px;
}
.pg-headline {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 38px;
letter-spacing: 2px;
line-height: 1.0;
color: var(–paper);
margin-bottom: 12px;
}
.pg-headline em { color: var(–accent); font-style: normal; }
.pg-sub {
font-size: 11px;
color: var(–muted);
line-height: 1.7;
max-width: 320px;
margin: 0 auto;
}

/* ── Billing Toggle ── */
.billing-toggle {
display: flex;
align-items: center;
justify-content: center;
gap: 12px;
margin-bottom: 32px;
animation: fadeUp .6s ease .1s both;
}
.toggle-lbl {
font-size: 9px;
letter-spacing: 2px;
text-transform: uppercase;
color: var(–muted);
cursor: pointer;
transition: color .2s;
}
.toggle-lbl.on { color: var(–paper); }
.toggle-track {
width: 42px; height: 22px;
background: #222;
border: 1px solid #333;
border-radius: 11px;
position: relative;
cursor: pointer;
transition: background .2s;
}
.toggle-track.on { background: var(–accent); border-color: var(–accent); }
.toggle-thumb {
position: absolute;
top: 3px; left: 3px;
width: 14px; height: 14px;
background: var(–paper);
border-radius: 50%;
transition: transform .2s;
}
.toggle-track.on .toggle-thumb { transform: translateX(20px); }
.save-pill {
font-size: 8px;
letter-spacing: 1px;
text-transform: uppercase;
padding: 2px 8px;
background: rgba(26,122,74,.25);
border: 1px solid rgba(26,122,74,.4);
color: #4caf80;
}

/* ── Trial Banner ── */
.trial-banner {
background: rgba(200,68,26,.1);
border: 1px solid rgba(200,68,26,.25);
padding: 14px 16px;
margin-bottom: 20px;
display: flex;
align-items: center;
gap: 12px;
animation: fadeUp .5s ease .15s both;
}
.trial-ico { font-size: 20px; flex-shrink: 0; }
.trial-text { flex: 1; }
.trial-title { font-size: 11px; color: var(–paper); margin-bottom: 2px; }
.trial-sub { font-size: 9px; letter-spacing: 1px; color: var(–muted); text-transform: uppercase; }
.trial-cta {
background: var(–accent);
color: white;
border: none;
padding: 8px 14px;
font-family: ‘DM Mono’, monospace;
font-size: 9px;
letter-spacing: 1px;
text-transform: uppercase;
cursor: pointer;
white-space: nowrap;
transition: filter .2s;
flex-shrink: 0;
}
.trial-cta:hover { filter: brightness(1.15); }

/* ── Plan Cards ── */
.plans { display: flex; flex-direction: column; gap: 12px; }

.plan-card {
background: rgba(255,255,255,.04);
border: 1px solid #222;
padding: 20px;
position: relative;
overflow: hidden;
cursor: pointer;
transition: border-color .25s, transform .2s;
animation: fadeUp .5s ease both;
}
.plan-card:hover { border-color: #444; transform: translateY(-1px); }
.plan-card.selected { border-color: var(–accent) !important; }
.plan-card.featured { border-color: #333; background: rgba(255,255,255,.06); }
.plan-card.featured.selected { border-color: var(–accent); }

/* shimmer line on featured */
.plan-card.featured::before {
content: ‘’;
position: absolute; top: 0; left: 0; right: 0; height: 2px;
background: linear-gradient(90deg, var(–accent), var(–blue), var(–green), var(–accent));
background-size: 200% 100%;
animation: shimmer 3s linear infinite;
}

.plan-card:nth-child(1) { animation-delay: .15s; }
.plan-card:nth-child(2) { animation-delay: .22s; }
.plan-card:nth-child(3) { animation-delay: .29s; }
.plan-card:nth-child(4) { animation-delay: .36s; }

.plan-top {
display: flex;
justify-content: space-between;
align-items: flex-start;
margin-bottom: 14px;
}
.plan-name-wrap {}
.plan-badge {
font-size: 8px;
letter-spacing: 2px;
text-transform: uppercase;
color: var(–muted);
margin-bottom: 4px;
}
.plan-name {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 26px;
letter-spacing: 3px;
color: var(–paper);
line-height: 1;
}
.popular-tag {
font-size: 8px;
letter-spacing: 1px;
text-transform: uppercase;
padding: 3px 9px;
background: rgba(200,68,26,.2);
border: 1px solid rgba(200,68,26,.35);
color: var(–accent);
}
.team-tag {
font-size: 8px;
letter-spacing: 1px;
text-transform: uppercase;
padding: 3px 9px;
background: rgba(184,150,46,.15);
border: 1px solid rgba(184,150,46,.3);
color: var(–gold);
}

.price-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
.price-dollar { font-size: 13px; color: var(–muted); margin-top: 4px; }
.price-amount {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 42px;
letter-spacing: 0;
color: var(–paper);
line-height: 1;
}
.price-free {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 42px;
color: var(–muted);
line-height: 1;
}
.price-per { font-size: 10px; color: var(–muted); }
.price-annual { font-size: 9px; color: #4caf80; letter-spacing: 1px; margin-bottom: 14px; }
.price-note { font-size: 9px; color: var(–muted); letter-spacing: 1px; margin-bottom: 14px; }

.divider { height: 1px; background: #1e1e1e; margin-bottom: 14px; }

.features { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
.feature { display: flex; align-items: flex-start; gap: 10px; font-size: 11px; color: #aaa; line-height: 1.4; }
.feature .check { color: var(–green); font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.feature .cross { color: #444; font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.feature.hi { color: var(–paper); }
.feature .ai-tag {
font-size: 8px;
letter-spacing: 1px;
padding: 1px 6px;
background: rgba(200,68,26,.15);
border: 1px solid rgba(200,68,26,.25);
color: var(–accent);
text-transform: uppercase;
white-space: nowrap;
}

.plan-btn {
width: 100%;
padding: 13px;
font-family: ‘Bebas Neue’, sans-serif;
font-size: 18px;
letter-spacing: 4px;
border: none;
cursor: pointer;
transition: all .2s;
position: relative;
overflow: hidden;
}
.plan-btn-free    { background: #1a1a1a; color: #666; border: 1px solid #2a2a2a; }
.plan-btn-free:hover { background: #222; color: #888; }
.plan-btn-creator { background: var(–accent); color: white; }
.plan-btn-creator:hover { filter: brightness(1.1); transform: translateY(-1px); }
.plan-btn-pro     { background: linear-gradient(135deg, var(–accent), #1a4ec8); color: white; }
.plan-btn-pro:hover { filter: brightness(1.1); transform: translateY(-1px); }
.plan-btn-team    { background: var(–gold); color: var(–ink); }
.plan-btn-team:hover { filter: brightness(1.1); transform: translateY(-1px); }

.plan-btn.selected-btn::after {
content: ‘✓ SELECTED’;
position: absolute;
inset: 0;
background: rgba(0,0,0,.6);
display: flex;
align-items: center;
justify-content: center;
font-size: 14px;
letter-spacing: 3px;
}

/* ── Checkout Bar ── */
.checkout-bar {
position: fixed;
bottom: 0; left: 0; right: 0;
background: rgba(13,13,13,.95);
border-top: 1px solid #2a2a2a;
backdrop-filter: blur(12px);
padding: 14px 20px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 12px;
z-index: 50;
transform: translateY(100%);
transition: transform .3s ease;
}
.checkout-bar.visible { transform: translateY(0); }
.checkout-info {}
.checkout-plan { font-family: ‘Bebas Neue’, sans-serif; font-size: 20px; letter-spacing: 2px; color: var(–paper); }
.checkout-price { font-size: 9px; letter-spacing: 2px; color: var(–muted); text-transform: uppercase; }
.checkout-btn {
background: var(–accent);
color: white;
border: none;
padding: 12px 24px;
font-family: ‘Bebas Neue’, sans-serif;
font-size: 18px;
letter-spacing: 3px;
cursor: pointer;
transition: all .2s;
white-space: nowrap;
}
.checkout-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
.checkout-btn.pro-btn { background: linear-gradient(135deg, var(–accent), var(–blue)); }
.checkout-btn.team-btn { background: var(–gold); color: var(–ink); }

/* ── FAQ ── */
.faq-wrap { margin-top: 40px; animation: fadeUp .5s ease .5s both; }
.faq-title { font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: var(–muted); margin-bottom: 16px; text-align: center; }
.faq-item { border-bottom: 1px solid #1e1e1e; padding: 14px 0; cursor: pointer; }
.faq-q { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(–paper); gap: 10px; }
.faq-arrow { color: var(–muted); font-size: 14px; transition: transform .2s; flex-shrink: 0; }
.faq-arrow.open { transform: rotate(180deg); }
.faq-a { font-size: 10px; color: var(–muted); line-height: 1.65; margin-top: 10px; display: none; }
.faq-a.open { display: block; }

/* ── Trust row ── */
.trust-row {
display: flex;
justify-content: center;
gap: 20px;
margin-top: 32px;
padding-top: 24px;
border-top: 1px solid #1a1a1a;
animation: fadeUp .5s ease .6s both;
}
.trust-item { text-align: center; }
.trust-ico { font-size: 18px; margin-bottom: 4px; }
.trust-lbl { font-size: 8px; letter-spacing: 1px; text-transform: uppercase; color: var(–muted); }
`;

const PLANS = [
{
id: “free”,
badge: “Start Here”,
name: “Free Trial”,
price: 0,
annualPrice: 0,
pricePer: “”,
priceNote: “3 AI generations · no card required”,
annualNote: “”,
tag: null,
features: [
{ text: “3 AI shot list generations”, hi: true, check: true },
{ text: “1 shoot saved”, hi: false, check: true },
{ text: “Moodboard & video refs”, hi: false, check: true },
{ text: “Manual shot planning”, hi: false, check: true },
{ text: “Daily AI generations”, hi: false, check: false },
{ text: “PDF export”, hi: false, check: false },
{ text: “Team collaboration”, hi: false, check: false },
],
btn: “START FREE”,
btnClass: “plan-btn-free”,
featured: false,
},
{
id: “creator”,
badge: “Most Popular”,
name: “Creator”,
price: 5,
annualPrice: 4,
pricePer: “/mo”,
priceNote: “”,
annualNote: “Billed $48/yr — save $12”,
tag: “popular”,
features: [
{ text: “1 AI generation per day”, hi: true, check: true, aiTag: true },
{ text: “Unlimited shoots saved”, hi: false, check: true },
{ text: “Moodboard & video refs”, hi: false, check: true },
{ text: “Full shoot planner”, hi: false, check: true },
{ text: “Schedule & crew tools”, hi: false, check: true },
{ text: “PDF export”, hi: false, check: false },
{ text: “Team collaboration”, hi: false, check: false },
],
btn: “GET CREATOR”,
btnClass: “plan-btn-creator”,
featured: true,
},
{
id: “pro”,
badge: “Best Value”,
name: “Pro”,
price: 12,
annualPrice: 9,
pricePer: “/mo”,
priceNote: “”,
annualNote: “Billed $108/yr — save $36”,
tag: null,
features: [
{ text: “Unlimited AI generations”, hi: true, check: true, aiTag: true },
{ text: “Unlimited shoots saved”, hi: false, check: true },
{ text: “PDF shot list export”, hi: true, check: true },
{ text: “Priority AI responses”, hi: false, check: true },
{ text: “Full shoot planner”, hi: false, check: true },
{ text: “Schedule & crew tools”, hi: false, check: true },
{ text: “Team collaboration”, hi: false, check: false },
],
btn: “GET PRO”,
btnClass: “plan-btn-pro”,
featured: true,
},
{
id: “team”,
badge: “For Studios”,
name: “Team”,
price: 29,
annualPrice: 23,
pricePer: “/mo”,
priceNote: “”,
annualNote: “Billed $276/yr — save $72”,
tag: “team”,
features: [
{ text: “Everything in Pro”, hi: true, check: true },
{ text: “3 team seats included”, hi: true, check: true },
{ text: “Shared shoots & moodboards”, hi: false, check: true },
{ text: “Crew collaboration tools”, hi: false, check: true },
{ text: “Team shoot calendar”, hi: false, check: true },
{ text: “Priority support”, hi: false, check: true },
{ text: “Add seats — $8/seat/mo”, hi: false, check: true },
],
btn: “GET TEAM”,
btnClass: “plan-btn-team”,
featured: false,
},
];

const FAQS = [
{ q: “Can I cancel anytime?”, a: “Yes — cancel with one click from your account settings. No questions asked, no fees. Your data stays accessible until the end of your billing period.” },
{ q: “What counts as one AI generation?”, a: “Each time you hit ‘Generate Shot List’ counts as one generation. You can generate as many shots per list as you want (up to 30) — it still counts as one use.” },
{ q: “How does the free trial work?”, a: “You get 3 AI shot list generations for free with no credit card required. All other planning tools — moodboard, video refs, schedule, and manual shot building — are completely free forever.” },
{ q: “Can I upgrade or downgrade my plan?”, a: “Absolutely. You can change your plan at any time. Upgrades take effect immediately and we prorate the difference. Downgrades take effect at the next billing cycle.” },
{ q: “How does Team billing work?”, a: “The Team plan includes 3 seats. You can add more seats at $8/seat/month. All seats share the same billing cycle and are managed from the owner’s dashboard.” },
];

function PricingPage({ onSelect }) {
const [annual, setAnnual]       = useState(false);
const [selected, setSelected]   = useState(null);
const [openFaq, setOpenFaq]     = useState(null);
const [trialDismissed, setTrialDismissed] = useState(false);

const selectedPlan = PLANS.find(p => p.id === selected);

const displayPrice = (plan) => {
if (plan.price === 0) return null;
return annual ? plan.annualPrice : plan.price;
};

const checkoutLabel = () => {
if (!selectedPlan) return “”;
if (selectedPlan.price === 0) return “FREE”;
const p = displayPrice(selectedPlan);
return `$${p}/mo${annual ? " · billed annually" : ""}`;
};

const checkoutBtnClass = () => {
if (!selectedPlan) return “”;
if (selectedPlan.id === “pro”)  return “checkout-btn pro-btn”;
if (selectedPlan.id === “team”) return “checkout-btn team-btn”;
return “checkout-btn”;
};

return (
<>
<style>{PRICING_S}</style>
<div className="bg" />

```
  <div className="wrap">

    {/* Header */}
    <div className="pg-hdr">
      <div className="logo-mark">FR<em>A</em>ME</div>
      <div className="pg-eyebrow">Shoot Planner · Pricing</div>
      <div className="pg-headline">Every shot.<br/>Every mood.<br/><em>One place.</em></div>
      <div className="pg-sub">Start free. Upgrade when the AI saves you more time than it costs.</div>
    </div>

    {/* Billing Toggle */}
    <div className="billing-toggle">
      <span className={`toggle-lbl${!annual?" on":""}`} onClick={()=>setAnnual(false)}>Monthly</span>
      <div className={`toggle-track${annual?" on":""}`} onClick={()=>setAnnual(a=>!a)}>
        <div className="toggle-thumb" />
      </div>
      <span className={`toggle-lbl${annual?" on":""}`} onClick={()=>setAnnual(true)}>Annual</span>
      {annual && <span className="save-pill">Save up to 25%</span>}
    </div>

    {/* Trial Banner */}
    {!trialDismissed && (
      <div className="trial-banner">
        <div className="trial-ico">✦</div>
        <div className="trial-text">
          <div className="trial-title">Start with 3 free AI generations</div>
          <div className="trial-sub">No credit card · No commitment</div>
        </div>
        <button className="trial-cta" onClick={()=>setSelected("free")}>Start Free</button>
      </div>
    )}

    {/* Plan Cards */}
    <div className="plans">
      {PLANS.map((plan) => {
        const price = displayPrice(plan);
        const isSelected = selected === plan.id;
        return (
          <div
            key={plan.id}
            className={`plan-card${plan.featured?" featured":""}${isSelected?" selected":""}`}
            onClick={() => setSelected(plan.id)}
          >
            <div className="plan-top">
              <div className="plan-name-wrap">
                <div className="plan-badge">{plan.badge}</div>
                <div className="plan-name">{plan.name}</div>
              </div>
              {plan.tag === "popular" && <div className="popular-tag">★ Popular</div>}
              {plan.tag === "team"    && <div className="team-tag">◈ Studio</div>}
            </div>

            {/* Price */}
            {plan.price === 0 ? (
              <div className="price-row"><div className="price-free">FREE</div></div>
            ) : (
              <div className="price-row">
                <div className="price-dollar">$</div>
                <div className="price-amount">{price}</div>
                <div className="price-per">{plan.pricePer}</div>
              </div>
            )}

            {plan.priceNote  && <div className="price-note">{plan.priceNote}</div>}
            {annual && plan.annualNote && <div className="price-annual">{plan.annualNote}</div>}
            {!annual && plan.price > 0 && <div style={{marginBottom:14}}/>}

            <div className="divider" />

            {/* Features */}
            <ul className="features">
              {plan.features.map((f, i) => (
                <li key={i} className={`feature${f.hi?" hi":""}`}>
                  <span className={f.check ? "check" : "cross"}>{f.check ? "✓" : "×"}</span>
                  <span>
                    {f.text}
                    {f.aiTag && <span className="ai-tag" style={{marginLeft:6}}>AI</span>}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              className={`plan-btn ${plan.btnClass}${isSelected?" selected-btn":""}`}
              onClick={(e) => { e.stopPropagation(); setSelected(plan.id); }}
            >
              {plan.btn}
            </button>
          </div>
        );
      })}
    </div>

    {/* FAQ */}
    <div className="faq-wrap">
      <div className="faq-title">Common Questions</div>
      {FAQS.map((f, i) => (
        <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
          <div className="faq-q">
            <span>{f.q}</span>
            <span className={`faq-arrow${openFaq===i?" open":""}`}>▾</span>
          </div>
          <div className={`faq-a${openFaq===i?" open":""}`}>{f.a}</div>
        </div>
      ))}
    </div>

    {/* Trust */}
    <div className="trust-row">
      <div className="trust-item"><div className="trust-ico">🔒</div><div className="trust-lbl">Secure Checkout</div></div>
      <div className="trust-item"><div className="trust-ico">↩</div><div className="trust-lbl">Cancel Anytime</div></div>
      <div className="trust-item"><div className="trust-ico">⚡</div><div className="trust-lbl">Instant Access</div></div>
    </div>

    {/* ── Beta bypass — remove before full launch ── */}
    <div style={{marginTop:28,textAlign:"center"}}>
      <div style={{fontSize:"8px",letterSpacing:"2px",textTransform:"uppercase",color:"#333",marginBottom:8}}>
        ── Beta Access ──
      </div>
      <button
        onClick={() => onSelect && onSelect({ id:"guest", name:"Beta Guest", price:0 })}
        style={{
          background:"none", border:"1px dashed #2a2a2a", color:"#555",
          fontFamily:"'DM Mono',monospace", fontSize:"9px",
          letterSpacing:"2px", textTransform:"uppercase",
          padding:"10px 20px", cursor:"pointer", transition:"all .2s"
        }}
        onMouseOver={e=>{e.target.style.color="#888";e.target.style.borderColor="#444";}}
        onMouseOut={e=>{e.target.style.color="#555";e.target.style.borderColor="#2a2a2a";}}
      >
        Skip — Enter as Beta Tester
      </button>
    </div>
    {/* ── End beta bypass ── */}

  </div>

  {/* Sticky Checkout Bar */}
  <div className={`checkout-bar${selected?" visible":""}`}>
    <div className="checkout-info">
      <div className="checkout-plan">{selectedPlan?.name}</div>
      <div className="checkout-price">{checkoutLabel()}</div>
    </div>
    <button
      className={checkoutBtnClass()}
      onClick={() => onSelect && onSelect(selectedPlan)}
    >
      {selectedPlan?.price === 0 ? "START FREE →" : "SUBSCRIBE →"}
    </button>
  </div>
</>
```

);
}

// ─────────────────────────────────────────────────────

// ─── Simple auth/onboarding gate ─────────────────────────────────────────────
// Screens: “pricing” → “signup” → “app”
// When Supabase is wired in, replace the signup screen logic with real auth.

const AUTH_S = `
@import url(‘https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap’);
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0d0d0d; font-family: ‘DM Mono’, monospace; color: #f4f0e8; }

@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

.auth-bg {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
padding: 24px 16px;
background:
radial-gradient(ellipse 70% 50% at 20% 20%, rgba(200,68,26,.1) 0%, transparent 60%),
radial-gradient(ellipse 50% 40% at 80% 80%, rgba(26,78,200,.08) 0%, transparent 60%),
#0d0d0d;
}
.auth-card {
width: 100%;
max-width: 380px;
animation: fadeUp .5s ease both;
}
.auth-logo {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 30px;
letter-spacing: 6px;
text-align: center;
margin-bottom: 4px;
}
.auth-logo em { color: #c8441a; font-style: normal; }
.auth-eyebrow {
font-size: 8px;
letter-spacing: 3px;
text-transform: uppercase;
color: #8a8478;
text-align: center;
margin-bottom: 28px;
}
.auth-plan-pill {
background: rgba(200,68,26,.12);
border: 1px solid rgba(200,68,26,.25);
padding: 10px 14px;
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 20px;
}
.auth-plan-name {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 18px;
letter-spacing: 2px;
color: #f4f0e8;
}
.auth-plan-price { font-size: 10px; color: #8a8478; letter-spacing: 1px; }
.auth-change {
font-size: 8px;
letter-spacing: 1px;
text-transform: uppercase;
color: #8a8478;
cursor: pointer;
background: none;
border: none;
font-family: ‘DM Mono’, monospace;
transition: color .2s;
}
.auth-change:hover { color: #c8441a; }

.auth-field-lbl { font-size: 8px; letter-spacing: 2px; text-transform: uppercase; color: #8a8478; margin-bottom: 5px; }
.auth-inp {
width: 100%;
background: rgba(255,255,255,.05);
border: 1px solid #222;
padding: 11px 12px;
font-family: ‘DM Mono’, monospace;
font-size: 12px;
color: #f4f0e8;
outline: none;
margin-bottom: 12px;
transition: border-color .2s;
}
.auth-inp:focus { border-color: #c8441a; }
.auth-inp::placeholder { color: #444; }

.auth-submit {
width: 100%;
padding: 14px;
background: linear-gradient(135deg, #c8441a, #d94e20);
color: white;
border: none;
font-family: ‘Bebas Neue’, sans-serif;
font-size: 20px;
letter-spacing: 4px;
cursor: pointer;
transition: filter .2s, transform .2s;
margin-top: 4px;
position: relative;
overflow: hidden;
}
.auth-submit:hover { filter: brightness(1.1); transform: translateY(-1px); }
.auth-submit.loading::after {
content: ‘’;
position: absolute; inset: 0;
background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
background-size: 200% 100%;
animation: shimmer .9s linear infinite;
}

.auth-divider {
display: flex;
align-items: center;
gap: 10px;
margin: 16px 0;
}
.auth-divider::before, .auth-divider::after { content: ‘’; flex:1; height:1px; background:#1e1e1e; }
.auth-divider span { font-size: 9px; letter-spacing: 2px; color: #444; text-transform: uppercase; }

.auth-switch {
text-align: center;
font-size: 10px;
color: #8a8478;
margin-top: 16px;
}
.auth-switch button {
background: none;
border: none;
color: #c8441a;
font-family: ‘DM Mono’, monospace;
font-size: 10px;
cursor: pointer;
text-decoration: underline;
padding: 0;
}

.auth-terms {
font-size: 9px;
color: #444;
text-align: center;
margin-top: 14px;
line-height: 1.6;
}
`;

function AuthScreen({ plan, onBack, onEnter }) {
const [mode, setMode]       = useState(“signup”); // “signup” | “login”
const [email, setEmail]     = useState(””);
const [password, setPassword] = useState(””);
const [name, setName]       = useState(””);
const [loading, setLoading] = useState(false);

const planLabel = plan
? `${plan.name} — ${plan.price === 0 ? "Free" : `$${plan.price}/mo`}`
: “”;

const handleSubmit = async () => {
if (!email || !password) return;
setLoading(true);
// ── Supabase auth goes here ──────────────────────────
// TODO: wire supabase auth here
// if (mode === ‘signup’) {
//   const { error } = await supabase.auth.signUp({ email, password })
// } else {
//   const { error } = await supabase.auth.signInWithPassword({ email, password })
// }
// ────────────────────────────────────────────────────
// For now — simulate a brief load then enter the app
await new Promise(r => setTimeout(r, 900));
setLoading(false);
onEnter(plan);
};

return (
<>
<style>{AUTH_S}</style>
<div className="auth-bg">
<div className="auth-card">
<div className="auth-logo">FR<em>A</em>ME</div>
<div className="auth-eyebrow">Shoot Planner</div>

```
      {plan && (
        <div className="auth-plan-pill">
          <div>
            <div className="auth-plan-name">{plan.name}</div>
            <div className="auth-plan-price">{plan.price === 0 ? "Free — no card required" : `$${plan.price}/mo`}</div>
          </div>
          <button className="auth-change" onClick={onBack}>Change →</button>
        </div>
      )}

      <div className="auth-field-lbl">{mode === "signup" ? "Create Account" : "Welcome Back"}</div>

      {mode === "signup" && (
        <input className="auth-inp" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
      )}
      <input className="auth-inp" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="auth-inp" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />

      <button className={`auth-submit${loading?" loading":""}`} onClick={handleSubmit} disabled={loading}>
        {loading ? "SIGNING IN..." : mode === "signup" ? "CREATE ACCOUNT →" : "LOG IN →"}
      </button>

      <div className="auth-divider"><span>or</span></div>

      {/* ── Beta Guest Bypass ── remove this block before full launch ── */}
      <button
        onClick={() => onEnter({ id:"guest", name:"Beta Guest", price:0 })}
        style={{
          width:"100%", padding:"12px", background:"none",
          border:"1px dashed #2a2a2a", color:"#555",
          fontFamily:"'DM Mono',monospace", fontSize:"10px",
          letterSpacing:"2px", textTransform:"uppercase",
          cursor:"pointer", transition:"all .2s", marginBottom:"12px"
        }}
        onMouseOver={e=>{e.target.style.borderColor="#444";e.target.style.color="#888";}}
        onMouseOut={e=>{e.target.style.borderColor="#2a2a2a";e.target.style.color="#555";}}
      >
        Continue as Guest — Beta
      </button>
      {/* ── End beta bypass ── */}

      <div className="auth-switch">
        {mode === "signup"
          ? <>Already have an account? <button onClick={()=>setMode("login")}>Log in</button></>
          : <>Don't have an account? <button onClick={()=>setMode("signup")}>Sign up</button></>
        }
      </div>

      {mode === "signup" && (
        <div className="auth-terms">
          By creating an account you agree to our<br />Terms of Service and Privacy Policy.
        </div>
      )}
    </div>
  </div>
</>
```

);
}

// ─── Root Router ─────────────────────────────────────────────────────────────
export default function Root() {
const [screen, setScreen] = useState(“pricing”); // “pricing” | “auth” | “app”
const [plan, setPlan]     = useState(null);

// Called when user picks a plan on the pricing page
const handlePlanSelect = (selectedPlan) => {
setPlan(selectedPlan);
setScreen(“auth”);
};

// Called after successful auth
const handleEnter = (activePlan) => {
setPlan(activePlan);
setScreen(“app”);
};

if (screen === “pricing”) return <PricingPage onSelect={handlePlanSelect} />;
if (screen === “auth”)    return <AuthScreen plan={plan} onBack={()=>setScreen(“pricing”)} onEnter={handleEnter} />;
if (screen === “app”)     return <FRAMEApp plan={plan} />;
}

// ─────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────
const UNSPLASH_KEY  = “Q3QRSuGSYomCa0jkLfVnb1w2gMVk7jfqVRzuqNV5ric”;
const PEXELS_KEY    = “WPqt0IfPFJn3hgTbW3nkFGOVq3nEFPLl0Pq5e9WlPiKijFQ7Bw4bFNpd”;
const LIGHTING_OPTS = [“Natural”,“Golden Hour”,“Blue Hour”,“Studio Strobe”,“Continuous”,“Practical”,“Mixed”];
const LENS_OPTS     = [“24mm”,“35mm”,“50mm”,“85mm”,“135mm”,“70-200mm”,“Macro”];
const MOOD_TAGS     = [“Dark”,“Airy”,“Moody”,“Editorial”,“Commercial”,“Intimate”,“Dynamic”,“Graphic”];
const VID_TAGS      = [“B-Roll”,“Lighting Ref”,“Color Grade”,“Movement”,“Composition”,“Mood”];
const SHOOT_TYPES   = [“Fashion Editorial”,“Brand / Commercial”,“Portrait Session”,“Wedding”,“Real Estate”,“Product”,“Music Video”,“Documentary”,“Sports / Action”,“Food & Lifestyle”];
const VIBES         = [“Dark & Moody”,“Editorial”,“Airy & Clean”,“Cinematic”,“Gritty”,“Luxury”,“Natural”,“High Energy”];

let uid = 1;
const id = () => uid++;

// ─── Styles ───────────────────────────────────────────────────────────────────
const APP_S = `
@import url(‘https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap’);

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
–ink: #0d0d0d;
–paper: #f4f0e8;
–cream: #ede8de;
–accent: #c8441a;
–blue: #1a4ec8;
–green: #1a7a4a;
–muted: #8a8478;
–card: #faf8f3;
–border: #d4cfc4;
}

body { background: var(–paper); font-family: ‘DM Mono’, monospace; font-size: 13px; color: var(–ink); }

@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── Header ── */
.hdr { background:var(–ink); padding:12px 16px; display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid var(–accent); position:sticky; top:0; z-index:99; }
.logo { font-family:‘Bebas Neue’,sans-serif; font-size:26px; letter-spacing:5px; color:var(–paper); }
.logo em { color:var(–accent); font-style:normal; }
.hdr-right { text-align:right; }
.hdr-lbl { font-size:8px; letter-spacing:2px; color:var(–muted); text-transform:uppercase; }
.hdr-inp { background:none; border:none; border-bottom:1px solid #444; color:var(–paper); font-family:‘DM Mono’,monospace; font-size:12px; text-align:right; width:145px; outline:none; padding:2px 0; }

/* ── Tabs ── */
.tabs { display:flex; background:var(–cream); border-bottom:1px solid var(–border); overflow-x:auto; scrollbar-width:none; }
.tabs::-webkit-scrollbar { display:none; }
.tab { padding:11px 15px; font-family:‘DM Mono’,monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(–muted); cursor:pointer; border:none; border-bottom:2px solid transparent; background:none; white-space:nowrap; transition:all .2s; }
.tab.on { color:var(–ink); border-bottom-color:var(–accent); }

/* ── Panel ── */
.panel { padding:16px; padding-bottom:40px; min-height:80vh; }

/* ── Shared ── */
.slbl { font-size:8px; letter-spacing:3px; text-transform:uppercase; color:var(–muted); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.slbl::after { content:’’; flex:1; height:1px; background:var(–border); }

.btn { background:var(–ink); color:var(–paper); border:none; padding:9px 15px; font-family:‘DM Mono’,monospace; font-size:9px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:background .2s; white-space:nowrap; }
.btn:hover:not(:disabled) { background:var(–accent); }
.btn:disabled { opacity:.4; cursor:not-allowed; }
.btn-blue  { background:var(–blue);  } .btn-blue:hover:not(:disabled)  { background:#1236a8 !important; }
.btn-green { background:var(–green); } .btn-green:hover:not(:disabled) { background:#145838 !important; }
.btn-ghost { background:none; border:1px solid var(–border); color:var(–ink); }
.btn-ghost:hover:not(:disabled) { background:var(–ink); color:var(–paper); }

.flbl { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(–muted); margin-bottom:3px; }
.finp { width:100%; background:none; border:none; border-bottom:1px solid var(–border); padding:5px 0; margin-bottom:9px; font-family:‘DM Mono’,monospace; font-size:12px; color:var(–ink); outline:none; transition:border-color .2s; }
.finp:focus { border-color:var(–ink); }
.finp::placeholder { color:var(–muted); }
select.finp { appearance:none; background:url(“data:image/svg+xml,%3Csvg xmlns=‘http://www.w3.org/2000/svg’ width=‘10’ height=‘6’%3E%3Cpath d=‘M0 0l5 6 5-6z’ fill=’%238a8478’/%3E%3C/svg%3E”) no-repeat right 4px center; padding-right:18px; cursor:pointer; }

.tag { font-size:8px; letter-spacing:1px; padding:3px 9px; background:var(–cream); border:1px solid var(–border); color:var(–muted); text-transform:uppercase; cursor:pointer; transition:all .15s; user-select:none; }
.tag.on { background:var(–ink); color:var(–paper); border-color:var(–ink); }
.tags { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px; }

.badge { display:inline-block; font-size:8px; letter-spacing:1px; padding:2px 6px; background:var(–accent); color:white; text-transform:uppercase; vertical-align:middle; margin-left:4px; }
.badge-blue  { background:var(–blue); }
.badge-green { background:var(–green); }

.row { display:flex; gap:8px; margin-bottom:14px; }
.inp { flex:1; background:var(–card); border:1px solid var(–border); padding:9px 11px; font-family:‘DM Mono’,monospace; font-size:11px; color:var(–ink); outline:none; transition:border-color .2s; }
.inp:focus { border-color:var(–ink); }
.inp::placeholder { color:var(–muted); }

.empty { text-align:center; padding:36px 16px; color:var(–muted); font-size:10px; letter-spacing:1px; border:1px dashed var(–border); }
.empty-ico { font-size:28px; margin-bottom:10px; }

.add-row { width:100%; padding:12px; background:none; border:1px dashed var(–border); color:var(–muted); font-family:‘DM Mono’,monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; margin-bottom:14px; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:6px; }
.add-row:hover { border-color:var(–ink); color:var(–ink); }

.rm { background:none; border:none; color:var(–muted); cursor:pointer; font-size:16px; line-height:1; padding:2px 4px; transition:color .2s; }
.rm:hover { color:var(–accent); }

/* ── AI Panel ── */
.ai-wrap { background:var(–ink); padding:16px; margin-bottom:18px; position:relative; overflow:hidden; border-radius:0; }
.ai-wrap::before { content:’’; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(–accent),var(–blue),var(–green),var(–accent)); background-size:200% 100%; animation:shimmer 3s linear infinite; }
.ai-hdr { display:flex; align-items:flex-start; gap:10px; margin-bottom:14px; }
.ai-spark { font-size:20px; margin-top:2px; }
.ai-title { font-family:‘Bebas Neue’,sans-serif; font-size:20px; letter-spacing:3px; color:var(–paper); line-height:1; }
.ai-sub { font-size:8px; letter-spacing:2px; color:var(–muted); text-transform:uppercase; margin-top:3px; }

.ai-inp { width:100%; background:rgba(255,255,255,.07); border:1px solid #333; padding:10px 12px; font-family:‘DM Mono’,monospace; font-size:12px; color:var(–paper); outline:none; transition:border-color .2s; margin-bottom:0; }
.ai-inp:focus { border-color:var(–accent); }
.ai-inp::placeholder { color:#555; }

.ai-sel { width:100%; background:rgba(255,255,255,.07); border:1px solid #333; padding:9px 10px; font-family:‘DM Mono’,monospace; font-size:11px; color:var(–paper); outline:none; appearance:none; background-image:url(“data:image/svg+xml,%3Csvg xmlns=‘http://www.w3.org/2000/svg’ width=‘10’ height=‘6’%3E%3Cpath d=‘M0 0l5 6 5-6z’ fill=’%238a8478’/%3E%3C/svg%3E”); background-repeat:no-repeat; background-position:right 10px center; cursor:pointer; }
.ai-sel option { background:#1a1a1a; color:var(–paper); }

.ai-chip { padding:5px 12px; font-family:‘DM Mono’,monospace; font-size:8px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; border:1px solid #333; background:rgba(255,255,255,.04); color:#777; transition:all .15s; user-select:none; }
.ai-chip.on { background:var(–accent); color:white; border-color:var(–accent); }

.gen-btn { width:100%; padding:14px; background:linear-gradient(135deg,var(–accent),#d94e20); color:white; border:none; font-family:‘Bebas Neue’,sans-serif; font-size:20px; letter-spacing:5px; cursor:pointer; transition:all .2s; position:relative; overflow:hidden; margin-top:4px; }
.gen-btn:hover:not(:disabled) { transform:translateY(-1px); filter:brightness(1.1); }
.gen-btn:disabled { opacity:.5; cursor:not-allowed; }
.gen-btn.spin::after { content:’’; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); background-size:200% 100%; animation:shimmer .9s linear infinite; }

.ai-custom-inp { width:100%; background:rgba(255,255,255,.07); border:1px solid #333; border-top:none; padding:9px 12px; font-family:‘DM Mono’,monospace; font-size:12px; color:var(–paper); outline:none; }
.ai-custom-inp:focus { border-color:var(–accent); }
.ai-custom-inp::placeholder { color:#555; }

/* AI Results */
.ai-res-bar { display:flex; justify-content:space-between; align-items:center; margin:14px 0 10px; }
.ai-res-lbl { font-size:8px; letter-spacing:2px; text-transform:uppercase; color:var(–muted); }
.import-all { background:var(–green); color:white; border:none; padding:7px 13px; font-family:‘DM Mono’,monospace; font-size:8px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:background .2s; }
.import-all:hover { background:#145838; }

.ai-card { background:rgba(255,255,255,.05); border:1px solid #2a2a2a; padding:12px; margin-bottom:7px; animation:fadeUp .3s ease both; }
.ai-card-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:7px; }
.ai-num { font-family:‘Bebas Neue’,sans-serif; font-size:15px; letter-spacing:2px; color:var(–accent); }
.ai-add { background:none; border:1px solid #444; color:#888; padding:4px 10px; font-family:‘DM Mono’,monospace; font-size:8px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:all .2s; }
.ai-add:hover, .ai-add.done { background:var(–green); color:white; border-color:var(–green); }
.ai-desc { font-size:11px; color:var(–paper); margin-bottom:5px; line-height:1.55; }
.ai-note { font-size:10px; color:#666; margin-bottom:8px; line-height:1.45; font-style:italic; }
.ai-pills { display:flex; flex-wrap:wrap; gap:5px; }
.pill { font-size:8px; letter-spacing:1px; padding:2px 8px; border:1px solid #333; color:#666; text-transform:uppercase; }
.pill-l { border-color:#c8441a55; color:#c8441aaa; }
.pill-n { border-color:#1a4ec855; color:#1a4ec8aa; }
.pill-m { border-color:#1a7a4a55; color:#1a7a4aaa; }

.dots { display:inline-flex; gap:5px; margin-top:10px; }
.dot { width:6px; height:6px; background:var(–accent); animation:pulse 1.2s ease-in-out infinite; }
.dot:nth-child(2) { animation-delay:.2s; }
.dot:nth-child(3) { animation-delay:.4s; }

.err-box { background:rgba(200,68,26,.1); border:1px solid rgba(200,68,26,.35); padding:14px; text-align:center; margin-top:12px; animation:fadeUp .3s ease; }
.err-msg { font-size:11px; color:var(–accent); margin-bottom:4px; }
.err-sub { font-size:9px; letter-spacing:1px; color:var(–muted); text-transform:uppercase; }

/* ── Shot Cards ── */
.shot-card { background:var(–card); border:1px solid var(–border); margin-bottom:11px; overflow:hidden; animation:fadeUp .25s ease; }
.shot-card.done { opacity:.45; }
.shot-hdr { background:var(–ink); padding:8px 12px; display:flex; justify-content:space-between; align-items:center; }
.shot-num { font-family:‘Bebas Neue’,sans-serif; font-size:17px; letter-spacing:2px; color:var(–accent); }
.ai-bdg { font-size:8px; letter-spacing:1px; padding:2px 6px; background:rgba(200,68,26,.18); color:var(–accent); border:1px solid rgba(200,68,26,.3); margin-left:8px; }
.shot-acts { display:flex; gap:6px; align-items:center; }
.act { background:none; border:none; color:#777; cursor:pointer; font-size:14px; padding:2px 4px; transition:color .2s; }
.act:hover { color:var(–paper); }
.act.chk.on { color:#5cb85c; }
.shot-body { padding:12px; }
.shot-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:9px; }

/* ── Moodboard ── */
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.thumb { position:relative; aspect-ratio:4/3; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:border-color .2s; background:#e8e4da; }
.thumb:hover { border-color:var(–accent); }
.thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.ov { position:absolute; inset:0; background:rgba(13,13,13,.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; font-size:22px; color:white; }
.thumb:hover .ov { opacity:1; }
.mood-card { border:1px solid var(–border); background:var(–card); overflow:hidden; }
.mood-card img { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; }
.mood-foot { padding:5px 8px; display:flex; justify-content:space-between; align-items:center; }
.mood-cred { font-size:8px; letter-spacing:1px; color:var(–muted); text-transform:uppercase; }

/* ── Video ── */
.vsrc-row { display:flex; gap:4px; margin-bottom:12px; }
.vsrc { padding:6px 13px; font-family:‘DM Mono’,monospace; font-size:8px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border:1px solid var(–border); background:none; color:var(–muted); transition:all .2s; }
.vsrc.on { background:var(–ink); color:var(–paper); border-color:var(–ink); }
.vid-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
.vid-th { position:relative; aspect-ratio:16/9; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:border-color .2s; background:#111; }
.vid-th:hover { border-color:var(–blue); }
.vid-th img { width:100%; height:100%; object-fit:cover; display:block; opacity:.82; }
.vid-play { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:20px; color:white; pointer-events:none; }
.vid-th-ov { position:absolute; inset:0; background:rgba(26,78,200,.55); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; font-size:18px; color:white; }
.vid-th:hover .vid-th-ov { opacity:1; }
.vid-strip { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent,rgba(0,0,0,.7)); padding:5px 7px 3px; font-size:8px; letter-spacing:1px; color:rgba(255,255,255,.7); text-transform:uppercase; }
.vid-card { background:var(–card); border:1px solid var(–border); overflow:hidden; margin-bottom:12px; }
.vid-area { position:relative; aspect-ratio:16/9; background:#0d0d0d; overflow:hidden; }
.vid-area img { width:100%; height:100%; object-fit:cover; opacity:.8; display:block; }
.play-circ { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.play-btn { width:44px; height:44px; border-radius:50%; background:rgba(255,255,255,.15); border:2px solid rgba(255,255,255,.6); display:flex; align-items:center; justify-content:center; font-size:16px; color:white; }
.vid-body { padding:10px 12px; }
.vid-name-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
.vid-name { background:none; border:none; font-family:‘DM Mono’,monospace; font-size:11px; color:var(–ink); outline:none; border-bottom:1px solid transparent; flex:1; transition:border-color .2s; }
.vid-name:focus { border-color:var(–border); }
.vid-note { width:100%; background:none; border:none; border-bottom:1px solid var(–border); font-family:‘DM Mono’,monospace; font-size:10px; color:var(–muted); outline:none; padding:3px 0; transition:border-color .2s; }
.vid-note:focus { border-color:var(–ink); color:var(–ink); }
.vid-note::placeholder { color:#ccc; }
.vtag { font-size:8px; letter-spacing:1px; padding:2px 7px; background:var(–cream); border:1px solid var(–border); color:var(–muted); text-transform:uppercase; cursor:pointer; transition:all .15s; }
.vtag.on { background:var(–blue); color:white; border-color:var(–blue); }
.etype-row { display:flex; gap:5px; margin-bottom:8px; }
.etype { padding:5px 12px; font-family:‘DM Mono’,monospace; font-size:8px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; border:1px solid var(–border); background:none; color:var(–muted); transition:all .15s; }
.etype.on { background:var(–blue); color:white; border-color:var(–blue); }

/* ── Schedule ── */
.sched-hdr { display:grid; grid-template-columns:58px 1fr 72px 28px; gap:6px; padding:7px 12px; background:var(–ink); color:var(–paper); font-size:8px; letter-spacing:2px; text-transform:uppercase; margin-bottom:2px; }
.blk { display:grid; grid-template-columns:58px 1fr 72px 28px; gap:6px; padding:9px 12px; background:var(–card); border-bottom:1px solid var(–border); align-items:center; }
.t-inp { background:none; border:none; border-bottom:1px solid var(–border); font-family:‘Bebas Neue’,sans-serif; font-size:14px; color:var(–accent); width:100%; outline:none; text-align:center; }
.tl-inp { background:none; border:none; font-family:‘DM Mono’,monospace; font-size:11px; color:var(–ink); outline:none; width:100%; }
.tl-inp::placeholder { color:var(–muted); }
.dur-inp { background:none; border:none; border-bottom:1px solid var(–border); font-family:‘DM Mono’,monospace; font-size:11px; color:var(–ink); outline:none; width:100%; text-align:right; }
.dur-inp::placeholder { color:var(–muted); }
.add-blk { width:100%; padding:11px; margin-top:7px; background:none; border:1px dashed var(–border); font-family:‘DM Mono’,monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(–muted); cursor:pointer; transition:all .2s; }
.add-blk:hover { color:var(–ink); border-color:var(–ink); }

/* ── Notes ── */
.notes-ta { width:100%; min-height:160px; background:var(–card); border:1px solid var(–border); padding:12px; font-family:‘DM Mono’,monospace; font-size:11px; color:var(–ink); outline:none; resize:none; line-height:1.7; margin-bottom:14px; transition:border-color .2s; }
.notes-ta:focus { border-color:var(–ink); }
.crew-card { background:var(–card); border:1px solid var(–border); padding:11px; margin-bottom:8px; display:flex; gap:10px; align-items:center; }
.crew-av { width:34px; height:34px; background:var(–ink); color:var(–paper); display:flex; align-items:center; justify-content:center; font-family:‘Bebas Neue’,sans-serif; font-size:15px; flex-shrink:0; }
.crew-info { flex:1; }
.crew-n { background:none; border:none; outline:none; font-family:‘DM Mono’,monospace; font-size:12px; color:var(–ink); width:100%; border-bottom:1px solid transparent; padding:2px 0; transition:border-color .2s; }
.crew-n:focus { border-color:var(–border); }
.crew-r { background:none; border:none; outline:none; font-family:‘DM Mono’,monospace; font-size:10px; color:var(–muted); width:100%; border-bottom:1px solid transparent; padding:2px 0; transition:border-color .2s; }
.crew-r:focus { border-color:var(–border); }
`;

// ─── App ─────────────────────────────────────────────────────────────────────
function FRAMEApp({ plan }) {
const [tab, setTab]             = useState(“shots”);
const [title, setTitle]         = useState(“My Shoot”);

// Shot list
const [shots, setShots]         = useState([]);

// AI
const [brief, setBrief]         = useState(””);
const [shootType, setShootType] = useState(“Fashion Editorial”);
const [countMode, setCountMode] = useState(“8”);
const [customN, setCustomN]     = useState(””);
const [vibes, setVibes]         = useState([“Editorial”]);
const [aiLoading, setAiLoading] = useState(false);
const [aiResults, setAiResults] = useState([]);
const [aiAdded, setAiAdded]     = useState({});
const [aiErr, setAiErr]         = useState(””);

// Moodboard
const [moods, setMoods]         = useState([]);
const [uQ, setUQ]               = useState(””);
const [uRes, setURes]           = useState([]);
const [urlIn, setUrlIn]         = useState(””);

// Video
const [videos, setVideos]       = useState([]);
const [vSrc, setVSrc]           = useState(“pexels”);
const [vQ, setVQ]               = useState(””);
const [vRes, setVRes]           = useState([]);
const [eType, setEType]         = useState(“YouTube”);
const [eUrl, setEUrl]           = useState(””);

// Schedule
const [blocks, setBlocks]       = useState([
{ id:id(), time:“7:00”,  activity:“Load in & Setup”,        duration:“90m” },
{ id:id(), time:“8:30”,  activity:“Hair, Makeup & Wardrobe”, duration:“60m” },
{ id:id(), time:“9:30”,  activity:“First Look — Shot 01”,   duration:“45m” },
]);

// Notes
const [dirN, setDirN]           = useState(””);
const [gearN, setGearN]         = useState(””);
const [crew, setCrew]           = useState([]);

// ── AI ──────────────────────────────────────────────────────────────────────
const shotCount = () => {
if (countMode === “custom”) { const n = parseInt(customN,10); return (!n||n<1)?8:Math.min(n,30); }
return parseInt(countMode,10);
};

const generate = useCallback(async () => {
setAiLoading(true); setAiResults([]); setAiAdded({}); setAiErr(””);
const n = shotCount();
const v = vibes.length ? vibes.join(”, “) : “Editorial”;

```
const prompt = `Generate exactly ${n} professional shots for a ${shootType} shoot.
```

Brief: “${brief || shootType}”
Vibe: ${v}

Reply with ONLY this JSON structure, no other text:
{“shots”:[{“description”:“subject and framing detail”,“lighting”:“Natural”,“lens”:“50mm”,“mood”:“Editorial”,“notes”:“execution note”}]}

Use only these lighting values: Natural, Golden Hour, Blue Hour, Studio Strobe, Continuous, Practical, Mixed
Use only these lens values: 24mm, 35mm, 50mm, 85mm, 135mm, 70-200mm, Macro
Use only these mood values: Dark, Airy, Moody, Editorial, Commercial, Intimate, Dynamic, Graphic`;

```
try {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: "You are a professional creative director. Output ONLY raw valid JSON — no markdown fences, no explanation, no extra text before or after the JSON.",
      messages: [{ role:"user", content:prompt }],
    }),
  });

  if (!res.ok) {
    const e = await res.json().catch(()=>({}));
    throw new Error(e?.error?.message || `Error ${res.status}`);
  }

  const data = await res.json();
  const raw  = (data.content||[]).map(b=>b.text||"").join("").trim();

  // Pull out JSON even if there's surrounding text
  const a = raw.indexOf("{"), b2 = raw.lastIndexOf("}");
  if (a === -1 || b2 === -1) throw new Error("Unexpected response — please try again");
  const parsed = JSON.parse(raw.slice(a, b2+1));
  const list = parsed.shots || [];
  if (!list.length) throw new Error("No shots returned — try again");
  setAiResults(list);

} catch(e) {
  setAiErr(e.message || "Something went wrong");
} finally {
  setAiLoading(false);
}
```

}, [brief, shootType, countMode, customN, vibes]);

const importOne = (i) => {
if (aiAdded[i]) return;
const s = aiResults[i];
setShots(p=>[…p,{ id:id(), name:s.description, location:””, lighting:s.lighting||“Natural”, lens:s.lens||“50mm”, notes:s.notes||””, done:false, tags:[s.mood].filter(Boolean), fromAI:true }]);
setAiAdded(p=>({…p,[i]:true}));
};
const importAll = () => aiResults.forEach((_,i)=>importOne(i));

// ── Shots ────────────────────────────────────────────────────────────────────
const addShot  = () => setShots(p=>[…p,{ id:id(), name:””, location:””, lighting:“Natural”, lens:“50mm”, notes:””, done:false, tags:[], fromAI:false }]);
const upShot   = (id2,k,v2) => setShots(p=>p.map(s=>s.id===id2?{…s,[k]:v2}:s));
const rmShot   = (id2) => setShots(p=>p.filter(s=>s.id!==id2));
const doneShot = (id2) => setShots(p=>p.map(s=>s.id===id2?{…s,done:!s.done}:s));
const togTag   = (id2,t) => setShots(p=>p.map(s=>s.id===id2?{…s,tags:s.tags.includes(t)?s.tags.filter(x=>x!==t):[…s.tags,t]}:s));

// ── Moodboard ────────────────────────────────────────────────────────────────
const searchU = async () => {
if (!uQ.trim()) return;
try {
const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(uQ)}&per_page=8&orientation=landscape&client_id=${UNSPLASH_KEY}`);
const d = await r.json(); setURes(d.results||[]);
} catch { setURes([1,2,3,4,5,6].map(i=>({ id:`f${i}`, urls:{ small:`https://picsum.photos/seed/${uQ+i}/300/200`, regular:`https://picsum.photos/seed/${uQ+i}/800/600` }, user:{name:“Sample”} }))); }
};
const addMood  = (url, credit) => { setMoods(p=>[{id:id(),url,credit},…p]); setURes([]); };
const addByUrl = () => { if(!urlIn.trim())return; addMood(urlIn.trim(),“Custom”); setUrlIn(””); };

// ── Video ────────────────────────────────────────────────────────────────────
const searchV = async () => {
if (!vQ.trim()) return;
try {
const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(vQ)}&per_page=6`,{ headers:{Authorization:PEXELS_KEY} });
const d = await r.json(); setVRes(d.videos||[]);
} catch { setVRes([1,2,3,4,5,6].map(i=>({ id:i, image:`https://picsum.photos/seed/${vQ+i}/320/180`, video_files:[{link:””,quality:“sd”}], user:{name:“Demo”}, duration:0 }))); }
};
const addVid = (v2) => {
const f = v2.video_files?.find(x=>x.quality===“sd”)||v2.video_files?.[0];
setVideos(p=>[{id:id(),type:“pexels”,url:f?.link||””,thumb:v2.image,credit:v2.user?.name||””,dur:v2.duration?`${Math.floor(v2.duration/60)}:${String(v2.duration%60).padStart(2,"0")}`:””,title:””,note:””,tags:[]},…p]);
setVRes([]);
};
const addEmbed = () => {
let src=””, thumb=””;
if (eType===“YouTube”) { const m=eUrl.match(/(?:v=|youtu.be/)([^&?/]+)/); if(!m)return; src=`https://www.youtube.com/embed/${m[1]}?autoplay=1`; thumb=`https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`; }
else { const m=eUrl.match(/vimeo.com/(\d+)/); if(!m)return; src=`https://player.vimeo.com/video/${m[1]}?autoplay=1`; }
setVideos(p=>[{id:id(),type:“embed”,src,thumb,credit:eType,title:””,note:””,tags:[]},…p]);
setEUrl(””);
};
const upVid   = (id2,k,v2) => setVideos(p=>p.map(v=>v.id===id2?{…v,[k]:v2}:v));
const togVTag = (id2,t)    => setVideos(p=>p.map(v=>v.id===id2?{…v,tags:v.tags.includes(t)?v.tags.filter(x=>x!==t):[…v.tags,t]}:v));

// ── Schedule ─────────────────────────────────────────────────────────────────
const addBlk = () => setBlocks(p=>[…p,{id:id(),time:””,activity:””,duration:””}]);
const upBlk  = (id2,k,v2) => setBlocks(p=>p.map(b=>b.id===id2?{…b,[k]:v2}:b));
const rmBlk  = (id2) => setBlocks(p=>p.filter(b=>b.id!==id2));

// ── Crew ─────────────────────────────────────────────────────────────────────
const addCrew = () => setCrew(p=>[…p,{id:id(),name:””,role:””}]);
const upCrew  = (id2,k,v2) => setCrew(p=>p.map(c=>c.id===id2?{…c,[k]:v2}:c));
const rmCrew  = (id2) => setCrew(p=>p.filter(c=>c.id!==id2));

// ── Render ───────────────────────────────────────────────────────────────────
return (
<>
<style>{APP_S}</style>

```
  {/* Header */}
  <div className="hdr">
    <div className="logo">FR<em>A</em>ME</div>
    <div className="hdr-right">
      {plan && (
        <div style={{fontSize:"8px",letterSpacing:"2px",color:"var(--accent)",textTransform:"uppercase",textAlign:"right",marginBottom:2}}>
          ✦ {plan.name}
        </div>
      )}
      <div className="hdr-lbl">Shoot Name</div>
      <input className="hdr-inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="My Shoot" />
    </div>
  </div>

  {/* Tabs */}
  <div className="tabs">
    {[["shots","Shot List"],["moodboard","Moodboard"],["video","Video Refs"],["schedule","Schedule"],["notes","Notes & Crew"]].map(([k,lbl])=>(
      <button key={k} className={`tab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{lbl}</button>
    ))}
  </div>

  {/* ══════════════ SHOT LIST ══════════════ */}
  {tab==="shots" && (
    <div className="panel">

      {/* AI Generator */}
      <div className="ai-wrap">
        <div className="ai-hdr">
          <div className="ai-spark">✦</div>
          <div>
            <div className="ai-title">AI Shot Generator</div>
            <div className="ai-sub">Describe your shoot — get a full list in seconds</div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {/* Brief */}
          <div>
            <div className="flbl" style={{color:"#666",marginBottom:4}}>Shoot Brief</div>
            <input className="ai-inp" value={brief} onChange={e=>setBrief(e.target.value)}
              placeholder="e.g. streetwear brand rooftop at golden hour..." />
          </div>

          {/* Type + Count */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div className="flbl" style={{color:"#666",marginBottom:4}}>Shoot Type</div>
              <select className="ai-sel" value={shootType} onChange={e=>setShootType(e.target.value)}>
                {SHOOT_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className="flbl" style={{color:"#666",marginBottom:4}}>Shot Count</div>
              <select className="ai-sel" value={countMode} onChange={e=>setCountMode(e.target.value)}>
                <option value="5">5 — Quick</option>
                <option value="8">8 — Standard</option>
                <option value="12">12 — Full Day</option>
                <option value="15">15 — Epic</option>
                <option value="custom">Custom...</option>
              </select>
              {countMode==="custom" && (
                <input className="ai-custom-inp" type="number" min="1" max="30"
                  placeholder="Enter number (1–30)" value={customN}
                  onChange={e=>setCustomN(e.target.value)} autoFocus />
              )}
            </div>
          </div>

          {/* Vibes */}
          <div>
            <div className="flbl" style={{color:"#666",marginBottom:6}}>Vibe / Mood</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {VIBES.map(v=>(
                <span key={v} className={`ai-chip${vibes.includes(v)?" on":""}`}
                  onClick={()=>setVibes(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v])}>{v}</span>
              ))}
            </div>
          </div>

          {/* Button */}
          <button className={`gen-btn${aiLoading?" spin":""}`} disabled={aiLoading} onClick={generate}>
            {aiLoading ? "GENERATING..." : "GENERATE SHOT LIST"}
          </button>
        </div>

        {/* Loading */}
        {aiLoading && (
          <div style={{textAlign:"center",padding:"18px 0"}}>
            <div style={{fontSize:"9px",letterSpacing:"2px",color:"var(--muted)",textTransform:"uppercase"}}>Crafting your shot list</div>
            <div className="dots"><div className="dot"/><div className="dot"/><div className="dot"/></div>
          </div>
        )}

        {/* Error */}
        {aiErr && (
          <div className="err-box">
            <div style={{fontSize:22,marginBottom:6}}>⚠️</div>
            <div className="err-msg">{aiErr}</div>
            <div className="err-sub">Check your connection and try again</div>
          </div>
        )}

        {/* Results */}
        {aiResults.length > 0 && (
          <div>
            <div className="ai-res-bar">
              <div className="ai-res-lbl">✦ {aiResults.length} shots generated</div>
              <button className="import-all" onClick={importAll}>Import All →</button>
            </div>
            {aiResults.map((s,i)=>(
              <div className="ai-card" key={i} style={{animationDelay:`${i*0.04}s`}}>
                <div className="ai-card-top">
                  <div className="ai-num">SHOT {String(i+1).padStart(2,"0")}</div>
                  <button className={`ai-add${aiAdded[i]?" done":""}`} onClick={()=>importOne(i)}>
                    {aiAdded[i]?"✓ Added":"+ Add"}
                  </button>
                </div>
                <div className="ai-desc">{s.description}</div>
                <div className="ai-note">{s.notes}</div>
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

      {/* Manual add */}
      <button className="add-row" onClick={addShot}>＋ Add Shot Manually</button>
      <div className="slbl">Shot List <span className="badge">{shots.length}</span></div>

      {shots.length===0 && (
        <div className="empty"><div className="empty-ico">📷</div>Generate a shot list above or add shots manually</div>
      )}

      {shots.map(s=>(
        <div key={s.id} className={`shot-card${s.done?" done":""}`}>
          <div className="shot-hdr">
            <div style={{display:"flex",alignItems:"center"}}>
              <div className="shot-num">SHOT {String(s.id).padStart(2,"0")}</div>
              {s.fromAI && <div className="ai-bdg">✦ AI</div>}
            </div>
            <div className="shot-acts">
              <button className={`act chk${s.done?" on":""}`} onClick={()=>doneShot(s.id)} title="Mark done">✓</button>
              <button className="act" onClick={()=>rmShot(s.id)} title="Delete">×</button>
            </div>
          </div>
          <div className="shot-body">
            <div className="flbl">Shot Description</div>
            <input className="finp" value={s.name} placeholder="Describe the shot..." onChange={e=>upShot(s.id,"name",e.target.value)} />
            <div className="flbl">Location / Set</div>
            <input className="finp" value={s.location} placeholder="e.g. Rooftop, Studio A..." onChange={e=>upShot(s.id,"location",e.target.value)} />
            <div className="shot-grid2">
              <div>
                <div className="flbl">Lighting</div>
                <select className="finp" value={s.lighting} onChange={e=>upShot(s.id,"lighting",e.target.value)}>
                  {LIGHTING_OPTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <div className="flbl">Lens</div>
                <select className="finp" value={s.lens} onChange={e=>upShot(s.id,"lens",e.target.value)}>
                  {LENS_OPTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="flbl">Vibe</div>
            <div className="tags">
              {MOOD_TAGS.map(t=>(
                <span key={t} className={`tag${s.tags.includes(t)?" on":""}`} onClick={()=>togTag(s.id,t)}>{t}</span>
              ))}
            </div>
            <div className="flbl">Director Notes</div>
            <input className="finp" value={s.notes} placeholder="Blocking, wardrobe, execution..." onChange={e=>upShot(s.id,"notes",e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  )}

  {/* ══════════════ MOODBOARD ══════════════ */}
  {tab==="moodboard" && (
    <div className="panel">
      <div className="slbl">Search Unsplash</div>
      <div className="row">
        <input className="inp" value={uQ} onChange={e=>setUQ(e.target.value)}
          placeholder="golden hour, editorial, moody..." onKeyDown={e=>e.key==="Enter"&&searchU()} />
        <button className="btn" onClick={searchU}>Search</button>
      </div>

      {uRes.length>0 && (
        <div className="grid2" style={{marginBottom:16}}>
          {uRes.map(p=>(
            <div key={p.id} className="thumb" onClick={()=>addMood(p.urls.regular,p.user.name)}>
              <img src={p.urls.small} loading="lazy" alt="" />
              <div className="ov">＋</div>
            </div>
          ))}
        </div>
      )}

      <div className="slbl">Add by URL</div>
      <div className="row">
        <input className="inp" value={urlIn} onChange={e=>setUrlIn(e.target.value)} placeholder="Paste any image URL..." />
        <button className="btn btn-ghost" onClick={addByUrl}>Add</button>
      </div>

      <div className="slbl">Moodboard <span className="badge">{moods.length}</span></div>
      {moods.length===0
        ? <div className="empty"><div className="empty-ico">🎞</div>Search Unsplash or paste a URL to build your board</div>
        : <div className="grid2">{moods.map(m=>(
            <div key={m.id} className="mood-card">
              <img src={m.url} loading="lazy" alt="" onError={e=>e.target.src=`https://picsum.photos/seed/${m.id}/400/300`} />
              <div className="mood-foot">
                <span className="mood-cred">{m.credit}</span>
                <button className="rm" onClick={()=>setMoods(p=>p.filter(x=>x.id!==m.id))}>×</button>
              </div>
            </div>
          ))}</div>
      }
    </div>
  )}

  {/* ══════════════ VIDEO REFS ══════════════ */}
  {tab==="video" && (
    <div className="panel">
      <div className="slbl">Browse Royalty-Free Video</div>
      <div className="vsrc-row">
        {["pexels","pixabay"].map(s=>(
          <button key={s} className={`vsrc${vSrc===s?" on":""}`} onClick={()=>{setVSrc(s);setVRes([]);}}>{s}</button>
        ))}
      </div>
      <div className="row">
        <input className="inp" value={vQ} onChange={e=>setVQ(e.target.value)}
          placeholder="cinematic city, golden field, rain..." onKeyDown={e=>e.key==="Enter"&&searchV()} />
        <button className="btn btn-blue" onClick={searchV}>Search</button>
      </div>

      {vRes.length>0 && (
        <div className="vid-grid2">
          {vRes.map(v=>(
            <div key={v.id} className="vid-th" onClick={()=>addVid(v)}>
              <img src={v.image} loading="lazy" alt="" />
              <div className="vid-play">▶</div>
              <div className="vid-th-ov">＋ Add</div>
              <div className="vid-strip">{v.user?.name}</div>
            </div>
          ))}
        </div>
      )}

      <div className="slbl" style={{marginTop:6}}>Embed YouTube / Vimeo</div>
      <div className="flbl" style={{marginBottom:6}}>Source</div>
      <div className="etype-row">
        {["YouTube","Vimeo"].map(t=>(
          <button key={t} className={`etype${eType===t?" on":""}`} onClick={()=>setEType(t)}>{t}</button>
        ))}
      </div>
      <div className="row">
        <input className="inp" value={eUrl} onChange={e=>setEUrl(e.target.value)} placeholder="Paste YouTube or Vimeo URL..." />
        <button className="btn btn-blue" onClick={addEmbed}>Add</button>
      </div>

      <div className="slbl">Video Board <span className="badge badge-blue">{videos.length}</span></div>
      {videos.length===0
        ? <div className="empty"><div className="empty-ico">🎬</div>Search Pexels or embed a reference link</div>
        : videos.map(v=>(
            <div key={v.id} className="vid-card">
              <div className="vid-area">
                {v.type==="embed"
                  ? <iframe src={v.src} style={{width:"100%",height:"100%",border:"none",display:"block",position:"absolute",inset:0}} allow="autoplay;encrypted-media" allowFullScreen title={v.title} />
                  : <><img src={v.thumb||`https://picsum.photos/seed/${v.id}/320/180`} loading="lazy" alt="" /><div className="play-circ"><div className="play-btn">▶</div></div></>
                }
              </div>
              <div className="vid-body">
                <div className="vid-name-row">
                  <input className="vid-name" value={v.title} placeholder="Add title..." onChange={e=>upVid(v.id,"title",e.target.value)} />
                  <button className="rm" style={{marginLeft:8}} onClick={()=>setVideos(p=>p.filter(x=>x.id!==v.id))}>×</button>
                </div>
                <input className="vid-note" value={v.note} placeholder="Notes — lighting, movement, color grade..." onChange={e=>upVid(v.id,"note",e.target.value)} />
                <div className="tags" style={{marginTop:7}}>
                  {VID_TAGS.map(t=>(
                    <span key={t} className={`vtag${v.tags.includes(t)?" on":""}`} onClick={()=>togVTag(v.id,t)}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
      }
    </div>
  )}

  {/* ══════════════ SCHEDULE ══════════════ */}
  {tab==="schedule" && (
    <div className="panel">
      <div className="slbl">Day Schedule</div>
      <div className="sched-hdr"><div>Time</div><div>Activity</div><div>Duration</div><div/></div>
      {blocks.map(b=>(
        <div key={b.id} className="blk">
          <input className="t-inp" value={b.time} placeholder="9:00" onChange={e=>upBlk(b.id,"time",e.target.value)} />
          <input className="tl-inp" value={b.activity} placeholder="Setup / Hair & MU / Shot 01..." onChange={e=>upBlk(b.id,"activity",e.target.value)} />
          <input className="dur-inp" value={b.duration} placeholder="30m" onChange={e=>upBlk(b.id,"duration",e.target.value)} />
          <button className="rm" onClick={()=>rmBlk(b.id)}>×</button>
        </div>
      ))}
      <button className="add-blk" onClick={addBlk}>＋ Add Time Block</button>
    </div>
  )}

  {/* ══════════════ NOTES & CREW ══════════════ */}
  {tab==="notes" && (
    <div className="panel">
      <div className="slbl">Director's Notes</div>
      <textarea className="notes-ta" value={dirN} onChange={e=>setDirN(e.target.value)} placeholder="Mood, tone, client brief, technical notes..." />

      <div className="slbl">Gear List</div>
      <textarea className="notes-ta" style={{minHeight:100}} value={gearN} onChange={e=>setGearN(e.target.value)} placeholder="Camera body, lenses, lighting, grip..." />

      <div className="slbl">Crew</div>
      {crew.map(c=>(
        <div key={c.id} className="crew-card">
          <div className="crew-av">{c.name?c.name.slice(0,2).toUpperCase():"?"}</div>
          <div className="crew-info">
            <input className="crew-n" value={c.name} placeholder="Full Name" onChange={e=>upCrew(c.id,"name",e.target.value)} />
            <input className="crew-r" value={c.role} placeholder="Role / Department" onChange={e=>upCrew(c.id,"role",e.target.value)} />
          </div>
          <button className="rm" onClick={()=>rmCrew(c.id)}>×</button>
        </div>
      ))}
      <button className="add-row" onClick={addCrew}>＋ Add Crew Member</button>
    </div>
  )}
</>


);
}
