import React, {useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { readAndCompressImage } from 'browser-image-resizer';
import AddSectionButton from './AddSectionButton';
import "../../styles/ImageSection.css";

const ImageSection = React.memo(({ image, onBlur, onAddSection, onRemoveSection }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(image);
    const { enqueueSnackbar } = useSnackbar();
    const config = {
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 600,
        autoRotate: true,
        debug: true,
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file){
            if (!file.type.startsWith('image/')) {
                enqueueSnackbar('Only image files are allowed!', { variant: 'error', autoHideDuration: 3000});
                return;
            }
            const resizedImage = await readAndCompressImage(file, config);
            setSelectedFile(resizedImage);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onBlur(reader.result);
            };
            reader.readAsDataURL(resizedImage);
        }
    };

    return (
        <div className="section-container">
          <div className="image-container">
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            ) : (
              <Form.Group>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>
            )}
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="remove-button me-3"
              onClick={onRemoveSection}>
              <i className="fas fa-trash"></i>
            </Button>
          </div>
          <AddSectionButton onAddClick={onAddSection} />
        </div>
      );
      

});

export default ImageSection;