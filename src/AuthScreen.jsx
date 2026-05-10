import { useState } from 'react';

export default function AuthScreen({ plan, onBack, onEnter }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onEnter(plan);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          FR<em>A</em>ME
        </div>
        <div className="auth-eyebrow">Shoot Planner</div>

        {plan && (
          <div className="auth-plan-pill">
            <div>
              <div className="auth-plan-name">{plan.name}</div>
              <div className="auth-plan-price">
                {plan.price === 0 ? 'Free — no card required' : '$' + plan.price + '/mo'}
              </div>
            </div>
            <button className="auth-change" onClick={onBack}>
              Change →
            </button>
          </div>
        )}

        <div className="auth-field-lbl">
          {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
        </div>

        {mode === 'signup' && (
          <input
            className="auth-inp"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="auth-inp"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-inp"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="auth-submit" onClick={submit} disabled={loading}>
          {loading
            ? 'SIGNING IN…'
            : mode === 'signup'
            ? 'CREATE ACCOUNT →'
            : 'LOG IN →'}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="auth-guest"
          onClick={() => onEnter({ id: 'guest', name: 'Beta Guest', price: 0 })}
        >
          Continue as Guest — Beta
        </button>

        <div className="auth-switch">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')}>Log in</button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => setMode('signup')}>Sign up</button>
            </>
          )}
        </div>

        {mode === 'signup' && (
          <div className="auth-terms">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </div>
        )}
      </div>
    </div>
  );
}
