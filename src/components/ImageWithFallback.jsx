import React, { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = 'https://via.placeholder.com/300x200?text=Gambar+Tidak+Tersedia',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(() => {
    // Perbaiki URL gambar jika menggunakan i.ibb.co
    if (src && src.includes('i.ibb.co')) {
      return src.replace('i.ibb.co', 'i.ibb.co.com');
    }
    return src;
  });

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;