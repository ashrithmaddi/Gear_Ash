import React from 'react';
import { createUserAvatar } from '../utils/placeholderUtils';

function ProfilePicture({ 
  src, 
  alt = "Profile Picture", 
  size = "50", 
  className = "",
  style = {} 
}) {
  // Extract name from alt text for avatar generation
  const name = alt.includes("Profile") ? "User" : alt;
  const defaultImage = createUserAvatar(parseInt(size), name);
  
  return (
    <img 
      src={src || defaultImage} 
      alt={alt}
      className={`rounded-circle ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        border: '2px solid #e5e7eb',
        ...style
      }}
      onError={(e) => {
        e.target.src = defaultImage;
      }}
    />
  );
}

export default ProfilePicture;
