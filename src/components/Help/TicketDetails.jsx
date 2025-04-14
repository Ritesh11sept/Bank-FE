import { useState, useEffect } from 'react';
import { FaArrowLeft, FaReply, FaPaperPlane, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const TicketDetails = ({ ticket, onBack }) => {
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(!localStorage.getItem('userId'));

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    inProgress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };
  
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        // Handle demo mode
        if (isDemoMode) {
          // Mock messages for demo tickets
          if (ticket._id === 'mock_ticket_1') {
            setMessages([
              {
                _id: 'mock_message_1',
                content: "Hi, I cannot access my account. It says my password is incorrect even though I'm sure it's right.",
                isAdmin: false,
                createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
              },
              {
                _id: 'mock_message_2',
                content: "Hello, thanks for contacting support. I'll help you recover your account access. Have you tried the password reset option?",
                isAdmin: true,
                createdAt: new Date(Date.now() - 82800000).toISOString() // 23 hours ago
              }
            ]);
          } else if (ticket._id === 'mock_ticket_2') {
            setMessages([
              {
                _id: 'mock_message_1',
                content: "My payment to vendor XYZ failed but the money was deducted from my account. Please help!",
                isAdmin: false,
                createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
              },
              {
                _id: 'mock_message_2',
                content: "I can confirm that we're looking into this issue. Your reference number is PAY-20230615. We'll update you shortly.",
                isAdmin: true,
                createdAt: new Date(Date.now() - 72000000).toISOString() // 20 hours ago
              },
              {
                _id: 'mock_message_3',
                content: "Any updates on this? It's quite urgent as I need to make the payment today.",
                isAdmin: false,
                createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
              }
            ]);
          }
          setLoading(false);
          return;
        }

        // Real API call
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:9000'}/tickets/${ticket._id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token || 'temp_token'}`
            }
          }
        );
        
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load ticket details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticket._id, isDemoMode]);

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    setSending(true);
    setError('');
    
    try {
      // Handle demo mode
      if (isDemoMode) {
        // Add mock reply
        const newMessage = {
          _id: `mock_message_${Date.now()}`,
          content: replyText,
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        
        setMessages([...messages, newMessage]);
        setReplyText('');
        
        // Add mock admin response after a delay in demo mode
        setTimeout(() => {
          const adminResponse = {
            _id: `mock_message_${Date.now() + 1}`,
            content: "This is an automated response in demo mode. In a real environment, admins would respond to your messages.",
            isAdmin: true,
            createdAt: new Date().toISOString()
          };
          setMessages(prev => [...prev, adminResponse]);
        }, 3000);
        
        setSending(false);
        return;
      }
      
      // Real API call
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:9000'}/tickets/${ticket._id}/messages`,
        {
          content: replyText,
          userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Add the new message to the list
      setMessages([...messages, response.data]);
      setReplyText('');
      
    } catch (err) {
      console.error('Error sending reply:', err);
      if (err.message === 'User not authenticated') {
        setError('You need to be logged in to send a reply. Please log in and try again.');
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Failed to send your reply. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Tickets
      </button>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center">
          <FaExclamationCircle className="mr-3 flex-shrink-0 text-red-500" />
          <p>{error}</p>
        </div>
      )}
      
      {isDemoMode && (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-xl flex items-center">
          <FaExclamationCircle className="mr-3 flex-shrink-0 text-yellow-500" />
          <div>
            <p className="font-medium">Development Mode</p>
            <p className="text-sm">This is a demo ticket. Replies will be simulated and not saved to a server.</p>
          </div>
        </div>
      )}
      
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-gray-50 p-5 border-b border-gray-200">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-medium text-gray-800">{currentTicket.subject}</h3>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[currentTicket.status]}`}>
              {currentTicket.status.charAt(0).toUpperCase() + currentTicket.status.slice(1)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[currentTicket.priority]}`}>
              {currentTicket.priority.charAt(0).toUpperCase() + currentTicket.priority.slice(1)}
            </div>
            <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
              {currentTicket.category.charAt(0).toUpperCase() + currentTicket.category.slice(1)}
            </div>
            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Created: {new Date(currentTicket.createdAt).toLocaleString()}
            </div>
          </div>
          
          <p className="text-gray-700">{currentTicket.description}</p>
        </div>
        
        <div className="p-5">
          <h4 className="font-medium text-gray-800 mb-4">Conversation</h4>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Start the conversation by sending a reply.
            </div>
          ) : (
            <div className="space-y-5 mb-6">
              {messages.map((message) => (
                <div 
                  key={message._id}
                  className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] rounded-xl p-4 ${
                    message.isAdmin 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-emerald-50 text-gray-800'
                  }`}>
                    <div className="text-sm mb-1">
                      <span className="font-medium">
                        {message.isAdmin ? 'Support Agent' : 'You'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Reply form */}
          {currentTicket.status !== 'closed' && (
            <form onSubmit={handleReply} className="mt-6">
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className={`px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 self-end ${
                    sending || !replyText.trim() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {sending ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaPaperPlane className="w-4 h-4" />
                  )}
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          )}
          
          {currentTicket.status === 'closed' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center text-gray-600">
              This ticket is closed. If you need further assistance, please create a new ticket.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
