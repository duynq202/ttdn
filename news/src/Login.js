import React, { useState } from 'react';
import './Login.css'; 

function Login({ closeLoginForm, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5217/api/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(username); // Cập nhật trạng thái đăng nhập thành công
        setSuccessMessage('Đăng nhập thành công!');
        closeLoginForm();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-form-overlay">
      <div className="login-form">
        <h2>Đăng Nhập</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>Tên tài khoản</label>
          <input
            type="text"
            placeholder="Nhập tên tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Mật Khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Đăng Nhập</button>
        </form>
        <button className="close-button" onClick={closeLoginForm}>Đóng</button>
      </div>
    </div>
  );
}

export default Login;
