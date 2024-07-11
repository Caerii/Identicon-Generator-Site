# Identicon Generator Site
 Creating identicons automatically!

# What is an Identicon?

Identicons are icons that are generated based on a unique identifier. They are often used in applications to visually represent a user's identity. Identicons are generated based on a hash of the unique identifier, which ensures that the same identifier will always produce the same identicon.

# The objectives of our Identicons:

1. Legibility at Various Scales:
- Scalability: Ensure identicons are clear and recognizable at different sizes (e.g., 32x32, 64x64, 128x128).
- Contrast: High contrast between elements to maintain clarity when scaled down.

2. Uniqueness vs Similarity:
- Differentiation: Slight variations in strings should result in noticeably different identicons.
- Consistent Uniqueness: Ensure distinctiveness for a wide variety of inputs, minimizing collisions.

3. Appearance:
- Aesthetics: Identicons should be visually appealing and easy to recognize.
- Consistency: Maintain a consistent style across all identicons.

4. Performance and Efficiency:
- Speed: Generate identicons quickly and efficiently.
- Resource Usage: Minimize resource usage to ensure optimal performance.

Implementation Strategy

1. Algorithm Design:
- Hash Function: Use a robust hashing algorithm to convert strings into numerical values.
- Pattern Generation: Design an algorithm to convert hash values into visual patterns.
- Color Scheme: Develop a palette generator based on hash values to ensure diverse yet aesthetically pleasing colors.
2. Technology Stack:
- Frontend: Use Next.js for server-side rendering and React for the dynamic generation of identicons.
- Backend: Utilize Python for the core logic of identicon generation.
- Deployment: Deploy the solution on AWS using services like Lambda for the backend logic and S3 for storage.
3. Development Steps:
- Hashing and Pattern Algorithm:
Write a hashing function in Python.
Develop a pattern generation algorithm that translates hash outputs to visual elements.
- Color Generation:
Create a function to map hash values to color schemes.
- Next.js Integration:
Set up a Next.js project.
Integrate a Python API (using Flask or FastAPI) for generating identicons.
Use a canvas element in React to draw identicons dynamically.

- Testing and Validation:
Test for uniqueness and aesthetic quality.
Implement unit tests and visual checks.

# TODO:
- The identicons need to have a border on their container