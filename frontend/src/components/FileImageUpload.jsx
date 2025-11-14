import React, { useState } from 'react';

const FileImageUpload = ({ 
  currentImage, 
  onImageChange, 
  uploadEndpoint, 
  fieldName = 'image',
  label = 'Upload Image',
  className = '' 
}) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser'))?.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageChange(data.imageUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
      setPreview(currentImage); // Revert preview
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    setError('');
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <label className="form-label">{label}</label>
      
      {preview && (
        <div className="mb-3">
          <img 
            src={preview} 
            alt="Preview" 
            className="img-thumbnail"
            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
          />
          <div className="mt-2">
            <button 
              type="button" 
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemove}
              disabled={uploading}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="form-control"
        disabled={uploading}
      />

      {uploading && (
        <div className="mt-2">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
          Uploading...
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-2 mb-0">
          {error}
        </div>
      )}

      <small className="text-muted d-block mt-1">
        Supported formats: JPG, PNG, GIF. Max size: 5MB
      </small>
    </div>
  );
};

export default FileImageUpload;
