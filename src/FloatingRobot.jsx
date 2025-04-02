// src/FloatingRobot.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function FloatingRobotModel() {
    const robotRef = useRef();
    const { scene } = useGLTF("/robot.glb");
  
    useFrame(({ clock }) => {
      if (robotRef.current) {
        robotRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.1;
      }
    });
  
    return (
      <primitive
        ref={robotRef}
        object={scene}
        scale={3}
        position={[0, 0, 0]}
        rotation={[0, -Math.PI*2, 0]} // Face forward
      />
    );
  }
  

export default function FloatingRobot() {
  return (
    <Canvas style={{ height: "200px", width: "100%" }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 3]} />
      <FloatingRobotModel />
    </Canvas>
  );
}
