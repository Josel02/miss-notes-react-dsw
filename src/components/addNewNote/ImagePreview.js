import React from 'react';
import Masonry from '@mui/lab/Masonry';

const ImagePreview = ({ images }) => {
  if (images.length === 0) return null; // No renderiza nada si no hay imágenes

  return (
    <Masonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={2}>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`preview ${index}`} style={{ width: '100%', display: 'block' }} />
        </div>
      ))}
    </Masonry>
  );
};

export default ImagePreview;
