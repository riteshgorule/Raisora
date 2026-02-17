import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User as UserIcon, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({ username: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user?.username) setProfileForm({ username: user.username });
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    const res = await updateProfile({ username: profileForm.username });
    setStatus({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    const res = await updateProfile({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
    if (res.ok) setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setStatus({ type: res.ok ? 'success' : 'error', message: res.message });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Update your profile details and security preferences.</p>
        </div>

        {status.message && (
          <div className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-[#02c39a]/10 flex items-center justify-center text-[#02c39a]">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-600">Basic information associated with your account.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  required
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ username: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02c39a] focus:ring-[#02c39a]"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Changes to your username require re-authentication on next login.</span>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-[#02c39a] px-4 py-2 text-white font-semibold hover:bg-[#02987b] transition-colors"
              >
                Save Profile
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-[#f0f3bd]/60 flex items-center justify-center text-[#7a7a1e]">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                <p className="text-sm text-gray-600">Keep your account protected with a strong password.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02c39a] focus:ring-[#02c39a]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02c39a] focus:ring-[#02c39a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#02c39a] focus:ring-[#02c39a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
