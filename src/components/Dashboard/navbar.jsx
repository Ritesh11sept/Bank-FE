import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiMail,
  FiUser,
  FiLogOut,
  FiHelpCircle,
  FiMenu,
  FiCreditCard,
  FiFileText,
  FiShield,
  FiGift,
  FiCalendar,
  FiPlusCircle,
  FiMinusCircle,
  FiTarget,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import Avatar from "react-avatar";
import {
  useGetUserProfileQuery,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "../../state/api";
import NotificationPanel from "./NotificationPanel";
import { useTranslation2, TranslationContext2 } from "../../context/TranslationContext2";

// Fallback translations when context isn't available
const fallbackTranslations = {
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
    dismiss: "Dismiss",
  },
  notificationPanel: {
    noNotifications: "No notifications",
    clearAll: "Clear all",
    loading: "Loading notifications...",
    unreadNotifications: "Unread notifications",
    allNotifications: "All notifications",
    markAllRead: "Mark all as read",
    justNow: "Just now",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
  },
  language: {
    en: "EN",
    hi: "HI",
    english: "English",
    hindi: "Hindi",
  },
};

const Navbar = ({ toggleSidebar, setMobileOpen, toggleChatbot = () => {} }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showNewNotificationPopup, setShowNewNotificationPopup] = useState(false);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationsButtonRef = useRef(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  // Create a local translation state if context is not available
  const [localLanguage, setLocalLanguage] = useState("english");

  // Try to get translations from context, use fallback if not available
  const translationContext = useContext(TranslationContext2);
  const translationService = translationContext || {
    translations: fallbackTranslations,
    language: localLanguage,
    changeLanguage: setLocalLanguage,
  };

  const { translations, language, changeLanguage } = translationService;
  const { navbar, notificationPanel, language: langText } = translations;

  // Fetch user profile data
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();

  // Fix: Access profile data directly without the .user property
  // The API now returns the user data directly in the response
  const userData = profileData;

  // Fetch notifications with periodic refetch
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();

  const [markNotificationsRead] = useMarkNotificationsReadMutation();

  // Since we don't have these mutations yet in the API, we'll create mock functions
  const deleteNotification = async (id) => {
    console.log("Mock delete notification:", id);
    // In a real implementation, this would call the API
    // For now, we'll just log and pretend it succeeded

    // Create a local mock implementation to actually remove the notification from the UI
    if (notificationsData && notificationsData.notifications) {
      const updatedNotifications = notificationsData.notifications.filter(
        (notification) => notification.id !== id.id
      );
      // Update the local state to reflect the deletion
      notificationsData.notifications = updatedNotifications;
    }
  };

  const clearAllNotifications = async () => {
    console.log("Mock clear all notifications");
    // In a real implementation, this would call the API
    // For now, we'll just log and pretend it succeeded

    // Clear all notifications locally
    if (notificationsData) {
      notificationsData.notifications = [];
    }
  };

  // Periodically refetch notifications to catch new ones
  useEffect(() => {
    // Initial fetch
    refetchNotifications();

    // Set up interval to check for new notifications
    const notificationInterval = setInterval(() => {
      refetchNotifications();
    }, 30000); // Check every 30 seconds

    // Clean up on component unmount
    return () => clearInterval(notificationInterval);
  }, [refetchNotifications]);

  // Get unread notifications count and avoid duplicates
  const notifications = notificationsData?.notifications || [];
  // Make sure notifications are unique by ID to avoid doubles
  const uniqueNotifications = notifications.reduce((acc, current) => {
    const existingNotification = acc.find((item) => item.id === current.id);
    if (!existingNotification) {
      acc.push(current);
    }
    return acc;
  }, []);
  const unreadCount = uniqueNotifications.filter((notif) => !notif.isRead).length;

  // Show popup when new notifications arrive
  useEffect(() => {
    if (unreadCount > lastNotificationCount && lastNotificationCount !== 0) {
      setShowNewNotificationPopup(true);
      // Auto hide popup after 5 seconds
      const timeout = setTimeout(() => {
        setShowNewNotificationPopup(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
    setLastNotificationCount(unreadCount);
  }, [unreadCount, lastNotificationCount]);

  // Get the latest notification for preview
  const latestNotification =
    uniqueNotifications.length > 0
      ? [...uniqueNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      : null;

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target) &&
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleNotifications = () => {
    const wasOpen = isNotificationsOpen;
    setIsNotificationsOpen(!isNotificationsOpen);
    setShowNewNotificationPopup(false);

    // Mark all as read when opening
    if (!wasOpen && unreadCount > 0) {
      markNotificationsRead({}).then(() => {
        // Refetch to update the UI
        refetchNotifications();
      });
    }
  };

  const handleSidebarToggle = () => {
    console.log("Direct sidebar toggle");
    if (typeof setMobileOpen === "function") {
      setMobileOpen(true);
      console.log("Sidebar should be open now");
    } else {
      console.error("setMobileOpen is not available:", setMobileOpen);
    }
  };

  const getNotificationIcon = (type, iconName) => {
    switch (iconName) {
      case "gift":
        return <FiGift className="text-pink-500" />;
      case "calendar":
        return <FiCalendar className="text-blue-500" />;
      case "deposit":
        return <FiPlusCircle className="text-green-500" />;
      case "withdraw":
        return <FiMinusCircle className="text-orange-500" />;
      case "goal":
        return <FiTarget className="text-indigo-500" />;
      case "pot":
        return <FiTarget className="text-emerald-500" />;
      case "game":
        return <FiTarget className="text-purple-500" />;
      default:
        if (type === "reward") return <FiGift className="text-pink-500" />;
        if (type === "alert") return <FiAlertCircle className="text-amber-500" />;
        if (type === "transaction") return <FiCreditCard className="text-blue-500" />;
        return <FiBell className="text-gray-500" />;
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification({ id });
      refetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await clearAllNotifications();
      refetchNotifications();
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  const notificationItems = [
    {
      icon: <FiBell size={20} />,
      count: unreadCount,
      label: "Notifications",
      action: toggleNotifications,
    },
    {
      icon: <FiMail size={20} />,
      count: 0,
      label: "Messages",
      action: () => console.log("Messages clicked"),
    },
  ];

  // Fix: Update account info to handle the new data structure
  const accountInfo = userData
    ? {
        name: userData.name,
        email: userData.email,
        accountNumber:
          userData.linkedAccounts?.length > 0 ? userData.linkedAccounts[0].accountNumber : "Not Available",
        accountType: userData.linkedAccounts?.length > 0 ? "Savings" : "Not Available",
        panNumber: userData.pan,
        branch: userData.linkedAccounts?.length > 0 ? "Main Branch - Mumbai" : "Not Available",
        ifsc: userData.linkedAccounts?.length > 0 ? userData.linkedAccounts[0].ifscCode : "Not Available",
        lastLogin: "Today, 10:45 AM",
        phone: userData.phone,
        kycStatus: "Verified",
      }
    : {
        name: "Loading...",
        email: "loading@example.com",
        accountNumber: "XXXX-XXXX-0000",
        accountType: "Loading...",
        panNumber: "Loading...",
        branch: "Loading...",
        ifsc: "Loading...",
        lastLogin: "Loading...",
        phone: "Loading...",
        kycStatus: "Unknown",
      };

  // Fix: Update linked accounts access to match the new data structure
  const accountsList =
    userData?.linkedAccounts?.map((account, index) => ({
      accountNumber: account.accountNumber,
      accountType: "Savings",
      isPrimary: index === 0,
      bankName: account.bankName,
      balance: account.balance,
    })) || [{ accountNumber: "Loading...", accountType: "Loading...", isPrimary: true }];

  const profileMenuItems = [
    { icon: <FiUser size={16} />, text: "Profile", action: () => setShowAccountModal(true) },
    {
      icon: <FiLogOut size={16} />,
      text: "Sign Out",
      action: () => {
        localStorage.removeItem("token");
        window.location.href = "/home";
      },
    },
  ];

  return (
    <>
      <nav className="fixed top-0 right-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-lg shadow-sm lg:ml-64 w-full lg:w-[calc(100%-16rem)]">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleSidebarToggle}
              className="lg:hidden mr-3 p-2.5 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl transition-all duration-200 border border-gray-100 hover:border-emerald-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={22} />
            </button>

            {/* Language toggle slider - Fixed to keep labels consistent */}
            <div className="hidden sm:flex items-center ml-3">
              <span className="mr-2 text-sm font-medium" style={{ color: language === "english" ? "#047857" : "#6B7280" }}>
                EN
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={language === "hindi"}
                  onChange={() => changeLanguage(language === "english" ? "hindi" : "english")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
              <span className="ml-2 text-sm font-medium" style={{ color: language === "hindi" ? "#047857" : "#6B7280" }}>
                HI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {notificationItems.map((item, index) => (
              <div key={index} className="relative hidden sm:block">
                <button
                  ref={index === 0 ? notificationsButtonRef : null}
                  onClick={item.action}
                  className="p-2.5 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 rounded-xl transition-all duration-200 border border-gray-100 hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 active:scale-95"
                  aria-label={item.label}
                >
                  {item.icon}
                  {item.count > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm font-medium">
                      {item.count}
                    </span>
                  )}
                </button>

                {/* Enhanced notification popup */}
                <AnimatePresence>
                  {showNewNotificationPopup && index === 0 && latestNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, x: "-50%" }}
                      exit={{ opacity: 0, y: -10, x: "-50%" }}
                      className="absolute left-1/2 top-12 bg-white px-4 py-3 rounded-lg shadow-lg border border-emerald-100 z-50 w-72"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <FiBell className="text-emerald-600" size={15} />
                        </div>
                        <p className="font-medium text-sm">
                          {unreadCount > 1 ? navbar.newNotifications : navbar.newNotification}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowNewNotificationPopup(false);
                          }}
                          className="ml-auto text-gray-400 hover:text-gray-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>

                      {/* Notification preview */}
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 rounded-full bg-gray-100 flex-shrink-0 mt-0.5">
                            {getNotificationIcon(latestNotification.type, latestNotification.icon)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{latestNotification.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{latestNotification.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowNewNotificationPopup(false);
                            toggleNotifications();
                          }}
                          className="text-xs flex-1 bg-emerald-100 text-emerald-700 py-1.5 rounded hover:bg-emerald-200 transition-colors"
                        >
                          {navbar.viewAll} ({unreadCount})
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification({ id: latestNotification.id });
                            setShowNewNotificationPopup(false);
                          }}
                          className="text-xs px-2 bg-gray-100 text-gray-600 py-1.5 rounded hover:bg-gray-200 transition-colors"
                        >
                          {navbar.dismiss}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  ref={notificationsRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-16 right-20 bg-white shadow-lg rounded-xl py-2 w-80 sm:w-96 border border-gray-100 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
                >
                  <NotificationPanel
                    notifications={uniqueNotifications}
                    isLoading={isLoadingNotifications}
                    getNotificationIcon={getNotificationIcon}
                    onDeleteNotification={handleDeleteNotification}
                    onClearAllNotifications={handleClearAllNotifications}
                    unreadCount={unreadCount}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative ml-1">
              <button
                ref={profileButtonRef}
                onClick={toggleProfileMenu}
                className="hover:shadow-[0_0_0_2px_rgba(16,185,129,0.3)] transition-all rounded-full flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-300 active:scale-95"
                aria-label="Profile menu"
              >
                <Avatar
                  name={accountInfo.name}
                  size="40"
                  round={true}
                  color="#10B981"
                  className="border-2 border-emerald-500"
                />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    ref={profileMenuRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 bg-white shadow-lg rounded-xl py-2 w-72 border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar
                          name={accountInfo.name}
                          size="40"
                          round={true}
                          color="#10B981"
                          className="border-2 border-emerald-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{accountInfo.name}</p>
                          <p className="text-sm text-gray-500 truncate">{accountInfo.email}</p>
                        </div>
                      </div>

                      <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Primary Account</span>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {accountInfo.accountType}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{accountInfo.accountNumber}</p>
                      </div>

                      <div className="mt-2 flex justify-between text-xs">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">PAN:</span>
                          <span className="font-medium">{accountInfo.panNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">KYC:</span>
                          <span className="text-emerald-600 font-medium flex items-center">
                            <FiShield size={10} className="mr-0.5" /> {accountInfo.kycStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {profileMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors
                          ${
                            index === profileMenuItems.length - 1
                              ? "text-red-600 hover:bg-red-50 mt-1 border-t border-gray-100"
                              : ""
                          }`}
                      >
                        <span
                          className={`${
                            index === profileMenuItems.length - 1 ? "text-red-500" : "text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {item.text}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showAccountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAccountModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={accountInfo.name}
                    size="56"
                    round={true}
                    color="#10B981"
                    className="border-2 border-white shadow-md"
                  />
                  <div className="text-white">
                    <h3 className="font-bold text-xl">{accountInfo.name}</h3>
                    <p className="opacity-90 text-sm">{accountInfo.email}</p>
                    <p className="opacity-90 text-sm">{accountInfo.phone}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">{navbar.accountInformation}</h4>
                  {accountsList.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                        className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      >
                        {navbar.switchAccount}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            showAccountSwitcher ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {showAccountSwitcher && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg w-64 overflow-hidden z-10 border border-gray-200"
                          >
                            {accountsList.map((account, idx) => (
                              <button
                                key={idx}
                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(`Switching to account: ${account.accountNumber}`);
                                  setShowAccountSwitcher(false);
                                }}
                              >
                                <div>
                                  <div className="text-sm font-medium">
                                    {account.bankName || ""} {account.accountNumber}
                                  </div>
                                  <div className="text-xs text-gray-500">{account.accountType}</div>
                                  {account.balance && (
                                    <div className="text-xs text-emerald-600">
                                      Balance: ₹{account.balance.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                                {account.isPrimary && (
                                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                    Primary
                                  </span>
                                )}
                              </button>
                            ))}

                            <div className="border-t border-gray-200 p-2">
                              <button
                                className="w-full text-sm text-center py-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Manage accounts clicked");
                                  setShowAccountSwitcher(false);
                                }}
                              >
                                Manage Accounts
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">{navbar.currentAccount}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
                      {accountInfo.accountType}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{navbar.accountNumber}</span>
                      <span className="text-sm font-medium">{accountInfo.accountNumber}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{navbar.ifscCode}</span>
                      <span className="text-sm font-medium">{accountInfo.ifsc}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{navbar.branch}</span>
                      <span className="text-sm font-medium">{accountInfo.branch}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">{navbar.panNumber}</span>
                    <span className="text-sm font-medium">{accountInfo.panNumber}</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <span className="text-xs text-gray-500 block mb-1">{navbar.kycStatus}</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center">
                      <FiShield size={14} className="mr-1" /> {accountInfo.kycStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-500 block">{navbar.lastLogin}</span>
                    <span className="text-sm font-medium">{accountInfo.lastLogin}</span>
                  </div>
                  <button className="text-xs bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors duration-200">
                    {navbar.viewActivity}
                  </button>
                </div>

                {userData?.bankBalance && (
                  <div className="mt-4 bg-green-50 rounded-xl p-3 border border-green-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-green-500 block">{navbar.bankBalance}</span>
                      <span className="text-sm font-medium">₹{userData.bankBalance.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-center">
                  <button
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-200 font-medium flex items-center gap-2"
                    onClick={() => console.log("Manage accounts clicked")}
                  >
                    <FiCreditCard size={16} />
                    {navbar.manageAccounts}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                >
                  {navbar.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;