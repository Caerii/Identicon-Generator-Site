/**
 * MainContext.tsx
 * 
 * @file This file defines the MainContent component, which serves as the primary interface for the 3D Geometric Identicon Generator application. The component allows users to input a string, generate a unique 3D identicon based on the SHA-256 hash of the string, control the rotation of the identicons, select the size of the identicons, and download the generated identicons as PNG files.
 * 
 * @version 1.0.0
 * @date 07/12/24
 * @contact alif@halcyox.com
 */

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import GeometricIdenticon from './GeometricIdenticon';
import { useMemo, useState, ChangeEvent } from 'react';
import { generateHash, captureIdenticon } from './utils';
import { Vector2 } from 'three';

/**
 * Prop types for MainContent component.
 * 
 * @typedef {Object} MainContentProps
 * @property {string} inputString - The input string entered by the user, which is used to generate the identicons.
 * @property {function} handleInputChange - Callback function to handle changes in the input string, updating the inputString state in the parent component.
 * @property {function} setSeed - Function to set the seed value used for identicon generation. The seed is derived from the input string.
 * @property {boolean} rotate - Boolean flag indicating whether the identicons should be in a rotating state.
 * @property {function} setRotate - Function to toggle the rotation state of the identicons.
 * @property {string|null} seed - The current seed value used for generating the identicons. This is typically a hashed version of the input string.
 * @property {React.MutableRefObject<(HTMLDivElement | null)[]>} canvasRefs - A reference object to an array of canvas container elements, allowing the component to interact with the canvases directly.
 * @property {function} setIsTyping - Function to update the typing state, used to control UI behavior when the user is typing in the input field.
 */
interface MainContentProps {
  inputString: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setSeed: (seed: string | null) => void;
  rotate: boolean;
  setRotate: (rotate: boolean) => void;
  seed: string | null;
  canvasRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  setIsTyping: (isTyping: boolean) => void;
}

// Constant defining the number of geometric shapes to generate for identicons
const amountOfShapes = 10;

/**
 * MainContent component.
 * 
 * The MainContent component is responsible for rendering the user interface of the 3D Geometric Identicon Generator application.
 * It provides an input field for the user to enter a string, which is used to generate unique identicons based on a SHA-256 hash.
 * The component allows users to control the rotation of the identicons, select their size, and download them as PNG files.
 * Additionally, it renders a 3D scene with postprocessing effects using react-three-fiber.
 * 
 * @component
 * @param {MainContentProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered MainContent component.
 */
const MainContent: React.FC<MainContentProps> = ({
  inputString, 
  handleInputChange, 
  setSeed, 
  rotate, 
  setRotate, 
  seed, 
  canvasRefs, 
  setIsTyping
}) => {
  // State to track the selected size for the identicon download
  const [selectedSize, setSelectedSize] = useState(256);

  /**
   * Memoized identicons array.
   * 
   * This useMemo hook generates an array of GeometricIdenticon components based on the current seed and rotation state.
   * The array is re-generated only when the seed or rotation state changes, optimizing performance.
   * 
   * @returns {JSX.Element[]} Array of GeometricIdenticon components.
   */
  const identicons = useMemo(() => 
    seed 
      ? Array.from({ length: amountOfShapes }, (_, i) => (
          <GeometricIdenticon key={i} seed={generateHash(seed, i)} rotate={rotate} />
        )) 
      : [], 
    [seed, rotate]
  );

  return (
    <div className="w-33/4 p-4 text-center mt-12">
      <h1 className="text-4xl mb-4">3D Geometric Identicon Generator</h1>
      <p className="text-lg mb-4">The identicons below are generated using the SHA-256 hashing algorithm.</p>

      {/* Input field for entering the string to generate identicons */}
      <input
        type="text"
        value={inputString}
        onChange={handleInputChange}
        onFocus={() => setIsTyping(false)}
        placeholder="Enter a string"
        className="px-4 py-2 text-lg border rounded-md"
      />

      {/* Button to toggle identicon rotation */}
      <button 
        onClick={() => setRotate(!rotate)} 
        className="px-4 py-2 ml-2 text-lg bg-green-500 text-white rounded-md hover:bg-green-700"
      >
        {rotate ? "Stop Rotation" : "Start Rotation"}
      </button>

      {/* Dropdown menu to select the identicon size */}
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(parseInt(e.target.value))}
        className="px-4 py-2 ml-2 text-lg border rounded-md"
      >
        {[16, 32, 64, 128, 256, 512].map(size => (
          <option key={size} value={size}>{size}x{size}</option>
        ))}
      </select>

      {/* Button to download the identicon */}
      <button 
        onClick={() => captureIdenticon(canvasRefs.current.length - 1, selectedSize, canvasRefs)} 
        className="px-4 py-2 ml-2 text-lg bg-red-500 text-white rounded-md hover:bg-red-700"
      >
        Download Identicon
      </button>

      {/* Container for the 3D canvas */}
      <div className="canvas-container mx-auto mt-8 p-4 border-2 border-gray-300 rounded-lg" ref={el => { canvasRefs.current[canvasRefs.current.length] = el; }} >
        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 5, 5], fov: 35 }}>
          {/* Adding postprocessing effects for enhanced visual quality */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} height={300} />
            <ChromaticAberration offset={new Vector2(0.005, 0.0015)} radialModulation={false} modulationOffset={0.0} />
            <ambientLight intensity={3.5} />
            <pointLight position={[10, 10, 10]} />
            <> {identicons} </>
          </EffectComposer>

          {/* Adding orbit controls to navigate the 3D scene */}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default MainContent;
