// lib/auth.ts
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export async function getAuthStatus() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token')?.value;
  
  if (!authToken) {
    return { isAuthenticated: false, user: null };
  }
  
  try {
    const decoded = jwtDecode(authToken);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (decoded.exp && decoded.exp > currentTime) {
      return {
        isAuthenticated: true,
        user: {
          id: decoded.sub || decoded.user_id,
          email: decoded.email,
          user_id: decoded.user_id
        }
      };
    }
  } catch (error) {
    console.error('Token verification failed', error);
  }
  
  return { isAuthenticated: false, user: null };
}
