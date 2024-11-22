import React, { useState } from 'react';
import './CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // kiểm tra các trường hợp thiếu dữ liệu
    if (!title || !content || !author || !image) {
        setErrorMessage('Vui lòng điền đầy đủ thông tin.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('image', image); 
    try {
        const response = await fetch('http://localhost:5217/api/post/create', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setSuccessMessage('Bài viết đã được đăng thành công!');
            setErrorMessage('');
            resetForm();
        } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || 'Đăng bài thất bại. Vui lòng thử lại.');
            setSuccessMessage('');
        }
    } catch (error) {
        console.error('Lỗi khi đăng bài:', error);
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        setSuccessMessage('');
    }
};


  const resetForm = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setImage(null);
  };

  return (
    <div className="create-post-form">
      <h2>Đăng Bài Mới</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Tiêu Đề</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài viết" />

        <label>Nội Dung</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung bài viết"></textarea>

        <label>Tác Giả</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nhập tên tác giả" />

        <label>Ảnh</label>
        <input type="file"name="image_url" onChange={handleImageChange} />

        <button type="submit">Đăng</button>
      </form>
    </div>
  );
}

export default CreatePost;
