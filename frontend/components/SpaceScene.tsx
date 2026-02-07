"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

/* 🌍 EARTH + MOON SYSTEM */
function EarthSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const earthMap = useTexture("/textures/earth.jpg", (t) => {}, () => {}); 
  const moonMap = useTexture("/textures/moon.jpg", (t) => {}, () => {});

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.05; 
    if (earthRef.current) earthRef.current.rotation.y = t * 0.08;
    
    if (moonRef.current) {
      moonRef.current.position.x = Math.sin(t * 0.2) * 6; 
      moonRef.current.position.z = Math.cos(t * 0.2) * 6;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={earthRef} args={[1.6, 64, 64]}>
        {earthMap ? (
          <meshStandardMaterial map={earthMap} metalness={0.1} roughness={0.7} />
        ) : (
          <meshStandardMaterial color="#1E90FF" />
        )}
      </Sphere>
      <Sphere ref={moonRef} args={[0.45, 32, 32]}>
        {moonMap ? (
          <meshStandardMaterial map={moonMap} metalness={0.1} roughness={0.8} />
        ) : (
          <meshStandardMaterial color="#888888" />
        )}
      </Sphere>
    </group>
  );
}

/* 🛰️ REUSABLE SATELLITE COMPONENT */
function SingleSatellite({ 
  speed, 
  radius, 
  offset, 
  inclination, 
  color 
}: { 
  speed: number, 
  radius: number, 
  offset: number, 
  inclination: number,
  color: string 
}) {
  const satRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (satRef.current) {
      // Time + Offset so they don't start at same place
      const t = clock.getElapsedTime() * speed + offset;
      
      satRef.current.position.x = Math.sin(t) * radius;
      satRef.current.position.z = Math.cos(t) * radius;
      // "Inclination" creates the wave motion (Orbit tilt)
      satRef.current.position.y = Math.sin(t * 3) * inclination;

      satRef.current.lookAt(0, 0, 0);
      satRef.current.rotateY(Math.PI / 2);
    }
  });

  return (
    <group ref={satRef} scale={[0.15, 0.15, 0.15]}>
      {/* 1. BODY */}
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={1.0} />
      </mesh>

      {/* 2. PANELS */}
      <mesh position={[0, 0, 1.2]}>
        <boxGeometry args={[0.05, 0.8, 1.6]} />
        <meshStandardMaterial color="#101040" roughness={0.1} metalness={0.9} emissive="#000020" />
      </mesh>
      <mesh position={[0, 0, 0.6]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.05, 0.05, 0.4]} />
         <meshStandardMaterial color="#888" />
      </mesh>

      <mesh position={[0, 0, -1.2]}>
        <boxGeometry args={[0.05, 0.8, 1.6]} />
        <meshStandardMaterial color="#101040" roughness={0.1} metalness={0.9} emissive="#000020" />
      </mesh>
       <mesh position={[0, 0, -0.6]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[0.05, 0.05, 0.4]} />
         <meshStandardMaterial color="#888" />
      </mesh>

      {/* 3. BLINKING LED */}
      <pointLight position={[0, 0.6, 0]} intensity={3} color={color === "#FFD700" ? "#00ff00" : "#ff0000"} distance={1} />
    </group>
  );
}

/* ☄️ ASTEROID BELT */
function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const asteroidTexture = useTexture("/textures/asteroid.jpg", (t) => {}, () => {});
  
  const count = 3000; 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const xBase = (t - 0.5) * 45; 
      const zBase = (xBase * xBase) * 0.04 - 10; 
      const x = xBase + (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 3; 
      const z = zBase + (Math.random() - 0.5) * 4;
      const baseSize = Math.random() * 0.06 + 0.01;
      const scale = baseSize * (0.8 + Math.random() * 0.5); 
      temp.push({ x, y, z, scale, speed: (Math.random() - 0.5) * 0.002, rot: Math.random() * Math.PI });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.rot += p.speed;
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rot, p.rot, p.rot);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} /> 
      {asteroidTexture ? (
        <meshStandardMaterial map={asteroidTexture} color="#cccccc" emissive="#222222" roughness={0.6} metalness={0.2} />
      ) : (
        <meshStandardMaterial color="#666" />
      )}
    </instancedMesh>
  );
}

/* 🌌 MAIN SCENE */
export default function SpaceScene() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 1.5, 12], fov: 50 }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={4.5} color="#ffffff" />
        <pointLight position={[0, -10, 0]} intensity={2.0} color="#aaccff" />
        <pointLight position={[-10, 5, -10]} intensity={5.0} color="#8080ff" distance={40} />
        <Stars radius={300} depth={60} count={6000} factor={4} fade speed={0.5} />
        
        <EarthSystem />
        
        {/* 🛰️ TWO SATELLITES */}
        {/* Sat 1: Gold, Lower Orbit, Faster */}
        <SingleSatellite 
          speed={0.3} 
          radius={2.2} 
          offset={0} 
          inclination={0.5} 
          color="#FFD700" 
        />
        
        {/* Sat 2: Silver, Higher Orbit, Slower, Different Phase */}
        <SingleSatellite 
          speed={0.2} 
          radius={2.8} 
          offset={3} 
          inclination={-0.5} 
          color="#C0C0C0" 
        />
        
        <AsteroidBelt />
      </Canvas>
    </div>
  );
}