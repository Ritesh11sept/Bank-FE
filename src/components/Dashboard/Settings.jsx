import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaLock, FaIdCard, FaBell, FaTimes, FaChevronDown, FaCheck, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Settings = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(null);
  const modalRef = useRef(null);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    panNumber: "ABCDE1234F",
    dob: "01/01/1990",
    address: "123 Main Street, Mumbai, India",
    accountStatus: "Active",
    kycStatus: "Verified",
    twoFactorAuth: true,
    loginAlerts: true,
    transactionAlerts: true,
    promotionalAlerts: false,
  };

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
              <InfoRow label="Full Name" value={userData.name} />
              <InfoRow label="Email" value={userData.email} />
              <InfoRow label="Phone Number" value={userData.phone} />
              <InfoRow label="PAN Number" value={userData.panNumber} />
              <InfoRow label="Date of Birth" value={userData.dob} />
              <InfoRow label="Address" value={userData.address} />
              
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
              <InfoRow label="Two-factor Authentication" value={userData.twoFactorAuth ? "Enabled" : "Disabled"} highlight={userData.twoFactorAuth} />
              
              <div className="space-y-2 mt-3">
                <ToggleSwitch 
                  isOn={userData.twoFactorAuth} 
                  onToggle={() => {}} 
                  label="Two-factor Authentication" 
                />
                
                <div className="pt-3 border-t border-gray-200">
                  <button className="px-4 py-2 text-sm bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors">
                    Change Password
                  </button>
                </div>
                
                <div className="pt-3">
                  <button className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
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
              <InfoRow label="Account Status" value={userData.accountStatus} highlight={userData.accountStatus === "Active"} />
              <InfoRow label="KYC Status" value={userData.kycStatus} highlight={userData.kycStatus === "Verified"} />
              <InfoRow label="PAN Number" value={userData.panNumber} />
              
              <div className="flex items-center mt-3 p-3 bg-green-50 rounded-lg">
                <FaCheck className="text-green-500 mr-2" />
                <span className="text-green-700 text-sm">Your account is fully verified</span>
              </div>
            </div>
          </SettingSection>
          
          <SettingSection 
            title="Notifications" 
            icon={<FaBell className="w-5 h-5" />} 
            section="notifications"
          >
            <div className="space-y-1">
              <ToggleSwitch 
                isOn={userData.loginAlerts} 
                onToggle={() => {}} 
                label="Login Alerts" 
              />
              <ToggleSwitch 
                isOn={userData.transactionAlerts} 
                onToggle={() => {}} 
                label="Transaction Alerts" 
              />
              <ToggleSwitch 
                isOn={userData.promotionalAlerts} 
                onToggle={() => {}} 
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
