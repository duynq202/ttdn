import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import NewsPage from './NewsPage';
import PostDetail from './PostDetail';
import CreatePost from './CreatePost';
import EditPost from './EditPost'; 

function App() {
    const [user, setUser ] = useState(null); // Trạng thái người dùng

    const handleLoginSuccess = (username) => {
        setUser (username);
    };

    const handleLogout = () => {
        setUser (null);
    };

    return (
        <Router>
            <div className="App">
                <Navbar onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} user={user} />
                <div className="content">
                    <Routes>
                        <Route path="/" element={user ? <CreatePost />  : <NewsPage />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;