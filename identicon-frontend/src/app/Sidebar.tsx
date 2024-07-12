/**
 * Sidebar.tsx
 * 
 * This file defines the Sidebar component, which displays a list of forum posts along with their corresponding geometric identicons. The identicons are generated using Three.js and can be downloaded in various sizes. Each forum post includes a user's username, the content of the post, and an identicon visually representing the user. The identicon's properties are derived from a SHA-256 hash of the username.
 * 
 * Created by Alif Jakir on 7/11/24
 * Updated by Alif Jakir on 7/12/24
 * Contact: alif@halcyox.com
 */

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import GeometricIdenticon from './GeometricIdenticon';
import { generateHash, captureIdenticon } from './utils';
import { MutableRefObject, useState } from 'react';
import * as THREE from 'three';

// Array of possible sizes for identicon downloads
const sizes = [16, 32, 64, 128, 256, 512];

// Number of shapes to generate within each identicon
const amountOfShapes = 10;

/**
 * Interface representing a forum post
 * 
 * This interface defines the structure of a forum post object, including the username of the person who made the post and the content of the post.
 * 
 * @interface ForumPost
 * @property {string} username - The username of the person who made the post.
 * @property {string} post - The content of the forum post.
 */
interface ForumPost {
  username: string;
  post: string;
}

/**
 * Props for the Sidebar component
 * 
 * This interface defines the properties passed to the Sidebar component, including an array of forum posts, 
 * a flag for identicon rotation, functions for managing dropdown visibility, and a reference to canvas elements.
 * 
 * @interface SidebarProps
 * @property {ForumPost[]} forumPosts - Array of forum posts to display.
 * @property {boolean} rotate - Whether the identicons should rotate.
 * @property {function} setDropdownVisible - Function to toggle the visibility of the dropdown menu.
 * @property {Record<number, boolean>} dropdownVisible - Object mapping post indices to their dropdown visibility state.
 * @property {MutableRefObject<(HTMLDivElement | null)[]>} canvasRefs - Mutable reference to an array of canvas containers.
 */
interface SidebarProps {
  forumPosts: ForumPost[];
  rotate: boolean;
  setDropdownVisible: (visible: (prev: Record<number, boolean>) => Record<number, boolean>) => void;
  dropdownVisible: Record<number, boolean>;
  canvasRefs: MutableRefObject<(HTMLDivElement | null)[]>;
}

/**
 * Sidebar component to display forum posts and their identicons
 * 
 * This component renders a sidebar containing a list of forum posts. Each post includes a geometric identicon 
 * that is generated using Three.js and can be downloaded in various sizes. The identicons visually represent the users based on their usernames.
 * 
 * @param {SidebarProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered sidebar component.
 */
const Sidebar: React.FC<SidebarProps> = ({ forumPosts, rotate, setDropdownVisible, dropdownVisible, canvasRefs }) => {
  // State to track the selected size for identicon downloads for each post
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>(forumPosts.reduce((acc, _, index) => {
    acc[index] = sizes[0];  // Default to the smallest size
    return acc;
  }, {} as Record<number, number>));

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r">
      <h2 className="text-2xl mb-4">Forum Posts</h2>
      {/* Loop through the forumPosts array and render each post */}
      {forumPosts.map((post, i) => (
        <div key={i} className="mb-4 p-2 border rounded-md flex items-center relative">
          {/* Container for the identicon */}
          <div className="forum-identicon-container relative" ref={(el: HTMLDivElement | null) => { canvasRefs.current[i] = el; }}>
            <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 5, 5], fov: 35 }}>
              <EffectComposer>
                <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} height={300} />
                <ChromaticAberration offset={new THREE.Vector2(0.02, 0.015)} radialModulation={false} modulationOffset={0.0} />
                <ambientLight intensity={3.5} />
                <pointLight position={[10, 10, 10]} />
                {/* Generate identicon shapes */}
                {Array.from({ length: amountOfShapes }, (_, j) => (
                  <GeometricIdenticon key={j} seed={generateHash(post.username, j)} rotate={rotate} />
                )) as React.ReactElement<any, any>}
              </EffectComposer>
              <OrbitControls />
            </Canvas>
          </div>
          {/* Container for the post content */}
          <div className="ml-4 flex-grow">
            <p className="text-lg font-bold">{post.username}</p>
            <p className="text-sm">{post.post}</p>
          </div>
          {/* Dropdown button and menu for downloading identicons */}
          <div className="absolute top-0 right-0">
            {/* Button to toggle dropdown visibility */}
            <button
              onClick={() =>
                setDropdownVisible((prev: Record<number, boolean>) => ({ ...prev, [i]: !prev[i] }))
              }
              className="text-sm bg-blue-500 text-white rounded-md px-2 py-1"
            >
              Download
            </button>
            {/* Dropdown menu for selecting identicon size and downloading */}
            {dropdownVisible[i] && (
              <div className="absolute bg-white border rounded-md mt-1 p-2">
                <select
                  value={selectedSizes[i]}
                  onChange={(e) => setSelectedSizes({ ...selectedSizes, [i]: parseInt(e.target.value) })}
                  className="block w-full mb-2 p-1 border rounded-md"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}x{size}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setDropdownVisible((prev: Record<number, boolean>) => ({ ...prev, [i]: false }));
                    captureIdenticon(i, selectedSizes[i], canvasRefs);
                  }}
                  className="block w-full bg-green-500 text-white rounded-md px-2 py-1"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
