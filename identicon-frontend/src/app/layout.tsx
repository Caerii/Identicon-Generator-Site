/**
 * This file defines the root layout component for the Identicon Generator application.
 * It sets up the basic HTML structure and applies global styles.
 *
 * @module RootLayout
 * @author Alif Jakri
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * The Inter font is used for the application's typography.
 * It is defined using the Google Fonts API and applied as a global style.
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * The metadata object contains metadata information about the application.
 * It is used by the Next.js framework to generate metadata for the HTML document.
 */
export const metadata: Metadata = {
  title: "Identicon Generator",
  description: "Unique digital identifiers.",
};

/**
 * The RootLayout component is the root layout component for the application.
 * It sets up the basic HTML structure and applies global styles.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * The HTML element that represents the root layout.
     * It sets the language attribute to "en" and applies the Inter font class.
     */
    <html lang="en">
      <body className={inter.className}>
        {/**
         * The child components to render within the layout.
         */}
        {children}
      </body>
    </html>
  );
}

