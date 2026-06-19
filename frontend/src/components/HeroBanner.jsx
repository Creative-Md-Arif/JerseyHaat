import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useBanners } from '../hooks/useBanners';

const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    title: 'JerseyHaat ',
    subtitle: 'Premium Football Jerseys',
    badge: 'New Arrival',
    image: '/banner1.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  {
    _id: 'default-2',
    title: 'New Season 2025/26',
    subtitle: 'Latest Kits from Top Clubs',
    badge: 'Season 25/26',
    image: '/banner2.jpg',
    buttonText: 'Explore Kits',
    buttonLink: '/shop?filter=new',
  },
  {
    _id: 'default-3',
    title: 'Authentic Quality',
    subtitle: 'Premium Materials & Craftsmanship',
    badge: 'Best Seller',
    image: '/banner3.jpg',
    buttonText: 'Learn More',
    buttonLink: '/shop',
  },
];

const HeroBanner = () => {
  const { banners, loading } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const activeBanners = banners?.length > 0 ? banners : DEFAULT_BANNERS;
  const count = activeBanners.length;

  const goTo = useCallback((i) => setCurrentIndex((i % count + count) % count), [count]);
  const next = useCallback(() => setCurrentIndex((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrentIndex((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  useEffect(() => {
    if (currentIndex >= count) setCurrentIndex(0);
  }, [count, currentIndex]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full bg-[#0a0806]"
        style={{ height: 'clamp(420px, 72vh, 700px)', fontFamily: "'Trebuchet MS', sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 150, 300].map((d) => (
              <span key={d} className="animate-bounce w-2 h-2 rounded-full bg-[#c9a84c] block"
                style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
          <span className="text-[rgba(245,240,232,0.4)] text-[11px] tracking-[0.3em] uppercase">JerseyHaat</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-[#0a0806]"
      style={{ height: 'clamp(420px, 84vh, 850px)', fontFamily: "'Trebuchet MS', sans-serif" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {activeBanners.map((banner, index) => (
        <div
          key={banner._id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            visibility: index === currentIndex ? 'visible' : 'hidden',
            zIndex: index === currentIndex ? 10 : 0,
          }}
        >
          {/* ── Full-bleed background image ── */}
       
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* ── Left dark gradient ── */}
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,8,6,0.95)] via-[rgba(10,8,6,0.55)] to-transparent" />

          {/* ── Top/bottom vignette ── */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.35) 0%, transparent 25%, transparent 75%, rgba(10,8,6,0.5) 100%)' }} />

          {/* ── Content ── */}
          <div className="absolute inset-0 flex items-center z-20">
            <div className="section-container px-4 sm:px-6 lg:px-8">
              {/* 320px এ full width, বড় screen এ 45% */}
              <div className="w-full sm:max-w-[70%] md:max-w-[55%] lg:max-w-[45%]">

                {/* Badge */}
                {banner.badge && (
                  <span className="inline-block mb-4 px-3.5 py-1 text-[11px] tracking-[0.2em] uppercase rounded-full border border-[rgba(201,168,76,0.45)] text-[#c9a84c] bg-[rgba(201,168,76,0.07)]">
                    {banner.badge}
                  </span>
                )}

                {/* Title */}
                <h1
                  className="gold-text-gradient font-extrabold leading-[1.05] mb-5 tracking-tight "
                  style={{ fontSize: 'clamp(1.8rem, 5vw, 5rem)' }}
                >
                  {banner.title}
                </h1>

                {/* Gold divider */}
                <div className="w-11 h-0.5 mb-3.5 rounded-full"
                  style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }} />

                {/* Subtitle */}
                <p className="text-[rgba(245,240,232,0.75)] mb-8 leading-relaxed tracking-wide"
                  style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)' }}>
                  {banner.subtitle}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-5 flex-wrap">
                  <Link
                    to={banner.buttonLink || '/shop'}
                    className="btn-primary"
                    style={{ fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)' }}
                  >
                    {banner.buttonText || 'Shop Now'}
                  </Link>
                  <Link
                    to="/shop"
                    className="text-[13px] text-[rgba(245,240,232,0.5)] underline underline-offset-4 tracking-widest transition-colors duration-200 hover:text-[#c9a84c]"
                  >
                    View All
                  </Link>
                </div>

                {/* Slide counter */}
                <div className="flex items-center gap-2.5 mt-11">
                  <span className="text-[#c9a84c] font-bold text-[15px]">0{currentIndex + 1}</span>
                  <div className="flex gap-1.5">
                    {activeBanners.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                        className="h-0.5 rounded-full border-none cursor-pointer p-0 transition-all duration-300"
                        style={{
                          width: i === currentIndex ? 28 : 8,
                          background: i === currentIndex ? '#c9a84c' : 'rgba(245,240,232,0.2)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[rgba(245,240,232,0.2)] text-[15px]">0{count}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      {count > 1 && (
        <>
          {[
            { dir: 'prev', className: 'left-3.5', onClick: prev, path: 'M15 19l-7-7 7-7' },
            { dir: 'next', className: 'right-3.5', onClick: next, path: 'M9 5l7 7-7 7' },
          ].map(({ dir, className, onClick, path }) => (
            <button
              key={dir}
              onClick={onClick}
              aria-label={dir}
              className={`absolute top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-[rgba(10,8,6,0.55)] border border-[rgba(201,168,76,0.2)] text-[rgba(245,240,232,0.6)] cursor-pointer flex transition-all duration-200 hover:text-[#c9a84c] hover:border-[rgba(201,168,76,0.5)] ${className}`}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
              </svg>
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default HeroBanner;