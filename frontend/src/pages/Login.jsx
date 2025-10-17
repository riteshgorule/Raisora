import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { login, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(form.username, form.password);
    if (res.ok) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Sign in to your account</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input name="username" value={form.username} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <button type="submit" className="w-full bg-[#02c39a] text-white px-4 py-2 rounded">Sign in</button>
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Don't have an account? <button type="button" onClick={() => openAuthModal('register')} className="text-[#016b52] font-semibold">Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
