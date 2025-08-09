import React from 'react';

interface DigitalStampProps {
  className?: string;
}

const DigitalStamp: React.FC<DigitalStampProps> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width="120" 
        height="120" 
        viewBox="0 0 120 120" 
        className="text-primary opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="55" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        />
        
        {/* Inner Circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="45" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1"
        />
        
        {/* Company Name - Top Arc */}
        <path
          id="topArc"
          d="M 15 60 A 45 45 0 0 1 105 60"
          fill="none"
          stroke="none"
        />
        <text 
          fontSize="10" 
          fontWeight="bold" 
          fill="currentColor"
          textAnchor="middle"
        >
          <textPath href="#topArc" startOffset="50%">
            شركة الحلول الرقمية
          </textPath>
        </text>
        
        {/* Company Name English - Bottom Arc */}
        <path
          id="bottomArc"
          d="M 105 60 A 45 45 0 0 1 15 60"
          fill="none"
          stroke="none"
        />
        <text 
          fontSize="8" 
          fill="currentColor"
          textAnchor="middle"
        >
          <textPath href="#bottomArc" startOffset="50%">
            DIGITAL SOLUTIONS
          </textPath>
        </text>
        
        {/* Center Content */}
        <text 
          x="60" 
          y="55" 
          textAnchor="middle" 
          fontSize="12" 
          fontWeight="bold" 
          fill="currentColor"
        >
          معتمد
        </text>
        <text 
          x="60" 
          y="70" 
          textAnchor="middle" 
          fontSize="8" 
          fill="currentColor"
        >
          CERTIFIED
        </text>
        
        {/* Date */}
        <text 
          x="60" 
          y="85" 
          textAnchor="middle" 
          fontSize="6" 
          fill="currentColor"
        >
          {new Date().getFullYear()}
        </text>
      </svg>
    </div>
  );
};

export default DigitalStamp;