"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAutomation } from '../../hooks/useAutomation';
import { WorkflowRequest } from '../../types';

export default function WorkflowsPage() {
  const { 
    status, 
    loading, 
    error, 
    executeWorkflow, 
    retryFailed, 
    testAutomation,
    startPolling, 
    stopPolling, 
    isPolling 
  } = useAutomation();
  
  const [formData, setFormData] = useState<WorkflowRequest>({
    channelName: '',
    clipLimit: 10,
    daysBack: 7
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false); // Desativado por padrão
  const [activeTab, setActiveTab] = useState('execute');
  const [scheduledWorkflows] = useState([
    {
      id: 1,
      name: 'Daily Highlights',
      channel: 'gaules',
      schedule: 'Daily at 18:00',
      status: 'active',
      nextRun: '2024-01-15 18:00'
    },
    {
      id: 2,
      name: 'Weekend Compilation',
      channel: 'loud_coringa',
      schedule: 'Weekly on Sundays',
      status: 'paused',
      nextRun: '2024-01-21 10:00'
    }
  ]);

  // Não iniciar polling automaticamente
  useEffect(() => {
    if (isAutomationEnabled) {
      startPolling();
    } else {
      stopPolling();
    }
    
    return () => stopPolling();
  }, [isAutomationEnabled, startPolling, stopPolling]);

  const handleExecuteWorkflow = async () => {
    if (!formData.channelName.trim()) {
      setActionError('Channel name is required');
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      setSuccessMessage(null);
      
      const result = await executeWorkflow(formData);
      
      if (result) {
        setSuccessMessage(`Workflow started successfully for channel: ${formData.channelName}`);
        // Reset form
        setFormData({
          channelName: '',
          clipLimit: 10,
          daysBack: 7
        });
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to execute workflow');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetryFailed = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      await retryFailed();
      setSuccessMessage('Retry initiated for failed workflows');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to retry workflows');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTestAutomation = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      
      await testAutomation();
      setSuccessMessage('Automation test completed successfully');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Automation test failed');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleAutomation = () => {
    setIsAutomationEnabled(!isAutomationEnabled);
    if (!isAutomationEnabled) {
      setSuccessMessage('Automation enabled successfully');
    } else {
      setSuccessMessage('Automation disabled successfully');
    }
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const workflowTemplates = [
    {
      name: 'Gaming Highlights',
      description: 'Best gaming moments from popular streamers',
      config: { channelName: 'gaules', clipLimit: 10, daysBack: 7 },
      category: 'Gaming'
    },
    {
      name: 'Daily Compilation',
      description: 'Quick daily highlights for consistent content',
      config: { channelName: '', clipLimit: 5, daysBack: 1 },
      category: 'Daily'
    },
    {
      name: 'Weekly Best',
      description: 'Top clips from the entire week',
      config: { channelName: '', clipLimit: 20, daysBack: 7 },
      category: 'Weekly'
    },
    {
      name: 'Viral Moments',
      description: 'High-engagement clips with viral potential',
      config: { channelName: '', clipLimit: 15, daysBack: 3 },
      category: 'Viral'
    }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#121416] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar */}
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#121416] p-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 p-3">
                  <div className="text-white flex size-6 shrink-0 items-center">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_6_543)">
                        <path
                          d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                          fill="currentColor"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6_543">
                          <rect width="48" height="48" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">AutoClipster</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="SquaresFour" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48ZM104,136H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Dashboard</p>
                  </Link>
                  <Link href="/channels" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="ChatsCircle" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M231.79,187.33A80,80,0,0,0,169.6,72.72L151.36,131.4A40,40,0,1,1,124.6,104.64l58.68-18.24A80,80,0,0,0,68.67,152.21L20.5,199.83a12,12,0,0,0,17,17l47.62-47.62A80,80,0,0,0,231.79,187.33ZM80,152a40,40,0,1,1,40,40A40,40,0,0,1,80,152Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Channels</p>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2c3135]">
                    <div className="text-white" data-icon="Gear" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25a8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.12-3.12L186,40.44a8,8,0,0,0-3.93-6,107.29,107.29,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.49A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.56-3.12,3.12L40.44,70a8,8,0,0,0-6,3.93,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.49,7.06,107.6,107.6,0,0,0,10.87,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.56,1.56,3.12,3.12L70,215.56a8,8,0,0,0,3.93,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.49,107.29,107.29,0,0,0,26.25-10.87,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.56,3.12-3.12L215.56,186a8,8,0,0,0,6-3.93,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,192a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,192Z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium leading-normal">Workflows</p>
                  </div>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="GearSix" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.91,25a8,8,0,0,0-6.46-.59A111.91,111.91,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.08L51.78,84.84,21.95,101.81a8,8,0,0,0-3.89,5.4,112.1,112.1,0,0,0,0,41.58,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.09,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.56-.42,111.91,111.91,0,0,0,36.72-20.67,8,8,0,0,0,2.83-6.08l.12-33.62,29.83-17a8,8,0,0,0,3.89-5.4A112.1,112.1,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Settings</p>
                  </Link>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#a2abb3]" data-icon="Question" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                      </svg>
                    </div>
                    <p className="text-[#a2abb3] text-sm font-medium leading-normal">Help</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCxqDYy6GKAUSeccG0FfR8nuNmi4V1Jixy4GQgQJqqx0mdOfspbB5FOrKkNdhuXpSCa94-3gAwrcMl_zMyRp5HYxc_AuwgW8oouLMBFUHXX8BzXJ0P77w3F5Y-A6HZ19C-WFoQdOcVoqvvccGzhv3STn_sQqEBY0NNK0u58o9x51BM_86ifbsvRhFkLSV-WDnIdXO6oPU55KmZvYYhewCQEcCt8qkv99uxBdADP7npsIm0ub72AEplAxTLgNwb_oWEnWu5Xs9AUn_op")'}} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              {/* Header */}
              <div className="flex min-w-72 flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-white text-2xl font-bold leading-tight">Workflows</h1>
                  <p className="text-[#a2abb3] text-base font-normal leading-normal">
                    Automate clip processing and content creation
                  </p>
                </div>

                {/* Automation Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#1c1f22] rounded-xl">
                  <div className="flex flex-col">
                    <h3 className="text-white text-sm font-medium">Automation Status</h3>
                    <p className="text-[#a2abb3] text-xs">
                      {isAutomationEnabled ? 'Automation is currently active' : 'Automation is currently disabled'}
                    </p>
                  </div>
                  <button
                    onClick={toggleAutomation}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAutomationEnabled ? 'bg-[#2884e6]' : 'bg-[#3c4045]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAutomationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4">
                    <div className="text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM116,96v64a12,12,0,0,0,24,0V96a12,12,0,0,0-24,0Z"/>
                      </svg>
                    </div>
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                )}

                {actionError && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-900/20 border border-red-600/30 p-4">
                    <div className="text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM116,96v64a12,12,0,0,0,24,0V96a12,12,0,0,0-24,0Z"/>
                      </svg>
                    </div>
                    <span className="text-red-300 text-sm">{actionError}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-3 rounded-xl bg-green-900/20 border border-green-600/30 p-4">
                    <div className="text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"/>
                      </svg>
                    </div>
                    <span className="text-green-300 text-sm">{successMessage}</span>
                  </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-[#1c1f22] p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('execute')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'execute' 
                        ? 'bg-[#2884e6] text-white' 
                        : 'text-[#a2abb3] hover:text-white'
                    }`}
                  >
                    Execute
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'templates' 
                        ? 'bg-[#2884e6] text-white' 
                        : 'text-[#a2abb3] hover:text-white'
                    }`}
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveTab('scheduled')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'scheduled' 
                        ? 'bg-[#2884e6] text-white' 
                        : 'text-[#a2abb3] hover:text-white'
                    }`}
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => setActiveTab('status')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'status' 
                        ? 'bg-[#2884e6] text-white' 
                        : 'text-[#a2abb3] hover:text-white'
                    }`}
                  >
                    Status
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'execute' && (
                  <div className="flex flex-col gap-4">
                    {/* Execute Workflow Form */}
                    <div className="flex flex-col gap-3 rounded-xl bg-[#1c1f22] p-4">
                      <h3 className="text-white text-lg font-bold leading-tight">Execute New Workflow</h3>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-white text-sm font-medium">Channel Name</label>
                          <input
                            type="text"
                            value={formData.channelName}
                            onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                            placeholder="Enter Twitch channel name (e.g., gaules)"
                            disabled={!isAutomationEnabled}
                            className="w-full px-3 py-2 bg-[#2c3135] text-white rounded-lg border border-[#3c4045] focus:border-[#7047eb] focus:outline-none disabled:opacity-50"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium">Clip Limit</label>
                            <input
                              type="number"
                              value={formData.clipLimit}
                              onChange={(e) => setFormData({ ...formData, clipLimit: parseInt(e.target.value) || 10 })}
                              min="1"
                              max="100"
                              disabled={!isAutomationEnabled}
                              className="w-full px-3 py-2 bg-[#2c3135] text-white rounded-lg border border-[#3c4045] focus:border-[#7047eb] focus:outline-none disabled:opacity-50"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium">Days Back</label>
                            <input
                              type="number"
                              value={formData.daysBack}
                              onChange={(e) => setFormData({ ...formData, daysBack: parseInt(e.target.value) || 7 })}
                              min="1"
                              max="30"
                              disabled={!isAutomationEnabled}
                              className="w-full px-3 py-2 bg-[#2c3135] text-white rounded-lg border border-[#3c4045] focus:border-[#7047eb] focus:outline-none disabled:opacity-50"
                            />
                          </div>
                        </div>
                        
                        <button
                          onClick={handleExecuteWorkflow}
                          disabled={!isAutomationEnabled || actionLoading || !formData.channelName.trim()}
                          className="w-full px-4 py-2 bg-[#2884e6] text-white rounded-lg font-medium hover:bg-[#1e73cc] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? 'Executing...' : 'Execute Workflow'}
                        </button>

                        {!isAutomationEnabled && (
                          <p className="text-[#a2abb3] text-xs text-center">
                            Enable automation above to execute workflows
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-3 rounded-xl bg-[#1c1f22] p-4">
                      <h3 className="text-white text-lg font-bold leading-tight">Quick Actions</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleRetryFailed}
                          disabled={!isAutomationEnabled || actionLoading}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? 'Retrying...' : 'Retry Failed'}
                        </button>
                        
                        <button
                          onClick={handleTestAutomation}
                          disabled={!isAutomationEnabled || actionLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? 'Testing...' : 'Test Automation'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'templates' && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl bg-[#1c1f22] p-4">
                      <h3 className="text-white text-lg font-bold leading-tight mb-4">Workflow Templates</h3>
                      
                      <div className="grid gap-3">
                        {workflowTemplates.map((template, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-[#2c3135] rounded-lg hover:bg-[#3c4045] transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white text-sm font-medium">{template.name}</h4>
                                <span className="text-xs px-2 py-1 bg-[#7c3aed] text-white rounded-full">
                                  {template.category}
                                </span>
                              </div>
                              <p className="text-[#a2abb3] text-xs">{template.description}</p>
                              <p className="text-[#a2abb3] text-xs mt-1">
                                {template.config.clipLimit} clips • {template.config.daysBack} days
                              </p>
                            </div>
                            <button
                              onClick={() => setFormData({ ...template.config, channelName: template.config.channelName || formData.channelName })}
                              disabled={!isAutomationEnabled}
                              className="ml-3 px-3 py-1 bg-[#2884e6] text-white text-xs rounded hover:bg-[#1e73cc] disabled:opacity-50"
                            >
                              Use
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'scheduled' && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl bg-[#1c1f22] p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-lg font-bold leading-tight">Scheduled Workflows</h3>
                        <button 
                          disabled={!isAutomationEnabled}
                          className="px-3 py-1 bg-[#2884e6] text-white text-sm rounded hover:bg-[#1e73cc] disabled:opacity-50"
                        >
                          Add Schedule
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        {scheduledWorkflows.map((workflow) => (
                          <div key={workflow.id} className="flex items-center justify-between p-3 bg-[#2c3135] rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white text-sm font-medium">{workflow.name}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  workflow.status === 'active' 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-yellow-900/30 text-yellow-400'
                                }`}>
                                  {workflow.status}
                                </span>
                              </div>
                              <p className="text-[#a2abb3] text-xs">
                                {workflow.channel} • {workflow.schedule}
                              </p>
                              <p className="text-[#a2abb3] text-xs">
                                Next: {workflow.nextRun}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-2 py-1 bg-[#7c3aed] text-white text-xs rounded hover:bg-[#6d28d9]">
                                Edit
                              </button>
                              <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'status' && (
                  <div className="flex flex-col gap-4">
                    {/* Current Status */}
                    <div className="flex flex-col gap-3 rounded-xl bg-[#1c1f22] p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white text-lg font-bold leading-tight">Live Status</h3>
                        <div className="flex items-center gap-2">
                          {isAutomationEnabled && isPolling && (
                            <>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-400 text-xs">Live</span>
                            </>
                          )}
                          {!isAutomationEnabled && (
                            <span className="text-red-400 text-xs">Disabled</span>
                          )}
                        </div>
                      </div>
                      
                      {loading ? (
                        <div className="text-[#a2abb3] text-sm">Loading status...</div>
                      ) : status ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#a2abb3] text-xs">Processing Active</span>
                            <span className={`text-sm font-medium ${status.isProcessingActive ? 'text-green-400' : 'text-red-400'}`}>
                              {status.isProcessingActive ? 'YES' : 'NO'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#a2abb3] text-xs">Pending</span>
                            <span className="text-white text-sm font-medium">{status.totalClipsPending}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#a2abb3] text-xs">Avg Processing Time</span>
                            <span className="text-white text-sm font-medium">{status.averageProcessingTime}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#a2abb3] text-xs">Last Processed</span>
                            <span className="text-white text-sm font-medium">
                              {status.lastProcessedAt ? new Date(status.lastProcessedAt).toLocaleTimeString() : 'Never'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[#a2abb3] text-sm">No status available</div>
                      )}
                    </div>

                    {/* Processing Queue */}
                    <div className="rounded-xl bg-[#1c1f22] p-4">
                      <h3 className="text-white text-lg font-bold leading-tight mb-4">Processing Queue</h3>
                      <div className="text-center py-8">
                        <div className="text-[#a2abb3] text-sm">No items in queue</div>
                        <div className="text-[#a2abb3] text-xs mt-1">
                          {isAutomationEnabled ? 'Waiting for new workflows...' : 'Enable automation to see queue status'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 