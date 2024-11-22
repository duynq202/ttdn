import React, { useState } from 'react';
import './register.css'; // Import CSS cho form đăng ký

function Register({ closeRegisterForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Thêm state cho thông báo thành công

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra điều kiện đầu vào
    if (!username || !password || !confirmPassword) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu không khớp.');
      return;
    }

    // Gọi API để đăng ký người dùng
    try {
      const response = await fetch('http://localhost:5217/api/auth/register', { // Đảm bảo đường dẫn chính xác
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Gửi username và password
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Đăng ký thành công:', data);
        setSuccessMessage('Đăng ký thành công!'); // Cập nhật thông báo thành công
        
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        setSuccessMessage(''); // Reset thông báo thành công nếu có lỗi
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setSuccessMessage(''); // Reset thông báo thành công nếu có lỗi
    }
  };

  return (
    <div className="register-form-overlay">
      <div className="register-form">
        <h2>Đăng Ký</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Hiển thị thông báo lỗi */}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Hiển thị thông báo thành công */}
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
          <label>Xác Nhận Mật Khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Đăng Ký</button>
        </form>
        <button className="close-button" onClick={closeRegisterForm}>Đóng</button> {/* Đóng form */}
      </div>
    </div>
  );
}

export default Register;
