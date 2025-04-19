import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TicketCheck, MessageSquare, Clock, Filter, Search, 
  Shield, CheckCircle, XCircle, RefreshCw, User, Mail, 
  Send, Calendar, AlertTriangle, ChevronDown, BarChart2, Zap
} from 'lucide-react';

const TicketManagement = ({ tickets, updateTicketStatus, replyToTicket, isLoading }) => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);

  const filteredTickets = tickets?.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = !searchTerm || 
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id?.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const ticketStats = {
    total: tickets?.length || 0,
    new: tickets?.filter(t => t.status === 'new')?.length || 0,
    open: tickets?.filter(t => t.status === 'open')?.length || 0,
    inProgress: tickets?.filter(t => t.status === 'in_progress')?.length || 0,
    resolved: tickets?.filter(t => t.status === 'resolved')?.length || 0,
    closed: tickets?.filter(t => t.status === 'closed')?.length || 0,
    urgent: tickets?.filter(t => t.priority === 'urgent')?.length || 0,
    avgResponseTime: '2.4 hours'
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    
    try {
      setIsSubmitting(true);
      await replyToTicket({
        ticketId: selectedTicket.id || selectedTicket._id,
        message: replyText
      }).unwrap();
      
      setReplyText('');
    } catch (error) {
      console.error("Failed to reply to ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus({
        ticketId,
        status: newStatus
      }).unwrap();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  const formatTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getSuggestedResponses = (ticket) => {
    if (!ticket) return [];
    
    const basicResponses = [
      "Thank you for reaching out. We're looking into this issue and will get back to you shortly.",
      "I understand your concern. Let me help you resolve this issue as quickly as possible.",
      "We apologize for the inconvenience. Your issue has been escalated to our technical team."
    ];
    
    if (ticket.category === 'technical') {
      return [
        ...basicResponses,
        "Could you please provide more details about the technical issue you're experiencing?",
        "Have you tried clearing your browser cache and cookies?",
        "We've identified the technical issue and are working on a fix. We'll update you once resolved."
      ];
    }
    
    if (ticket.category === 'billing') {
      return [
        ...basicResponses,
        "I've reviewed your account and can confirm the billing issue will be resolved within 24 hours.",
        "Your account has been credited. The adjustment will appear on your next statement.",
        "We'll need to verify some account details to resolve this billing concern. Could you provide..."
      ];
    }
    
    return basicResponses;
  };

  const formatUserValue = (value) => {
    if (value && typeof value === 'object') {
      if (value.name) return value.name;
      if (value.email) return value.email;
      return JSON.stringify(value).substring(0, 50);
    }
    if (value === null || value === undefined) return 'N/A';
    return String(value);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
            <TicketCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Support Tickets</h1>
            <p className="text-sm text-gray-500">Manage and respond to customer inquiries</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium shadow-sm hover:bg-purple-100 flex items-center gap-2"
          >
            <BarChart2 className="h-4 w-4" />
            {showStats ? 'Hide Stats' : 'View Stats'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-purple-700 flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Create Ticket
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Ticket Analytics</h3>
                <button 
                  onClick={() => setShowStats(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Total Tickets</p>
                  <p className="text-2xl font-bold text-gray-800">{ticketStats.total}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Open Issues</p>
                  <p className="text-2xl font-bold text-purple-600">{ticketStats.open + ticketStats.new}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Urgent Tickets</p>
                  <p className="text-2xl font-bold text-red-600">{ticketStats.urgent}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Avg. Response Time</p>
                  <p className="text-2xl font-bold text-green-600">{ticketStats.avgResponseTime}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Status Distribution</h4>
                <div className="w-full h-8 rounded-full bg-gray-100 overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: `${(ticketStats.new / ticketStats.total) * 100}%` }} title={`New: ${ticketStats.new}`}></div>
                  <div className="h-full bg-purple-500" style={{ width: `${(ticketStats.open / ticketStats.total) * 100}%` }} title={`Open: ${ticketStats.open}`}></div>
                  <div className="h-full bg-amber-500" style={{ width: `${(ticketStats.inProgress / ticketStats.total) * 100}%` }} title={`In Progress: ${ticketStats.inProgress}`}></div>
                  <div className="h-full bg-green-500" style={{ width: `${(ticketStats.resolved / ticketStats.total) * 100}%` }} title={`Resolved: ${ticketStats.resolved}`}></div>
                  <div className="h-full bg-gray-500" style={{ width: `${(ticketStats.closed / ticketStats.total) * 100}%` }} title={`Closed: ${ticketStats.closed}`}></div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>New ({ticketStats.new})</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                    <span>Open ({ticketStats.open})</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span>In Progress ({ticketStats.inProgress})</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Resolved ({ticketStats.resolved})</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                    <span>Closed ({ticketStats.closed})</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg text-xs">
              <button 
                className={`px-3 py-1 rounded-md ${filterStatus === 'all' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${filterStatus === 'new' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setFilterStatus('new')}
              >
                New
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${filterStatus === 'open' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setFilterStatus('open')}
              >
                Open
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${filterStatus === 'resolved' ? 'bg-white shadow-sm text-green-600' : 'text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setFilterStatus('resolved')}
              >
                Resolved
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full"
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {filteredTickets && filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <motion.button 
                      key={ticket.id}
                      className={`block w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedTicket?.id === ticket.id ? 'bg-purple-50 border-l-4 border-purple-500' : 'border-l-4 border-transparent'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                      whileHover={{ backgroundColor: selectedTicket?.id === ticket.id ? 'rgba(233, 213, 255, 0.5)' : 'rgba(249, 250, 251, 0.8)' }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-800 line-clamp-1">{ticket.subject}</h4>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium
                            ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' : ''}
                            ${ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                            ${ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${ticket.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                          `}>
                            {ticket.priority}
                          </span>
                          <span className="text-xs text-gray-400">{formatTimeSince(ticket.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 line-clamp-1 flex-1">{ticket.description}</p>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium
                          ${ticket.status === 'new' ? 'bg-blue-100 text-blue-700' : ''}
                          ${ticket.status === 'open' ? 'bg-purple-100 text-purple-700' : ''}
                          ${ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : ''}
                          ${ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : ''}
                          ${ticket.status === 'closed' ? 'bg-gray-100 text-gray-700' : ''}
                        `}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.userName || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.messages?.length || 0}
                        </span>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <TicketCheck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No tickets found</p>
                    {(searchTerm || filterStatus !== 'all') && (
                      <button 
                        className="mt-2 text-purple-500 hover:underline text-sm"
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStatus('all');
                        }}
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-gray-800">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2">
                    <select
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`text-xs px-2 py-1 rounded-full font-medium
                        ${selectedTicket.priority === 'urgent' ? 'bg-red-100 text-red-700' : ''}
                        ${selectedTicket.priority === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                        ${selectedTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${selectedTicket.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                      `}>
                        Priority: {selectedTicket.priority}
                      </div>
                      <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        Category: {selectedTicket.category}
                      </div>
                      <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                        ID: {selectedTicket.id}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                    </div>
                    {selectedTicket.updatedAt !== selectedTicket.createdAt && (
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-700">Customer Information</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Name:</span> 
                        <span className="ml-2 text-gray-800">{formatUserValue(selectedTicket.userName)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Email:</span> 
                        <span className="ml-2 text-gray-800">{formatUserValue(selectedTicket.userEmail)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">User ID:</span> 
                        <span className="ml-2 text-gray-800">{formatUserValue(selectedTicket.userId)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{selectedTicket.description}</p>
                </div>
              </div>
              
              
              
              <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                <div className="mb-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase">Quick Responses</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getSuggestedResponses(selectedTicket).map((response, idx) => (
                      <button 
                        key={idx}
                        className="inline-flex py-1 px-3 bg-white border border-gray-200 rounded-full text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        onClick={() => setReplyText(response)}
                      >
                        {response.substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] resize-none"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <div className="absolute bottom-2 right-2 flex gap-1 text-gray-400">
                      <button className="p-1 hover:text-gray-600 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-sm flex items-center gap-2"
                    onClick={handleReply}
                    disabled={isSubmitting || !replyText.trim()}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <TicketCheck className="h-16 w-16 text-purple-200 mb-4" />
                <p className="text-xl font-medium text-gray-600 mb-2 text-center">No Ticket Selected</p>
                <p className="text-sm max-w-sm text-center">
                  Select a ticket from the list to view details and respond to customer inquiries.
                </p>
                
                <div className="mt-8 flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Quick Stats</p>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">{ticketStats.open + ticketStats.new}</p>
                      <p className="text-xs text-gray-500">Open Tickets</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{ticketStats.resolved}</p>
                      <p className="text-xs text-gray-500">Resolved</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TicketManagement;
