
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#fcf9f2] text-[#2d2a2e] overflow-hidden">
      <div className="w-full max-w-5xl h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-4">
        {children}
      </div>
    </div>
  );
};
