/**
 * MainHeaderV2 - Logo Component
 * Premium corporate branding
 */

import { Link } from 'react-router-dom';
import { logoStyles as s } from './MainHeaderV2.styles';

interface HeaderLogoProps {
  compact?: boolean;
}

export function HeaderLogo({ compact = false }: HeaderLogoProps) {
  return (
    <Link to="/" className={s.wrapper} aria-label="الصفحة الرئيسية">
      {/* Logo Icon */}
      <div className={s.icon}>
        <span className={s.iconText}>ASH</span>
        
        {/* Shine Effect */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
          aria-hidden="true"
        />
      </div>
      
      {/* Company Name */}
      {!compact && (
        <div className={s.text}>
          <div className={s.textMain}>
            ASH <span className={s.textGradient}>HOLDING</span>
          </div>
          <div className={s.textSub}>شركة قابضة منذ 2016</div>
        </div>
      )}
    </Link>
  );
}
