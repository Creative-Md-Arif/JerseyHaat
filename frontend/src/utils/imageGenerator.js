/**
 * Generate a dynamic jersey image as an SVG data URL
 * Used as fallback when backend has no image
 */
export const generateJerseyImage = (
  clubName = "Voûte",
  type = "Home",
  color = "#c9a84c",
) => {
  const darkenColor = (hex, amount = 20) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
    const b = Math.max(0, (num & 0x0000ff) - amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const lightenColor = (hex, amount = 40) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
    const b = Math.min(255, (num & 0x0000ff) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const jerseyColor = color || "#c9a84c";
  const bodyColor = darkenColor(jerseyColor, 10);
  const highlightColor = lightenColor(jerseyColor, 30);
  const textColor = "#f5f0e8";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"
         viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${highlightColor};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${jerseyColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bodyColor};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="sleeveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${highlightColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bodyColor};stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="400" height="500" fill="#1a1612"/>

      <!-- Jersey Body Shape (shadow filter removed) -->
      <g>
        <!-- Left Sleeve -->
        <path d="M 60 120 Q 30 130 20 170 L 50 200 Q 70 180 80 160 Z" fill="url(#sleeveGrad)"/>
        <!-- Right Sleeve -->
        <path d="M 340 120 Q 370 130 380 170 L 350 200 Q 330 180 320 160 Z" fill="url(#sleeveGrad)"/>

        <!-- Main Body -->
        <path d="
          M 80 100
          Q 120 130 200 140
          Q 280 130 320 100
          L 340 120
          L 320 160
          L 340 400
          Q 340 420 320 430
          L 80 430
          Q 60 420 60 400
          L 80 160
          L 60 120
          Z"
          fill="url(#jerseyGrad)"/>

        <!-- V-Neck Collar -->
        <path d="M 130 105 Q 200 160 270 105"
          fill="none"
          stroke="#f5f0e8"
          stroke-width="4"
          stroke-linecap="round"/>
        <path d="M 130 105 Q 200 160 270 105 L 280 95 Q 200 145 120 95 Z"
          fill="#1a1612"
          opacity="0.8"/>

        <!-- Sleeve Stripes -->
        <rect x="28" y="150" width="30" height="4" rx="2" fill="#f5f0e8" opacity="0.6"/>
        <rect x="342" y="150" width="30" height="4" rx="2" fill="#f5f0e8" opacity="0.6"/>

        <!-- Side Stripes -->
        <rect x="75" y="200" width="4" height="180" rx="2" fill="#f5f0e8" opacity="0.3"/>
        <rect x="321" y="200" width="4" height="180" rx="2" fill="#f5f0e8" opacity="0.3"/>

        <!-- Bottom Hem -->
        <rect x="65" y="410" width="270" height="6" rx="3" fill="#f5f0e8" opacity="0.4"/>
      </g>

      <!-- Club Name -->
      <text x="200" y="240"
        font-family="'Trebuchet MS', sans-serif"
        font-size="22"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="middle"
        letter-spacing="1">
        ${clubName}
      </text>

      <!-- Jersey Type Badge -->
      <rect x="160" y="260" width="80" height="28" rx="14" fill="#1a1612" opacity="0.7"/>
      <text x="200" y="279"
        font-family="'Trebuchet MS', sans-serif"
        font-size="13"
        font-weight="600"
        fill="#c9a84c"
        text-anchor="middle"
        letter-spacing="2">
        ${type.toUpperCase()}
      </text>

      <!-- Jersey Number Placeholder -->
      <text x="200" y="350"
        font-family="'Trebuchet MS', sans-serif"
        font-size="72"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="middle"
        opacity="0.15">
        10
      </text>

      <!-- Brand Logo Placeholder -->
      <circle cx="200" cy="195" r="12" fill="none" stroke="${textColor}" stroke-width="1.5" opacity="0.4"/>
      <text x="200" y="200"
        font-family="'Trebuchet MS', sans-serif"
        font-size="10"
        fill="${textColor}"
        text-anchor="middle"
        opacity="0.5">V</text>

      <!-- Decorative Gold Accents -->
      <circle cx="50" cy="50" r="80" fill="#c9a84c" opacity="0.03"/>
      <circle cx="350" cy="450" r="100" fill="#c9a84c" opacity="0.02"/>
    </svg>
  `;

  const base64 = btoa(unescape(encodeURIComponent(svg.trim())));
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * Generate a banner/hero image as SVG data URL
 */
export const generateBannerImage = (
  title = "Voûte",
  subtitle = "Premium Jerseys",
) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500"
         viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0e0c0a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1612;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#252018;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#c9a84c;stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:#e8d5a3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#c9a84c;stop-opacity:0.8" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="500" fill="url(#bgGrad)"/>

      <!-- Decorative Elements -->
      <circle cx="100" cy="100" r="200" fill="#c9a84c" opacity="0.03"/>
      <circle cx="1100" cy="400" r="250" fill="#c9a84c" opacity="0.02"/>

      <!-- Gold Lines -->
      <line x1="0" y1="200" x2="1200" y2="200" stroke="#c9a84c" stroke-width="0.5" opacity="0.1"/>
      <line x1="0" y1="300" x2="1200" y2="300" stroke="#c9a84c" stroke-width="0.5" opacity="0.1"/>

      <!-- Jersey Silhouette -->
      <g opacity="0.15" transform="translate(850, 80) scale(1.2)">
        <path d="M 80 100 Q 120 130 200 140 Q 280 130 320 100 L 340 120 L 320 160 L 340 400 Q 340 420 320 430 L 80 430 Q 60 420 60 400 L 80 160 L 60 120 Z"
          fill="url(#goldGrad)"/>
        <path d="M 130 105 Q 200 160 270 105"
          fill="none" stroke="#c9a84c" stroke-width="3"/>
      </g>

      <!-- Title -->
      <text x="100" y="200"
        font-family="'Trebuchet MS', sans-serif"
        font-size="72"
        font-weight="bold"
        fill="url(#goldGrad)">
        ${title}
      </text>

      <!-- Subtitle -->
      <text x="100" y="260"
        font-family="'Trebuchet MS', sans-serif"
        font-size="28"
        font-weight="300"
        fill="#f5f0e8"
        letter-spacing="4">
        ${subtitle}
      </text>

      <!-- Decorative Line -->
      <line x1="100" y1="290" x2="400" y2="290" stroke="#c9a84c" stroke-width="2" opacity="0.6"/>

      <!-- Tagline -->
      <text x="100" y="330"
        font-family="'Trebuchet MS', sans-serif"
        font-size="16"
        fill="#9a8a6a"
        letter-spacing="2">
        AUTHENTIC • PREMIUM • WORLDWIDE
      </text>
    </svg>
  `;

  const base64 = btoa(unescape(encodeURIComponent(svg.trim())));
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * Generate a simple placeholder/loading image
 */
export const generatePlaceholderImage = () => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"
         viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
      <rect width="400" height="500" fill="#1a1612"/>
      <rect x="50" y="100" width="300" height="300" rx="8" fill="#252018" stroke="#3a3020" stroke-width="1"/>
      <text x="200" y="270"
        font-family="'Trebuchet MS', sans-serif"
        font-size="48"
        fill="#3a3020"
        text-anchor="middle">V</text>
      <text x="200" y="310"
        font-family="'Trebuchet MS', sans-serif"
        font-size="14"
        fill="#9a8a6a"
        text-anchor="middle">Voûte</text>
    </svg>
  `;

  const base64 = btoa(unescape(encodeURIComponent(svg.trim())));
  return `data:image/svg+xml;base64,${base64}`;
};
