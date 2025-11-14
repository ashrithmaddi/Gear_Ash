import React, { useState } from 'react';

function ImageUpload({ 
  currentImage, 
  onImageChange, 
  label = "Upload Image", 
  accept = "image/*",
  className = ""
}) {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setPreview(base64String);
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className={`image-upload-component ${className}`}>
      <label className="form-label">{label}</label>
      
      {preview && (
        <div className="mb-3">
          <div className="position-relative d-inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className="img-thumbnail"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            />
            <button
              type="button"
              className="btn btn-sm btn-danger position-absolute top-0 end-0"
              onClick={removeImage}
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}
      
      <div className="input-group">
        <input
          type="file"
          className="form-control"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <span className="input-group-text">
          {uploading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <i className="bi bi-upload"></i>
          )}
        </span>
      </div>
      
      <small className="form-text text-muted">
        Supported formats: JPG, PNG, GIF. Max size: 5MB.
      </small>
    </div>
  );
}

export default ImageUpload;
