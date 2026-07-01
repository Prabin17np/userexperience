'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

export default function AccountSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name, email });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-[#111111] mb-6">Account Settings</h2>

      {/* Profile form */}
      <form
        onSubmit={handleProfileSubmit}
        className="border border-[#e5e5e5] rounded-md p-6 space-y-4 mb-8 max-w-md"
      >
        <h3 className="text-sm font-semibold text-[#111111]">Profile</h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#777777]">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-[#ddd] rounded-md px-3 py-2 text-sm outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#777777]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#ddd] rounded-md px-3 py-2 text-sm outline-none focus:border-[#111111]"
          />
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="bg-[#111111] text-white text-sm font-medium px-5 py-2.5 rounded-md disabled:opacity-60"
        >
          {savingProfile ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {/* Password form */}
      <form
        onSubmit={handlePasswordSubmit}
        className="border border-[#e5e5e5] rounded-md p-6 space-y-4 max-w-md"
      >
        <h3 className="text-sm font-semibold text-[#111111]">Change Password</h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#777777]">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border border-[#ddd] rounded-md px-3 py-2 text-sm outline-none focus:border-[#111111]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#777777]">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-[#ddd] rounded-md px-3 py-2 text-sm outline-none focus:border-[#111111]"
          />
        </div>

        <button
          type="submit"
          disabled={savingPassword || !currentPassword || !newPassword}
          className="bg-[#111111] text-white text-sm font-medium px-5 py-2.5 rounded-md disabled:opacity-60"
        >
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}