import CryptoJS from 'crypto-js';

/**
 * Generates a SHA-256 hash of the input string concatenated with an index.
 * 
 * This function takes an input string and an index, concatenates them, and then generates
 * a SHA-256 hash of the resulting string. The hash is converted to a string and returned.
 * 
 * The SHA-256 algorithm is used for its strong cryptographic properties, ensuring that even
 * small changes to the input result in a significantly different hash.
 * 
 * @param {string} inputString - The input string to be hashed.
 * @param {number} index - An index to be concatenated with the input string before hashing.
 * @returns {string} - The resulting SHA-256 hash as a string.
 */
export const generateHash = (inputString: string, index: number): string => {
  // Concatenate the input string and index to form the string to be hashed
  const concatenatedString = inputString + index;
  
  // Generate the SHA-256 hash of the concatenated string
  const hash = CryptoJS.SHA256(concatenatedString);

  // Convert the hash to a hexadecimal string and return it
  return hash.toString();
};

/**
 * Capture the identicon from a canvas and trigger a download.
 * 
 * This function captures the current state of a WebGL canvas, resizes it to the specified
 * dimensions, and then triggers a download of the resized image as a PNG file.
 * 
 * The function follows these steps:
 * 1. Access the canvas container at the specified index from the provided references.
 * 2. Extract the canvas element from the container.
 * 3. Create a new canvas element to serve as the resized version.
 * 4. Draw the content of the original canvas onto the resized canvas.
 * 5. Convert the resized canvas content to a data URL.
 * 6. Create a link element, set its href to the data URL, and trigger a download.
 * 
 * @param {number} index - The index of the canvas element in the canvasRefs array.
 * @param {number} size - The desired size of the identicon to be downloaded.
 * @param {React.MutableRefObject<(HTMLDivElement | null)[]>} canvasRefs - A reference to an array of canvas container elements.
 */
export const captureIdenticon = (index: number, size: number, canvasRefs: React.MutableRefObject<(HTMLDivElement | null)[]>) => {
  // Access the canvas container at the specified index
  const canvasContainer = canvasRefs.current[index];
  if (!canvasContainer) {
    console.warn(`No canvas container found at index ${index}`);
    return;
  }

  // Extract the canvas element from the container
  const canvasElement = canvasContainer.querySelector('canvas');
  if (!canvasElement) {
    console.warn('No canvas element found in the specified container');
    return;
  }

  // Create a new canvas element to resize the image
  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = size;
  resizedCanvas.height = size;
  const ctx = resizedCanvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get 2D context for the resized canvas');
    return;
  }

  // Draw the content of the original canvas onto the resized canvas
  ctx.drawImage(canvasElement, 0, 0, size, size);

  // Convert the resized canvas content to a data URL in PNG format
  const dataURL = resizedCanvas.toDataURL('image/png');

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `identicon-${size}x${size}.png`;

  // Programmatically click the link to trigger the download
  link.click();
};
