import React from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import Button from "@mui/material/Button";
import { useDiceRollStore } from "../dice/store";
import { DiceStyle } from "../types/DiceStyle";
import { InteractiveDiceRoll } from "../dice/InteractiveDiceRoll";
import environment from "../environment.hdr";
import { AudioListenerProvider } from "../audio/AudioListenerProvider";

export function StandaloneDiceRoller() {
  const startRoll = useDiceRollStore(state => state.startRoll);
  const clearRoll = useDiceRollStore(state => state.clearRoll);

  const rollDice = () => {
    clearRoll();
    setTimeout(() => {
      startRoll({
        dice: [
          { type: "D6", style: DiceStyle.GLASS, id: "d6-1" },
          { type: "D6", style: DiceStyle.GLASS, id: "d6-2" },
          { type: "D6", style: DiceStyle.GLASS, id: "d6-3" },
          { type: "D6", style: DiceStyle.GLASS, id: "d6-4" }
        ],
        hidden: false
      });
    }, 100);
  };

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={rollDice}
        style={{ 
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001
        }}
      >
        Roll 4d6
      </Button>
      
      <div style={{ 
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000
      }}>
        <Canvas>
          <AudioListenerProvider>
            <Environment files={environment} />
            <ContactShadows
              resolution={256}
              scale={[1, 2]}
              position={[0, 0, 0]}
              blur={0.5}
              opacity={0.5}
              far={1}
              color="#222222"
            />
            <InteractiveDiceRoll />
            <PerspectiveCamera
              makeDefault
              fov={28}
              position={[0, 4.3, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </AudioListenerProvider>
        </Canvas>
      </div>
    </div>
  );
} 