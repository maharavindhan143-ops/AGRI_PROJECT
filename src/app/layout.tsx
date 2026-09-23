'use client';

import React, { useState } from 'react';
import './globals.css';
import { AppProvider } from '../lib/context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ComplaintModal } from '../components/ComplaintModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>RuralFix – Agro MedKnow Nexus</title>
        <meta 
          name="description" 
          content="Unified Rural Infrastructure Grievance Redressal & AI-Powered Smart Agriculture Decision Support Platform" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar onOpenReportModal={() => setIsReportModalOpen(true)} />
            
            <div className="flex flex-1 max-w-7xl w-full mx-auto">
              <Sidebar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
                {children}
              </main>
            </div>
            
            <ComplaintModal 
              isOpen={isReportModalOpen} 
              onClose={() => setIsReportModalOpen(false)} 
            />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
