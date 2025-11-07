/**
 * Authentication API Client
 * 
 * Centralized API functions for authentication
 */

export interface LoginInput {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

/**
 * Login to admin panel
 */
export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
}

/**
 * Logout from admin panel
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  
  return response.json();
}

