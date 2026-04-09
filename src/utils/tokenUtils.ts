// Utility to check if JWT token is expired
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    // JWT tokens have 3 parts separated by dots
    const payload = token.split('.')[1];
    if (!payload) return true;

    // Decode the payload
    const decodedPayload = JSON.parse(atob(payload));

    // Check if token has expired
    const currentTime = Date.now() / 1000;
    return decodedPayload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it expired
    console.warn('Failed to decode token:', error);
    return true;
  }
};

// Check token on app startup
export const validateStoredToken = () => {
  const token = localStorage.getItem('token');
  return !isTokenExpired(token);
};