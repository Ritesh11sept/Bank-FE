import { useState, useEffect } from 'react';
import { FaTicketAlt, FaExclamationCircle, FaSpinner, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const UserTickets = ({ onSelectTicket }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchTickets = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        const effectiveUserId = userId || 'temp_user_id';
        const effectiveToken = token || 'temp_token';
        
        console.log('Fetching tickets for user ID:', effectiveUserId);
        
        if (isDemoMode) {
          setTickets([
            {
              _id: 'mock_ticket_1',
              subject: 'Demo Ticket - Account Access',
              description: 'This is a mock ticket for demonstration purposes. In a real environment, tickets would be fetched from the server.',
              status: 'new',
              priority: 'medium',
              category: 'account',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: 'mock_ticket_2',
              subject: 'Demo Ticket - Payment Issue',
              description: 'This is another mock ticket showing a different status and priority. No actual server requests are made in demo mode.',
              status: 'inProgress',
              priority: 'high',
              category: 'payments',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 43200000).toISOString()
            }
          ]);
          setLoading(false);
          return;
        }
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:9000'}/tickets/user/${effectiveUserId}`,
          {
            headers: {
              Authorization: `Bearer ${effectiveToken}`
            }
          }
        );
        
        setTickets(response.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load tickets. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FaExclamationCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (isDemoMode && tickets.length > 0) {
    return (
      <div>
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-xl flex items-center">
          <FaExclamationCircle className="mr-3 flex-shrink-0 text-yellow-500" />
          <div>
            <p className="font-medium">Development Mode</p>
            <p className="text-sm">Showing mock ticket data. In production, real tickets would be displayed here.</p>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Support Tickets (Demo)</h3>
        
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket._id}
              className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-800">{ticket.subject}</h4>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FaTicketAlt className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">No tickets found</h3>
        <p className="text-gray-600 mb-6">You haven't created any support tickets yet.</p>
        <button 
          onClick={() => onSelectTicket(null)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Create Your First Ticket
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Your Support Tickets</h3>
      
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div 
            key={ticket._id}
            className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectTicket(ticket)}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-800">{ticket.subject}</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </div>
                <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTickets;
