import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState(null);
  const { register, openAuthModal } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await register(form.username, form.password);
      if (res.ok) {
        // open login modal so user can sign in
        openAuthModal('login');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Create an account</h2>
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
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <button type="submit" className="w-full bg-[#02c39a] text-white px-4 py-2 rounded">Register</button>
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account? <button type="button" onClick={() => openAuthModal('login')} className="text-[#016b52] font-semibold">Sign in</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
