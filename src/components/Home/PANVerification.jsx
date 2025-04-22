// import React, { useState, useRef } from 'react';
// import { Upload, Camera, FileText, AlertCircle, Loader } from 'lucide-react';
// import { motion } from 'framer-motion';
// import Tesseract from 'tesseract.js';
// import { useTranslation } from '../../context/TranslationContext';

// const PANVerification = ({ onVerification, onManualEntry, loading }) => {
//   const { translations } = useTranslation();
//   const [dragActive, setDragActive] = useState(false);
//   const [error, setError] = useState('');
//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const fileInputRef = useRef(null);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     const file = e.dataTransfer.files[0];
//     await processFile(file);
//   };

//   const handleFileInput = async (e) => {
//     const file = e.target.files[0];
//     await processFile(file);
//   };

//   const handleCameraCapture = () => {
//     fileInputRef.current.click();
//   };

//   const extractPanInfo = async (text) => {
//     const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
//     const panMatch = text.match(panRegex);
//     const pan = panMatch ? panMatch[0] : '';
    
//     let name = '';
//     const nameRegex = /Name[\s:]*([A-Z\s]+)/i;
//     const nameMatch = text.match(nameRegex);
//     if (nameMatch && nameMatch[1]) {
//       name = nameMatch[1].trim();
//     } else {
//       const nameWordsRegex = /([A-Z]{2,}\s[A-Z]{2,}(\s[A-Z]{2,})?)/;
//       const nameWordsMatch = text.match(nameWordsRegex);
//       if (nameWordsMatch) {
//         name = nameWordsMatch[0].trim();
//       }
//     }
    
//     let dateOfBirth = '';
//     const dobRegex = /(DOB|Date of Birth)[\s:]*(\d{2}[-/.]\d{2}[-/.]\d{4})/i;
//     const dobMatch = text.match(dobRegex);
//     if (dobMatch && dobMatch[2]) {
//       const parts = dobMatch[2].split(/[-/.]/);
//       if (parts.length === 3) {
//         dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;
//       }
//     }
    
//     let age = '';
//     if (dateOfBirth) {
//       const dob = new Date(dateOfBirth);
//       const today = new Date();
//       let ageValue = today.getFullYear() - dob.getFullYear();
//       if (today.getMonth() < dob.getMonth() || 
//           (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
//         ageValue--;
//       }
//       age = ageValue.toString();
//     }
    
//     return {
//       name,
//       pan,
//       dateOfBirth,
//       age
//     };
//   };

//   const processFile = async (file) => {
//     if (!file) return;
    
//     const fileType = file.type;
//     if (!fileType.includes('image')) {
//       setError(translations.panVerification.errorFileType);
//       return;
//     }

//     try {
//       setUploading(true);
//       setError('');
//       setProgress(0);
      
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreview(e.target.result);
//       };
//       reader.readAsDataURL(file);

//       const result = await Tesseract.recognize(
//         file,
//         'eng',
//         { 
//           logger: m => {
//             if (m.status === 'recognizing text') {
//               setProgress(parseInt(m.progress * 100));
//             }
//           }
//         }
//       );
      
//       console.log('OCR Result:', result);
//       const extractedText = result.data.text;
//       console.log('Extracted Text:', extractedText);
      
//       const extractedInfo = await extractPanInfo(extractedText);
//       console.log('Extracted Info:', extractedInfo);
      
//       if (!extractedInfo.pan) {
//         throw new Error('Could not extract PAN number from the image');
//       }
      
//       const base64File = await convertToBase64(file);
      
//       onVerification({
//         ...extractedInfo,
//         image: base64File,
//         filename: file.name
//       });
      
//     } catch (err) {
//       console.error('Error processing file:', err);
//       setError(translations.panVerification.errorProcessing);
//       setUploading(false);
//     }
//   };

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(',')[1]);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   return (
//     <div className="p-8">
//       <h3 className="text-2xl font-bold text-white mb-3">{translations.panVerification.title}</h3>
//       <p className="text-gray-400 mb-6">{translations.panVerification.description}</p>
      
//       {!preview ? (
//         <div
//           className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
//             ${dragActive ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/20 hover:border-emerald-400/50'}`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <input
//             type="file"
//             id="pan-upload"
//             ref={fileInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={handleFileInput}
//             capture="environment"
//           />
//           <label htmlFor="pan-upload" className="cursor-pointer block">
//             <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
//             <p className="text-white mb-2">{translations.panVerification.dragDrop}</p>
//             <p className="text-gray-400 text-sm mb-6">{translations.panVerification.supportedFormats}</p>
            
//             <div className="flex justify-center gap-4">
//               <button 
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
//               >
//                 <FileText className="w-4 h-4" />
//                 {translations.panVerification.browseFiles}
//               </button>
              
//               <button 
//                 type="button"
//                 onClick={handleCameraCapture}
//                 className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
//               >
//                 <Camera className="w-4 h-4" />
//                 {translations.panVerification.useCamera}
//               </button>
//             </div>
//           </label>
//         </div>
//       ) : (
//         <div className="relative border border-white/20 rounded-xl overflow-hidden mb-6">
//           <img 
//             src={preview} 
//             alt="PAN Card Preview" 
//             className="w-full max-h-64 object-contain bg-black"
//           />
//           <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
//             {uploading || loading ? (
//               <div className="flex flex-col items-center">
//                 <Loader className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
//                 <p className="text-white text-sm">
//                   {uploading ? `${translations.panVerification.extracting} (${progress}%)...` : translations.panVerification.processing}
//                 </p>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setPreview(null)}
//                 className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
//               >
//                 {translations.panVerification.uploadDifferent}
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4 text-red-300">
//           <AlertCircle className="w-5 h-5 flex-shrink-0" />
//           <p className="text-sm">{error}</p>
//         </div>
//       )}

//       <div className="mt-8 text-center">
//         <button
//           onClick={onManualEntry}
//           disabled={uploading || loading}
//           className="text-emerald-400 hover:text-emerald-300 transition-colors disabled:text-emerald-700 disabled:cursor-not-allowed"
//         >
//           {translations.panVerification.manualEntry}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PANVerification;


"use client"

import { useState, useRef } from "react"
import { Upload, Camera, FileText, AlertCircle, Loader } from "lucide-react"
import Tesseract from "tesseract.js"
import { useTranslation } from "../../context/TranslationContext"

const PANVerification = ({ onVerification, onManualEntry, loading }) => {
  const { translations } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    await processFile(file)
  }

  const handleFileInput = async (e) => {
    const file = e.target.files[0]
    await processFile(file)
  }

  const handleCameraCapture = async () => {
    try {
      setCameraActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError(translations.panVerification.errorCamera || "Could not access camera")
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        // Stop camera stream
        const stream = video.srcObject
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())
        }

        setCameraActive(false)

        // Process the captured image
        await processFile(blob)
      },
      "image/jpeg",
      0.95,
    )
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
    setCameraActive(false)
  }

  const extractPanInfo = async (text) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
    const panMatch = text.match(panRegex)
    const pan = panMatch ? panMatch[0] : ""

    let name = ""
    const nameRegex = /Name[\s:]*([A-Z\s]+)/i
    const nameMatch = text.match(nameRegex)
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1].trim()
    } else {
      const nameWordsRegex = /([A-Z]{2,}\s[A-Z]{2,}(\s[A-Z]{2,})?)/
      const nameWordsMatch = text.match(nameWordsRegex)
      if (nameWordsMatch) {
        name = nameWordsMatch[0].trim()
      }
    }

    let dateOfBirth = ""
    const dobRegex = /(DOB|Date of Birth)[\s:]*(\d{2}[-/.]\d{2}[-/.]\d{4})/i
    const dobMatch = text.match(dobRegex)
    if (dobMatch && dobMatch[2]) {
      const parts = dobMatch[2].split(/[-/.]/)
      if (parts.length === 3) {
        dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }

    let age = ""
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth)
      const today = new Date()
      let ageValue = today.getFullYear() - dob.getFullYear()
      if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ) {
        ageValue--
      }
      age = ageValue.toString()
    }

    return {
      name,
      pan,
      dateOfBirth,
      age,
    }
  }

  const processFile = async (file) => {
    if (!file) return

    const fileType = file.type
    if (!fileType.includes("image")) {
      setError(translations.panVerification.errorFileType)
      return
    }

    try {
      setUploading(true)
      setError("")
      setProgress(0)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Number.parseInt(m.progress * 100))
          }
        },
      })

      console.log("OCR Result:", result)
      const extractedText = result.data.text
      console.log("Extracted Text:", extractedText)

      const extractedInfo = await extractPanInfo(extractedText)
      console.log("Extracted Info:", extractedInfo)

      if (!extractedInfo.pan) {
        throw new Error("Could not extract PAN number from the image")
      }

      const base64File = await convertToBase64(file)

      onVerification({
        ...extractedInfo,
        image: base64File,
        filename: file.name,
      })
    } catch (err) {
      console.error("Error processing file:", err)
      setError(translations.panVerification.errorProcessing)
      setUploading(false)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(",")[1])
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-white mb-3">{translations.panVerification.title}</h3>
      <p className="text-gray-400 mb-6">{translations.panVerification.description}</p>

      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragActive ? "border-emerald-400 bg-emerald-400/10" : "border-white/20 hover:border-emerald-400/50"}`}
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
            <p className="text-white mb-2">{translations.panVerification.dragDrop}</p>
            <p className="text-gray-400 text-sm mb-6">{translations.panVerification.supportedFormats}</p>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <FileText className="w-4 h-4" />
                {translations.panVerification.browseFiles}
              </button>

              <button
                type="button"
                onClick={handleCameraCapture}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Camera className="w-4 h-4" />
                {translations.panVerification.useCamera}
              </button>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative border border-white/20 rounded-xl overflow-hidden mb-6">
          <img
            src={preview || "/placeholder.svg"}
            alt="PAN Card Preview"
            className="w-full max-h-64 object-contain bg-black"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40">
            {uploading || loading ? (
              <div className="flex flex-col items-center">
                <Loader className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <p className="text-white text-sm">
                  {uploading
                    ? `${translations.panVerification.extracting} (${progress}%)...`
                    : translations.panVerification.processing}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                {translations.panVerification.uploadDifferent}
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
          {translations.panVerification.manualEntry}
        </button>
      </div>
      {cameraActive && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="relative flex-1 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="max-h-full max-w-full" />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button onClick={stopCamera} className="p-4 bg-red-500 rounded-full text-white">
                <AlertCircle className="w-6 h-6" />
              </button>

              <button onClick={captureImage} className="p-4 bg-emerald-500 rounded-full text-white">
                <Camera className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PANVerification
