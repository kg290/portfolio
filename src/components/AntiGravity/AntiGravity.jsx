import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const defaultConfig = {
  count: 300,
  magnetRadius: 10,
  ringRadius: 10,
  waveSpeed: 0.4,
  waveAmplitude: 1,
  particleSize: 2,
  lerpSpeed: 0.1,
  color: '#FF9FFC',
  autoAnimate: false,
  particleVariance: 1,
  rotationSpeed: 0,
  depthFactor: 1,
  pulseSpeed: 3,
  fieldStrength: 10,
  particleShape: 'capsule',
};

function Particle({ position, targetPosition, config, meshRef }) {
  const vec = new THREE.Vector3();
  const timeRef = useRef(Math.random() * 100);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    timeRef.current += config.pulseSpeed * state.clock.delta;
    
    const pulse = Math.sin(timeRef.current) * 0.3 + 1;
    const scale = config.particleSize * pulse * (config.particleVariance > 0 
      ? 1 + Math.random() * config.particleVariance 
      : 1);
    
    meshRef.current.scale.setScalar(scale);
    
    vec.copy(position);
    vec.lerp(targetPosition, config.lerpSpeed);
    
    if (config.autoAnimate) {
      const wave = Math.sin(state.clock.elapsedTime * config.waveSpeed + position.x) * config.waveAmplitude;
      vec.y += wave;
    }
    
    meshRef.current.position.copy(vec);
    
    if (config.rotationSpeed !== 0) {
      meshRef.current.rotation.y += config.rotationSpeed * state.clock.delta;
      meshRef.current.rotation.x += config.rotationSpeed * 0.5 * state.clock.delta;
    }
  });
  
  if (config.particleShape === 'capsule') {
    return (
      <mesh ref={meshRef} position={position}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshBasicMaterial color={config.color} />
      </mesh>
    );
  }
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color={config.color} />
    </mesh>
  );
}

function Particles({ config }) {
  const particles = useMemo(() => {
    const positions = [];
    const targetPositions = [];
    const meshRefs = [];
    
    for (let i = 0; i < config.count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = config.magnetRadius * Math.cbrt(Math.random());
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * config.depthFactor;
      
      positions.push(new THREE.Vector3(x, y, z));
      
      const ringTheta = (i / config.count) * Math.PI * 2;
      const ringX = config.ringRadius * Math.cos(ringTheta);
      const ringY = config.ringRadius * Math.sin(ringTheta);
      const ringZ = 0;
      
      targetPositions.push(new THREE.Vector3(ringX, ringY, ringZ));
      meshRefs.push({ current: null });
    }
    
    return { positions, targetPositions, meshRefs };
  }, [config]);
  
  return (
    <>
      {particles.positions.map((pos, i) => (
        <Particle
          key={i}
          position={pos}
          targetPosition={particles.targetPositions[i]}
          config={config}
          meshRef={particles.meshRefs[i]}
        />
      ))}
    </>
  );
}

function Scene({ config }) {
  useFrame((state) => {
    if (config.rotationSpeed !== 0) {
      // Scene rotation handled by individual particles
    }
  });
  
  return <Particles config={config} />;
}

export default function AntiGravity({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = '#FF9FFC',
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  fieldStrength = 10,
  particleShape = 'capsule',
  style,
  ...props
}) {
  const config = {
    count,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    lerpSpeed,
    color,
    autoAnimate,
    particleVariance,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    fieldStrength,
    particleShape,
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
      {...props}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene config={config} />
      </Canvas>
    </div>
  );
}
