import { useState } from 'react';
import PricingPage from './PricingPage.jsx';
import AuthScreen from './AuthScreen.jsx';
import FRAMEApp from './FRAMEApp.jsx';

export default function App() {
  const [screen, setScreen] = useState('pricing');
  const [plan, setPlan] = useState(null);

  const handleSelect = (p) => {
    setPlan(p);
    setScreen('auth');
  };
  const handleEnter = (p) => {
    setPlan(p);
    setScreen('app');
  };

  if (screen === 'pricing') return <PricingPage onSelect={handleSelect} />;
  if (screen === 'auth')
    return (
      <AuthScreen
        plan={plan}
        onBack={() => setScreen('pricing')}
        onEnter={handleEnter}
      />
    );
  return <FRAMEApp plan={plan} />;
}
