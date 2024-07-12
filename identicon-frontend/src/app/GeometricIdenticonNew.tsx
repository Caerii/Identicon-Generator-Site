import React, { useMemo, useRef, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Box3, Vector3, Color, Euler, CylinderGeometry, SphereGeometry, BoxGeometry, ConeGeometry } from 'three';
import CryptoJS from 'crypto-js';
import * as THREE from 'three';

interface GeometricIdenticonProps {
  seed: string;
}

const GeometricIdenticon: React.FC<GeometricIdenticonProps> = ({ seed }) => {
  const gltf = useLoader(GLTFLoader, './human_head.glb');
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const { color, scale, rotation, cylinderSize, primitives } = useMemo(() => {
    const hash = CryptoJS.SHA256(seed).toString();
    const hue = parseInt(hash.substring(0, 2), 16);
    const hslColor = new Color(`hsl(${hue % 360}, 70%, 50%)`).getHexString();

    const baseScale = 10; // Base scale for the head
    const scaleVariation = 0.05; // Minor variation for scale
    const scaleX = baseScale + (parseInt(hash.substring(2, 4), 16) % 5) * scaleVariation;
    const scaleY = baseScale + (parseInt(hash.substring(4, 6), 16) % 5) * scaleVariation;
    const scaleZ = baseScale + (parseInt(hash.substring(6, 8), 16) % 5) * scaleVariation;

    const rotationVariation = Math.PI / 180; // One degree in radians
    const rotX = (parseInt(hash.substring(8, 10), 16) % 40) * rotationVariation;
    const rotY = (parseInt(hash.substring(10, 12), 16) % 50) * rotationVariation;
    const rotZ = (parseInt(hash.substring(12, 14), 16) % 50) * rotationVariation;

    const cylinderHeight = 15;
    const cylinderRadius = 8;
    const numPrimitives = 10;
    const rotationAngle = Math.PI / 45; // Adjust this to set the desired rotation angle (45 degrees for example)

    const primitivePositions = Array.from({ length: numPrimitives }, (_, i) => {
      const angle = (i / numPrimitives) * Math.PI * 2; // Full circle divided by the number of primitives
      const radius = cylinderRadius / 2; // Half the cylinder radius for the calculation
      const y = radius * Math.sin(angle);
      const x = radius * Math.cos(angle);

      // Apply rotation around the X-axis
      const newY = y * Math.cos(rotationAngle);
      const newZ = y * Math.sin(rotationAngle);

      return {
          x: x,  // X remains unchanged since the rotation is around the X-axis
          y: newY, // New Y calculated from rotation
          z: newZ,  // New Z calculated from rotation
          type: (i % 3)  // Modulo operation to alternate shapes
      };
    });

    return {
      color: `#${hslColor}`,
      scale: new Vector3(scaleX, scaleY, scaleZ),
      rotation: new Euler(rotX, rotY, rotZ),
      cylinderSize: { radius: cylinderRadius, height: cylinderHeight },
      primitives: primitivePositions
    };
  }, [seed]);

  const head = useMemo(() => {
    const scene = gltf.scene.clone();
    scene.scale.copy(scale);
    scene.rotation.copy(rotation);
    const box = new Box3().setFromObject(scene);
    const center = new Vector3();
    box.getCenter(center);
    scene.position.sub(center);
    return scene;
  }, [gltf, scale, rotation]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
    }
  }, [color]);

  // Function to create geometry based on type
  const createGeometry = (type, args) => {
    switch (type) {
      case 0: return new SphereGeometry(...args);
      case 1: return new BoxGeometry(...args);
      case 2: return new ConeGeometry(...args);
      default: return new SphereGeometry(...args);
    }
  };

  return (
    <>
      <mesh>
        <primitive object={head} />
        <meshStandardMaterial ref={materialRef} attach="material" color={color} roughness={0.5} metalness={1} />
      </mesh>

      {primitives.map((pos, index) => {
          const geometryArgs = pos.type === 0 ? [0.5, 16, 16] : pos.type === 1 ? [1, 1, 1] : [0.5, 1, 16];
          const geometry = createGeometry(pos.type, geometryArgs);
          return (
            <mesh key={index} position={[pos.x, pos.y, pos.z]} rotation={[0, -Math.atan2(pos.y, pos.x), 0]}>
              <primitive object={geometry} />
              <meshStandardMaterial color="red" />
            </mesh>
          );
      })}
    </>
  );
};

const Scene: React.FC<GeometricIdenticonProps> = ({ seed }) => {
  const lightColor = useMemo(() => {
    const hash = CryptoJS.SHA256(seed).toString();
    const hue = parseInt(hash.substring(0, 2), 16);
    const color = new Color(`hsl(${hue % 360}, 100%, 50%)`).getHexString();
    return `#${color}`;
  }, [seed]);

  return (
    <>
      <ambientLight intensity={0.04} />
      <directionalLight position={[0, 10, 5]} color={lightColor} intensity={1} />
      <pointLight position={[0, 0, 10]} color={lightColor} intensity={5} />
      <GeometricIdenticon seed={seed} />
    </>
  );
};

export default Scene;
