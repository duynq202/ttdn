import React, { useState, useEffect } from 'react';
import './EditPost.css';

function EditPost() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        const response = await fetch('http://localhost:5217/api/post');
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
        } else {
            setErrorMessage('Không thể tải danh sách bài viết.');
        }
    } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
        setErrorMessage('Có lỗi xảy ra khi tải danh sách bài viết.');
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5217/api/post/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setSuccessMessage('Bài viết đã được xóa thành công.');
        fetchPosts(); // Cập nhật lại danh sách bài viết
      } else {
        setErrorMessage('Không thể xóa bài viết.');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    if (image) formData.append('image', image);

    try {
      const response = await fetch(
        `http://localhost:5217/api/post/${selectedPost.id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (response.ok) {
        setSuccessMessage('Bài viết đã được cập nhật thành công.');
        fetchPosts();
        resetForm();
      } else {
        setErrorMessage('Không thể cập nhật bài viết.');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra.');
    }
  };

  const resetForm = () => {
    setSelectedPost(null);
    setTitle('');
    setContent('');
    setAuthor('');
    setImage(null);
  };

  return (
    <div className="edit-post">
      <h2>Quản lý bài viết</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <div className='button'>
              <button onClick={() => handleEdit(post)}>Sửa</button>
              <button onClick={() => handleDelete(post.id)}>Xóa</button>
            </div> 
            
          </li>
        ))}
      </ul>

      {selectedPost && (
        <form onSubmit={handleSubmit}>
          <h3>Chỉnh sửa bài viết</h3>
          <label>Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Nội dung</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <label>Tác giả</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label>Ảnh</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button type="submit">Cập nhật</button>
          <button type="button" onClick={resetForm}>
            Hủy
          </button>
        </form>
      )}
    </div>
  );
}

export default EditPost;
