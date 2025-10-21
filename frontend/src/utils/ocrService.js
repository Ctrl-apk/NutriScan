import Tesseract from 'tesseract.js';

/**
 * Extract text from image using Tesseract.js OCR
 * @param {File} imageFile - The image file to process
 * @param {Function} onProgress - Callback for progress updates (0-100)
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (imageFile, onProgress) => {
  try {
    const result = await Tesseract.recognize(
      imageFile,
      'eng',
      {
        logger: (m) => {
          if (onProgress && m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            onProgress(progress);
          }
        },
      }
    );
    
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image. Please try another image.');
  }
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} - Validation result {valid: boolean, error: string}
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, JPG, PNG, and GIF files are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  return { valid: true, error: null };
};