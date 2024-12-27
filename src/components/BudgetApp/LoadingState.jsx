import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => (
  <div className="flex flex-1 items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">Loading budget data...</p>
    </div>
  </div>
);

export default LoadingState;