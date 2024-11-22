import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NewsPage.css';

const NewsPage = () => {
    const [posts, setPosts] = useState([]);

    // Lấy danh sách bài đăng khi load trang
    useEffect(() => {
        axios.get('http://localhost:5217/api/post')
            .then(response => {
                const sortedPosts = response.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setPosts(sortedPosts.reverse()); 
            })
            .catch(error => console.error('Lỗi:', error));
    }, []);

    return (
        <div className="news-page">
            {/* Nội dung chính */}
            <div className="main-content">
                <h2>Tin mới</h2>
                {posts.map(post => (
                    <div key={post.id} className="post-summary">
                        <Link to={`/post/${post.id}`}>
                            <div className="post-content">
                                <img src={`http://localhost:5217${post.image_url}`} alt="post" className="post-image"/>
                                <div className="post-info"> 
                                    <h2>{post.title}</h2> {post.author} 
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsPage;