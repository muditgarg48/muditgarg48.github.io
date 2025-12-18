import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc 
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

export const formatBlogDate = (dateValue, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
  if (!dateValue) return 'Unknown date';
  
  try {
    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    return date.toLocaleDateString('en-US', options);
  } catch (err) {
    return 'Invalid date';
  }
};

export const parseBlogDate = (dateValue) => {
  if (!dateValue) return null;
  return dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
};