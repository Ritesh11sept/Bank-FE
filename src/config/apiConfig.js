/**
 * API Configuration file to manage endpoints based on environment
 */

// Determine the current environment
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');

// Set the base API URL based on the environment
export const API_BASE_URL = isProduction
  ? 'https://financeseerbe.vercel.app'
  : 'http://localhost:9000'; // Use your local development port

console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);
console.log(`API URL: ${API_BASE_URL}`);

// Export other API related configuration if needed
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  credentials: 'include',
};
