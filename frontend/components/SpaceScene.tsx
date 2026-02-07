"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useState } from "react";

/* 🛸 THE BEAM MATERIAL (High-Tech Scanner) */
const beamMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color("#22ff22") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      // Smooth gradient: Transparent at bottom, opaque at top
      float gradient = smoothstep(0.0, 1.0, vUv.y);
      // Sci-fi scanner lines moving down
      float scanline = sin(vUv.y * 50.0 - time * 10.0) * 0.1;
      gl_FragColor = vec4(color, (gradient + scanline) * 0.25);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});

/* 🛸 SLEEK UFO COMPONENT */
function SleekUFO() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const [shooting, setShooting] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    beamMaterial.uniforms.time.value = t;

    if (groupRef.current) {
      // 1. FLY IN (0s - 2s)
      if (t < 2) {
        groupRef.current.position.set(
          THREE.MathUtils.lerp(-20, 0, t / 2),
          THREE.MathUtils.lerp(10, 4.5, t / 2), // Hover higher to cover Title
          THREE.MathUtils.lerp(-10, 0, t / 2)
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(-0.5, 0, t / 2);
      } 
      // 2. HOVER & SCAN (2s - 5s)
      else if (t >= 2 && t < 5) {
        groupRef.current.position.y = 4.5 + Math.sin(t * 2) * 0.1;
        if (!shooting) setShooting(true);
      }
      // 3. FLY AWAY
      else {
        setShooting(false);
        groupRef.current.position.x += 0.5;
        groupRef.current.position.y += 0.3;
        groupRef.current.rotation.z = 0.3;
      }
    }

    // Spin the outer ring
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.1; 
    }

    // BEAM LOGIC
    if (beamRef.current) {
      if (shooting) {
        beamRef.current.visible = true;
        // Open the beam
        const openProgress = Math.min(1, (t - 2) * 3);
        beamRef.current.scale.set(openProgress, 1, openProgress);
      } else {
        beamRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef} position={[-20, 10, 0]} scale={[0.5, 0.5, 0.5]}>
      {/* --- UFO BODY --- */}
      <group rotation={[0.2, 0, 0]}>
        {/* Dome (Glowing Core) */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00ffff" emissive="#0088ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* Main Disc (Dark Metal) */}
        <mesh scale={[1, 0.3, 1]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial color="#222" metalness={1} roughness={0.2} envMapIntensity={3} />
        </mesh>
        {/* Spinning Ring (Lights) */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
           <torusGeometry args={[3, 0.1, 16, 100]} />
           <meshBasicMaterial color="#00ff00" toneMapped={false} />
        </mesh>
      </group>

      {/* --- THE BEAM --- */}
      {/* Large Cone: Starts at UFO, covers Title + Subtitle */}
      <mesh ref={beamRef} position={[0, -8, 0]} visible={false} material={beamMaterial}>
        <cylinderGeometry args={[0.1, 9, 16, 32, 1, true]} />
      </mesh>
    </group>
  );
}

/* 🌍 EARTH + MOON (Original) */
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
        {earthMap ? <meshStandardMaterial map={earthMap} metalness={0.1} roughness={0.7} /> : <meshStandardMaterial color="#1E90FF" />}
      </Sphere>
      <Sphere ref={moonRef} args={[0.45, 32, 32]}>
        {moonMap ? <meshStandardMaterial map={moonMap} metalness={0.1} roughness={0.8} /> : <meshStandardMaterial color="#888888" />}
      </Sphere>
    </group>
  );
}

/* 🛰️ SATELLITE (Original) */
function SingleSatellite({ speed, radius, offset, inclination, color }: { speed: number, radius: number, offset: number, inclination: number, color: string }) {
  const satRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (satRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      satRef.current.position.x = Math.sin(t) * radius;
      satRef.current.position.z = Math.cos(t) * radius;
      satRef.current.position.y = Math.sin(t * 3) * inclination;
      satRef.current.lookAt(0, 0, 0);
      satRef.current.rotateY(Math.PI / 2);
    }
  });
  return (
    <group ref={satRef} scale={[0.15, 0.15, 0.15]}>
      <mesh><boxGeometry args={[0.5, 0.5, 0.8]} /><meshStandardMaterial color={color} roughness={0.3} metalness={1.0} /></mesh>
      <mesh position={[0, 0, 1.2]}><boxGeometry args={[0.05, 0.8, 1.6]} /><meshStandardMaterial color="#101040" roughness={0.1} metalness={0.9} emissive="#000020" /></mesh>
      <mesh position={[0, 0, -1.2]}><boxGeometry args={[0.05, 0.8, 1.6]} /><meshStandardMaterial color="#101040" roughness={0.1} metalness={0.9} emissive="#000020" /></mesh>
      <pointLight position={[0, 0.6, 0]} intensity={3} color={color === "#FFD700" ? "#00ff00" : "#ff0000"} distance={1} />
    </group>
  );
}

/* ☄️ ASTEROIDS (Original) */
function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const asteroidTexture = useTexture("/textures/asteroid.jpg", (t) => {}, () => {});
  const count = 3000; 
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const xBase = (t - 0.5) * 45; const zBase = (xBase * xBase) * 0.04 - 10; const x = xBase + (Math.random() - 0.5) * 4; const y = (Math.random() - 0.5) * 3; const z = zBase + (Math.random() - 0.5) * 4; const baseSize = Math.random() * 0.06 + 0.01; const scale = baseSize * (0.8 + Math.random() * 0.5); temp.push({ x, y, z, scale, speed: (Math.random() - 0.5) * 0.002, rot: Math.random() * Math.PI });
    }
    return temp;
  }, [count]);
  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => { p.rot += p.speed; dummy.position.set(p.x, p.y, p.z); dummy.rotation.set(p.rot, p.rot, p.rot); dummy.scale.set(p.scale, p.scale, p.scale); dummy.updateMatrix(); meshRef.current.setMatrixAt(i, dummy.matrix); });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} /> {asteroidTexture ? <meshStandardMaterial map={asteroidTexture} color="#cccccc" emissive="#222222" roughness={0.6} metalness={0.2} /> : <meshStandardMaterial color="#666" />}
    </instancedMesh>
  );
}

export default function SpaceScene() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 1.5, 12], fov: 50 }}>
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={4.5} color="#ffffff" />
        <pointLight position={[0, -10, 0]} intensity={2.0} color="#aaccff" />
        <Environment preset="city" />
        <Stars radius={300} depth={60} count={6000} factor={4} fade speed={0.5} />
        
        <EarthSystem />
        <SleekUFO /> {/* <-- The New Sleek UFO */}
        
        <SingleSatellite speed={0.3} radius={2.2} offset={0} inclination={0.5} color="#FFD700" />
        <SingleSatellite speed={0.2} radius={2.8} offset={3} inclination={-0.5} color="#C0C0C0" />
        <AsteroidBelt />
      </Canvas>
    </div>
  );
}