import { useState } from 'react';
import { PLANS, FAQS } from './data.js';

export default function PricingPage({ onSelect }) {
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const sel = PLANS.find((p) => p.id === selected);
  const price = (p) => (annual ? p.annualPrice : p.price);

  return (
    <>
      <div className="bg" />
      <div className="wrap">
        <div className="pg-hdr">
          <div className="logo-mark">
            FR<em>A</em>ME
          </div>
          <div className="pg-eyebrow">Shoot Planner · Pricing</div>
          <div className="pg-headline">
            Every shot.<br />
            Every mood.<br />
            <span className="serif">One place.</span>
          </div>
          <div className="pg-sub">
            Start free. Upgrade when the AI saves you more time than it costs.
          </div>
          <div className="perf" />
        </div>

        <div className="billing-toggle">
          <span
            className={'toggle-lbl' + (!annual ? ' on' : '')}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </span>
          <div
            className={'toggle-track' + (annual ? ' on' : '')}
            onClick={() => setAnnual((a) => !a)}
          >
            <div className="toggle-thumb" />
          </div>
          <span
            className={'toggle-lbl' + (annual ? ' on' : '')}
            onClick={() => setAnnual(true)}
          >
            Annual
          </span>
          {annual && <span className="save-pill">Save 25%</span>}
        </div>

        <div className="trial-banner">
          <div style={{ fontSize: 20 }}>✦</div>
          <div className="trial-text">
            <div className="trial-title">Start with 3 free AI generations</div>
            <div className="trial-sub">No credit card · No commitment</div>
          </div>
          <button className="trial-cta" onClick={() => onSelect && onSelect(PLANS[0])}>
            Start Free
          </button>
        </div>

        <div className="plans">
          {PLANS.map((plan) => {
            const p = price(plan);
            const isSel = selected === plan.id;
            return (
              <div
                key={plan.id}
                className={
                  'plan-card tier-' +
                  plan.id +
                  (plan.featured ? ' featured' : '') +
                  (isSel ? ' selected' : '')
                }
                onClick={() => setSelected(plan.id)}
              >
                <div className="plan-top">
                  <div>
                    <div className="plan-badge">{plan.badge}</div>
                    <div className="plan-name">{plan.name}</div>
                  </div>
                  {plan.tag === 'popular' && <div className="popular-tag">★ Popular</div>}
                  {plan.tag === 'team' && <div className="team-tag">◈ Studio</div>}
                </div>

                {plan.price === 0 ? (
                  <div className="price-row">
                    <div className="price-free">FREE</div>
                  </div>
                ) : (
                  <div className="price-row">
                    <div className="price-dollar">$</div>
                    <div className="price-amount">{p}</div>
                    <div className="price-per">/mo</div>
                  </div>
                )}

                {plan.price === 0 ? (
                  <div className="price-note">{plan.note}</div>
                ) : annual ? (
                  <div className="price-annual">
                    Billed annually — save ${(plan.price - p) * 12}/yr
                  </div>
                ) : (
                  <div style={{ marginBottom: 14 }} />
                )}

                <div className="divider" />

                <ul className="features">
                  {plan.features.map((f, i) => (
                    <li key={i} className={'feature' + (f.hi ? ' hi' : '')}>
                      <span className={f.ok ? 'check' : 'cross'}>{f.ok ? '✓' : '×'}</span>
                      <span>
                        {f.t}
                        {f.ai && <span className="ai-tag">AI</span>}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={'plan-btn ' + plan.btnC}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(plan.id);
                  }}
                >
                  {plan.btn}
                </button>
              </div>
            );
          })}
        </div>

        <div className="faq-wrap">
          <div className="faq-title">Common Questions</div>
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="faq-item"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-q">
                <span>{f.q}</span>
                <span className={'faq-arrow' + (openFaq === i ? ' open' : '')}>▾</span>
              </div>
              <div className={'faq-a' + (openFaq === i ? ' open' : '')}>{f.a}</div>
            </div>
          ))}
        </div>

        <div className="trust-row">
          <div className="trust-item">
            <div className="trust-ico">🔒</div>
            <div className="trust-lbl">Secure</div>
          </div>
          <div className="trust-item">
            <div className="trust-ico">↩</div>
            <div className="trust-lbl">Cancel Anytime</div>
          </div>
          <div className="trust-item">
            <div className="trust-ico">⚡</div>
            <div className="trust-lbl">Instant Access</div>
          </div>
        </div>

        <div className="beta-section">
          <div className="beta-lbl">── Beta Access ──</div>
          <button
            className="beta-btn"
            onClick={() =>
              onSelect && onSelect({ id: 'guest', name: 'Beta Guest', price: 0 })
            }
          >
            Skip — Enter as Beta Tester
          </button>
        </div>
      </div>

      {sel && (
        <div className="checkout-bar visible">
          <div>
            <div className="checkout-plan">{sel.name}</div>
            <div className="checkout-price">
              {sel.price === 0
                ? 'Free — no card required'
                : '$' + (annual ? sel.annualPrice : sel.price) + '/mo'}
            </div>
          </div>
          <button className="checkout-btn" onClick={() => onSelect && onSelect(sel)}>
            {sel.price === 0 ? 'START FREE →' : 'SUBSCRIBE →'}
          </button>
        </div>
      )}
    </>
  );
}
