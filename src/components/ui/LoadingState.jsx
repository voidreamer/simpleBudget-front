import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Loading...", subMessage }) => (
  <div className="flex flex-1 items-center justify-center min-h-[200px]">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
      <p className="text-lg font-medium text-gray-900">{message}</p>
      {subMessage && (
        <p className="text-sm text-gray-500 mt-2">{subMessage}</p>
      )}
    </div>
  </div>
);

export const LoadingSpinner = ({ size = "sm", className = "" }) => (
  <Loader2 
    className={`animate-spin ${
      size === "sm" ? "w-4 h-4" : 
      size === "md" ? "w-6 h-6" : 
      "w-8 h-8"
    } ${className}`}
  />
);

export default LoadingState;