/**
 * `GeometricIdenticon` is a functional React component that creates a 3D identicon based on a cryptographic seed.
 * The component utilizes several useMemo hooks to compute properties like position, scale, and color based on the seed,
 * ensuring that each identicon is unique and reproducibly generated from its input seed.
 *
 * This component illustrates an advanced use-case of cryptographic functions to drive aesthetic variations in 3D models,
 * making extensive use of three.js geometries to represent different possible identicon shapes. It also demonstrates the
 * use of React hooks to optimize computation-intensive tasks in a 3D rendering context.
 *
 * The generated identicon is a visual representation of the cryptographic seed, featuring unique properties such as
 * geometry, position, scale, color, and rotation. These properties are derived from the cryptographic hash of the seed,
 * ensuring consistency and uniqueness for each distinct seed value.
 *
 * @module GeometricIdenticon
 * @param {GeometricIdenticonProps} props - The properties required by the component, primarily the cryptographic seed.
 * @param {string} props.seed - The cryptographic seed used to generate the identicon's unique properties.
 */

import React, { useMemo, useRef } from 'react';
import { Vector3, Euler } from 'three';
import CryptoJS from 'crypto-js';
import { useFrame, useLoader } from '@react-three/fiber';

interface GeometricIdenticonProps {
  seed: string;
}

/**
 * Generates a SHA256 hash from the provided input string. This cryptographic hash function
 * serves as the foundation for deriving all other properties of the 3D identicon. By generating
 * a hash from the seed, we ensure that the identicon's properties are both unique and reproducible
 * for any given seed.
 *
 * @param {string} inputString - The input string used to generate the hash.
 * @returns {string} - A hexadecimal string representing the SHA256 hash of the input string.
 */
const generateHash = (inputString: string): string => {
  return CryptoJS.SHA256(inputString).toString();
};

/**
 * Derives a numerical value from a specific segment of a hash. This function is crucial for translating
 * the hash into specific visual or geometric characteristics of an identicon. By slicing a segment of the
 * hash and converting it to a numerical value, we can map this value to a range suitable for positioning,
 * scaling, and coloring the identicon's elements.
 *
 * @param {string} hash - The cryptographic hash from which to derive the value.
 * @param {number} index - The index indicating which segment of the hash to use. This allows for multiple distinct values to be derived from a single hash.
 * @param {number} range - The maximum range to which the resulting value should be scaled, ensuring the value falls within a desired interval.
 * @returns {number} - A scaled number derived from the hash, used for property computation such as position, scale, and color.
 */
const getRandomValue = (hash: string, index: number, range: number): number => {
  const hashIndex = index % (hash.length / 2);
  return (parseInt(hash.slice(hashIndex * 2, hashIndex * 2 + 2), 16) / 255) * range;
};

/**
 * Defines the specific color scheme for the identicon. It selects colors based on predefined ranges,
 * ensuring a consistent palette.
 *
 * @param {string} hash - The cryptographic hash from which to derive the color.
 * @param {number} index - The index indicating which segment of the hash to use.
 * @returns {string} - A color string in HSL format.
 */
const getColorFromHash = (hash: string, index: number): string => {
  const hue = getRandomValue(hash, index, 360);
  // Define fixed saturation and lightness for the color scheme
  const saturation = 70; // 70% saturation
  const lightness = 50; // 50% lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * `GeometricIdenticon` is the main component that renders the 3D identicon. It calculates the identicon's properties
 * using the provided cryptographic seed. The properties include the identicon's position, scale, color, rotation, and
 * geometry type. Each property is derived from a segment of the SHA256 hash of the seed, ensuring that the identicon is
 * unique for each seed and reproducible for the same seed.
 *
 * @param {GeometricIdenticonProps} props - The properties required by the component, primarily the cryptographic seed.
 * @returns {JSX.Element} - The rendered 3D identicon mesh.
 */
const GeometricIdenticon: React.FC<GeometricIdenticonProps> = ({ seed }) => {
  // Generates a stable hash from the seed. This hash serves as the basis for all other property calculations.
  const hash = useMemo(() => generateHash(seed), [seed]);

  // Calculates the position of the identicon in 3D space. The position is determined by deriving three values from the hash,
  // each mapped to a range from -5 to 5.
  const position = useMemo(() => new Vector3(
    getRandomValue(hash, 1, 5) - 5,
    getRandomValue(hash, 2, 5) - 5,
    getRandomValue(hash, 3, 5) - 5
  ), [hash]);

  // Determines the type of geometry to render based on a value derived from the hash. The typeIndex ensures a varied and
  // unpredictable selection of geometry types, adding to the visual diversity of the identicon.
  const typeIndex = useMemo(() => Math.floor(getRandomValue(hash, 0, 7)), [hash]);

  // Calculates the scale of the identicon. Each dimension (x, y, z) is scaled independently, resulting in potentially
  // asymmetric shapes. The scale values are derived from the hash and mapped to a range from 0.5 to 2.5.
  const scale = useMemo(() => new Vector3(
    getRandomValue(hash, 4, 2) + 0.5,
    getRandomValue(hash, 5, 2) + 0.5,
    getRandomValue(hash, 6, 2) + 0.5
  ), [hash]);

  // Derives the color of the identicon using a constrained color scheme.
  const color = useMemo(() => getColorFromHash(hash, 7), [hash]);

  // Determines the rotation of the identicon. The rotation is represented by Euler angles (in radians) for the x, y, and z axes.
  // Each angle is derived from the hash and mapped to a range from 0 to 2π, allowing for full rotational freedom.
  const rotation = useMemo(() => new Euler(
    getRandomValue(hash, 8, Math.PI * 2),
    getRandomValue(hash, 9, Math.PI * 2),
    getRandomValue(hash, 10, Math.PI * 2)
  ), [hash]);

  // A React ref used to attach to the rendered mesh. This ref can be used for future dynamic modifications or animations.
  const ref = useRef<THREE.Mesh>(null);

  // Add an animation to make the identicon spin with a specific pattern
  // useFrame(({ clock }) => {
  //   if (ref.current) {
  //     const time = clock.getElapsedTime();
  //     ref.current.rotation.x = rotation.x + Math.sin(time) * 0.15; // Adjust the factor to control speed
  //     ref.current.rotation.y = rotation.y + Math.sin(time / 1.5) * 0.2; // Adjust the divisor to create a staggered effect
  //     ref.current.rotation.z = rotation.z + Math.sin(time / 2) * 0.2; // Adjust the divisor to create a staggered effect
  //   }
  // });

  // Determines which type of three.js geometry to render based on the typeIndex. This adds variety to the identicons
  // by selecting different geometric shapes such as boxes, spheres, cones, etc.
  const geometry = useMemo(() => {
    switch (typeIndex) {
      case 0: return <boxGeometry args={[1, 1, 1]} />;
      case 1: return <sphereGeometry args={[1.5, 32, 32]} />;
      case 2: return <coneGeometry args={[0.5, 1, 32]} />;
      case 3: return <torusKnotGeometry args={[1.5, 0.01, 100, 16]} />;
      case 4: return <dodecahedronGeometry args={[0.75, 0]} />;
      case 5: return <octahedronGeometry args={[0.75, 0]} />;
      case 6: return <tetrahedronGeometry args={[0.75, 0]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [typeIndex]);

  // Creates a material for the identicon. The material's color and wireframe properties are derived from the hash,
  // adding to the visual uniqueness. The opacity is also varied to create different levels of transparency.
  const material = useMemo(() => (
    <meshStandardMaterial 
      color={color} 
      wireframe={typeIndex % 2 === 0} 
      transparent 
      opacity={0.5 + getRandomValue(hash, 11, 0.5)} 
    />
  ), [color, typeIndex, hash]);

  // The rendered 3D mesh, applying all the calculated properties and attaching the selected geometry and material.
  return (
    <mesh ref={ref} position={position} scale={scale} rotation={rotation}>
      {geometry}
      {material}
    </mesh>
  );
};

export default GeometricIdenticon;
