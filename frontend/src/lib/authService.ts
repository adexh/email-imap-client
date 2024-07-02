import axios from 'axios';

// Function to refresh the auth token
export async function refreshAuthToken(): Promise<string> {
  try {
    const response = await axios.post('https://api.example.com/auth/refresh', {}, { withCredentials: true });
    const newAuthToken = response.data.token;
    return newAuthToken;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
}