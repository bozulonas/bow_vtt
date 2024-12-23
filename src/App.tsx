import React from 'react';
import { StandaloneDiceRoller } from './standalone/StandaloneDiceRoller';
import { LegacyClock } from './components/LegacyClock';

export function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      backgroundColor: '#282c34',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      gap: '20px'
    }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        border: '1px solid red',
        padding: '20px'
      }}>
        <div style={{ border: '1px solid yellow', width: '300px', height: '300px' }}>
          <LegacyClock 
            progress={2} 
            segments={6} 
          />
        </div>
        
        <div style={{ border: '1px solid yellow', width: '300px', height: '300px' }}>
          <LegacyClock 
            progress={3} 
            segments={8} 
            badClock={true}
          />
        </div>
      </div>

      <StandaloneDiceRoller />
    </div>
  );
}
