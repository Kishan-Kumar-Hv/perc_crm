import React from 'react';

/**
 * Reusable high-fidelity SVG brand logo component for PERC
 * (Personalized Education Research Center)
 * Matches the colors and shapes from the logo.
 */
export default function PERCLogo({ variant = 'vertical', width, height, className = '' }) {
  // Standard sizing based on variant
  const defaultWidth = variant === 'icon' ? 48 : variant === 'horizontal' ? 240 : 180;
  const defaultHeight = variant === 'icon' ? 48 : variant === 'horizontal' ? 52 : 180;
  
  const w = width || defaultWidth;
  const h = height || defaultHeight;

  // Navy blue color matching var(--color-primary)
  const navy = '#1E223F';
  // Burgundy/crimson color matching the logo lettering
  const crimson = '#8A1525';
  // Beige/sand color matching the logo book edge details
  const beige = '#C5B49F';

  // The actual high-fidelity icon SVG
  const renderIcon = () => (
    <svg 
      viewBox="0 0 200 200" 
      width="100%" 
      height="100%" 
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* 1. GRADUATION CAP (TOP) */}
      {/* Top Diamond Board */}
      <path 
        d="M 100 22 L 155 42 L 100 62 L 45 42 Z" 
        fill={navy} 
      />
      {/* Cap Skull Base */}
      <path 
        d="M 74 48 L 74 61 C 74 72, 126 72, 126 61 L 126 48 Z" 
        fill={navy} 
      />
      {/* Tassel (hanging to the right) */}
      <path 
        d="M 100 42 L 146 45 L 146 64" 
        stroke={navy} 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="146" cy="67" r="3.5" fill={navy} />

      {/* 2. OPEN BOOK PAGES & COVER */}
      
      {/* Outer book cover / page border (Beige layer) */}
      {/* Left page underlayer */}
      <path 
        d="M 94 92 C 72 88, 52 94, 48 98 L 48 126 C 52 122, 72 116, 94 120 Z" 
        fill={beige} 
      />
      {/* Right page underlayer */}
      <path 
        d="M 106 92 C 128 88, 148 94, 152 98 L 152 126 C 148 122, 128 116, 106 120 Z" 
        fill={beige} 
      />
      
      {/* Left page beige shadow border bottom */}
      <path 
        d="M 48 126 C 58 132, 80 134, 94 129 L 94 133 C 80 138, 58 136, 48 130 Z" 
        fill={beige} 
      />
      {/* Right page beige shadow border bottom */}
      <path 
        d="M 152 126 C 142 132, 120 134, 106 129 L 106 133 C 120 138, 142 136, 152 130 Z" 
        fill={beige} 
      />

      {/* Main Pages (Navy Blue) */}
      {/* Left page */}
      <path 
        d="M 94 88 C 72 84, 54 90, 50 94 L 50 122 C 54 118, 72 112, 94 116 Z" 
        fill={navy} 
      />
      {/* Right page */}
      <path 
        d="M 106 88 C 128 84, 146 90, 150 94 L 150 122 C 146 118, 128 112, 106 116 Z" 
        fill={navy} 
      />

      {/* 3. FOUNTAIN PEN NIB (NEGATIVE SPACE IN THE GUTTER) */}
      {/* Nib Outer Silhouette */}
      <path 
        d="M 94 132 C 94 125, 96 112, 100 86 C 104 112, 106 125, 106 132 Z" 
        fill={navy} 
      />
      {/* Nib Tip cut-out (White) */}
      <path 
        d="M 100 86 L 103 102 L 97 102 Z" 
        fill="#FFFFFF" 
      />
      {/* Nib Breather Hole (White) */}
      <circle cx="100" cy="112" r="3.5" fill="#FFFFFF" />
      {/* Nib Slit Line (White) */}
      <line 
        x1="100" 
        y1="102" 
        x2="100" 
        y2="128" 
        stroke="#FFFFFF" 
        strokeWidth="2.5" 
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`perc-logo-icon ${className}`} style={{ width: w, height: h, display: 'inline-block' }}>
        {renderIcon()}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div 
        className={`perc-logo-horizontal ${className}`} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          width: w, 
          height: h 
        }}
      >
        <div style={{ width: h, height: h, flexShrink: 0 }}>
          {renderIcon()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1px' }}>
          {/* Logo Brand Name PERC */}
          <span 
            style={{ 
              fontFamily: 'var(--font-family)', 
              fontSize: '1.45rem', 
              fontWeight: '800', 
              color: crimson, 
              letterSpacing: '0.12em', 
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            P<span style={{ display: 'inline-flex', letterSpacing: '0.08em' }}>E</span>RC
          </span>
          <span 
            style={{ 
              fontFamily: 'var(--font-family)', 
              fontSize: '0.38rem', 
              fontWeight: '700', 
              color: navy, 
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}
          >
            Personalized Education Research Center
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', margin: '1px 0' }}>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: navy, opacity: 0.2 }}></div>
            <span style={{ fontSize: '0.38rem', color: navy, display: 'inline-flex', opacity: 0.8 }}>🎓</span>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: navy, opacity: 0.2 }}></div>
          </div>
          <span 
            style={{ 
              fontFamily: 'var(--font-family)', 
              fontSize: '0.38rem', 
              fontWeight: '600', 
              color: navy, 
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: '1px'
            }}
          >
            IIT <span style={{ color: crimson }}>|</span> NEET <span style={{ color: crimson }}>|</span> CET <span style={{ color: crimson }}>|</span> TUITION
          </span>
        </div>
      </div>
    );
  }

  // default 'vertical'
  return (
    <div 
      className={`perc-logo-vertical ${className}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        width: w,
        padding: '10px'
      }}
    >
      <div style={{ width: '100px', height: '100px', marginBottom: '8px' }}>
        {renderIcon()}
      </div>
      
      {/* Brand Text PERC */}
      <h1 
        style={{ 
          fontFamily: 'var(--font-family)', 
          fontSize: '2.5rem', 
          fontWeight: '900', 
          color: crimson, 
          letterSpacing: '0.2em', 
          lineHeight: '1',
          margin: '0 0 2px 0'
        }}
      >
        PERC
      </h1>
      
      <p 
        style={{ 
          fontFamily: 'var(--font-family)', 
          fontSize: '0.52rem', 
          fontWeight: '700', 
          color: navy, 
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: '0 0 4px 0',
          whiteSpace: 'nowrap'
        }}
      >
        Personalized Education Research Center
      </p>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', width: '90%', gap: '6px', margin: '4px 0' }}>
        <div style={{ flexGrow: 1, height: '1px', backgroundColor: navy, opacity: 0.3 }}></div>
        <span style={{ fontSize: '0.65rem', color: navy }}>🎓</span>
        <div style={{ flexGrow: 1, height: '1px', backgroundColor: navy, opacity: 0.3 }}></div>
      </div>

      <p 
        style={{ 
          fontFamily: 'var(--font-family)', 
          fontSize: '0.58rem', 
          fontWeight: '700', 
          color: navy, 
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          margin: '2px 0 0 0'
        }}
      >
        IIT <span style={{ color: crimson }}>|</span> NEET <span style={{ color: crimson }}>|</span> CET <span style={{ color: crimson }}>|</span> TUITION
      </p>
    </div>
  );
}
