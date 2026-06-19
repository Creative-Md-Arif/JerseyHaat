import React, { useState, useEffect } from 'react';
import { generateJerseyImage } from '../utils/imageGenerator';

const ImageWithFallback = ({
  src,
  alt,
  clubName,
  type,
  color,
  className = '',
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Generate fallback image
      const fallbackImage = generateJerseyImage(
        clubName || alt || 'JerseyHaat ',
        type || 'Home',
        color || '#c9a84c'
      );
      setImgSrc(fallbackImage);
      setIsLoading(false);
      if (onError) onError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-dark-2 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imgSrc || generateJerseyImage(clubName || 'JerseyHaat ', type || 'Home', color || '#c9a84c')}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithFallback;
