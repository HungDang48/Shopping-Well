import React, { useState, useEffect } from 'react';
import img1 from '../img/img1.jpg';
import img2 from '../img/img2.jpg';
import img3 from '../img/img3.jpg';
import img4 from '../img/img4.jpg';
import './stylebanner.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


interface BannerProps {
  images?: string[];
  interval?: number;
}

const Banner: React.FC<BannerProps> = ({ 
  images = [img2, img4], // ✅ Định nghĩa đúng mảng ảnh mặc định
  interval = 3000 
}) => {
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
    <div> {/* ✅ Bọc tất cả nội dung trong một <div> */}
      <div className="banner-container">
        <img src={images[currentImageIndex]} alt="banner" className="banner-image" />
      </div>

      <div className="info-section"> {/* ✅ Đổi class => className */}
        <div className="info-item">
            <i className="fas fa-truck"></i>
            <h3>GIAO HÀNG MIỄN PHÍ</h3>
            <p>Hóa đơn trên 500k</p>
        </div>
        <div className="info-item">
            <i className="fas fa-undo"></i>
            <h3>ĐỔI TRẢ</h3>
            <p>Trong vòng 3 ngày</p>
        </div>
        <div className="info-item">
            <i className="fas fa-tag"></i>
            <h3>COD TOÀN QUỐC</h3>
            <p>Thanh toán nhận hàng</p>
        </div>
        <div className="info-item">
            <i className="fas fa-phone"></i>
            <h3>CẦN TÌM ĐỐI TÁC PHÂN PHỐI KHÁCH SỈ/BUÔN</h3>
            <p>LH 0937.234.789</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
