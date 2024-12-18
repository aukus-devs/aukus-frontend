import React, { useState } from 'react';
import './ImageWithPreloader.css';

interface ImageWithPreloaderProps {
  src: string;
  imgStyle?: React.CSSProperties;
}

const ImageWithPreloader: React.FC<ImageWithPreloaderProps> = ({ src, imgStyle }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', width: '900px', height: '500px' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}
        >
          <div className="spinner"></div>
        </div>
      )}
      <img
        src={src}
        onLoad={handleImageLoad}
        style={{
          display: loading ? 'none' : 'block',
          margin: '0 auto',
          ...imgStyle,
        }}
      />
    </div>
  );
};

export default ImageWithPreloader;
