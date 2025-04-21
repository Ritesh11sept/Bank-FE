import React, { createContext, useState, useContext, useEffect } from 'react';

// English translations
const englishTranslations = {
  navbar: {
    notifications: "Notifications",
    messages: "Messages",
    profile: "Profile", 
    signOut: "Sign Out",
    primaryAccount: "Primary Account",
    pan: "PAN:",
    kyc: "KYC:",
    verified: "Verified",
    accountInformation: "Account Information",
    switchAccount: "Switch Account",
    currentAccount: "Current Account",
    accountNumber: "Account Number",
    ifscCode: "IFSC Code",
    branch: "Branch",
    panNumber: "PAN Number",
    kycStatus: "KYC Status",
    lastLogin: "Last Login",
    viewActivity: "View Activity",
    bankBalance: "Bank Balance",
    manageAccounts: "Manage Accounts",
    close: "Close",
    newNotification: "New notification",
    newNotifications: "New notifications",
    viewAll: "View All",
    dismiss: "Dismiss"
  },
  notificationPanel: {
    noNotifications: "No notifications yet",
    clearAll: "Clear All",
    loading: "Loading notifications...",
    unreadNotifications: "Unread notifications",
    allNotifications: "All notifications",
    markAllRead: "Mark all as read",
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    viewAll: "View all notifications",
    notifications: "Notifications",
    new: "new",
    cancel: "Cancel",
    confirm: "Confirm",
    areYouSure: "Are you sure you want to clear all notifications?"
  },
  language: {
    en: "EN",
    hi: "HI",
    english: "English",
    hindi: "Hindi"
  },
  sidebar: {
    appName: "Financeseer",
    menu: {
      home: "Home",
      markets: "Markets",
      prediction: "Prediction",
      treasures: "Treasures",
      savings: "Savings",
      analytics: "Analytics",
      settings: "Settings",
      help: "Help",
      logout: "Logout"
    }
  },
  dashboard: {
    header: {
      home: "Home",
      dashboard: "Dashboard",
      predictions: "Predictions",
      insights: "Insights",
      treasures: "Treasures",
      savings: "Savings",
      logout: "Logout"
    },
    layout: {
      openChat: "Open chat assistant"
    }
  },
  landing: {
    loading: "Loading your dashboard...",
    authRequired: "Authentication Required",
    loginPrompt: "Please log in to access your dashboard. No authentication token was found.",
    goToLogin: "Go to Login"
  },
  predictions: {
    title: "Financial Insights & Predictions",
    subtitle: "Smart analysis and forecasting based on your transaction patterns",
    loading: "Loading financial insights...",
    weekly: "Weekly",
    monthly: "Monthly",
    hide: "Hide",
    show: "Show",
    predictions: "Predictions",
    earnings: "Total Earnings",
    income: "Income",
    spending: "Total Spending",
    expenses: "Expenses",
    savings: "Savings",
    balance: "Balance",
    spendingPattern: "Spending Pattern & Predictions",
    trend: "Trend:",
    trendText: "Your spending is",
    increasing: "increasing",
    decreasing: "decreasing",
    stable: "stable",
    nextMonth: "next month",
    topSpendingCategories: "Top Spending Categories",
    financialInsights: "Financial Insights",
    highestSpendingDay: "Highest Spending Day",
    avgDailySpending: "Average Daily Spending",
    monthComparison: "Month-over-Month Comparison",
    savingsAchievement: "Savings Achievement",
    smartSuggestions: "Smart Suggestions",
    noDataSuggestions: "Not enough data to generate suggestions",
    takeControl: "Want to take control?",
    setBudget: "Set a budget for next",
    optimizeSavings: "to optimize your savings",
    setBudgetGoals: "Set Budget Goals",
    youSpentMost: "You spent the most on",
    noSpendingRecorded: "No spending recorded",
    averageDaily: "Your average daily spending is",
    youHad: "You had",
    noSpendDay: "no-spend day",
    noSpendDays: "no-spend days",
    spendingSame: "Your spending is the same as last month",
    spentMore: "You spent",
    spentLess: "You spent",
    moreThanLast: "more than last month",
    lessThanLast: "less than last month",
    increase: "increase",
    decrease: "decrease",
    youSaved: "You saved",
    thats: "— that's",
    ofYourIncome: "of your income!",
    youSpentMoreThanEarned: "You've spent more than you earned",
    fromSources: "You've received money from",
    sources: "sources",
    noIncomeRecorded: "No income recorded",
    actualSpending: "Actual Spending",
    predictedSpending: "Predicted Spending"
  },
  savings: {
    title: "Savings Pots",
    subtitle: "Save for your goals and earn 2.5% interest annually",
    aboutPots: "About Pots",
    createNew: "Create New Pot",
    totalSavings: "Total Savings",
    annualInterest: "Annual Interest",
    activeGoals: "Active Goals",
    completedGoals: "Completed Goals",
    of: "of",
    loading: "Loading...",
    failedToLoad: "Failed to load your savings pots",
    tryAgain: "Try Again",
    guide: {
      title: "Smart Savings with AI Assistance",
      description: "Create savings pots for different goals and get personalized AI tips to help you reach them faster.",
      bullet1: "Create different pots for different goals",
      bullet2: "Get AI-powered savings tips and gift recommendations",
      bullet3: "Track your progress with visual indicators"
    },
    alerts: {
      potCreated: "Pot created successfully",
      potDeleted: "Pot deleted successfully",
      depositSuccess: "Deposit successful",
      withdrawSuccess: "Withdrawal successful",
      goalSetSuccess: "Goal set successfully",
      error: "An error occurred"
    }
  },
  settings: {
    title: "Settings",
    close: "Close",
    account: {
      title: "Account Settings",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      panNumber: "PAN Number",
      dateOfBirth: "Date of Birth",
      age: "Age", 
      accountCreated: "Account Created",
      editProfile: "Edit Profile Information"
    },
    security: {
      title: "Security",
      twoFactorAuthentication: "Two-factor Authentication",
      enabled: "Enabled",
      disabled: "Disabled",
      changePassword: "Change Password",
      logoutAllDevices: "Logout from All Devices"
    },
    verification: {
      title: "Verification",
      accountStatus: "Account Status",
      kycStatus: "KYC Status",
      active: "Active",
      verified: "Verified",
      fullyVerified: "Your account is fully verified"
    },
    linkedAccounts: {
      title: "Linked Accounts",
      primary: "Primary",
      accountNumber: "Account Number",
      ifscCode: "IFSC Code",
      balance: "Balance",
      noLinkedAccounts: "No linked accounts found"
    },
    notifications: {
      title: "Notifications",
      loginAlerts: "Login Alerts", 
      transactionAlerts: "Transaction Alerts",
      promotionalNotifications: "Promotional Notifications",
      manageEmailPreferences: "Manage Email Preferences"
    },
    loading: "Loading...",
    error: "Failed to load settings"
  },
  treasures: {
    title: "Rewards & Treasures",
    rewardPoints: "Reward Points",
    loginStreak: {
      title: "Daily Login Streak",
      day: "Day",
      weeklyReward: "Weekly Reward (Day 7)",
      rewardDescription: "Special Scratch Card + 50 Points",
      claimedToday: "Claimed Today!",
      daysRemaining: "days remaining"
    },
    scratchCards: {
      title: "Scratch Cards",
      available: "Available",
      scratchAndWin: "Scratch & Win",
      tapToReveal: "Tap to reveal your reward",
      new: "NEW",
      expiresIn: "Expires in",
      days: "days",
      youWon: "You've won",
      cashback: "Cashback",
      off: "Off",
      points: "Points",
      rewardApplied: "Reward already applied to your account",
      expiresOn: "Expires on",
      noCards: "No scratch cards available right now",
      comeBack: "Come back tomorrow for new rewards or continue your login streak",
      scratching: "Scratching..."
    },
    game: {
      title: "Quick Hit Game",
      score: "Score",
      time: "Time",
      description: "Play \"Quick Hit\" and earn reward points!",
      instructions: "Hit as many targets as you can in 30 seconds. Each hit gives you 10 points!",
      startGame: "Start Game",
      gameOver: "Game Over!",
      yourScore: "Your Score",
      earned: "You earned",
      rewardPoints: "reward points!",
      newTotal: "New total",
      playAgain: "Play Again",
      close: "Close"
    },
    offers: {
      title: "Exclusive Offers",
      viewAll: "View All",
      validTill: "Valid till"
    },
    summary: {
      title: "Rewards Summary",
      totalPoints: "Total Points",
      loginStreak: "Login Streak",
      days: "days",
      weeklyProgress: "Weekly Progress",
      day: "Day",
      daysToBonus: "days to weekly bonus",
      pointsValue: "Points Value"
    },
    referral: {
      title: "Refer & Earn",
      description: "Invite your friends to join our banking app and both of you can earn rewards!",
      yourCode: "Your Referral Code",
      forYou: "For you",
      forFriend: "For friend",
      inviteFriends: "Invite Friends"
    },
    leaderboard: {
      title: "Point Leaders",
      you: "You",
      viewFull: "View Full Leaderboard"
    }
  },
  accountOverview: {
    title: "Account Overview",
    subtitle: "Your current balance and account details",
    availableBalance: "Available Balance",
    accountNumber: "Account Number",
    bank: "Bank",
    moneyIn: "Money In",
    moneyOut: "Money Out",
    last30Days: "Last 30 days",
    savingsAccount: "Savings Account"
  },
  financialTips: {
    title: "Financial Insights",
    subtitle: "Tips to improve your finances",
    tips: [
      {
        title: "Save for emergencies",
        description: "Aim to save at least 3-6 months of expenses in an emergency fund."
      },
      {
        title: "Diversify investments",
        description: "Don't put all your eggs in one basket. Spread your investments across assets."
      },
      {
        title: "Pay off high-interest debt",
        description: "Prioritize paying off credit cards and loans with high interest rates."
      },
      {
        title: "Track your spending",
        description: "Keep a budget to understand where your money goes each month."
      },
      {
        title: "Protect your finances",
        description: "Make sure you have insurance to protect against unexpected losses."
      }
    ],
    quickActions: "Quick Actions",
    createSavingsGoal: "Create Savings Goal",
    exploreInvestments: "Explore Investments",
    financeScore: "Personal Finance Score",
    good: "Good",
    financeHealth: "Your finance health is good, but there's room for improvement.",
    viewDetailedReport: "View Detailed Report"
  },
  quickTransfer: {
    title: "Quick Transfer",
    subtitle: "Send money to other users instantly",
    searchPlaceholder: "Search users by name or email",
    availableUsers: "Available Users",
    refresh: "Refresh",
    noUsersFound: "No users found matching your search",
    noUsersAvailable: "No other users available for transfer",
    errorPrefix: "Error loading users:",
    createUserHint: "Try creating another user account to test transfers",
    refreshUsersList: "Refresh users list",
    transferMoney: "Transfer Money",
    transferSubtitle: "Send money instantly and securely",
    you: "You",
    amount: "Amount",
    addNote: "Add a note (optional)",
    notePlaceholder: "What's this for?",
    availableBalance: "Available Balance",
    cancel: "Cancel",
    sendMoney: "Send Money",
    processing: "Processing...",
    enterValidAmount: "Please enter a valid amount",
    insufficientBalance: "Insufficient balance",
    transferFailed: "Transfer failed. Please try again."
  },
  recentTransactions: {
    title: "Recent Transactions",
    subtitle: "'s last {0} transactions",
    your: "Your",
    all: "All",
    incoming: "Incoming",
    outgoing: "Outgoing",
    from: "From: {0}",
    to: "To: {0}",
    unknown: "Unknown",
    receivedPayment: "Received payment",
    sentPayment: "Sent payment",
    noTransactionsYet: "No transactions yet",
    noTransactionsDescription: "Your transaction history will appear here after you make your first transfer",
    viewAllTransactions: "View All Transactions"
  }
};

// Hindi translations
const hindiTranslations = {
  navbar: {
    notifications: "सूचनाएँ",
    messages: "संदेश",
    profile: "प्रोफ़ाइल",
    signOut: "साइन आउट",
    primaryAccount: "प्राथमिक खाता",
    pan: "पैन:",
    kyc: "केवाईसी:",
    verified: "सत्यापित",
    accountInformation: "खाता जानकारी",
    switchAccount: "खाता बदलें",
    currentAccount: "वर्तमान खाता",
    accountNumber: "खाता संख्या",
    ifscCode: "आईएफएससी कोड",
    branch: "शाखा",
    panNumber: "पैन नंबर",
    kycStatus: "केवाईसी स्थिति",
    lastLogin: "अंतिम लॉगिन",
    viewActivity: "गतिविधि देखें",
    bankBalance: "बैंक बैलेंस",
    manageAccounts: "खाते प्रबंधित करें",
    close: "बंद करें",
    newNotification: "नई सूचना",
    newNotifications: "नई सूचनाएँ",
    viewAll: "सभी देखें",
    dismiss: "खारिज करें"
  },
  notificationPanel: {
    noNotifications: "अभी कोई सूचना नहीं",
    clearAll: "सभी हटाएं",
    loading: "सूचनाएँ लोड हो रही हैं...",
    unreadNotifications: "अपठित सूचनाएँ",
    allNotifications: "सभी सूचनाएँ",
    markAllRead: "सभी को पढ़ा हुआ मार्क करें",
    justNow: "अभी-अभी",
    minutesAgo: "मिनट पहले",
    hoursAgo: "घंटे पहले",
    daysAgo: "दिन पहले",
    viewAll: "सभी सूचनाएं देखें",
    notifications: "सूचनाएँ",
    new: "नई",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    areYouSure: "क्या आप सभी सूचनाएं हटाना चाहते हैं?"
  },
  language: {
    en: "अं",
    hi: "हि",
    english: "अंग्रेजी",
    hindi: "हिंदी"
  },
  sidebar: {
    appName: "फाइनेंससीर",
    menu: {
      home: "होम",
      markets: "मार्केट",
      prediction: "भविष्यवाणी",
      treasures: "खजाना",
      savings: "बचत",
      analytics: "विश्लेषण",
      settings: "सेटिंग",
      help: "मदद",
      logout: "लॉग आउट"
    }
  },
  dashboard: {
    header: {
      home: "होम",
      dashboard: "डैशबोर्ड",
      predictions: "भविष्यवाणी",
      insights: "जानकारी",
      treasures: "खजाना",
      savings: "बचत",
      logout: "लॉगआउट"
    },
    layout: {
      openChat: "चैट सहायक खोलें"
    }
  },
  landing: {
    loading: "आपका डैशबोर्ड लोड हो रहा है...",
    authRequired: "प्रमाणीकरण आवश्यक",
    loginPrompt: "अपने डैशबोर्ड तक पहुंचने के लिए कृपया लॉगिन करें। कोई प्रमाणीकरण टोकन नहीं मिला।",
    goToLogin: "लॉगिन पर जाएं"
  },
  predictions: {
    title: "वित्तीय अंतर्दृष्टि और भविष्यवाणियां",
    subtitle: "आपके लेन-देन पैटर्न के आधार पर स्मार्ट विश्लेषण और पूर्वानुमान",
    loading: "वित्तीय अंतर्दृष्टि लोड हो रही है...",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    hide: "छिपाएं",
    show: "दिखाएं",
    predictions: "भविष्यवाणियां",
    earnings: "कुल कमाई",
    income: "आय",
    spending: "कुल खर्च",
    expenses: "व्यय",
    savings: "बचत",
    balance: "शेष",
    spendingPattern: "खर्च पैटर्न और भविष्यवाणियां",
    trend: "प्रवृत्ति:",
    trendText: "आपका खर्च",
    increasing: "बढ़ रहा है",
    decreasing: "घट रहा है",
    stable: "स्थिर है",
    nextMonth: "अगले महीने",
    topSpendingCategories: "सबसे अधिक खर्च श्रेणियां",
    financialInsights: "वित्तीय अंतर्दृष्टि",
    highestSpendingDay: "सबसे अधिक खर्च का दिन",
    avgDailySpending: "औसत दैनिक खर्च",
    monthComparison: "महीने-दर-महीने तुलना",
    savingsAchievement: "बचत उपलब्धि",
    smartSuggestions: "स्मार्ट सुझाव",
    noDataSuggestions: "सुझाव उत्पन्न करने के लिए पर्याप्त डेटा नहीं है",
    takeControl: "नियंत्रण लेना चाहते हैं?",
    setBudget: "अगले के लिए बजट सेट करें",
    optimizeSavings: "अपनी बचत को अनुकूलित करने के लिए",
    setBudgetGoals: "बजट लक्ष्य सेट करें",
    youSpentMost: "आपने सबसे अधिक खर्च किया",
    noSpendingRecorded: "कोई खर्च दर्ज नहीं",
    averageDaily: "आपका औसत दैनिक खर्च है",
    youHad: "आपके पास थे",
    noSpendDay: "बिना-खर्च दिन",
    noSpendDays: "बिना-खर्च दिन",
    spendingSame: "आपका खर्च पिछले महीने जैसा ही है",
    spentMore: "आपने खर्च किया",
    spentLess: "आपने खर्च किया",
    moreThanLast: "पिछले महीने से अधिक",
    lessThanLast: "पिछले महीने से कम",
    increase: "वृद्धि",
    decrease: "कमी",
    youSaved: "आपने बचाया",
    thats: "— यह है",
    ofYourIncome: "आपकी आय का!",
    youSpentMoreThanEarned: "आपने अपनी कमाई से अधिक खर्च किया है",
    fromSources: "आपको पैसा मिला है",
    sources: "स्रोतों से",
    noIncomeRecorded: "कोई आय दर्ज नहीं",
    actualSpending: "वास्तविक खर्च",
    predictedSpending: "अनुमानित खर्च"
  },
  savings: {
    title: "बचत के बर्तन",
    subtitle: "अपने लक्ष्यों के लिए बचत करें और सालाना 2.5% ब्याज कमाएं",
    aboutPots: "बर्तन के बारे में",
    createNew: "नया बर्तन बनाएं",
    totalSavings: "कुल बचत",
    annualInterest: "वार्षिक ब्याज",
    activeGoals: "सक्रिय लक्ष्य",
    completedGoals: "पूर्ण लक्ष्य",
    of: "का",
    loading: "लोड हो रहा है...",
    failedToLoad: "आपके बचत बर्तनों को लोड करने में विफल",
    tryAgain: "पुनः प्रयास करें",
    guide: {
      title: "एआई सहायता के साथ स्मार्ट बचत",
      description: "विभिन्न लक्ष्यों के लिए बचत बर्तन बनाएं और उन्हें तेजी से पूरा करने में मदद के लिए व्यक्तिगत एआई टिप्स प्राप्त करें।",
      bullet1: "विभिन्न लक्ष्यों के लिए अलग-अलग बर्तन बनाएं",
      bullet2: "एआई-संचालित बचत टिप्स और उपहार सुझाव प्राप्त करें",
      bullet3: "दृश्य संकेतकों के साथ अपनी प्रगति का निरीक्षण करें"
    },
    alerts: {
      potCreated: "बर्तन सफलतापूर्वक बनाया गया",
      potDeleted: "बर्तन सफलतापूर्वक हटाया गया",
      depositSuccess: "जमा सफल",
      withdrawSuccess: "निकासी सफल",
      goalSetSuccess: "लक्ष्य सफलतापूर्वक सेट किया गया",
      error: "एक त्रुटि हुई"
    }
  },
  settings: {
    title: "सेटिंग्स",
    close: "बंद करें",
    account: {
      title: "खाता सेटिंग्स",
      fullName: "पूरा नाम",
      email: "ईमेल",
      phone: "फोन नंबर", 
      panNumber: "पैन नंबर",
      dateOfBirth: "जन्म तिथि",
      age: "उम्र",
      accountCreated: "खाता बनाया गया",
      editProfile: "प्रोफाइल जानकारी संपादित करें"
    },
    security: {
      title: "सुरक्षा",
      twoFactorAuthentication: "दो-कारक प्रमाणीकरण",
      enabled: "सक्रिय",
      disabled: "निष्क्रिय",
      changePassword: "पासवर्ड बदलें",
      logoutAllDevices: "सभी डिवाइस से लॉगआउट करें"
    },
    verification: {
      title: "सत्यापन",
      accountStatus: "खाता स्थिति",
      kycStatus: "KYC स्थिति",
      active: "सक्रिय",
      verified: "सत्यापित",
      fullyVerified: "आपका खाता पूरी तरह से सत्यापित है"
    },
    linkedAccounts: {
      title: "जुड़े खाते",
      primary: "प्राथमिक",
      accountNumber: "खाता संख्या",
      ifscCode: "IFSC कोड",
      balance: "बैलेंस",
      noLinkedAccounts: "कोई जुड़े खाते नहीं मिले"
    },
    notifications: {
      title: "सूचनाएँ",
      loginAlerts: "लॉगिन अलर्ट",
      transactionAlerts: "लेनदेन अलर्ट",
      promotionalNotifications: "प्रचार संबंधी सूचनाएँ",
      manageEmailPreferences: "ईमेल प्राथमिकताएं प्रबंधित करें"
    },
    loading: "लोड हो रहा है...",
    error: "सेटिंग्स लोड करने में विफल"
  },
  treasures: {
    title: "पुरस्कार और खजाने",
    rewardPoints: "रिवॉर्ड पॉइंट्स",
    loginStreak: {
      title: "दैनिक लॉगिन स्ट्रीक",
      day: "दिन",
      weeklyReward: "साप्ताहिक पुरस्कार (दिन 7)",
      rewardDescription: "विशेष स्क्रैच कार्ड + 50 पॉइंट्स",
      claimedToday: "आज दावा किया!",
      daysRemaining: "दिन शेष"
    },
    scratchCards: {
      title: "स्क्रैच कार्ड",
      available: "उपलब्ध",
      scratchAndWin: "स्क्रैच करें और जीतें",
      tapToReveal: "अपना पुरस्कार देखने के लिए टैप करें",
      new: "नया",
      expiresIn: "समाप्ति",
      days: "दिन",
      youWon: "आपने जीता है",
      cashback: "कैशबैक",
      off: "छूट",
      points: "पॉइंट्स",
      rewardApplied: "पुरस्कार पहले ही आपके खाते में जोड़ दिया गया है",
      expiresOn: "समाप्ति तिथि",
      noCards: "अभी कोई स्क्रैच कार्ड उपलब्ध नहीं है",
      comeBack: "नए पुरस्कारों के लिए कल वापस आएँ या अपनी लॉगिन स्ट्रीक जारी रखें",
      scratching: "स्क्रैच कर रहे हैं..."
    },
    game: {
      title: "क्विक हिट गेम",
      score: "स्कोर",
      time: "समय",
      description: "\"क्विक हिट\" खेलें और रिवॉर्ड पॉइंट्स कमाएँ!",
      instructions: "30 सेकंड में जितने हो सके उतने लक्ष्यों पर हिट करें। हर हिट से आपको 10 पॉइंट्स मिलते हैं!",
      startGame: "गेम शुरू करें",
      gameOver: "गेम ओवर!",
      yourScore: "आपका स्कोर",
      earned: "आपने कमाए",
      rewardPoints: "रिवॉर्ड पॉइंट्स!",
      newTotal: "नया कुल",
      playAgain: "फिर से खेलें",
      close: "बंद करें"
    },
    offers: {
      title: "विशेष ऑफर",
      viewAll: "सभी देखें",
      validTill: "वैध तारीख"
    },
    summary: {
      title: "पुरस्कार सारांश",
      totalPoints: "कुल पॉइंट्स",
      loginStreak: "लॉगिन स्ट्रीक",
      days: "दिन",
      weeklyProgress: "साप्ताहिक प्रगति",
      day: "दिन",
      daysToBonus: "साप्ताहिक बोनस में शेष दिन",
      pointsValue: "पॉइंट्स का मूल्य"
    },
    referral: {
      title: "रेफर करें और कमाएँ",
      description: "अपने दोस्तों को हमारे बैंकिंग ऐप में शामिल होने के लिए आमंत्रित करें और दोनों पुरस्कार कमाएँ!",
      yourCode: "आपका रेफरल कोड",
      forYou: "आपके लिए",
      forFriend: "दोस्त के लिए",
      inviteFriends: "दोस्तों को आमंत्रित करें"
    },
    leaderboard: {
      title: "पॉइंट लीडर्स",
      you: "आप",
      viewFull: "पूरा लीडरबोर्ड देखें"
    }
  },
  accountOverview: {
    title: "खाता अवलोकन",
    subtitle: "आपका वर्तमान बैलेंस और खाता विवरण",
    availableBalance: "उपलब्ध बैलेंस",
    accountNumber: "खाता संख्या",
    bank: "बैंक",
    moneyIn: "जमा राशि",
    moneyOut: "खर्च राशि",
    last30Days: "पिछले 30 दिन",
    savingsAccount: "बचत खाता"
  },
  financialTips: {
    title: "वित्तीय अंतर्दृष्टि",
    subtitle: "अपने वित्त में सुधार के लिए टिप्स",
    tips: [
      {
        title: "आपातकालीन स्थिति के लिए बचत करें",
        description: "आपातकालीन फंड में कम से कम 3-6 महीने के खर्च की बचत करने का लक्ष्य रखें।"
      },
      {
        title: "निवेश को विविधतापूर्ण बनाएं",
        description: "अपने सारे अंडे एक टोकरी में न रखें। अपने निवेश को विभिन्न संपत्तियों में फैलाएं।"
      },
      {
        title: "उच्च ब्याज वाले कर्ज चुकाएं",
        description: "उच्च ब्याज दरों वाले क्रेडिट कार्ड और ऋण चुकाने को प्राथमिकता दें।"
      },
      {
        title: "अपने खर्च पर नज़र रखें",
        description: "हर महीने अपना पैसा कहां जाता है, यह समझने के लिए बजट रखें।"
      },
      {
        title: "अपने वित्त की सुरक्षा करें",
        description: "अप्रत्याशित नुकसान से बचाव के लिए बीमा लें।"
      }
    ],
    quickActions: "त्वरित कार्य",
    createSavingsGoal: "बचत लक्ष्य बनाएं",
    exploreInvestments: "निवेश खोजें",
    financeScore: "व्यक्तिगत वित्त स्कोर",
    good: "अच्छा",
    financeHealth: "आपका वित्तीय स्वास्थ्य अच्छा है, लेकिन सुधार की गुंजाइश है।",
    viewDetailedReport: "विस्तृत रिपोर्ट देखें"
  },
  quickTransfer: {
    title: "त्वरित स्थानांतरण",
    subtitle: "अन्य उपयोगकर्ताओं को तुरंत पैसे भेजें",
    searchPlaceholder: "नाम या ईमेल से उपयोगकर्ताओं को खोजें",
    availableUsers: "उपलब्ध उपयोगकर्ता",
    refresh: "रीफ्रेश",
    noUsersFound: "आपकी खोज से मिलान करने वाले कोई उपयोगकर्ता नहीं मिले",
    noUsersAvailable: "स्थानांतरण के लिए कोई अन्य उपयोगकर्ता उपलब्ध नहीं है",
    errorPrefix: "उपयोगकर्ताओं को लोड करने में त्रुटि:",
    createUserHint: "स्थानांतरण का परीक्षण करने के लिए एक अन्य उपयोगकर्ता खाता बनाएं",
    refreshUsersList: "उपयोगकर्ता सूची रीफ्रेश करें",
    transferMoney: "पैसे भेजें",
    transferSubtitle: "तुरंत और सुरक्षित रूप से पैसे भेजें",
    you: "आप",
    amount: "राशि",
    addNote: "नोट जोड़ें (वैकल्पिक)",
    notePlaceholder: "यह किसके लिए है?",
    availableBalance: "उपलब्ध बैलेंस",
    cancel: "रद्द करें",
    sendMoney: "पैसे भेजें",
    processing: "प्रोसेसिंग...",
    enterValidAmount: "कृपया एक वैध राशि दर्ज करें",
    insufficientBalance: "अपर्याप्त बैलेंस",
    transferFailed: "स्थानांतरण विफल। कृपया पुनः प्रयास करें।"
  },
  recentTransactions: {
    title: "हाल के लेनदेन",
    subtitle: " के अंतिम {0} लेनदेन",
    your: "आपके",
    all: "सभी",
    incoming: "आने वाले",
    outgoing: "जाने वाले",
    from: "से: {0}",
    to: "को: {0}",
    unknown: "अज्ञात",
    receivedPayment: "भुगतान प्राप्त हुआ",
    sentPayment: "भुगतान भेजा",
    noTransactionsYet: "अभी तक कोई लेनदेन नहीं",
    noTransactionsDescription: "आपका पहला स्थानांतरण करने के बाद आपका लेनदेन इतिहास यहां दिखाई देगा",
    viewAllTransactions: "सभी लेनदेन देखें"
  }
};

// Create the context
export const TranslationContext2 = createContext();

// Custom hook for using translations
export const useTranslation2 = () => useContext(TranslationContext2);

// Provider component
export const TranslationProvider2 = ({ children }) => {
  const [language, setLanguage] = useState('english');
  const [translations, setTranslations] = useState(englishTranslations);
  
  useEffect(() => {
    // Update translations based on selected language
    if (language === 'hindi') {
      setTranslations(hindiTranslations);
    } else {
      setTranslations(englishTranslations);
    }
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <TranslationContext2.Provider value={{ 
      translations, 
      language, 
      changeLanguage
    }}>
      {children}
    </TranslationContext2.Provider>
  );
};

export default TranslationProvider2;
