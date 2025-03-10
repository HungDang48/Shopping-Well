import React, { useState, useEffect } from 'react';
import img1 from '../img/img1.jpg';
import img2 from '../img/img2.jpg';
import img3 from '../img/img3.jpg';
import './stylebanner.css'

interface BannerProps {
  images?: string[];
  interval?: number;
}

const Banner: React.FC<BannerProps> = ({ images = [img1], interval = 3000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [images, interval]);

  if (images.length === 0) {
    return <div className="banner-container">No image</div>;
  }

  return (
    <div className="banner-container">
      <img src={images[currentImageIndex]} alt="banner" className="banner-image" />
    </div>
  );
};

export default Banner;
