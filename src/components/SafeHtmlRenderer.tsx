import React from 'react';

interface SafeHtmlRendererProps {
  children: React.ReactNode;
  className?: string;
}

export const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Safe component for rendering structured content without innerHTML
export const SafeContentRenderer: React.FC<{
  title: string;
  content: string;
  className?: string;
}> = ({ title, content, className }) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
};