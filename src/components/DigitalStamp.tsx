import React from 'react';

interface DigitalStampProps {
  companyName?: string;
  registrationNumber?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const DigitalStamp: React.FC<DigitalStampProps> = ({
  companyName = "شركة علي صالح الشهري القابضة",
  registrationNumber = "4030554749",
  size = 'medium',
  className = ''
}) => {
  const sizeStyles = {
    small: {
      width: '80px',
      height: '80px',
      fontSize: '6px',
      borderWidth: '2px'
    },
    medium: {
      width: '120px',
      height: '120px',
      fontSize: '8px',
      borderWidth: '3px'
    },
    large: {
      width: '160px',
      height: '160px',
      fontSize: '10px',
      borderWidth: '4px'
    }
  };

  const currentSize = sizeStyles[size];

  const stampStyle: React.CSSProperties = {
    width: currentSize.width,
    height: currentSize.height,
    border: `${currentSize.borderWidth} solid #0066cc`,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    direction: 'rtl',
    fontSize: currentSize.fontSize,
    fontWeight: 'bold',
    color: '#0066cc',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.1',
    padding: '8px',
    boxSizing: 'border-box',
    position: 'relative',
    background: 'white'
  };

  return (
    <div className={`digital-stamp ${className}`} style={stampStyle}>
      <div style={{ 
        fontSize: `${parseInt(currentSize.fontSize) + 1}px`,
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>
        {companyName}
      </div>
      <div style={{
        fontSize: currentSize.fontSize,
        marginBottom: '2px'
      }}>
        سجل تجاري
      </div>
      <div style={{
        fontSize: currentSize.fontSize,
        fontWeight: 'bold'
      }}>
        {registrationNumber}
      </div>
      
      {/* دائرة داخلية للزينة */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '70%',
        border: '1px solid #0066cc',
        borderRadius: '50%',
        opacity: 0.3
      }} />
    </div>
  );
};

export default DigitalStamp;