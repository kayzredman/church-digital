import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
}

export const media = {
  // Upload file to Cloudinary
  uploadFile: async (
    file: File | string,
    folder: string = 'elimthronerm'
  ): Promise<UploadResponse> => {
    try {
      let uploadData: any;

      if (file instanceof File) {
        // Convert File to base64
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;
        uploadData = await cloudinary.uploader.upload(dataURI, {
          folder,
          resource_type: 'auto',
        });
      } else {
        // Assume it's a URL
        uploadData = await cloudinary.uploader.upload(file, {
          folder,
          resource_type: 'auto',
        });
      }

      return {
        public_id: uploadData.public_id,
        secure_url: uploadData.secure_url,
        url: uploadData.url,
        format: uploadData.format,
        width: uploadData.width,
        height: uploadData.height,
        bytes: uploadData.bytes,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  },

  // Upload video
  uploadVideo: async (
    file: File | string,
    folder: string = 'elimthronerm/videos'
  ): Promise<UploadResponse> => {
    try {
      let uploadData: any;

      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;
        uploadData = await cloudinary.uploader.upload(dataURI, {
          folder,
          resource_type: 'video',
          eager: [
            { width: 300, height: 300, crop: 'fill', quality: 'auto' },
          ],
        });
      } else {
        uploadData = await cloudinary.uploader.upload(file, {
          folder,
          resource_type: 'video',
        });
      }

      return {
        public_id: uploadData.public_id,
        secure_url: uploadData.secure_url,
        url: uploadData.url,
        format: uploadData.format,
        width: uploadData.width,
        height: uploadData.height,
        bytes: uploadData.bytes,
      };
    } catch (error) {
      throw new Error(`Failed to upload video: ${error}`);
    }
  },

  // Upload image with optimization
  uploadImage: async (
    file: File | string,
    folder: string = 'elimthronerm/images'
  ): Promise<UploadResponse> => {
    try {
      let uploadData: any;

      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;
        uploadData = await cloudinary.uploader.upload(dataURI, {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          eager: [
            { width: 200, height: 200, crop: 'fill', quality: 'auto' },
            { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          ],
        });
      } else {
        uploadData = await cloudinary.uploader.upload(file, {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        });
      }

      return {
        public_id: uploadData.public_id,
        secure_url: uploadData.secure_url,
        url: uploadData.url,
        format: uploadData.format,
        width: uploadData.width,
        height: uploadData.height,
        bytes: uploadData.bytes,
      };
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  },

  // Delete file
  deleteFile: async (publicId: string) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  },

  // Get optimized URL
  getOptimizedUrl: (publicId: string, options?: any) => {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    });
  },

  // Generate thumbnail
  getThumbnailUrl: (publicId: string, width = 300, height = 300) => {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  },
};
