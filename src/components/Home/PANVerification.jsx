import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import Tesseract from 'tesseract.js';

const PANVerification = ({ onVerification, onManualEntry, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    await processFile(file);
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    await processFile(file);
  };

  const handleCameraCapture = () => {
    fileInputRef.current.click();
  };

  const extractPanInfo = async (text) => {
    // Extract PAN number - format is 10 characters, 5 letters, followed by 4 numbers, followed by 1 letter
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const panMatch = text.match(panRegex);
    const pan = panMatch ? panMatch[0] : '';
    
    // Extract name - look for "Name" or just extract any capitalized words
    let name = '';
    const nameRegex = /Name[\s:]*([A-Z\s]+)/i;
    const nameMatch = text.match(nameRegex);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim();
    } else {
      // Try to find multiple capital words together
      const nameWordsRegex = /([A-Z]{2,}\s[A-Z]{2,}(\s[A-Z]{2,})?)/;
      const nameWordsMatch = text.match(nameWordsRegex);
      if (nameWordsMatch) {
        name = nameWordsMatch[0].trim();
      }
    }
    
    // Extract DOB - common format is DD/MM/YYYY or DD-MM-YYYY
    let dateOfBirth = '';
    const dobRegex = /(DOB|Date of Birth)[\s:]*(\d{2}[-/.]\d{2}[-/.]\d{4})/i;
    const dobMatch = text.match(dobRegex);
    if (dobMatch && dobMatch[2]) {
      // Convert to YYYY-MM-DD for HTML input
      const parts = dobMatch[2].split(/[-/.]/);
      if (parts.length === 3) {
        dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    // Calculate age if DOB is available
    let age = '';
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let ageValue = today.getFullYear() - dob.getFullYear();
      if (today.getMonth() < dob.getMonth() || 
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        ageValue--;
      }
      age = ageValue.toString();
    }
    
    return {
      name,
      pan,
      dateOfBirth,
      age
    };
  };

  const processFile = async (file) => {
    if (!file) return;
    
    const fileType = file.type;
    if (!fileType.includes('image')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setProgress(0);
      
      // Create a preview of the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Use Tesseract.js for local OCR processing
      const result = await Tesseract.recognize(
        file,
        'eng',
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          }
        }
      );
      
      console.log('OCR Result:', result);
      const extractedText = result.data.text;
      console.log('Extracted Text:', extractedText);
      
      // Process the extracted text to find relevant information
      const extractedInfo = await extractPanInfo(extractedText);
      console.log('Extracted Info:', extractedInfo);
      
      if (!extractedInfo.pan) {
        throw new Error('Could not extract PAN number from the image');
      }
      
      // Convert the file to base64 for sending to backend
      const base64File = await convertToBase64(file);
      
      // Pass the extracted info and image data to the parent component
      onVerification({
        ...extractedInfo,
        image: base64File,
        filename: file.name
      });
      
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process image. Please try again or enter details manually.');
      setUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-white mb-3">Verify PAN Card</h3>
      <p className="text-gray-400 mb-6">Upload your PAN card for faster registration or continue with manual entry</p>
      
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragActive ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/20 hover:border-emerald-400/50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="pan-upload"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
            capture="environment"
          />
          <label htmlFor="pan-upload" className="cursor-pointer block">
            <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-white mb-2">Drag and drop your PAN card or click to upload</p>
            <p className="text-gray-400 text-sm mb-6">Supported formats: JPG, PNG</p>
            
            <div className="flex justify-center gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Browse Files
              </button>
              
              <button 
                type="button"
                onClick={handleCameraCapture}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Use Camera
              </button>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative border border-white/20 rounded-xl overflow-hidden mb-6">
          <img 
            src={preview} 
            alt="PAN Card Preview" 
            className="w-full max-h-64 object-contain bg-black"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
            {uploading || loading ? (
              <div className="flex flex-col items-center">
                <Loader className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <p className="text-white text-sm">
                  {uploading ? `Extracting details (${progress}%)...` : 'Processing...'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                Upload a different image
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4 text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={onManualEntry}
          disabled={uploading || loading}
          className="text-emerald-400 hover:text-emerald-300 transition-colors disabled:text-emerald-700 disabled:cursor-not-allowed"
        >
          Continue with manual entry instead
        </button>
      </div>
    </div>
  );
};

export default PANVerification;
