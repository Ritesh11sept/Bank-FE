/**
 * Utility to check API connectivity
 */
import axios from './axios';

export const checkApiConnection = async () => {
  try {
    // Try to connect to the health endpoint
    const response = await axios.get('/health');
    console.log('API connection check:', response.data);
    return {
      connected: true,
      message: 'Connected to API successfully',
      details: response.data
    };
  } catch (error) {
    console.error('API connection check failed:', error);
    let message = 'Failed to connect to API';
    
    if (error.code === 'ERR_NETWORK') {
      message = 'Network error connecting to API. Verify the backend server is running.';
    } else if (error.response) {
      message = `API responded with status ${error.response.status}`;
    }
    
    return {
      connected: false,
      message,
      error
    };
  }
};

// You can call this from your app initialization
// or add a small widget to display connection status
