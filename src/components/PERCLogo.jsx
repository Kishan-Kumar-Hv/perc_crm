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
      {/* 1. OUTER BOOK LEAVES (NAVY) */}
      {/* Left Outer Cover (Navy) */}
      <path 
        d="M 27 98 L 27 172 C 45 179, 75 186, 100 188 L 100 180 C 78 178, 50 172, 35 164 L 35 106 Z" 
        fill={navy} 
      />
      {/* Right Outer Cover (Navy) */}
      <path 
        d="M 173 98 L 173 172 C 155 179, 125 186, 100 188 L 100 180 C 122 178, 150 172, 165 164 L 165 106 Z" 
        fill={navy} 
      />

      {/* 2. GOLD/BEIGE LEAVES */}
      {/* Left Beige Leaf */}
      <path 
        d="M 39 95 L 39 160 C 56 166, 80 171, 100 172 L 100 165 C 82 164, 60 159, 47 152 L 47 101 Z" 
        fill={beige} 
      />
      {/* Right Beige Leaf */}
      <path 
        d="M 161 95 L 161 160 C 144 166, 120 171, 100 172 L 100 165 C 118 164, 140 159, 153 152 L 153 101 Z" 
        fill={beige} 
      />

      {/* 3. CENTRAL CONNECTED NAVY BACKGROUND */}
      {/* Neck/dome transition background behind pen nib tip */}
      <path 
        d="M 72 86 Q 100 64 128 86 Z" 
        fill={navy} 
      />
      {/* Inner Book Pages (Navy) */}
      <path 
        d="M 51 92 Q 75 80 100 96 Q 125 80 149 92 L 149 154 Q 125 168 100 166 Q 75 168 51 154 Z" 
        fill={navy} 
      />

      {/* 4. FOUNTAIN PEN NIB (SOLID WHITE) */}
      <path 
        d="M 100 70 L 84 96 C 83 108, 88 128, 88 152 L 100 166 L 112 152 C 112 128, 117 108, 116 96 Z" 
        fill="#FFFFFF" 
      />
      {/* Pen Nib Details (Navy) */}
      <line 
        x1="100" 
        y1="74" 
        x2="100" 
        y2="114" 
        stroke={navy} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      <circle cx="100" cy="114" r="3.5" fill={navy} />

      {/* 5. GRADUATION CAP (TOP) */}
      {/* Top Diamond Board */}
      <path 
        d="M 100 15 L 182 43 L 100 71 L 18 43 Z" 
        fill={navy} 
      />
      {/* Cap Skull Base */}
      <path 
        d="M 68 50 C 68 50, 68 61, 68 61 C 68 73, 132 73, 132 61 L 132 50 C 112 55, 88 55, 68 50 Z" 
        fill={navy} 
      />
      {/* Tassel (hanging to the right) */}
      <path 
        d="M 100 43 L 146 46 L 146 72" 
        stroke={navy} 
        strokeWidth="2.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 143 72 L 149 72 L 151 83 L 141 83 Z" 
        fill={navy} 
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
