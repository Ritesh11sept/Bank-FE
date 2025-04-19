import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, XCircle, CheckCircle, FileText, Users, 
  AlertTriangle, UserPlus, ChevronDown, Download, Share2, 
  MoreHorizontal, Bell, Zap, Shield, BrainCircuit, User
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY;

const UserManagement = ({ users, toggleUserStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Filter and sort users
  const filteredAndSortedUsers = React.useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = 
          (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
          (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
          (user.pan?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        if (filterStatus === 'all') return matchesSearch;
        return matchesSearch && user.status === filterStatus;
      })
      .sort((a, b) => {
        let valueA, valueB;
        
        switch (sortField) {
          case 'name':
            valueA = a.name || '';
            valueB = b.name || '';
            break;
          case 'balance':
            valueA = parseInt(a.bankBalance) || 0;
            valueB = parseInt(b.bankBalance) || 0;
            break;
          case 'age':
            valueA = parseInt(a.age) || 0;
            valueB = parseInt(b.age) || 0;
            break;
          case 'date':
            valueA = new Date(a.createdAt || 0).getTime();
            valueB = new Date(b.createdAt || 0).getTime();
            break;
          default:
            valueA = a.name || '';
            valueB = b.name || '';
        }
        
        if (sortDirection === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
  }, [users, searchTerm, filterStatus, sortField, sortDirection]);

  // AI analysis of user profile
  const analyzeUserWithAI = async (user) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this bank user's profile and provide insights:
                Name: ${user.name || 'Unknown'}
                Age: ${user.age || 'Unknown'}
                Email: ${user.email || 'Unknown'}
                Phone: ${user.phone || 'Unknown'}
                Status: ${user.status || 'Unknown'}
                Bank Balance: ${user.bankBalance || 0}
                PAN: ${user.pan || 'Unknown'}
                Date of Birth: ${user.dateOfBirth || 'Unknown'}
                Account Created: ${user.createdAt || 'Unknown'}
                Last Login: ${user.rewards?.lastLogin || 'Unknown'}
                
                Provide insights on:
                1. Risk assessment (Low/Medium/High) with explanation
                2. Activity patterns
                3. Spending or saving habits (based on available data)
                4. Recommendations for the bank admin
                5. Any potential flags or concerns
                
                Format the output with clear sections.`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setAiInsights(data.candidates[0].content.parts[0].text);
      } else {
        setAiInsights("Unable to generate insights for this user profile. Please try again later.");
      }
    } catch (error) {
      console.error('Error during AI analysis:', error);
      setAiInsights("Error analyzing user profile. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) 
      ? new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      : 'N/A';
  };

  const formatDateOfBirth = (dob) => {
    if (!dob) return 'N/A';
    const date = new Date(dob);
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }
    return 'N/A';
  };

  const formatPan = (pan) => {
    if (!pan || typeof pan !== 'string') return 'N/A';
    return pan.toUpperCase();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    return phone.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const formatBankBalance = (balance) => {
    const numBalance = parseInt(balance);
    if (!isNaN(numBalance)) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(numBalance);
    }
    return 'N/A';
  };

  const formatAge = (age) => {
    const numAge = parseInt(age);
    if (!isNaN(numAge)) {
      return `${numAge} years`;
    }
    return 'N/A';
  };

  const getStatusColor = (user) => {
    if (user.isAdmin) return 'bg-purple-100 text-purple-700';
    switch(user.status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-amber-100 text-amber-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const UserDetailModal = ({ user, onClose }) => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 10 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-500">{user.email || 'No email available'}</p>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user)}`}>
                    {user.isAdmin ? 'Admin' : (user.status || 'Unknown')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                onClick={() => {
                  setShowUserModal(false);
                  setShowAIInsights(true);
                  if (!aiInsights) {
                    analyzeUserWithAI(user);
                  }
                }}
              >
                <BrainCircuit className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Personal Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Full Name</span>
                      <span className="text-sm font-medium text-gray-800">{user.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Age</span>
                      <span className="text-sm font-medium text-gray-800">{formatAge(user.age)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date of Birth</span>
                      <span className="text-sm font-medium text-gray-800">{formatDateOfBirth(user.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">PAN</span>
                      <span className="text-sm font-medium text-gray-800 font-mono">{formatPan(user.pan)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Contact Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium text-gray-800">{user.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium text-gray-800">{formatPhoneNumber(user.phone)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Account Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Current Balance</span>
                      <span className="text-sm font-bold text-green-600">{formatBankBalance(user.bankBalance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm font-medium ${user.status === 'active' ? 'text-green-600' : user.status === 'blocked' ? 'text-red-600' : 'text-amber-600'}`}>
                        {user.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account Created</span>
                      <span className="text-sm font-medium text-gray-800">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Login</span>
                      <span className="text-sm font-medium text-gray-800">
                        {user.rewards?.lastLogin ? formatDate(user.rewards.lastLogin) : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {!user.isAdmin && (
                      <>
                        {user.status !== 'blocked' ? (
                          <button 
                            onClick={() => {
                              handleStatusToggle(user._id?.$oid || user._id, 'blocked');
                              onClose();
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Block User
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              handleStatusToggle(user._id?.$oid || user._id, 'active');
                              onClose();
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Unblock User
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setShowUserModal(false);
                            setShowAIInsights(true);
                            if (!aiInsights) {
                              analyzeUserWithAI(user);
                            }
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <BrainCircuit className="h-4 w-4" />
                          AI Insights
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Recent Transactions</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-center text-gray-500 text-sm py-6">
                  Transaction history will be displayed here
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
            <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const AIInsightsModal = ({ user, insights, isLoading, onClose }) => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 10 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gradient-to-r from-blue-100 to-white">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-500 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
                <p className="text-sm text-gray-500">Analysis for {user.name || 'Unknown User'}</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
                />
                <p className="text-gray-500">Analyzing user profile with AI...</p>
              </div>
            ) : insights ? (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: insights
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/#{1,6}\s+(.*?)(\n|$)/g, '<h4>$1</h4>')
                }}/>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <p className="text-gray-500">No insights available</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between">
            <button 
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-lg shadow-sm hover:bg-blue-100"
              onClick={() => analyzeUserWithAI(user)}
            >
              Refresh Analysis
            </button>
            <button 
              className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      setIsLoading(true);
      await toggleUserStatus({
        userId,
        status: newStatus
      }).unwrap();
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500">Manage and monitor all bank users</p>
          </div>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add New User
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by name, email or PAN..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'active' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600'}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'inactive' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-600'}`}
              onClick={() => setFilterStatus('inactive')}
            >
              Inactive
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'blocked' ? 'bg-white shadow-sm text-red-600' : 'text-gray-600'}`}
              onClick={() => setFilterStatus('blocked')}
            >
              Blocked
            </button>
          </div>
          <button className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-gray-100">
          <div className="p-4 border-r border-gray-100">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="p-4 border-r border-gray-100">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className="p-4 border-r border-gray-100">
            <p className="text-sm text-gray-500">Inactive Users</p>
            <p className="text-xl font-bold text-amber-600">
              {users.filter(u => u.status === 'inactive').length}
            </p>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500">Blocked Users</p>
            <p className="text-xl font-bold text-red-600">
              {users.filter(u => u.status === 'blocked').length}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    User
                    {sortField === 'name' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium">Contact</th>
                <th className="py-3 px-4 font-medium">PAN</th>
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('age')}>
                  <div className="flex items-center gap-1">
                    Age
                    {sortField === 'age' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('balance')}>
                  <div className="flex items-center gap-1">
                    Balance
                    {sortField === 'balance' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    Last Activity
                    {sortField === 'date' && (
                      <ChevronDown className={`h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedUsers.map((user) => (
                <motion.tr 
                  key={user._id?.$oid || user._id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-600">{formatPhoneNumber(user.phone)}</p>
                    <p className="text-gray-400 text-xs">DOB: {formatDateOfBirth(user.dateOfBirth)}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs">{formatPan(user.pan)}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatAge(user.age)}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatBankBalance(user.bankBalance)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user)}`}>
                      {user.isAdmin ? 'Admin' : (user.status || 'Unknown')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {user.rewards?.lastLogin ? formatDate(user.rewards.lastLogin) : 
                     user.createdAt ? formatDate(user.createdAt) : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          setShowAIInsights(true);
                          analyzeUserWithAI(user);
                        }}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
                        title="AI Insights"
                      >
                        <BrainCircuit className="h-4 w-4" />
                      </motion.button>
                      
                      {!user.isAdmin && (
                        <>
                          {user.status !== 'blocked' ? (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusToggle(user._id?.$oid || user._id, 'blocked');
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                              title="Block User"
                            >
                              <XCircle className="h-4 w-4" />
                            </motion.button>
                          ) : (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusToggle(user._id?.$oid || user._id, 'active');
                              }}
                              className="p-1 text-green-500 hover:bg-green-50 rounded-full"
                              title="Unblock User"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.button>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded-full" 
                            title="View Details"
                          >
                            <FileText className="h-4 w-4" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredAndSortedUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
              >
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No users found matching your filters</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="mt-2 text-blue-500 text-sm hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 py-3 px-4 flex items-center justify-between border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-medium">{filteredAndSortedUsers.length}</span> of <span className="font-medium">{users.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 text-sm">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showUserModal && selectedUser && (
          <UserDetailModal 
            user={selectedUser} 
            onClose={() => setShowUserModal(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAIInsights && selectedUser && (
          <AIInsightsModal 
            user={selectedUser}
            insights={aiInsights}
            isLoading={isAnalyzing}
            onClose={() => setShowAIInsights(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
