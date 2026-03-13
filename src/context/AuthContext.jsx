import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('learnify_user');
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
      fetchEnrollments(u.id);
    }
    setLoading(false);
  }, []);

  const fetchEnrollments = async (userId) => {
    try {
      const res = await axios.get(`/api/enrollments?userId=${userId}`);
      setEnrollments(res.data);
    } catch (e) { console.error(e); }
  };

  const login = async (email, password) => {
    const res = await axios.get(`/api/users?email=${email}&password=${password}`);
    if (!res.data.length) throw new Error('Invalid email or password.');
    const u = res.data[0];
    setUser(u);
    localStorage.setItem('learnify_user', JSON.stringify(u));
    await fetchEnrollments(u.id);
    return u;
  };

  const register = async (name, email, password) => {
    const check = await axios.get(`/api/users?email=${email}`);
    if (check.data.length) throw new Error('An account with this email already exists.');
    const newUser = { name, email, password, enrolledCourses: [], avatar: `https://i.pravatar.cc/150?u=${email}` };
    const res = await axios.post('/api/users', newUser);
    setUser(res.data);
    localStorage.setItem('learnify_user', JSON.stringify(res.data));
    setEnrollments([]);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setEnrollments([]);
    localStorage.removeItem('learnify_user');
  };

  const enroll = async (courseId) => {
    if (!user) throw new Error('Login required');
    const existing = enrollments.find(e => e.courseId === courseId);
    if (existing) return existing;
    const rec = { userId: user.id, courseId, enrolledAt: new Date().toISOString(), progress: 0 };
    const res = await axios.post('/api/enrollments', rec);
    setEnrollments(prev => [...prev, res.data]);
    return res.data;
  };

  const isEnrolled = (courseId) => enrollments.some(e => e.courseId === courseId);

  return (
    <AuthContext.Provider value={{ user, enrollments, loading, login, register, logout, enroll, isEnrolled, fetchEnrollments }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
};
