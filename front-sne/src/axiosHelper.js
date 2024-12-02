import axios from 'axios';

// Set the base URL for all API requests
axios.defaults.baseURL = 'http://localhost:8080/api';

/**
 * A helper function to make API requests with automatic JWT token inclusion.
 * @param {string} url - The endpoint URL (relative to the base URL).
 * @param {string} [method='GET'] - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - Request body data for POST/PUT requests.
 * @param {Object} [headers={}] - Additional headers to include in the request.
 * @returns {Promise<Object>} - The response data from the API.
 */
const axiosHelper = async (url, method = 'GET', data = null, headers = {}) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

        const config = {
            method,
            url, // This is now relative to the base URL
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in Authorization header
                ...headers, // Merge additional headers if provided
            },
            data, // Attach the request body for POST/PUT methods
        };

        if (headers.responseType) {
            config.responseType = headers.responseType;
        }
        
        const response = await axios(config); // Execute the API request
        return response.data; // Return the response data
    } catch (error) {
        console.error('API request failed:', error.response || error.message);
        throw error; // Rethrow error for the caller to handle
    }
};

export default axiosHelper;
