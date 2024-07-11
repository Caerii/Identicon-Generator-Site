"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GeometricIdenticon from './GeometricIdenticon';
import CryptoJS from 'crypto-js';
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing';

// Mock user data
const users = [
  { username: "Alice" },
  { username: "Bob" },
  { username: "Charlie" },
  { username: "Diana" },
  { username: "Eve" },
];

export default function Home() {
  const [inputString, setInputString] = useState('');
  const [seed, setSeed] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const showcaseString = "enter username :)";

  useEffect(() => {
    const typewriterEffect = () => {
      const nextChar = showcaseString[inputString.length];
      
      if (nextChar) {
        setInputString(prev => prev + nextChar);
      } else {
        setTimeout(() => {
          setInputString('');
        }, 1000);
      }
    };

    if (isTyping) {
      const interval = setInterval(typewriterEffect, 200);
      return () => clearInterval(interval);
    }
  }, [inputString, isTyping]);

  useEffect(() => {
    if (inputString.length > 0) {
      setSeed(inputString);
    }
  }, [inputString]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(false);
    setInputString(e.target.value);
  };

  const handleInputFocus = () => {
    setIsTyping(false);
  };

  const generateHash = (inputString: string, index: number): string => {
    return CryptoJS.SHA256(inputString + index.toString()).toString();
  };

  const identicons = useMemo(() => {
    return seed ? Array.from({ length: 5 }, (_, index) => {
      const derivedSeed = generateHash(seed, index);
      return <GeometricIdenticon key={index} seed={derivedSeed} />;
    }) : [];
  }, [seed]);

  const generateIdenticons = (username: string) => {
    return Array.from({ length: 5 }, (_, index) => {
      const derivedSeed = generateHash(username, index);
      return <GeometricIdenticon key={index} seed={derivedSeed} />;
    });
  };

  return (
    <div className="flex">
      {/* Sidebar with user posts */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-2xl mb-4">Forum Posts</h2>
        {users.map((user, index) => (
          <div key={index} className="mb-4 p-2 border rounded-md flex items-center">
            <div className="w-60 h-100 mr-4">
              <Canvas camera={{ position: [5, 5, 5], fov: 20 }}>
                <OrbitControls />
                  <EffectComposer>
                  <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} height={300} />
                  <ChromaticAberration offset={{ x: 0.02, y: 0.015 }} />
                  <ambientLight intensity={3.5} />
                  <pointLight position={[10, 10, 10]} />
                  {generateIdenticons(user.username)}
                <OrbitControls />
              </EffectComposer>
              </Canvas>
            </div>
            <div>
              <p className="text-lg font-bold">{user.username}</p>
              <p className="text-sm">This is a post content example...</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="w-3/4 p-4">
        <div className="text-center mt-12">
          <h1 className="text-4xl mb-4">3D Geometric Identicon Generator</h1>
          <input
            type="text"
            value={inputString}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Enter a string"
            className="px-4 py-2 text-lg border rounded-md"
            ref={inputRef}
          />
          <button onClick={() => setSeed(inputString)} className="px-4 py-2 ml-2 text-lg bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Generate Identicons
          </button>
          <div className="canvas-container mx-auto mt-8 p-4 border-2 border-gray-300">
            <Canvas camera={{ position: [5, 5, 5], fov: 40 }}>
              <EffectComposer>
                <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} height={300} />
                <ChromaticAberration offset={{ x: 0.005, y: 0.0015 }} />
                <ambientLight intensity={3.5} />
                <pointLight position={[10, 10, 10]} />
                {identicons}
                <OrbitControls />
              </EffectComposer>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
