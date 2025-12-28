import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export const fetchAllBlogs = async () => {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const blogs = [];
    querySnapshot.forEach((docSnapshot) => {
      blogs.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });
    
    return blogs;
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    throw error;
  }
};

export const fetchBlogById = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }
    
    const blogRef = doc(db, 'blogs', blogId);
    const blogSnapshot = await getDoc(blogRef);
    
    if (!blogSnapshot.exists()) {
      return null;
    }
    
    return {
      id: blogSnapshot.id,
      ...blogSnapshot.data()
    };
  } catch (error) {
    console.error(`Error fetching blog with ID ${blogId}:`, error);
    throw error;
  }
};

export const formatBlogDate = (dateValue, options = { year: 'numeric', month: 'short', day: 'numeric' }, includeTime = true) => {
  if (!dateValue) return 'Unknown date';
  
  try {
    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    const dateStr = date.toLocaleDateString('en-US', options);
    
    if (includeTime) {
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${dateStr} ${timeStr}`;
    }
    
    return dateStr;
  } catch (err) {
    return 'Invalid date';
  }
};

export const incrementBlogViews = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }
    
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error(`Error incrementing views for blog ${blogId}:`, error);
    throw error;
  }
};

export const trackBlogView = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }

    const storageKey = process.env.REACT_APP_BLOG_VIEWED_IDS_KEY;
    if (!storageKey) {
      throw new Error('REACT_APP_BLOG_VIEWED_IDS_KEY environment variable is not set');
    }

    const viewedIds = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
    
    if (viewedIds.includes(blogId)) {
      return false; // Already viewed in this session
    }

    await incrementBlogViews(blogId);
    viewedIds.push(blogId);
    sessionStorage.setItem(storageKey, JSON.stringify(viewedIds));
    
    return true; // View tracked successfully
  } catch (error) {
    console.error(`Error tracking view for blog ${blogId}:`, error);
    throw error;
  }
};

export const incrementBlogLikes = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }
    
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error(`Error incrementing likes for blog ${blogId}:`, error);
    throw error;
  }
};

export const decrementBlogLikes = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }
    
    const blogRef = doc(db, 'blogs', blogId);
    await updateDoc(blogRef, {
      likes: increment(-1)
    });
  } catch (error) {
    console.error(`Error decrementing likes for blog ${blogId}:`, error);
    throw error;
  }
};

export const isBlogLiked = (blogId) => {
  try {
    const storageKey = process.env.REACT_APP_BLOG_LIKED_IDS_KEY;
    if (!storageKey) {
      return false;
    }

    const likedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return likedIds.includes(blogId);
  } catch (error) {
    console.error(`Error checking if blog ${blogId} is liked:`, error);
    return false;
  }
};

export const toggleBlogLike = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }

    const storageKey = process.env.REACT_APP_BLOG_LIKED_IDS_KEY;
    if (!storageKey) {
      throw new Error('REACT_APP_BLOG_LIKED_IDS_KEY environment variable is not set');
    }

    const likedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const isLiked = likedIds.includes(blogId);

    if (isLiked) {
      await decrementBlogLikes(blogId);
      const updatedIds = likedIds.filter(id => id !== blogId);
      localStorage.setItem(storageKey, JSON.stringify(updatedIds));
      return false; // Unliked
    } else {
      await incrementBlogLikes(blogId);
      likedIds.push(blogId);
      localStorage.setItem(storageKey, JSON.stringify(likedIds));
      return true; // Liked
    }
  } catch (error) {
    console.error(`Error toggling like for blog ${blogId}:`, error);
    throw error;
  }
};

export const getAuthorId = (blog) => {
  return blog.authorId;
};

export const getAuthorDisplayName = (author) => {
  if (!author) return null;
  // Firebase stores the field as 'display_name' (with underscore)
  return author.display_name || null;
};

export const fetchAuthorById = async (authorId) => {
  try {
    if (!authorId) {
      throw new Error('Author ID is required');
    }
    
    const authorRef = doc(db, 'authors', authorId);
    const authorSnapshot = await getDoc(authorRef);
    
    if (!authorSnapshot.exists()) {
      return null;
    }
    
    return {
      id: authorSnapshot.id,
      ...authorSnapshot.data()
    };
  } catch (error) {
    console.error(`Error fetching author with ID ${authorId}:`, error);
    throw error;
  }
};

/**
 * Check if an author with the given email exists in the authors collection
 * Uses email as document ID for fast O(1) lookup
 */
export const checkAuthorEmailExists = async (email) => {
  try {
    if (!email) {
      return { exists: false, author: null };
    }

    const authorRef = doc(db, 'authors', email);
    const authorSnapshot = await getDoc(authorRef);
    
    if (authorSnapshot.exists()) {
      return {
        exists: true,
        author: {
          id: authorSnapshot.id,
          ...authorSnapshot.data()
        }
      };
    }
    
    return { exists: false, author: null };
  } catch (error) {
    console.error(`Error checking if author email exists:`, error);
    throw error;
  }
};

export const shareBlog = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }

    const blogUrl = `${window.location.origin}/blogs/${blogId}`;

    try {
      await navigator.clipboard.writeText(blogUrl);
      return true;
    } catch {
      // Fallback for older browsers or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = blogUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Fallback copy command failed');
        }
        
        return true;
      } catch (fallbackError) {
        document.body.removeChild(textArea);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error(`Error sharing blog ${blogId}:`, error);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const {
      id,
      authorId,
      title,
      subtitle,
      timeToRead,
      tags,
      content
    } = blogData;

    if (!id) {
      throw new Error('Blog ID is required');
    }

    if (!authorId) {
      throw new Error('Author ID is required');
    }

    if (!title || !title.trim()) {
      throw new Error('Blog title is required');
    }

    if (!content || !Array.isArray(content) || content.length === 0) {
      throw new Error('Blog content is required and must contain at least one content block');
    }

    // Create the blog document
    const blogRef = doc(db, 'blogs', id);
    
    const blogDocument = {
      id: id, // Store id as a field in the document
      authorId: authorId,
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      createdAt: Timestamp.now(),
      timeToRead: timeToRead ? timeToRead.trim() : '',
      tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
      content: content, // Content array with proper structure (order preserved)
      views: 0,
      likes: 0
    };

    await setDoc(blogRef, blogDocument);

    return id;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (blogId, blogData) => {
  try {
    const {
      title,
      subtitle,
      timeToRead,
      tags,
      content
    } = blogData;

    if (!blogId) {
      throw new Error('Blog ID is required');
    }

    if (!title || !title.trim()) {
      throw new Error('Blog title is required');
    }

    if (!content || !Array.isArray(content) || content.length === 0) {
      throw new Error('Blog content is required and must contain at least one content block');
    }

    // Update the blog document
    const blogRef = doc(db, 'blogs', blogId);

    const updateData = {
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '',
      timeToRead: timeToRead ? timeToRead.trim() : '',
      tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
      content: content, // Content array with proper structure (order preserved)
      updatedAt: Timestamp.now()
    };

    await updateDoc(blogRef, updateData);

    return blogId;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error('Blog ID is required');
    }

    const blogRef = doc(db, 'blogs', blogId);
    const blogSnapshot = await getDoc(blogRef);

    if (!blogSnapshot.exists()) {
      throw new Error('Blog not found');
    }

    const blogData = blogSnapshot.data();

    // Reference to deleted blogs collection
    const deletedBlogRef = doc(db, 'blogs_deleted', blogId);

    // Write the blog to blogs_deleted
    await setDoc(deletedBlogRef, {
      ...blogData,
      deletedAt: Timestamp.now()
    });

    // Remove the blog from the active blogs collection
    await deleteDoc(blogRef);

    return blogId;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};