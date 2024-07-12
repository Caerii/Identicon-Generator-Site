/**
 * GeometricIdenticon.tsx
 * 
 * This file defines the GeometricIdenticon component, which generates a unique 3D geometric identicon based on a given seed string. The identicon's properties, including geometry, color, position, scale, and rotation, are derived from the SHA-256 hash of the seed string. The component leverages React and Three.js to render the 3D shape and applies dynamic transformations to create visually distinct identicons.
 * 
 * Created by Alif Jakir on 7/11/24
 * Updated by Alif Jakir on 7/12/24
 * Contact: alif@halcyox.com
 */

import React, { useMemo, useRef } from 'react';
import { Vector3, Euler } from 'three';
import CryptoJS from 'crypto-js';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Generates a SHA-256 hash for the given input string.
 * 
 * The SHA-256 hash algorithm is used for its strong cryptographic properties, ensuring that the resulting hash is unique and changes significantly with small variations in the input string. This property is crucial for generating distinct identicons.
 * 
 * @param {string} inputString - The input string to be hashed.
 * @returns {string} The SHA-256 hash of the input string.
 */
const generateHash = (inputString: string) => CryptoJS.SHA256(inputString).toString();

/**
 * Generates a random value within a given range based on the hash and index.
 * 
 * This function extracts a segment of the hash string, converts it to a decimal value, and scales it to the specified range. The index determines which part of the hash is used, ensuring different properties for different parts of the identicon.
 * 
 * @param {string} hash - The hash string.
 * @param {number} index - The index to extract the value from the hash.
 * @param {number} range - The range of the random value.
 * @returns {number} A random value within the specified range.
 */
const getRandomValue = (hash: string, index: number, range: number) => 
  (parseInt(hash.slice((index % (hash.length / 2)) * 2, (index % (hash.length / 2)) * 2 + 2), 16) / 255) * range;

/**
 * Generates a color in HSL format based on the hash and index.
 * 
 * The color is derived from the hash to ensure consistency with other properties of the identicon. HSL format is used for easy manipulation of hue, saturation, and lightness.
 * 
 * @param {string} hash - The hash string.
 * @param {number} index - The index to extract the color from the hash.
 * @returns {string} A color in HSL format.
 */
const getColorFromHash = (hash: string, index: number) => `hsl(${getRandomValue(hash, index, 360)}, 70%, 50%)`;

/**
 * GeometricIdenticon Component
 * 
 * This component creates a 3D mesh object whose properties are determined by a hashed seed.
 * It generates a unique geometric shape with position, scale, color, and rotation derived from the seed.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.seed - The seed string used to generate the identicon.
 * @param {boolean} props.rotate - Flag indicating whether the mesh should rotate.
 * @returns {JSX.Element} The rendered GeometricIdenticon component.
 */
const GeometricIdenticon = ({ seed, rotate }: { seed: string, rotate: boolean }) => {
  // Generate hash from the seed string
  const hash = useMemo(() => generateHash(seed), [seed]);

  // Determine the position of the mesh based on the hash
  const position = useMemo(() => new Vector3(
    getRandomValue(hash, 1, 10) - 5,  // X position between -5 and 5
    getRandomValue(hash, 2, 10) - 5,  // Y position between -5 and 5
    getRandomValue(hash, 3, 10) - 5   // Z position between -5 and 5
  ), [hash]);

  // Determine the type of geometry to use based on the hash
  const typeIndex = useMemo(() => Math.floor(getRandomValue(hash, 0, 7)), [hash]);

  // Determine the scale of the mesh based on the hash
  const scale = useMemo(() => new Vector3(
    getRandomValue(hash, 4, 2) + 0.5,  // X scale between 0.5 and 2.5
    getRandomValue(hash, 5, 2) + 0.5,  // Y scale between 0.5 and 2.5
    getRandomValue(hash, 6, 2) + 0.5   // Z scale between 0.5 and 2.5
  ), [hash]);

  // Determine the color of the mesh based on the hash
  const color = useMemo(() => getColorFromHash(hash, 7), [hash]);

  // Determine the rotation of the mesh based on the hash
  const rotation = useMemo(() => new Euler(
    getRandomValue(hash, 8, Math.PI * 2),  // X rotation between 0 and 2π
    getRandomValue(hash, 9, Math.PI * 2),  // Y rotation between 0 and 2π
    getRandomValue(hash, 10, Math.PI * 2)  // Z rotation between 0 and 2π
  ), [hash]);

  // Reference to the mesh object for updating its rotation over time
  const ref = useRef<THREE.Mesh>(null);

  /**
   * useFrame hook to update the rotation of the mesh on each frame.
   * 
   * This hook ensures that the mesh rotates smoothly over time when the rotate flag is true.
   * It uses the elapsed time to calculate the new rotation values.
   * 
   * @param {Object} state - The state object provided by the useFrame hook.
   * @param {Object} state.clock - The clock object to get the elapsed time.
   */
  useFrame(({ clock }) => {
    if (ref.current && rotate) {
      const time = clock.getElapsedTime();
      ref.current.rotation.set(
        rotation.x + Math.sin(time) * 0.15,
        rotation.y + Math.sin(time / 1.5) * 0.2,
        rotation.z + Math.sin(time / 2) * 0.2
      );
    }
  });

  // Define possible geometries for the mesh
  const geometries = [
    <boxGeometry args={[1, 1, 1]} key="box" />,
    <sphereGeometry args={[1.5, 32, 32]} key="sphere" />,
    <coneGeometry args={[0.5, 1, 32]} key="cone" />,
    <torusKnotGeometry args={[1.5, 0.01, 100, 16]} key="torusKnot" />,
    <dodecahedronGeometry args={[0.75, 0]} key="dodecahedron" />,
    <octahedronGeometry args={[0.75, 0]} key="octahedron" />,
    <tetrahedronGeometry args={[0.75, 0]} key="tetrahedron" />,
    <boxGeometry args={[1, 1, 1]} key="boxDefault" />,
  ];

  // Create material for the mesh with color, wireframe option, and transparency
  const material = useMemo(() => (
    <meshStandardMaterial 
      color={color} 
      wireframe={typeIndex % 2 === 0}  // Wireframe for even type indices
      transparent 
      opacity={0.5 + getRandomValue(hash, 11, 0.5)}  // Semi-transparent material
    />
  ), [color, typeIndex, hash]);

  return (
    <mesh ref={ref} position={position} scale={scale} rotation={rotation}>
      {geometries[typeIndex] || geometries[0]}  {/* Select geometry based on type index */}
      {material}  {/* Apply the material */}
    </mesh>
  );
};

export default GeometricIdenticon;
