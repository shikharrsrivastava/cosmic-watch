"use strict";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Satellite() {
  const satRef = useRef<THREE.Group>(null);
  
  // Load the gold foil texture
  const foilTexture = useTexture("/textures/satellite.jpg");

  useFrame(({ clock }) => {
    if (satRef.current) {
      // SLOW, Close Orbit
      const t = clock.getElapsedTime() * 0.1; // Very slow speed
      const radius = 6.5; // Very close to Earth (assuming Earth radius is ~5)
      
      satRef.current.position.x = Math.sin(t) * radius;
      satRef.current.position.z = Math.cos(t) * radius;
      
      // Gentle bobbing
      satRef.current.position.y = Math.sin(t * 2) * 0.5;
      
      // Always face Earth
      satRef.current.lookAt(0, 0, 0);
      
      // Correct orientation so solar panels face outward
      satRef.current.rotateY(Math.PI / 2);
    }
  });

  return (
    <group ref={satRef}>
      {/* MAIN BUS (Body) - Uses your gold texture */}
      <mesh>
        <boxGeometry args={[0.8, 0.8, 1.2]} />
        <meshStandardMaterial 
          map={foilTexture} 
          roughness={0.3} 
          metalness={0.8} 
        />
      </mesh>

      {/* SOLAR PANEL ARMS (Connecting rods) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* LEFT SOLAR PANEL (Dark Blue Glass) */}
      <mesh position={[0, 0, 2.2]}>
        <boxGeometry args={[0.05, 1.5, 2]} />
        <meshStandardMaterial 
          color="#101030" 
          roughness={0.1} 
          metalness={0.9} 
          emissive="#000020" // Subtle glow
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* RIGHT SOLAR PANEL */}
      <mesh position={[0, 0, -2.2]}>
        <boxGeometry args={[0.05, 1.5, 2]} />
        <meshStandardMaterial 
          color="#101030" 
          roughness={0.1} 
          metalness={0.9} 
          emissive="#000020"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* SENSOR DISH (Small detail) */}
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.5, 32]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}