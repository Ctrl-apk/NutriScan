import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader } from 'lucide-react';
import { extractTextFromImage } from '../utils/ocrService';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ScanUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [productName, setProductName] = useState('');
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setError('');
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and GIF files are allowed');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setOcrProgress(0);
    setProductName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    if (!productName.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError('');
    setOcrProgress(0);

    try {
      console.log('Starting OCR extraction...');
      const extractedText = await extractTextFromImage(selectedFile, setOcrProgress);
      
      if (!extractedText || extractedText.trim().length === 0) {
        setError('No text detected. Please try another image with clear text.');
        setLoading(false);
        return;
      }

      console.log('OCR Complete. Sending to backend...');

      // Send to backend
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('extractedText', extractedText);
      formData.append('productName', productName.trim());

      const { data } = await api.post('/scan/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Analysis complete:', data);

      // Navigate to results
      navigate('/results', { 
        state: { 
          results: data.results, 
          scanId: data._id,
          productName: productName.trim()
        } 
      });
    } catch (err) {
      console.error('Scan error:', err);
      setError(
        err.message || 
        err.response?.data?.message || 
        'Failed to analyze image. Please check if backend is running.'
      );
    } finally {
      setLoading(false);
      setOcrProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <Camera className="w-7 h-7 text-green-600" />
        <span>Scan Food Label</span>
      </h2>

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />

      {!preview ? (
        <div className="space-y-4">
          {/* Upload buttons */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 border-4 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition text-center"
          >
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Upload from Gallery
            </h3>
            <p className="text-gray-500">Select an image from your device</p>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full p-8 border-4 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-center"
          >
            <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Take Photo
            </h3>
            <p className="text-gray-500">Use your camera to capture label</p>
          </button>

          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tips:</strong> Ensure good lighting, keep the label flat, and avoid blurry images for best results.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview */}
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Name Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Coca Cola, Lays Chips, Dairy Milk"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the product name shown on the label
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start space-x-2">
              <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleScan}
              disabled={loading || !productName.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Analyzing...' : 'Scan & Analyze'}
            </button>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <Loader className="w-12 h-12 mx-auto text-green-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {ocrProgress > 0 && ocrProgress < 100
              ? `Processing OCR: ${ocrProgress}%`
              : ocrProgress === 100
              ? 'Analyzing ingredients...'
              : 'Initializing scan...'}
          </h3>
          <p className="text-sm text-gray-500">This may take 10-15 seconds</p>

          {ocrProgress > 0 && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanUpload;