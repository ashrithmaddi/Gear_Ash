/**
 * Utility function to generate local placeholder images as SVG data URLs
 * This avoids external dependencies and network requests
 */

export const createPlaceholderImage = (width = 300, height = 200, text = "No Image", bgColor = "#f0f0f0", textColor = "#999999") => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="${textColor}" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const createCoursePlaceholder = (width = 300, height = 200) => {
  return createPlaceholderImage(width, height, "Course Image", "#e5e7eb", "#6b7280");
};

export const createUserAvatar = (size = 150, name = "User") => {
  const initial = name.charAt(0).toUpperCase();
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#6366f1"/>
      <circle cx="${size/2}" cy="${size/2 - size/8}" r="${size/6}" fill="white"/>
      <path d="M${size/4} ${size * 0.75} Q${size/2} ${size * 0.65} ${size * 0.75} ${size * 0.75} V${size} H${size/4} Z" fill="white"/>
      <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="${size/4}" fill="white" text-anchor="middle" dy=".3em">${initial}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default {
  createPlaceholderImage,
  createCoursePlaceholder,
  createUserAvatar
};
