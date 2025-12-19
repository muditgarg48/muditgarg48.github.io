import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImageToStorage = async (file, path) => {
  try {
    if (!file) {
      throw new Error('File is required');
    }

    if (!path) {
      throw new Error('Storage path is required');
    }

    // Create a reference to the file location
    const storageRef = ref(storage, path);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw error;
  }
};

export const generateBlogImagePath = (authorId, blogId, fileName) => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `blog-images/${authorId}/${blogId}/${timestamp}_${sanitizedFileName}`;
};

export const processBlogContent = async (content, authorId, blogId) => {
  return Promise.all(
    content.map(async (item) => {
      if (item.type === 'image' && item.file) {
        const imagePath = generateBlogImagePath(authorId, blogId, item.file.name);
        const imageUrl = await uploadImageToStorage(item.file, imagePath);
        return {
          type: 'image',
          value: imageUrl
        };
      } else if (item.type === 'text') {
        return {
          type: 'text',
          value: item.value
        };
      } else if (item.type === 'code') {
        return {
          type: 'code',
          language: item.language,
          title: item.title || 'Code Snippet',
          value: item.value
        };
      } else if (item.type === 'link') {
        return {
          type: 'link',
          placeholder: item.placeholder,
          value: item.value
        };
      }
      return null;
    })
  ).then(processed => processed.filter(item => item !== null));
};