/**
 * Auth Divider Component
 */
import * as React from 'react';

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = 'أو' }: AuthDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/[0.06]" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 text-xs text-white/30 bg-transparent font-medium">
          {text}
        </span>
      </div>
    </div>
  );
}
