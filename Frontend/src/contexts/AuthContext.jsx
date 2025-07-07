import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - in a real app, this would come from a backend
  const [mockUsers, setMockUsers] = useState({
    admin: {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrator',
      email: 'admin@example.com'
    },
    user: {
      id: 2,
      username: 'user',
      password: 'user123',
      role: 'user',
      name: 'Regular User',
      email: 'user@example.com'
    }
  });

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      // Mock authentication - in a real app, this would be an API call
      const userKey = role === 'admin' ? 'admin' : 'user';
      const mockUser = mockUsers[userKey];

      // Check if user exists in mockUsers by username and password
      const foundUser = Object.values(mockUsers).find(
        user => user.username === username && user.password === password && user.role === role
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          name: foundUser.name,
          email: foundUser.email
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Check if username already exists
      const existingUser = Object.values(mockUsers).find(
        user => user.username === userData.username
      );

      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      // Check if email already exists
      const existingEmail = Object.values(mockUsers).find(
        user => user.email === userData.email
      );

      if (existingEmail) {
        return { success: false, error: 'Email already exists' };
      }

      // Create new user
      const newUserId = Object.keys(mockUsers).length + 1;
      const newUser = {
        id: newUserId,
        username: userData.username,
        password: userData.password,
        role: userData.role || 'user',
        name: userData.name,
        email: userData.email
      };

      // Add to mockUsers
      const updatedUsers = {
        ...mockUsers,
        [userData.username]: newUser
      };

      setMockUsers(updatedUsers);

      // Auto-login after registration
      const loginData = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email
      };

      setUser(loginData);
      localStorage.setItem('user', JSON.stringify(loginData));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
