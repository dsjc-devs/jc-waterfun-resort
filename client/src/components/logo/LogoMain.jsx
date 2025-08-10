import React from 'react';
import { useGetResortDetails } from 'api/resort-details';
import logoFallback from 'assets/images/logo/logo.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ isPadded = true }) => {
  const { resortDetails } = useGetResortDetails();
  const { companyInfo } = resortDetails || {};
  const logos = companyInfo?.logo
    ? Array.isArray(companyInfo.logo)
      ? companyInfo.logo
      : [companyInfo.logo]
    : [logoFallback];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 8,
        overflowX: 'auto',
      }}
    >
      {logos.length > 0 ? (
        logos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Logo ${i + 1}`}
            style={{
              height: isPadded ? 80 : 100,
              width: 200,
              objectFit: isPadded ? 'contain' : 'cover',
              borderRadius: 6,
              flexShrink: 0,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = logoFallback;
            }}
          />
        ))
      ) : (
        <img
          src={logoFallback}
          alt="Fallback Logo"
          style={{ height: 80, width: 200, objectFit: 'contain' }}
        />
      )}
    </div>
  );
};

export default Logo;
