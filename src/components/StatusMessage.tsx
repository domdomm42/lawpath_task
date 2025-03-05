import React from "react";

interface StatusMessageProps {
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

function StatusMessage({ isError, isSuccess, message }: StatusMessageProps) {
  if (!message) return null;

  if (isError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {message}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
        {message}
      </div>
    );
  }

  return null;
}

export default StatusMessage;
