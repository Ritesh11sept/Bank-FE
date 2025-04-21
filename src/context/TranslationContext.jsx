import React, { createContext, useState, useContext, useEffect } from 'react';

// English translations
const englishTranslations = {
  header: {
    about: "About",
    features: "Features",
    pricing: "Pricing",
    news: "News",
    login: "Sign in",
    signup: "Get Started",
    english: "English",
    hindi: "Hindi",
    logoText: "FinanceSeer",
    tagline: "Smart Financial Insights"
  },
  hero: {
    newBadge: "NEW",
    upiEnabled: "UPI payments enabled 🚀",
    title: "Your Financial Journey Made Smarter",
    description: "Connect all your bank accounts with a single PAN, get intelligent insights, and make informed financial decisions with FinanceSeer.",
    startBanking: "Start Banking",
    loginToAccount: "Login to Account"
  },
  features: {
    title: "Features",
    heading: "Banking Reimagined for the Digital India",
    description: "Experience next-generation banking with cutting-edge technology, complete transparency, and personalized service designed for your financial success"
  },
  featureList: {
    panIntegration: {
      title: "PAN Integration",
      description: "Connect all your bank accounts instantly with just your PAN details"
    },
    smartAnalytics: {
      title: "Smart Analytics",
      description: "Comprehensive analysis of your spending patterns and financial health"
    },
    financialGoals: {
      title: "Financial Goals",
      description: "Create custom saving pots for your goals with automated tracking"
    },
    marketInsights: {
      title: "Market Insights",
      description: "Get personalized financial advice and stock market recommendations"
    },
    rewardsSystem: {
      title: "Rewards System",
      description: "Earn rewards for smart financial decisions and app usage"
    },
    realTimeMonitoring: {
      title: "Real-time Monitoring",
      description: "Track all your transactions and account balances in real-time"
    }
  },
  chatbot: {
    label: "Chat with Aleeza"
  },
  languageSelector: {
    title: "Choose Your Language",
    description: "Please select your preferred language to continue",
    english: "English",
    hindi: "Hindi",
    confirm: "Confirm"
  },
  about: {
    title: "About FinanceSeer",
    description: "FinanceSeer is a revolutionary financial management platform that simplifies how you track and manage your finances across multiple bank accounts. By simply connecting your PAN card, you get instant access to all your linked bank accounts in one place.",
    mission: {
      title: "Our Mission",
      description: "To empower users with intelligent financial insights and tools that help them make better financial decisions and achieve their financial goals."
    },
    features: {
      title: "Key Features",
      integration: {
        title: "Single PAN Integration",
        description: "Connect multiple bank accounts with one PAN"
      },
      analytics: {
        title: "Advanced Analytics",
        description: "Spending pattern analysis and insights"
      },
      savings: {
        title: "Custom Saving Pots",
        description: "Goal-based savings management"
      },
      rewards: {
        title: "Rewards Program",
        description: "Earn rewards for smart financial decisions"
      }
    },
    security: {
      title: "Security",
      description: "FinanceSeer prioritizes your financial security with bank-grade encryption and secure authentication protocols. We never store sensitive banking credentials and comply with all relevant financial regulations."
    },
    close: "Got it"
  },
  login: {
    welcomeBack: "Welcome Back",
    adminAccess: "Admin Access",
    userDescription: "Login to access your secure banking dashboard",
    adminDescription: "Login to access administrative controls",
    customer: "Customer",
    admin: "Admin",
    enterPAN: "Enter PAN Number",
    enterEmployeeID: "Enter Employee ID",
    enterPassword: "Enter Password",
    signIn: "Sign In",
    loggedIn: "Logged In",
    loginSuccessful: "Login Successful!",
    redirectingToDashboard: "Redirecting to dashboard...",
    redirectingToAdmin: "Redirecting to admin...",
    loginFailed: "Login failed. Please check your credentials.",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up"
  },
  otp: {
    title: "Enter OTP",
    sentMessage: "We've sent a verification code to",
    completeOtpError: "Please enter the complete OTP",
    verifyButton: "Verify OTP",
    verifying: "Verifying...",
    didntReceive: "Didn't receive the code?",
    resendIn: "Resend in",
    seconds: "s",
    resendOtp: "Resend OTP",
    demoMessage: "Use",
    demoCode: "000000",
    forDemo: "for demo",
    resendSuccess: "OTP resent successfully! Use 000000 for demo."
  },
  panVerification: {
    title: "Verify PAN Card",
    description: "Upload your PAN card for faster registration or continue with manual entry",
    dragDrop: "Drag and drop your PAN card or click to upload",
    supportedFormats: "Supported formats: JPG, PNG",
    browseFiles: "Browse Files",
    useCamera: "Use Camera",
    uploadDifferent: "Upload a different image",
    extracting: "Extracting details",
    processing: "Processing...",
    errorFileType: "Please upload an image file",
    errorProcessing: "Failed to process image. Please try again or enter details manually.",
    manualEntry: "Continue with manual entry instead"
  },
  passwordSetup: {
    title: "Create Password",
    description: "Choose a strong password for your account",
    password: "Password",
    confirmPassword: "Confirm Password",
    enterPassword: "Enter your password",
    confirmYourPassword: "Confirm your password",
    passwordStrength: "Password Strength:",
    passwordRequired: "Password is required",
    passwordLength: "Password must be at least 6 characters",
    weakPassword: "Please choose a stronger password",
    confirmRequired: "Please confirm your password",
    passwordsNoMatch: "Passwords do not match",
    requirements: "Password requirements:",
    continueButton: "Continue to Verification",
    strengthLabels: {
      tooWeak: "Too Weak",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      veryStrong: "Very Strong"
    },
    criteria: {
      length: "At least 8 characters",
      lowercase: "Contains lowercase letter",
      uppercase: "Contains uppercase letter",
      number: "Contains number",
      special: "Contains special character"
    }
  },
  pricing: {
    sectionTitle: "Pricing Plan",
    heading: "Select a plan that will empower your business growth",
    subheading: "Each package includes GST compliance tools and personalized support to ensure your success",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "/per month",
    selectPlan: "Select This Plan",
    plans: {
      basic: {
        title: "Basic Insights",
        description: "Perfect for individual users starting their financial journey",
        features: [
          "PAN-based Account Integration",
          "Basic Spending Analytics",
          "Transaction Monitoring",
          "2 Saving Pots",
          "Basic Market Updates"
        ]
      },
      smart: {
        title: "Smart Saver",
        description: "Ideal for users seeking advanced financial insights",
        features: [
          "Everything in Basic Plan",
          "Advanced Analytics Dashboard",
          "Personalized Financial Advice",
          "Unlimited Saving Pots",
          "Premium Rewards Program"
        ]
      },
      wealth: {
        title: "Wealth Manager",
        description: "Complete financial management suite with premium features",
        features: [
          "Everything in Smart Saver",
          "AI-Powered Investment Tips",
          "Priority Customer Support",
          "Custom Financial Reports",
          "Advanced Market Insights"
        ]
      }
    }
  },
  registration: {
    title: "Create Your Account",
    back: "Back",
    steps: ["1", "2", "3", "4"],
    ageRestriction: "You must be at least 18 years old to register",
    weakPasswordError: "Please choose a stronger password that meets all the requirements",
    registrationFailed: "Registration failed. Please try again.",
    successTitle: "Registration Successful!",
    successMessage: "Your account has been created successfully with an initial balance of",
    amount: "₹1,50,000",
    loginPrompt: "You can now login with your credentials."
  },
  registrationForm: {
    title: "Personal Information",
    description: "Fill in your details to create your account",
    fullName: "Full Name",
    namePlaceholder: "Enter your full name",
    nameRequired: "Name is required",
    email: "Email Address",
    emailPlaceholder: "Enter your email",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email format",
    phone: "Phone Number",
    phonePlaceholder: "10-digit phone number",
    phoneRequired: "Phone number is required",
    phoneInvalid: "Phone must be 10 digits",
    pan: "PAN Number",
    panPlaceholder: "e.g., ABCDE1234F",
    panRequired: "PAN is required",
    panInvalid: "Invalid PAN format",
    dob: "Date of Birth",
    dobRequired: "Date of birth is required",
    age: "Age",
    agePlaceholder: "Your age",
    ageRequired: "Age is required",
    ageMinimum: "You must be at least 18 years old",
    continueButton: "Continue to Set Password"
  },
  stockNews: {
    loadingMarketData: "Loading market data...",
    loadingSectorData: "Loading sector data...",
    generateNewUpdate: "Generate new update",
    bullish: "Bullish",
    bearish: "Bearish",
    neutral: "Neutral",
    liveUpdate: "Live Update",
    realTimeMarketUpdates: "Real-time Market Updates",
    latestStockMarketNews: "Latest Stock Market News",
    refreshAllNews: "Refresh all news"
  },
  footer: {
    usersCount: "Over 100K+ Entrepreneurs and business choose us",
    heroTitle: "Empowering Your Financial Freedom",
    heroDescription: "Trust us to deliver cutting-edge innovation, transparency, and personalized service, all designed to help you achieve financial freedom",
    getStarted: "Get Started now",
    companyDescription: "Empowering users with smart financial insights and intelligent money management solutions for a secure financial future.",
    downloadApp: "Download our App",
    getItOn: "GET IT ON",
    downloadOn: "DOWNLOAD ON",
    allRightsReserved: "All rights reserved.",
    features: {
      title: "Features",
      panIntegration: "PAN Integration",
      analytics: "Analytics Dashboard",
      savingPots: "Saving Pots",
      marketInsights: "Market Insights",
      rewards: "Rewards Program"
    },
    resources: {
      title: "Resources",
      financialTips: "Financial Tips",
      marketUpdates: "Market Updates",
      userGuides: "User Guides",
      faqs: "FAQs"
    },
    company: {
      title: "Company",
      about: "About Us",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookies Policy"
    },
    newsletter: {
      title: "Newsletter",
      description: "Subscribe to our newsletter to get updates on our latest services and offers.",
      placeholder: "Enter your email"
    }
  }
};

// Hindi translations
const hindiTranslations = {
  header: {
    about: "हमारे बारे में",
    features: "विशेषताएँ",
    pricing: "मूल्य निर्धारण",
    news: "समाचार",
    login: "साइन इन करें",
    signup: "शुरू करें",
    english: "अंग्रेजी",
    hindi: "हिंदी",
    logoText: "फाइनेंसियर",
    tagline: "स्मार्ट वित्तीय अंतर्दृष्टि"
  },
  hero: {
    newBadge: "नया",
    upiEnabled: "UPI भुगतान सक्षम 🚀",
    title: "आपकी वित्तीय यात्रा अधिक स्मार्ट बनाई गई",
    description: "एकल पैन के साथ अपने सभी बैंक खातों को जोड़ें, बुद्धिमान अंतर्दृष्टि प्राप्त करें, और फाइनेंसियर के साथ सूचित वित्तीय निर्णय लें।",
    startBanking: "बैंकिंग शुरू करें",
    loginToAccount: "खाते में लॉगिन करें"
  },
  features: {
    title: "विशेषताएँ",
    heading: "डिजिटल भारत के लिए पुनर्कल्पित बैंकिंग",
    description: "आधुनिक तकनीक, पूर्ण पारदर्शिता और आपकी वित्तीय सफलता के लिए डिज़ाइन की गई व्यक्तिगत सेवा के साथ अगली पीढ़ी की बैंकिंग का अनुभव करें"
  },
  featureList: {
    panIntegration: {
      title: "पैन एकीकरण",
      description: "केवल अपने पैन विवरण से सभी बैंक खातों को तुरंत जोड़ें"
    },
    smartAnalytics: {
      title: "स्मार्ट एनालिटिक्स",
      description: "आपके खर्च पैटर्न और वित्तीय स्वास्थ्य का व्यापक विश्लेषण"
    },
    financialGoals: {
      title: "वित्तीय लक्ष्य",
      description: "स्वचालित ट्रैकिंग के साथ अपने लक्ष्यों के लिए कस्टम बचत पॉट बनाएं"
    },
    marketInsights: {
      title: "बाज़ार अंतर्दृष्टि",
      description: "व्यक्तिगत वित्तीय सलाह और स्टॉक मार्केट अनुशंसाएँ प्राप्त करें"
    },
    rewardsSystem: {
      title: "रिवॉर्ड सिस्टम",
      description: "स्मार्ट वित्तीय निर्णयों और ऐप उपयोग के लिए पुरस्कार अर्जित करें"
    },
    realTimeMonitoring: {
      title: "रीयल-टाइम निगरानी",
      description: "अपने सभी लेनदेन और खाता शेष की वास्तविक समय में निगरानी करें"
    }
  },
  chatbot: {
    label: "अलीजा से चैट करें"
  },
  languageSelector: {
    title: "अपनी भाषा चुनें",
    description: "जारी रखने के लिए कृपया अपनी पसंदीदा भाषा चुनें",
    english: "अंग्रेजी",
    hindi: "हिंदी",
    confirm: "पुष्टि करें"
  },
  about: {
    title: "फाइनेंससीर के बारे में",
    description: "फाइनेंससीर एक क्रांतिकारी वित्तीय प्रबंधन प्लेटफॉर्म है जो कई बैंक खातों में आपके वित्त को ट्रैक और प्रबंधित करने के तरीके को सरल बनाता है। बस अपने पैन कार्ड को कनेक्ट करके, आपको एक ही स्थान पर अपने सभी लिंक किए गए बैंक खातों तक तुरंत पहुंच मिल जाती है।",
    mission: {
      title: "हमारा मिशन",
      description: "उपयोगकर्ताओं को बुद्धिमान वित्तीय अंतर्दृष्टि और उपकरणों से सशक्त बनाना जो उन्हें बेहतर वित्तीय निर्णय लेने और अपने वित्तीय लक्ष्यों को प्राप्त करने में मदद करते हैं।"
    },
    features: {
      title: "मुख्य विशेषताएँ",
      integration: {
        title: "एकल पैन एकीकरण",
        description: "एक पैन के साथ कई बैंक खातों को जोड़ें"
      },
      analytics: {
        title: "उन्नत विश्लेषिकी",
        description: "खर्च पैटर्न विश्लेषण और अंतर्दृष्टि"
      },
      savings: {
        title: "कस्टम सेविंग पॉट",
        description: "लक्ष्य-आधारित बचत प्रबंधन"
      },
      rewards: {
        title: "रिवॉर्ड प्रोग्राम",
        description: "स्मार्ट वित्तीय निर्णयों के लिए पुरस्कार अर्जित करें"
      }
    },
    security: {
      title: "सुरक्षा",
      description: "फाइनेंससीर बैंक-ग्रेड एन्क्रिप्शन और सुरक्षित प्रमाणीकरण प्रोटोकॉल के साथ आपकी वित्तीय सुरक्षा को प्राथमिकता देता है। हम संवेदनशील बैंकिंग क्रेडेंशियल्स को स्टोर नहीं करते हैं और सभी प्रासंगिक वित्तीय नियमों का पालन करते हैं।"
    },
    close: "समझ गया"
  },
  login: {
    welcomeBack: "वापसी पर स्वागत है",
    adminAccess: "प्रशासक पहुंच",
    userDescription: "अपने सुरक्षित बैंकिंग डैशबोर्ड तक पहुंचने के लिए लॉगिन करें",
    adminDescription: "प्रशासनिक नियंत्रण तक पहुंचने के लिए लॉगिन करें",
    customer: "ग्राहक",
    admin: "प्रशासक",
    enterPAN: "पैन नंबर दर्ज करें",
    enterEmployeeID: "कर्मचारी आईडी दर्ज करें",
    enterPassword: "पासवर्ड दर्ज करें",
    signIn: "साइन इन करें",
    loggedIn: "लॉग इन किया",
    loginSuccessful: "लॉगिन सफल!",
    redirectingToDashboard: "डैशबोर्ड पर रीडायरेक्ट कर रहे हैं...",
    redirectingToAdmin: "प्रशासक पर रीडायरेक्ट कर रहे हैं...",
    loginFailed: "लॉगिन विफल। कृपया अपने क्रेडेंशियल्स की जांच करें।",
    dontHaveAccount: "खाता नहीं है?",
    signUp: "साइन अप करें"
  },
  otp: {
    title: "OTP दर्ज करें",
    sentMessage: "हमने एक सत्यापन कोड भेजा है",
    completeOtpError: "कृपया पूरा OTP दर्ज करें",
    verifyButton: "OTP सत्यापित करें",
    verifying: "सत्यापित हो रहा है...",
    didntReceive: "कोड नहीं मिला?",
    resendIn: "पुनः भेजें",
    seconds: "सेकंड में",
    resendOtp: "OTP पुनः भेजें",
    demoMessage: "डेमो के लिए",
    demoCode: "000000",
    forDemo: "का उपयोग करें",
    resendSuccess: "OTP सफलतापूर्वक पुनः भेजा गया! डेमो के लिए 000000 का उपयोग करें।"
  },
  panVerification: {
    title: "पैन कार्ड सत्यापित करें",
    description: "तेज़ पंजीकरण के लिए अपना पैन कार्ड अपलोड करें या मैनुअल प्रविष्टि के साथ जारी रखें",
    dragDrop: "अपना पैन कार्ड खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें",
    supportedFormats: "समर्थित प्रारूप: JPG, PNG",
    browseFiles: "फ़ाइलें ब्राउज़ करें",
    useCamera: "कैमरा का उपयोग करें",
    uploadDifferent: "अलग छवि अपलोड करें",
    extracting: "विवरण निकाला जा रहा है",
    processing: "प्रसंस्करण हो रहा है...",
    errorFileType: "कृपया एक छवि फ़ाइल अपलोड करें",
    errorProcessing: "छवि प्रसंस्करण में विफल। कृपया पुनः प्रयास करें या मैन्युअल रूप से विवरण दर्ज करें।",
    manualEntry: "इसके बजाय मैनुअल प्रविष्टि के साथ जारी रखें"
  },
  passwordSetup: {
    title: "पासवर्ड बनाएं",
    description: "अपने खाते के लिए एक मजबूत पासवर्ड चुनें",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    confirmYourPassword: "अपने पासवर्ड की पुष्टि करें",
    passwordStrength: "पासवर्ड की ताकत:",
    passwordRequired: "पासवर्ड आवश्यक है",
    passwordLength: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
    weakPassword: "कृपया एक मजबूत पासवर्ड चुनें",
    confirmRequired: "कृपया अपने पासवर्ड की पुष्टि करें",
    passwordsNoMatch: "पासवर्ड मेल नहीं खाते",
    requirements: "पासवर्ड आवश्यकताएँ:",
    continueButton: "सत्यापन के लिए जारी रखें",
    strengthLabels: {
      tooWeak: "बहुत कमज़ोर",
      weak: "कमज़ोर",
      medium: "मध्यम",
      strong: "मज़बूत",
      veryStrong: "बहुत मज़बूत"
    },
    criteria: {
      length: "कम से कम 8 अक्षर",
      lowercase: "लोअरकेस अक्षर शामिल है",
      uppercase: "अपरकेस अक्षर शामिल है",
      number: "संख्या शामिल है",
      special: "विशेष वर्ण शामिल है"
    }
  },
  pricing: {
    sectionTitle: "मूल्य निर्धारण योजना",
    heading: "एक ऐसी योजना चुनें जो आपके व्यापार की वृद्धि को सशक्त बनाएगी",
    subheading: "प्रत्येक पैकेज में आपकी सफलता सुनिश्चित करने के लिए GST अनुपालन उपकरण और व्यक्तिगत सहायता शामिल है",
    monthly: "मासिक",
    yearly: "वार्षिक",
    perMonth: "/प्रति माह",
    selectPlan: "इस योजना का चयन करें",
    plans: {
      basic: {
        title: "बेसिक इनसाइट्स",
        description: "वित्तीय यात्रा शुरू करने वाले व्यक्तिगत उपयोगकर्ताओं के लिए बिल्कुल सही",
        features: [
          "पैन-आधारित खाता एकीकरण",
          "बुनियादी खर्च विश्लेषिकी",
          "लेनदेन निगरानी",
          "2 बचत पॉट",
          "बुनियादी बाजार अपडेट"
        ]
      },
      smart: {
        title: "स्मार्ट सेवर",
        description: "उन्नत वित्तीय अंतर्दृष्टि चाहने वाले उपयोगकर्ताओं के लिए आदर्श",
        features: [
          "बेसिक प्लान में सब कुछ",
          "उन्नत विश्लेषिकी डैशबोर्ड",
          "व्यक्तिगत वित्तीय सलाह",
          "असीमित बचत पॉट",
          "प्रीमियम रिवॉर्ड्स प्रोग्राम"
        ]
      },
      wealth: {
        title: "वेल्थ मैनेजर",
        description: "प्रीमियम सुविधाओं के साथ पूर्ण वित्तीय प्रबंधन सूट",
        features: [
          "स्मार्ट सेवर में सब कुछ",
          "AI-संचालित निवेश टिप्स",
          "प्राथमिकता ग्राहक सहायता",
          "कस्टम वित्तीय रिपोर्ट",
          "उन्नत बाजार अंतर्दृष्टि"
        ]
      }
    }
  },
  registration: {
    title: "अपना खाता बनाएं",
    back: "वापस",
    steps: ["१", "२", "३", "४"],
    ageRestriction: "पंजीकरण करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए",
    weakPasswordError: "कृपया एक मजबूत पासवर्ड चुनें जो सभी आवश्यकताओं को पूरा करता हो",
    registrationFailed: "पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।",
    successTitle: "पंजीकरण सफल!",
    successMessage: "आपका खाता सफलतापूर्वक बनाया गया है जिसमें प्रारंभिक शेष राशि है",
    amount: "₹1,50,000",
    loginPrompt: "अब आप अपने क्रेडेंशियल्स से लॉगिन कर सकते हैं।"
  },
  registrationForm: {
    title: "व्यक्तिगत जानकारी",
    description: "अपना खाता बनाने के लिए अपना विवरण भरें",
    fullName: "पूरा नाम",
    namePlaceholder: "अपना पूरा नाम दर्ज करें",
    nameRequired: "नाम आवश्यक है",
    email: "ईमेल पता",
    emailPlaceholder: "अपना ईमेल दर्ज करें",
    emailRequired: "ईमेल आवश्यक है",
    emailInvalid: "अमान्य ईमेल प्रारूप",
    phone: "फ़ोन नंबर",
    phonePlaceholder: "10-अंकों का फ़ोन नंबर",
    phoneRequired: "फोन नंबर आवश्यक है",
    phoneInvalid: "फोन 10 अंकों का होना चाहिए",
    pan: "पैन नंबर",
    panPlaceholder: "उदाहरण, ABCDE1234F",
    panRequired: "पैन आवश्यक है",
    panInvalid: "अमान्य पैन प्रारूप",
    dob: "जन्म तिथि",
    dobRequired: "जन्म तिथि आवश्यक है",
    age: "आयु",
    agePlaceholder: "आपकी आयु",
    ageRequired: "आयु आवश्यक है",
    ageMinimum: "आपकी आयु कम से कम 18 वर्ष होनी चाहिए",
    continueButton: "पासवर्ड सेट करने के लिए जारी रखें"
  },
  stockNews: {
    loadingMarketData: "बाजार डेटा लोड हो रहा है...",
    loadingSectorData: "सेक्टर डेटा लोड हो रहा है...",
    generateNewUpdate: "नया अपडेट जनरेट करें",
    bullish: "तेजी",
    bearish: "मंदी",
    neutral: "तटस्थ",
    liveUpdate: "लाइव अपडेट",
    realTimeMarketUpdates: "वास्तविक समय बाजार अपडेट",
    latestStockMarketNews: "नवीनतम शेयर बाजार समाचार",
    refreshAllNews: "सभी समाचार रिफ्रेश करें"
  },
  footer: {
    usersCount: "100K+ से अधिक उद्यमियों और व्यापारियों ने हमें चुना है",
    heroTitle: "आपकी वित्तीय स्वतंत्रता को सशक्त बनाना",
    heroDescription: "हम अत्याधुनिक नवाचार, पारदर्शिता और व्यक्तिगत सेवा प्रदान करते हैं, जो आपको वित्तीय स्वतंत्रता प्राप्त करने में मदद करता है",
    getStarted: "अभी शुरू करें",
    companyDescription: "उपयोगकर्ताओं को स्मार्ट वित्तीय अंतर्दृष्टि और बुद्धिमान धन प्रबंधन समाधानों के साथ सुरक्षित वित्तीय भविष्य के लिए सशक्त बनाना।",
    downloadApp: "हमारा ऐप डाउनलोड करें",
    getItOn: "इस पर प्राप्त करें",
    downloadOn: "पर डाउनलोड करें",
    allRightsReserved: "सर्वाधिकार सुरक्षित।",
    features: {
      title: "विशेषताएँ",
      panIntegration: "पैन एकीकरण",
      analytics: "विश्लेषिकी डैशबोर्ड",
      savingPots: "बचत पॉट",
      marketInsights: "बाजार अंतर्दृष्टि",
      rewards: "रिवॉर्ड प्रोग्राम"
    },
    resources: {
      title: "संसाधन",
      financialTips: "वित्तीय सलाह",
      marketUpdates: "बाजार अपडेट",
      userGuides: "उपयोगकर्ता गाइड",
      faqs: "अक्सर पूछे जाने वाले प्रश्न"
    },
    company: {
      title: "कंपनी",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      cookies: "कुकीज़ नीति"
    },
    newsletter: {
      title: "न्यूज़लेटर",
      description: "हमारी नवीनतम सेवाओं और ऑफर पर अपडेट प्राप्त करने के लिए हमारे न्यूज़लेटर की सदस्यता लें।",
      placeholder: "अपना ईमेल दर्ज करें"
    }
  }
};

// Create the context
const TranslationContext = createContext();

// Custom hook for using translations
export const useTranslation = () => useContext(TranslationContext);

// Provider component
export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');
  const [translations, setTranslations] = useState(englishTranslations);
  const [showLanguageModal, setShowLanguageModal] = useState(true); // Always show on load

  useEffect(() => {
    // Update translations based on selected language
    if (language === 'hindi') {
      setTranslations(hindiTranslations);
    } else {
      setTranslations(englishTranslations);
    }
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  return (
    <TranslationContext.Provider value={{ 
      translations, 
      language, 
      changeLanguage, 
      showLanguageModal, 
      setShowLanguageModal 
    }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;
