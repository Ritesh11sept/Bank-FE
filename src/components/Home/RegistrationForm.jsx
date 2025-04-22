// import React, { useState, useEffect } from 'react';
// import { Calendar, Mail, User, Phone, CreditCard } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useTranslation } from '../../context/TranslationContext';

// const RegistrationForm = ({ initialData, onSubmit }) => {
//   const { translations } = useTranslation();
//   const [formData, setFormData] = useState({
//     name: initialData.name || '',
//     email: initialData.email || '',
//     phone: initialData.phone || '',
//     pan: initialData.pan || '',
//     dateOfBirth: initialData.dateOfBirth || '',
//     age: initialData.age || '',
//   });
//   const [errors, setErrors] = useState({});

//   // Calculate age whenever date of birth changes
//   useEffect(() => {
//     if (formData.dateOfBirth) {
//       const dob = new Date(formData.dateOfBirth);
//       const today = new Date();
//       let age = today.getFullYear() - dob.getFullYear();
//       if (today.getMonth() < dob.getMonth() || 
//           (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
//         age--;
//       }
//       setFormData(prev => ({ ...prev, age: age.toString() }));
//     }
//   }, [formData.dateOfBirth]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear error when field is edited
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validate form
//     const newErrors = {};
//     if (!formData.name) newErrors.name = translations.registrationForm.nameRequired;
//     if (!formData.email) newErrors.email = translations.registrationForm.emailRequired;
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = translations.registrationForm.emailInvalid;
//     if (!formData.phone) newErrors.phone = translations.registrationForm.phoneRequired;
//     else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = translations.registrationForm.phoneInvalid;
//     if (!formData.pan) newErrors.pan = translations.registrationForm.panRequired;
//     else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = translations.registrationForm.panInvalid;
//     if (!formData.dateOfBirth) newErrors.dateOfBirth = translations.registrationForm.dobRequired;
//     if (!formData.age) newErrors.age = translations.registrationForm.ageRequired;
//     else if (parseInt(formData.age, 10) < 18) newErrors.age = translations.registrationForm.ageMinimum;
    
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
    
//     onSubmit(formData);
//   };

//   return (
//     <motion.div 
//       className="p-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//     >
//       <h3 className="text-2xl font-bold text-white mb-2">{translations.registrationForm.title}</h3>
//       <p className="text-gray-400 mb-6">{translations.registrationForm.description}</p>
      
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div>
//             <label className="flex items-center text-white mb-1.5 text-sm">
//               <User className="w-4 h-4 mr-2" />
//               {translations.registrationForm.fullName}
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`w-full p-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
//               placeholder={translations.registrationForm.namePlaceholder}
//             />
//             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//           </div>
          
//           <div>
//             <label className="flex items-center text-white mb-1.5 text-sm">
//               <Mail className="w-4 h-4 mr-2" />
//               {translations.registrationForm.email}
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full p-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
//               placeholder={translations.registrationForm.emailPlaceholder}
//             />
//             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div>
//             <label className="flex items-center text-white mb-1.5 text-sm">
//               <Phone className="w-4 h-4 mr-2" />
//               {translations.registrationForm.phone}
//             </label>
//             <div className="flex">
//               <span className="bg-white/10 border border-white/20 border-r-0 rounded-l-lg p-3 text-white/60">+91</span>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={`w-full p-3 bg-white/10 border ${errors.phone ? 'border-red-500' : 'border-white/20'} rounded-r-lg text-white focus:outline-none focus:border-emerald-400`}
//                 placeholder={translations.registrationForm.phonePlaceholder}
//                 maxLength={10}
//               />
//             </div>
//             {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//           </div>
          
//           <div>
//             <label className="flex items-center text-white mb-1.5 text-sm">
//               <CreditCard className="w-4 h-4 mr-2" />
//               {translations.registrationForm.pan}
//             </label>
//             <input
//               type="text"
//               name="pan"
//               value={formData.pan}
//               onChange={handleChange}
//               className={`w-full p-3 bg-white/10 border ${errors.pan ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
//               placeholder={translations.registrationForm.panPlaceholder}
//               maxLength={10}
//               style={{ textTransform: 'uppercase' }}
//             />
//             {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div>
//             <label className="flex items-center text-white mb-1.5 text-sm">
//               <Calendar className="w-4 h-4 mr-2" />
//               {translations.registrationForm.dob}
//             </label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={formData.dateOfBirth}
//               onChange={handleChange}
//               max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} // Set max date to 18 years ago
//               className={`w-full p-3 bg-white/10 border ${errors.dateOfBirth ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
//             />
//             {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
//           </div>
          
//           <div>
//             <label className="flex items-center text-white mb-1.5 text-sm">
//               <User className="w-4 h-4 mr-2" />
//               {translations.registrationForm.age}
//             </label>
//             <input
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               className={`w-full p-3 bg-white/10 border ${errors.age ? 'border-red-500' : 'border-white/20'} rounded-lg text-white focus:outline-none focus:border-emerald-400`}
//               placeholder={translations.registrationForm.agePlaceholder}
//               min="18"
//               max="120"
//               readOnly // Make this readonly since it's calculated from DOB
//             />
//             {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
//           </div>
//         </div>
        
//         <motion.button
//           type="submit"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="w-full py-3.5 mt-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
//         >
//           {translations.registrationForm.continueButton}
//         </motion.button>
//       </form>
//     </motion.div>
//   );
// };

// export default RegistrationForm;


"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar, Mail, User, Phone, CreditCard, Camera, X, AlertCircle, Loader } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "../../context/TranslationContext"
import Tesseract from "tesseract.js"

const RegistrationForm = ({ initialData, onSubmit }) => {
  const { translations } = useTranslation()
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    pan: initialData.pan || "",
    dateOfBirth: initialData.dateOfBirth || "",
    age: initialData.age || "",
  })
  const [errors, setErrors] = useState({})
  const [cameraActive, setCameraActive] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState("")
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Calculate age whenever date of birth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ) {
        age--
      }
      setFormData((prev) => ({ ...prev, age: age.toString() }))
    }
  }, [formData.dateOfBirth])

  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const newErrors = {}
    if (!formData.name) newErrors.name = translations.registrationForm.nameRequired
    if (!formData.email) newErrors.email = translations.registrationForm.emailRequired
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = translations.registrationForm.emailInvalid
    if (!formData.phone) newErrors.phone = translations.registrationForm.phoneRequired
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = translations.registrationForm.phoneInvalid
    if (!formData.pan) newErrors.pan = translations.registrationForm.panRequired
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = translations.registrationForm.panInvalid
    if (!formData.dateOfBirth) newErrors.dateOfBirth = translations.registrationForm.dobRequired
    if (!formData.age) newErrors.age = translations.registrationForm.ageRequired
    else if (Number.parseInt(formData.age, 10) < 18) newErrors.age = translations.registrationForm.ageMinimum

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const openCamera = async () => {
    try {
      setScanError("")
      setCameraActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setScanError("Could not access camera")
      setCameraActive(false)
    }
  }

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
    setCameraActive(false)
    setScanning(false)
  }

  // Improve the captureImage function to better detect PAN numbers
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    try {
      setScanning(true)
      setScanError("")

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
          try {
            // Process the captured image with Tesseract OCR
            // Use SCRIPT_LATIN for better alphanumeric recognition
            const result = await Tesseract.recognize(blob, "eng", {
              logger: (m) => {
                console.log(m)
              },
              tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            })

            console.log("OCR Result:", result)
            const extractedText = result.data.text.replace(/\s/g, "")
            console.log("Cleaned Text:", extractedText)

            // Extract PAN number using multiple approaches
            // Standard PAN format: 5 uppercase letters + 4 digits + 1 uppercase letter
            const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g
            let panMatches = extractedText.match(panRegex)

            if (!panMatches) {
              // Try a more lenient approach - look for any 10 character alphanumeric sequence
              // that roughly matches PAN pattern (letters followed by numbers followed by letter)
              const lenientRegex = /[A-Z]{4,6}[0-9]{3,5}[A-Z]{1}/g
              panMatches = extractedText.match(lenientRegex)
            }

            if (panMatches && panMatches.length > 0) {
              const panNumber = panMatches[0]
              console.log("Found PAN:", panNumber)
              setFormData((prev) => ({ ...prev, pan: panNumber }))
              closeCamera()
            } else {
              // Try one more approach - search for 10 character sequences
              const possiblePans = []
              for (let i = 0; i <= extractedText.length - 10; i++) {
                const segment = extractedText.substring(i, i + 10)
                if (/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(segment)) {
                  possiblePans.push(segment)
                }
              }

              if (possiblePans.length > 0) {
                const panNumber = possiblePans[0]
                console.log("Found PAN from segments:", panNumber)
                setFormData((prev) => ({ ...prev, pan: panNumber }))
                closeCamera()
              } else {
                setScanError(
                  "Could not detect PAN number. Please ensure the PAN card is clearly visible and try again.",
                )
                setScanning(false)
              }
            }
          } catch (err) {
            console.error("Error processing image:", err)
            setScanError("Error processing image. Please try again.")
            setScanning(false)
          }
        },
        "image/jpeg",
        0.95,
      )
    } catch (err) {
      console.error("Error capturing image:", err)
      setScanError("Error capturing image. Please try again.")
      setScanning(false)
    }
  }

  // Add a preprocessing step to improve image quality before OCR
  const preprocessImage = (canvas) => {
    const ctx = canvas.getContext("2d")
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Increase contrast
    const contrast = 1.5 // Adjust as needed
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast
      data[i] = factor * (data[i] - 128) + 128 // red
      data[i + 1] = factor * (data[i + 1] - 128) + 128 // green
      data[i + 2] = factor * (data[i + 2] - 128) + 128 // blue

      // Convert to grayscale for better OCR
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }

    ctx.putImageData(imageData, 0, 0)
    return canvas
  }

  // Update the camera interface to add guidance for better scanning
  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-2xl font-bold text-white mb-2">{translations.registrationForm.title}</h3>
      <p className="text-gray-400 mb-6">{translations.registrationForm.description}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <User className="w-4 h-4 mr-2" />
              {translations.registrationForm.fullName}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${
                errors.name ? "border-red-500" : "border-white/20"
              } rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.namePlaceholder}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <Mail className="w-4 h-4 mr-2" />
              {translations.registrationForm.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${
                errors.email ? "border-red-500" : "border-white/20"
              } rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.emailPlaceholder}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              {translations.registrationForm.phone}
            </label>
            <div className="flex">
              <span className="bg-white/10 border border-white/20 border-r-0 rounded-l-lg p-3 text-white/60">+91</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 bg-white/10 border ${
                  errors.phone ? "border-red-500" : "border-white/20"
                } rounded-r-lg text-white focus:outline-none focus:border-emerald-400`}
                placeholder={translations.registrationForm.phonePlaceholder}
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <CreditCard className="w-4 h-4 mr-2" />
              {translations.registrationForm.pan}
            </label>
            <div className="relative">
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                className={`w-full p-3 bg-white/10 border ${
                  errors.pan ? "border-red-500" : "border-white/20"
                } rounded-lg text-white focus:outline-none focus:border-emerald-400 pr-10`}
                placeholder={translations.registrationForm.panPlaceholder}
                maxLength={10}
                style={{ textTransform: "uppercase" }}
              />
              <button
                type="button"
                onClick={openCamera}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-emerald-400 transition-colors"
                aria-label="Scan PAN with camera"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {translations.registrationForm.dob}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]} // Set max date to 18 years ago
              className={`w-full p-3 bg-white/10 border ${
                errors.dateOfBirth ? "border-red-500" : "border-white/20"
              } rounded-lg text-white focus:outline-none focus:border-emerald-400`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="flex items-center text-white mb-1.5 text-sm">
              <User className="w-4 h-4 mr-2" />
              {translations.registrationForm.age}
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full p-3 bg-white/10 border ${
                errors.age ? "border-red-500" : "border-white/20"
              } rounded-lg text-white focus:outline-none focus:border-emerald-400`}
              placeholder={translations.registrationForm.agePlaceholder}
              min="18"
              max="120"
              readOnly // Make this readonly since it's calculated from DOB
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 mt-6 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {translations.registrationForm.continueButton}
        </motion.button>
      </form>

      {cameraActive && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="relative flex-1 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="max-h-full max-w-full" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Add scanning guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-dashed border-emerald-400 w-4/5 aspect-[1.6/1] rounded-md flex items-center justify-center">
                <p className="text-emerald-400 text-sm bg-black/50 px-3 py-1 rounded">Position PAN card here</p>
              </div>
            </div>

            {scanError && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/80 text-white p-3 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{scanError}</p>
              </div>
            )}

            <div className="absolute top-4 right-4">
              <button
                onClick={closeCamera}
                className="p-2 bg-white/20 rounded-full text-white"
                aria-label="Close camera"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button
                onClick={captureImage}
                className="p-6 bg-emerald-500 rounded-full text-white shadow-lg"
                disabled={scanning}
                aria-label="Capture image"
              >
                {scanning ? <Loader className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
              </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/70 text-xs px-4">Make sure the PAN number is clearly visible</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default RegistrationForm
