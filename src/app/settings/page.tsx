"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [twitchClientId, setTwitchClientId] = useState("");
  const [twitchClientSecret, setTwitchClientSecret] = useState("");
  const [youtubeApiKey, setYoutubeApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [minimumViews, setMinimumViews] = useState("");
  const [minimumDuration, setMinimumDuration] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);

  const handleBackupSettings = () => {
    console.log("Backing up settings...");
  };

  const handleRestoreSettings = () => {
    console.log("Restoring settings...");
  };

  const handleUpdateSettings = () => {
    console.log("Updating settings...", {
      twitchClientId,
      twitchClientSecret,
      youtubeApiKey,
      geminiApiKey,
      minimumViews,
      minimumDuration,
      adminEmail,
      emailNotifications,
      desktopNotifications
    });
  };

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight">Settings</p>
            <p className="text-[#a2abb3] text-sm font-normal leading-normal">Manage your AutoClipster settings</p>
          </div>
        </div>

        {/* API Keys Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">API Keys</h2>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Twitch Client ID</p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={twitchClientId}
              onChange={(e) => setTwitchClientId(e.target.value)}
              placeholder="Enter your Twitch Client ID"
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Twitch Client Secret</p>
            <input
              type="password"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={twitchClientSecret}
              onChange={(e) => setTwitchClientSecret(e.target.value)}
              placeholder="Enter your Twitch Client Secret"
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">YouTube API Key</p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={youtubeApiKey}
              onChange={(e) => setYoutubeApiKey(e.target.value)}
              placeholder="Enter your YouTube API Key"
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Gemini API Key</p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Enter your Gemini API Key"
            />
          </label>
        </div>

        {/* Quality Filters Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Quality Filters</h2>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Minimum Views</p>
            <input
              type="number"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={minimumViews}
              onChange={(e) => setMinimumViews(e.target.value)}
              placeholder="e.g. 1000"
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Minimum Duration (seconds)</p>
            <input
              type="number"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={minimumDuration}
              onChange={(e) => setMinimumDuration(e.target.value)}
              placeholder="e.g. 30"
            />
          </label>
        </div>

        {/* Notifications Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Notifications</h2>
        <div className="px-4">
          <label className="flex gap-x-3 py-3 flex-row">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[#40484f] border-2 bg-transparent text-[#dce8f3] checked:bg-[#dce8f3] checked:border-[#dce8f3] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#40484f] focus:outline-none"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <p className="text-white text-base font-normal leading-normal">Email Notifications</p>
          </label>
          <label className="flex gap-x-3 py-3 flex-row">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-[#40484f] border-2 bg-transparent text-[#dce8f3] checked:bg-[#dce8f3] checked:border-[#dce8f3] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#40484f] focus:outline-none"
              checked={desktopNotifications}
              onChange={(e) => setDesktopNotifications(e.target.checked)}
            />
            <p className="text-white text-base font-normal leading-normal">Desktop Notifications</p>
          </label>
        </div>

        {/* Backup & Restore Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Backup &amp; Restore</h2>
        <div className="flex px-4 py-3 justify-start">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleBackupSettings}
          >
            <span className="truncate">Backup Settings</span>
          </button>
        </div>
        <div className="flex px-4 py-3 justify-start">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#2c3135] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleRestoreSettings}
          >
            <span className="truncate">Restore Settings</span>
          </button>
        </div>

        {/* User Management Section */}
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">User Management</h2>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">Admin Email</p>
            <input
              type="email"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#2c3135] focus:border-none h-14 placeholder:text-[#a2abb3] p-4 text-base font-normal leading-normal"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@autoclipster.com"
            />
          </label>
        </div>
        <div className="flex px-4 py-3 justify-start">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#dce8f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            onClick={handleUpdateSettings}
          >
            <span className="truncate">Update Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
} 