import React, { useState } from 'react';
import './navbar.css'; 
import Register from './Register'; 
import Login from './Login';
import CreatePost from './CreatePost';
import EditPost from './EditPost';

function Navbar() {
  const [isPersonalMenuOpen, setPersonalMenuOpen] = useState(false);
  const [isRegisterFormOpen, setRegisterFormOpen] = useState(false);
  const [isLoginFormOpen, setLoginFormOpen] = useState(false);
  const [user, setUser ] = useState(null); // Trạng thái người dùng
  const [isEditPostOpen, setEditPostOpen] = useState(false); // Trạng thái hiển thị EditPost

  const togglePersonalMenu = () => {
    setPersonalMenuOpen(!isPersonalMenuOpen);
  };

  const openLoginForm = () => {
    setLoginFormOpen(true); 
  };

  const closeLoginForm = () => {
    setLoginFormOpen(false);
  };

  const openRegisterForm = () => {
    setRegisterFormOpen(true); 
  };

  const closeRegisterForm = () => {
    setRegisterFormOpen(false);
  };

  const handleLoginSuccess = (username) => {
    setUser (username); // Cập nhật trạng thái người dùng khi đăng nhập
    setLoginFormOpen(false);
  };

  const handleLogout = () => {
    setUser (null); // Xóa trạng thái người dùng khi đăng xuất
    setPersonalMenuOpen(false);
    setEditPostOpen(false); // Đóng EditPost khi đăng xuất
  };

  const openEditPost = () => {
    setEditPostOpen(true); // Mở EditPost
    setPersonalMenuOpen(false); // Đóng menu cá nhân
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <a href='/'><img src='/img/bm-logo.png' alt='Logo'></img></a>
          </div>
          <ul className="navbar-menu">
            <li className="menu-item"><a href="/">Trang Chủ</a></li>
            <li className="menu-item"><a href="/">Thế Giới</a></li>
            <li className="menu-item"><a href="/">Kinh Doanh</a></li>
            <li className="menu-item"><a href="/">Giải Trí</a></li>
            <li className="menu-item"><a href="/">Thể Thao</a></li>
            <li className="menu-item"><a href="/">Công Nghệ</a></li>
            
            <li className="menu-item personal-menu" onClick={togglePersonalMenu}>
              <a href="#">
                <img src="/img/avatar.png" alt="Avatar" className="avatar-icon" />
              </a>
              {isPersonalMenuOpen && (
                <ul className="personal-dropdown">
                  {user ? (
                    <>
                      <li><span>Xin chào, {user}!</span></li>
                      <li><a href="#" onClick={handleLogout}>Đăng Xuất</a></li>
                      {/* Hiển thị "Chỉnh sửa bài viết" nếu user là admin */}
                      {user === 'admin' && (
                        <li><a href="#" onClick={openEditPost}>Chỉnh sửa bài viết</a></li>
                      )}
                    </>
                  ) : (
                    <>
                      <li><a href="#" onClick={openLoginForm}>Đăng Nhập</a></li>
                      <li><a href="#" onClick={openRegisterForm}>Đăng Ký</a></li>
                    </>
                  )}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {isRegisterFormOpen && (
        <Register closeRegisterForm={closeRegisterForm} /> 
      )}
      {isLoginFormOpen && (
        <Login closeLoginForm={closeLoginForm} onLoginSuccess={handleLoginSuccess} /> 
      )}
      
      {/* Hiển thị CreatePost nếu user đã đăng nhập */}
      {user && <CreatePost />}
      {/* Hiển thị EditPost nếu isEditPostOpen là true */}
      {isEditPostOpen && <EditPost />}
    </div>
  );
}

export default Navbar;