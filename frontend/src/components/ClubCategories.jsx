import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

const trebuchet = { fontFamily: "'Trebuchet MS', 'Segoe UI', Tahoma, sans-serif" };

const ClubCategories = () => {
  const { clubs, loading, error } = useCategories();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section style={trebuchet} className="w-full py-12 sm:py-16 lg:py-20 bg-[#0a0806]">
        <div className="section-container px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-serif text-cream uppercase tracking-wide" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
              Browse by Club
            </h2>
          </div>
          {/* মূল list-এর মতো একই container ক্লাস => layout shift এড়ায় */}
          <div className="flex gap-3 sm:gap-4 overflow-hidden pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-shrink-0 w-28 h-32 sm:w-36 sm:h-40 bg-dark-2 border border-dark-3 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={trebuchet} className="w-full py-12 sm:py-16 lg:py-20 bg-[#0a0806]">
        <div className="section-container px-3 sm:px-4 lg:px-6">
          <p className="text-danger text-center">{error}</p>
        </div>
      </section>
    );
  }

  // BUG FIX: clubs খালি হলে পুরো section render না করা (ফাঁকা সেকশন এড়ায়)
  if (!clubs || clubs.length === 0) {
    return null;
  }

  // arrow শুধু তখনই দরকার যখন যথেষ্ট card আছে scroll করার মতো
  const showArrows = clubs.length > 5;

  return (
    <section style={trebuchet} className="w-full py-12 sm:py-16 lg:py-20 bg-[#0a0806]">
      <div className="section-container px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-cream mb-1 sm:mb-2 uppercase tracking-wide" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
              Browse by Club
            </h2>
            <p className="text-text-muted" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>
              Find jerseys from your favorite teams
            </p>
          </div>

          {/* arrow শুধু যথেষ্ট card থাকলে */}
          {showArrows && (
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => scroll('left')}
                className="p-2 border border-dark-3 rounded-lg text-cream hover:border-gold hover:text-gold transition-colors"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 border border-dark-3 rounded-lg text-cream hover:border-gold hover:text-gold transition-colors"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Clubs */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {clubs.map((club) => (
            <Link key={club._id} to={`/club/${club.slug}`} className="flex-shrink-0 group snap-start">
              {/* simple hover: শুধু border-color পরিবর্তন, scale/shadow সরানো */}
              <div className="w-28 sm:w-36 h-32 sm:h-40 bg-dark-2 border border-dark-3 rounded-xl flex flex-col items-center justify-center gap-2 sm:gap-3 transition-colors duration-200 group-hover:border-gold">
                {/* Club Logo */}
                {club.logo ? (
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: club.color || '#c9a84c' }}
                  >
                    <span className="font-serif text-lg sm:text-xl text-white font-bold">
                      {club.name?.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Club Info */}
                <div className="text-center px-2">
                  <p className="text-xs font-medium text-cream line-clamp-1">
                    {club.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-text-muted mt-0.5">
                    {club.league}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubCategories;
