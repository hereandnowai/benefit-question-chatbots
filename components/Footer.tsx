import React from 'react';
import { BRAND_INFO } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer 
      className="p-3 text-center text-sm"
      style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--footer-text)' }}
    >
      <p>&copy; {new Date().getFullYear()} {BRAND_INFO.brand.organizationLongName}. All rights reserved.</p>
      <p className="text-xs mt-1" style={{ color: 'var(--app-text-muted)'}}>Developed by Adhithya J [ AI Products Engineering Team ]</p>
      <p className="italic opacity-80 mt-1">{BRAND_INFO.brand.slogan}</p>
    </footer>
  );
};