import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css'; 

const PostDetail = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Gọi API để lấy bài viết
        axios.get(`http://localhost:5217/api/post/${id}`)
            .then((response) => setPost(response.data))
            .catch((err) => setError(err.message));
    }, [id]);

    if (error) {
        return <p>Lỗi: {error}</p>;
    }

    if (!post) {
        return <p>Đang tải...</p>;
    }

    return (
        <div className="post-detail">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p className="author">Tác giả: {post.author}</p>
            <p className="date">Thời gian: {new Date(post.createdAt).toLocaleString()}</p>
        </div>
    );
};

export default PostDetail;
