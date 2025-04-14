import { useState } from 'react';
import { FaPaperPlane, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const TicketForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'account',
    priority: 'medium',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get user ID from localStorage (adjust according to your auth implementation)
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      // For development/demo purposes - use a temporary ID if not found
      // In production, you should redirect to login instead
      const effectiveUserId = userId || 'temp_user_id';
      const effectiveToken = token || 'temp_token';
      
      console.log('Submitting ticket with user ID:', effectiveUserId);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:9000'}/tickets`, 
        {
          ...formData,
          userId: effectiveUserId
        }, 
        {
          headers: {
            Authorization: `Bearer ${effectiveToken}`
          }
        }
      );
      
      setSuccessMsg('Ticket submitted successfully!');
      setFormData({
        subject: '',
        category: 'account',
        priority: 'medium',
        description: '',
      });
      
      // Navigate to tickets list after a delay
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess();
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting ticket:', err);
      
      // More descriptive error messages
      if (err.message === 'User not authenticated') {
        setError('You need to be logged in to submit a ticket. Please log in and try again.');
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit ticket. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">Create a New Support Ticket</h3>
      
      {successMsg && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center">
          <div className="mr-3 flex-shrink-0 text-green-500">✓</div>
          <p>{successMsg}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center">
          <FaExclamationCircle className="mr-3 flex-shrink-0 text-red-500" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Development mode notice */}
      {!localStorage.getItem('userId') && (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-xl flex items-center">
          <FaExclamationCircle className="mr-3 flex-shrink-0 text-yellow-500" />
          <div>
            <p className="font-medium">Development Mode</p>
            <p className="text-sm">You are not logged in. In development mode, a temporary user ID will be used.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Brief description of your issue"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="account">Account</option>
              <option value="payments">Payments</option>
              <option value="savings">Savings</option>
              <option value="investments">Investments</option>
              <option value="technical">Technical Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Please provide as much detail as possible about your issue"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              <FaPaperPlane className="w-4 h-4" />
              Submit Ticket
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
