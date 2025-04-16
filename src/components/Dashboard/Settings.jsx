import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaLock, FaIdCard, FaBell, FaTimes, FaChevronDown, FaCheck, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useGetUserProfileQuery } from "../../state/api";
import { format } from 'date-fns';

const Settings = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const modalRef = useRef(null);
  
  // Fetch user profile data
  const { data: profileData, isLoading, isError } = useGetUserProfileQuery();
  
  // Fix: Access profile data directly without the .user property
  const userData = profileData; // The API now returns the user data directly

  // Default user settings
  const [userSettings, setUserSettings] = useState({
    twoFactorAuth: true,
    loginAlerts: true,
    transactionAlerts: true,
    promotionalAlerts: false,
  });

  useEffect(() => {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle click outside to close modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Format date string to a readable format
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Not available";
      
      // If it's already in DD/MM/YYYY format, return as is
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
        return dateString;
      }
      
      // Try to parse the date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const SettingSection = ({ title, icon, children, section }) => {
    const isActive = activeSection === section;
    
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm">
        <button 
          onClick={() => toggleSection(section)} 
          className="w-full flex items-center justify-between px-6 py-4 bg-white text-left"
        >
          <div className="flex items-center">
            <span className="text-emerald-500 mr-3">{icon}</span>
            <span className="font-medium text-gray-800">{title}</span>
          </div>
          <FaChevronDown className={`text-gray-400 transition-transform ${isActive ? 'transform rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-gray-50 max-h-80 overflow-y-auto settings-scrollbar">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ToggleSwitch = ({ isOn, onToggle, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{label}</span>
      <button onClick={onToggle} className="text-2xl text-emerald-500">
        {isOn ? <FaToggleOn /> : <FaToggleOff className="text-gray-400" />}
      </button>
    </div>
  );

  const InfoRow = ({ label, value, highlight = false }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 sm:w-1/3">{label}</span>
      <span className={`font-medium ${highlight ? 'text-emerald-500' : 'text-gray-800'}`}>{value}</span>
    </div>
  );

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, display error message
  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="text-red-500 mb-2">Failed to load settings</div>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto settings-scrollbar"
      >
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <SettingSection 
            title="Account Settings" 
            icon={<FaUserCircle className="w-5 h-5" />} 
            section="account"
          >
            <div className="space-y-1">
              {userData?.name && <InfoRow label="Full Name" value={userData.name} />}
              {userData?.email && <InfoRow label="Email" value={userData.email} />}
              {userData?.phone && <InfoRow label="Phone Number" value={userData.phone} />}
              {userData?.pan && <InfoRow label="PAN Number" value={userData.pan} />}
              {userData?.dateOfBirth && <InfoRow label="Date of Birth" value={formatDate(userData.dateOfBirth)} />}
              {userData?.age && <InfoRow label="Age" value={userData.age} />}
              {userData?.createdAt && <InfoRow label="Account Created" value={formatDate(userData.createdAt)} />}
              
              <div className="mt-4 pt-2 border-t border-gray-200">
                <button className="px-4 py-2 text-sm bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
                  Edit Profile Information
                </button>
              </div>
            </div>
          </SettingSection>
          
          <SettingSection 
            title="Security" 
            icon={<FaLock className="w-5 h-5" />} 
            section="security"
          >
            <div className="space-y-3">
              <InfoRow label="Two-factor Authentication" value={userSettings.twoFactorAuth ? "Enabled" : "Disabled"} highlight={userSettings.twoFactorAuth} />
              
              <div className="space-y-2 mt-3">
                <ToggleSwitch 
                  isOn={userSettings.twoFactorAuth} 
                  onToggle={() => setUserSettings({...userSettings, twoFactorAuth: !userSettings.twoFactorAuth})} 
                  label="Two-factor Authentication" 
                />
                
                <div className="pt-3 border-t border-gray-200">
                  <button className="px-4 py-2 text-sm bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
                    Change Password
                  </button>
                </div>
                
                <div className="pt-3">
                  <button 
                    className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                  >
                    Logout from All Devices
                  </button>
                </div>
              </div>
            </div>
          </SettingSection>
          
          <SettingSection 
            title="Verification" 
            icon={<FaIdCard className="w-5 h-5" />} 
            section="verification"
          >
            <div className="space-y-3">
              <InfoRow label="Account Status" value="Active" highlight={true} />
              <InfoRow label="KYC Status" value="Verified" highlight={true} />
              {userData?.pan && <InfoRow label="PAN Number" value={userData.pan} />}
              
              <div className="flex items-center mt-3 p-3 bg-green-50 rounded-lg">
                <FaCheck className="text-green-500 mr-2" />
                <span className="text-green-700 text-sm">Your account is fully verified</span>
              </div>
            </div>
          </SettingSection>
          
          <SettingSection 
            title="Linked Accounts" 
            icon={<FaIdCard className="w-5 h-5" />} 
            section="linkedAccounts"
          >
            {userData?.linkedAccounts && userData.linkedAccounts.length > 0 ? (
              <div className="space-y-4">
                {userData.linkedAccounts.map((account, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{account.bankName}</span>
                      {index === 0 && <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Primary</span>}
                    </div>
                    <InfoRow label="Account Number" value={account.accountNumber} />
                    <InfoRow label="IFSC Code" value={account.ifscCode} />
                    <InfoRow label="Balance" value={`₹${account.balance.toLocaleString()}`} highlight={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No linked accounts found
              </div>
            )}
          </SettingSection>
          
          <SettingSection 
            title="Notifications" 
            icon={<FaBell className="w-5 h-5" />} 
            section="notifications"
          >
            <div className="space-y-1">
              <ToggleSwitch 
                isOn={userSettings.loginAlerts} 
                onToggle={() => setUserSettings({...userSettings, loginAlerts: !userSettings.loginAlerts})} 
                label="Login Alerts" 
              />
              <ToggleSwitch 
                isOn={userSettings.transactionAlerts} 
                onToggle={() => setUserSettings({...userSettings, transactionAlerts: !userSettings.transactionAlerts})} 
                label="Transaction Alerts" 
              />
              <ToggleSwitch 
                isOn={userSettings.promotionalAlerts} 
                onToggle={() => setUserSettings({...userSettings, promotionalAlerts: !userSettings.promotionalAlerts})} 
                label="Promotional Notifications" 
              />
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button className="px-4 py-2 text-sm bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
                  Manage Email Preferences
                </button>
              </div>
            </div>
          </SettingSection>
        </div>
      </motion.div>

      <style jsx global>{`
        .settings-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .settings-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .settings-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        
        .settings-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
};

export default Settings;
