import React, { useState, useEffect } from "react";

const trebuchet = {
  fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif",
};

const AnnouncementBar = ({ onClose }) => {
  const [announcements] = useState([
    { id: 1, text: 'Free delivery on orders over ৳2,000', link: '/shop' },
    { id: 2, text: 'New 2025/26 season jerseys now available', link: '/shop?filter=new' },
    { id: 3, text: 'Authentic jerseys from top European clubs', link: '/shop' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const current = announcements[currentIndex];

  return (
    <div style={trebuchet} className="w-full bg-gold text-dark py-2 sm:py-2.5 px-3 sm:px-4 relative uppercase">
      <div className="section-container flex items-center justify-center px-6 sm:px-8">
        <a href={current.link} className="font-medium tracking-wide uppercase text-center hover:underline"
           style={{ fontSize: 'clamp(0.6875rem, 2.8vw, 0.875rem)' }}>
          {current.text}
        </a>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1 hover:bg-gold-dark rounded cursor-pointer"
          aria-label="Close announcement"
        >
          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
