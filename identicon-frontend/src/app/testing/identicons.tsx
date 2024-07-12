/**
 * page.tsx
 * 
 * This component renders a page with a form to generate geometric identicons based on user input.
 * It displays identicons for predefined users and allows dynamic creation of identicons from user input.
 * 
 * Created by Alif Jakir on 7/11/24
 * Contact: alif@halcyox.com
 */

"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GeometricIdenticon from './GeometricIdenticon';
import CryptoJS from 'crypto-js';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// Predefined list of users to display identicons for
const users = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

// Forum posts content for predefined users
const forumPosts = [
  {
    username: "Quiznos",
    post: "Hey everyone! I just discovered this cool new framework for 3D rendering. It's so much fun to work with!"
  },
  {
    username: "Boberta",
    post: "I’ve been experimenting with different hashing algorithms for identicons. SHA-256 seems to give the best results so far."
  },
  {
    username: "Charlie",
    post: "Does anyone have tips on optimizing performance for real-time 3D graphics? My project is lagging a bit."
  },
  {
    username: "Diana",
    post: "I’m planning to use identicons as avatars for my new app. How do you guys ensure uniqueness and security?"
  },
  {
    username: "Eve",
    post: "Just finished integrating Bloom and Chromatic Aberration effects. The visuals are stunning!"
  }
];

export default function Home() {
  const [inputString, setInputString] = useState('');
  const [seed, setSeed] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(true);
  const [rotate, setRotate] = useState(false);
  const canvasRefs = useRef<(HTMLDivElement | null)[]>(new Array(forumPosts.length));
  const [dropdownVisible, setDropdownVisible] = useState<Record<number, boolean>>({});
  const sizes = [16, 32, 64, 128, 256, 512];

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setInputString((prev) => prev + "enter username :)".slice(prev.length, prev.length + 1));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  useEffect(() => {
    if (inputString) setSeed(inputString);
  }, [inputString]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(false);
    setInputString(e.target.value);
  };

  const generateHash = (inputString: string, index: number) =>
    CryptoJS.SHA256(inputString + index).toString();

  const captureIdenticon = (index: number, size: number) => {
    const canvasContainer = canvasRefs.current[index];
    if (!canvasContainer) return;

    const canvasElement = canvasContainer.querySelector('canvas');
    if (!canvasElement) return;

    const gl = canvasElement.getContext('webgl2');
    if (!gl) return;

    const screenshot = canvasElement.toDataURL('image/png');
    const image = new Image();
    image.src = screenshot;
    image.onload = () => {
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = size;
      resizedCanvas.height = size;
      const ctx = resizedCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0, size, size);
        const link = document.createElement('a');
        link.href = resizedCanvas.toDataURL('image/png');
        link.download = `identicon-${size}x${size}.png`;
        link.click();
      }
    };
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-2xl mb-4">Forum Posts</h2>
        {forumPosts.map((post, i) => (
          <div key={i} className="mb-4 p-2 border rounded-md flex items-center">
            <div className="forum-identicon-container" ref={el => canvasRefs.current[i] = el}>
              <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 5, 5], fov: 35 }}>
                <EffectComposer>
                  <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} height={300} />
                  <ChromaticAberration offset={{ x: 0.02, y: 0.015 }} />
                  <ambientLight intensity={3.5} />
                  <pointLight position={[10, 10, 10]} />
                  {Array.from({ length: 5 }, (_, j) => <GeometricIdenticon key={j} seed={generateHash(post.username, j)} rotate={rotate} />)}
                </EffectComposer>
                <OrbitControls />
              </Canvas>
              <button onClick={() => setDropdownVisible({ ...dropdownVisible, [i]: !dropdownVisible[i] })} className="text-sm bg-blue-500 text-white rounded-md px-2 py-1">
                Download
              </button>
              {dropdownVisible[i] && (
                <div className="absolute bg-white border rounded-md mt-1">
                  {sizes.map((size) => (
                    <button key={size} onClick={() => {
                      setDropdownVisible({ ...dropdownVisible, [i]: false });
                      captureIdenticon(i, size);
                    }} className="block px-4 py-2 text-sm hover:bg-gray-200">
                      {size}x{size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-bold">{post.username}</p>
              <p className="text-sm">{post.post}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-3/4 p-4 text-center mt-12">
        <h1 className="text-4xl mb-4">3D Geometric Identicon Generator</h1>
        <p className="text-lg mb-4">The identicons below are generated using the SHA-256 hashing algorithm.</p>
        <input type="text" value={inputString} onChange={handleInputChange} onFocus={() => setIsTyping(false)} placeholder="Enter a string" className="px-4 py-2 text-lg border rounded-md" />
        <button onClick={() => setSeed(inputString)} className="px-4 py-2 ml-2 text-lg bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Generate Identicons
        </button>
        <button onClick={() => setRotate(!rotate)} className="px-4 py-2 ml-2 text-lg bg-green-500 text-white rounded-md hover:bg-green-700">
          {rotate ? "Stop Rotation" : "Start Rotation"}
        </button>
        <div className="canvas-container mx-auto mt-8 p-4 border-2 border-gray-300 rounded-lg" ref={el => canvasRefs.current[forumPosts.length] = el}>
          <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 5, 5], fov: 35 }}>
            <EffectComposer>
              <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} height={300} />
              <ChromaticAberration offset={{ x: 0.005, y: 0.0015 }} />
              <ambientLight intensity={3.5} />
              <pointLight position={[10, 10, 10]} />
              {identicons}
            </EffectComposer>
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
