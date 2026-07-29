import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

const FoundationLanding: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto my-12 text-center">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
        <span className="text-3xl">🚀</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">CampusPrint System Foundation</h1>
      <p className="text-gray-600 mb-6 text-sm">
        The application development foundation, router system, global styles, and API clients have been initialized successfully.
      </p>
      <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">
        ● System Status: Foundation Ready (Phase 01 Complete)
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<FoundationLanding />} />
        <Route path="*" element={<FoundationLanding />} />
      </Route>
    </Routes>
  );
};
