/**
 * Image Handling Utility
 * Supports multiple storage options: File System, Cloudinary, AWS S3
 */

const fs = require('fs');
const path = require('path');

class ImageHandler {
  constructor(config = {}) {
    this.storage = config.storage || 'filesystem'; // 'filesystem', 'cloudinary', 's3'
    this.uploadDir = config.uploadDir || path.join(__dirname, '../uploads');
    this.maxSize = config.maxSize || 5 * 1024 * 1024; // 5MB
    this.allowedTypes = config.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    // Initialize storage specific configurations
    if (this.storage === 'cloudinary') {
      this.cloudinary = require('cloudinary').v2;
      this.cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
    } else if (this.storage === 's3') {
      this.AWS = require('aws-sdk');
      this.s3 = new this.AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });
      this.bucketName = process.env.AWS_S3_BUCKET;
    }
  }

  // Validate image file
  validateImage(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > this.maxSize) {
      throw new Error(`File size too large. Maximum size is ${this.maxSize / (1024 * 1024)}MB`);
    }

    return true;
  }

  // Generate unique filename
  generateFilename(originalname, prefix = '') {
    const ext = path.extname(originalname);
    const name = path.basename(originalname, ext);
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    return `${prefix}${name}-${timestamp}-${random}${ext}`;
  }

  // File System Storage
  async saveToFileSystem(file, subfolder = '') {
    this.validateImage(file);

    const uploadPath = path.join(this.uploadDir, subfolder);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filename = this.generateFilename(file.originalname);
    const filepath = path.join(uploadPath, filename);
    
    // Write file
    fs.writeFileSync(filepath, file.buffer);
    
    // Return URL path
    const urlPath = path.join('/uploads', subfolder, filename).replace(/\\/g, '/');
    return {
      success: true,
      url: urlPath,
      filename: filename,
      path: filepath
    };
  }

  // Cloudinary Storage
  async saveToCloudinary(file, folder = '') {
    this.validateImage(file);

    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto'
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format
            });
          }
        }
      ).end(file.buffer);
    });
  }

  // AWS S3 Storage
  async saveToS3(file, folder = '') {
    this.validateImage(file);

    const filename = this.generateFilename(file.originalname);
    const key = folder ? `${folder}/${filename}` : filename;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    try {
      const result = await this.s3.upload(params).promise();
      return {
        success: true,
        url: result.Location,
        key: result.Key,
        etag: result.ETag
      };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  // Main save method (routes to appropriate storage)
  async save(file, options = {}) {
    const { folder = '', subfolder = '' } = options;

    try {
      switch (this.storage) {
        case 'filesystem':
          return await this.saveToFileSystem(file, subfolder);
        case 'cloudinary':
          return await this.saveToCloudinary(file, folder);
        case 's3':
          return await this.saveToS3(file, folder);
        default:
          throw new Error(`Unsupported storage type: ${this.storage}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete methods
  async deleteFromFileSystem(filepath) {
    const fullPath = path.join(__dirname, '../', filepath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  }

  async deleteFromCloudinary(publicId) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      return { success: result.result === 'ok' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteFromS3(key) {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Main delete method
  async delete(identifier) {
    try {
      switch (this.storage) {
        case 'filesystem':
          return await this.deleteFromFileSystem(identifier);
        case 'cloudinary':
          return await this.deleteFromCloudinary(identifier);
        case 's3':
          return await this.deleteFromS3(identifier);
        default:
          throw new Error(`Unsupported storage type: ${this.storage}`);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = ImageHandler;
