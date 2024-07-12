"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GeometricIdenticon from '../GeometricIdenticon';
import CryptoJS from 'crypto-js';
import { EffectComposer, ChromaticAberration, DotScreen } from '@react-three/postprocessing';

// Mock user data for demonstration
const users = [
  { username: "Alice" },
  { username: "Bob" },
  { username: "Charlie" },
  { username: "Diana" },
  { username: "Eve" },
];

// List of interesting strings to loop through
const showcaseStrings = [
  "enter username :)",
  "identicons are unique!",
  "type a name and see magic!",
  "create your own identicons",
  "have fun with 3D visuals",
];

export default function Home() {
  const [inputString, setInputString] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const typingInterval = 100;
  const pauseBeforeRestart = 2000;

  useEffect(() => {
    if (!isTyping) {
      const timeout = setTimeout(() => {
        setInputString(''); // Clear the input string
        setIsTyping(true); // Restart typing
        setCurrentStringIndex((currentStringIndex + 1) % showcaseStrings.length); // Move to next string
      }, pauseBeforeRestart);
      return () => clearTimeout(timeout);
    }

    const typeChar = () => {
      const currentString = showcaseStrings[currentStringIndex];
      if (inputString.length < currentString.length) {
        setInputString(currentString.substring(0, inputString.length + 1));
      } else {
        setIsTyping(false); // Stop typing once the current string is completed
      }
    };

    const intervalId = setInterval(typeChar, typingInterval);
    return () => clearInterval(intervalId);

  }, [inputString, isTyping, currentStringIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(false);
    setInputString(e.target.value);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsTyping(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (inputString === '') {
      setIsTyping(true);
    }
  };

  const generateIdenticons = (username: string) => {
    return Array.from({ length: 5 }, (_, index) => {
      const derivedSeed = CryptoJS.SHA256(username + index).toString();
      return <GeometricIdenticon key={index} seed={derivedSeed} />;
    });
  };

  const renderCanvas = (username: string) => (
    <Canvas camera={{ position: [5, 5, 5], fov: 30 }}>
      <EffectComposer>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        {generateIdenticons(username)}
        <ChromaticAberration offset={[0.005, 0.005]} />
        <DotScreen scale={2} />
      </EffectComposer>
    </Canvas>
  );

  return (
    <div className="flex">
      {/* Sidebar with user posts */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-2xl mb-4">Forum Posts</h2>
        {users.map((user, index) => (
          <div key={index} className="mb-4 p-2 border rounded-md flex items-center">
            <div className="w-60 h-100 mr-4">
              {renderCanvas(user.username)}
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={() => setIsTyping(false)}
            placeholder="Enter a string"
            className="px-4 py-2 text-lg border rounded-md"
            ref={inputRef}
          />
          <button onClick={() => {}} className="px-4 py-2 ml-2 text-lg bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Generate Identicons
          </button>
          <div className="canvas-container mx-auto mt-8 p-4 border-2 border-gray-300">
            {renderCanvas(inputString)}
          </div>
        </div>
      </div>
    </div>
  );
}
