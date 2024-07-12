/**
 * page.tsx
 * 
 * This file contains the main component for the home page of the application. It integrates the Sidebar and MainContent components to provide a complete user interface. The page supports dynamic updates based on user input, such as generating identicons from usernames and controlling their properties.
 * 
 * Created by Alif Jakir on 7/11/24
 * Contact: alif@halcyox.com
 */

"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { forumPosts } from './data';

/**
 * Home Component
 * 
 * The Home component serves as the main entry point for the application. It manages the state and behavior for the Sidebar and MainContent components. The component supports dynamic user input for generating identicons and controlling their properties such as rotation and size.
 * 
 * @component
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
  // State to track the current input string entered by the user
  // This string is used to generate a unique identicon
  const [inputString, setInputString] = useState('');

  // State to store the seed value derived from the input string
  // The seed is used to ensure that the identicon is consistently generated based on the same input
  const [seed, setSeed] = useState<string | null>(null);

  // State to determine if the user is currently typing
  // Used to control the automatic typing effect
  const [isTyping, setIsTyping] = useState(true);

  // State to control whether the identicons should rotate
  // Toggles the rotation animation of identicons in the 3D scene
  const [rotate, setRotate] = useState(false);

  // Reference to an array of canvas elements used for rendering identicons
  // Allows direct manipulation of the canvas elements for actions such as capturing the identicon as an image
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State to manage the visibility of dropdown menus for each forum post
  // This ensures each post can independently show or hide its dropdown menu
  const [dropdownVisible, setDropdownVisible] = useState<Record<number, boolean>>({});

  /**
   * useEffect hook to simulate typing effect when the component mounts.
   * 
   * This effect sets an interval to gradually fill the input string with a predefined message.
   * The interval clears when the component unmounts or when typing is stopped.
   * The typing effect provides a guided experience for users to understand where to input their data.
   */
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setInputString((prev) => {
          // Simulate typing by adding one character at a time from the predefined message
          const nextChar = "enter username :)"[prev.length];
          return nextChar ? prev + nextChar : '';
        });
      }, 200); // Typing speed set to 200ms per character
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  /**
   * useEffect hook to update the seed state when the input string changes.
   * 
   * This effect ensures that the seed used for generating identicons is updated whenever the input string is modified.
   * The seed is set to the current input string to generate a new identicon each time the input changes.
   */
  useEffect(() => {
    if (inputString) setSeed(inputString);
  }, [inputString]);

  /**
   * Handler for input changes.
   * 
   * This function updates the input string state and stops the typing simulation when the user types in the input field.
   * By stopping the typing simulation, it allows the user to take over the input process.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(false); // Stop the automatic typing effect when the user starts typing
    setInputString(e.target.value); // Update the input string state with the user's input
  };

  return (
    <div className="flex">
      {/* Sidebar component to display forum posts and identicons */}
      <Sidebar 
        forumPosts={forumPosts} // Pass the array of forum posts to the Sidebar
        rotate={rotate} // Pass the rotate state to control identicon rotation
        setDropdownVisible={setDropdownVisible} // Function to toggle the visibility of dropdown menus
        dropdownVisible={dropdownVisible} // Current visibility state of dropdown menus
        canvasRefs={canvasRefs} // Reference to the canvas elements for identicons
      />
      {/* MainContent component to handle user input and identicon display */}
      <MainContent 
        inputString={inputString} // Current input string entered by the user
        handleInputChange={handleInputChange} // Function to handle input changes
        setSeed={setSeed} // Function to update the seed value
        rotate={rotate} // Current state of identicon rotation
        setRotate={setRotate} // Function to toggle identicon rotation
        seed={seed} // Current seed value for generating identicons
        canvasRefs={canvasRefs} // Reference to the canvas elements for identicons
        setIsTyping={setIsTyping} // Function to update the typing state
      />
    </div>
  );
}
