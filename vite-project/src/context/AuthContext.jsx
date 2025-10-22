import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import {inventoryAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const [userInitials, setUserInitials] = useState('U');
  useEffect(() => {
    checkAuth();
  }, []);

  // User initials calculate karo
  useEffect(() => {
    if (currentUser) {
      const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
      setUserInitials(initials);
    } else {
      setUserInitials('U');
    }
  }, [currentUser]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      authAPI.getCurrentUser()
        .then(response => {
          setCurrentUser(response.data);
        })
        .catch(error => {
          console.error('Auth check failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      //console.log(userData)
     // axios.defaults.withCredentials=true;

       // const backendUrl=import.meta.env.REACT_APP_API_UR
     //  const {response}=await axios.get(backendUrl +'/auths/register') 

     const response = await authAPI.register(userData);
     console.log("hello")
      const { token, user } = response.data;
      console.log("hello")
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
 const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      const updatedUser = response.data;
      
      setCurrentUser(updatedUser);
      localStorage.setItem('CurrentUser  ', JSON.stringify(updatedUser));
      
      return { success: true, currentUser: updatedUser };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };
  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };


  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
    const skipProfileCompletion = () => {
    // 24 hours ke liye skip karo
    const skippedUntil = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
    localStorage.setItem('profileSkippedUntil', skippedUntil.toString());
  };
    // Check if profile needs completion
 const needsProfileCompletion = () => {
    if (!currentUser) return false;

    // Check if user has skipped in the last 24 hours
    const skippedUntil = localStorage.getItem('profileSkippedUntil');
    if (skippedUntil) {
      const now = new Date().getTime();
      if (now < parseInt(skippedUntil)) {
        // Abhi skip period ke andar hain, toh profile completion mat dikhao
        return false;
      } else {
        // 24 hours complete, toh skip remove karo
        localStorage.removeItem('profileSkippedUntil');
      }
    }
    
    // Check if essential profile data is missing
    const essentialFields = ['phone', 'business_type', 'address'];
    return essentialFields.some(field => !currentUser[field]);
  };

  const getSkipRemainingTime = () => {
    const skippedUntil = localStorage.getItem('profileSkippedUntil');
    if (!skippedUntil) return null;

    const now = new Date().getTime();
    const remaining = parseInt(skippedUntil) - now;
    
    if (remaining <= 0) {
      localStorage.removeItem('profileSkippedUntil');
      return null;
    }

    return remaining;
  };

  //INVENTORY OPERATIONS
  const create=async(productData)=>{
    try {
      const response=await inventoryAPI.create(productData)
    } catch (error) {
       return { 
        success: false, 
        message: error.response?.data?.message || 'add item failed' 
      };
    }
  }

  const delet =async(id)=>{
     try {
      const response=await inventoryAPI.delete(id)
     } catch (error) {
      
     }
  }
   
  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    create,
    delet,
    updateProfile,
    needsProfileCompletion,
    skipProfileCompletion,
    getSkipRemainingTime,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};