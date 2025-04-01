import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/robot_waving.glb");
useGLTF.preload("/robot.glb");

function WavingRobot({ onWaveComplete }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/robot_waving.glb");
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (!animations[0]) return;

    const wave = actions[animations[0].name];
    if (wave && group.current) {
      group.current.rotation.y = 0; // face forward
      wave.reset()
        .setLoop(THREE.LoopOnce, 1)
        .clampWhenFinished = true;
      wave.play();

      const duration = wave.getClip().duration * 1000;
      const timer = setTimeout(() => {
        wave.stop();
        onWaveComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [actions, animations, onWaveComplete]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={3}
      position={[0, -2, 0]}
    />
  );
}

function IdleRobot({ onClick }) {
  const group = useRef();
  const { scene } = useGLTF("/robot.glb");

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.8; // slow rotate
    }
  });

  return (
    <primitive
      object={scene}
      ref={group}
      scale={3}
      position={[0, 0, 0]}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    />
  );
}

export default function RobotViewer() {
  const [mode, setMode] = useState("wave"); // Initial wave on load

  const handleWaveComplete = () => setMode("idle");
  const handleClick = () => {
    if (mode === "idle") setMode("wave");
  };

  return (
    <Canvas style={{ height: "500px", width: "100%" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} />
      {mode === "wave" ? (
        <WavingRobot onWaveComplete={handleWaveComplete} />
      ) : (
        <IdleRobot onClick={handleClick} />
      )}
    </Canvas>
  );
}
