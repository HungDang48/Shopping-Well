import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginAdmin.css';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    // Kiểm tra xem đã có admin trong localStorage và admin có AdminID không
    const admin = localStorage.getItem('admin');
    const adminData = admin ? JSON.parse(admin) : null;

    if (adminData && adminData.AdminID) {
      // Nếu đã đăng nhập và có AdminID, điều hướng ngay tới trang HomepageAdmin
      navigate('/HomepageAdmin');
    }
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(''); // Xóa thông báo lỗi trước đó

    try {
      // Gọi API để lấy danh sách admin
      const response = await axios.get('https://shopping-well-back-end-production.up.railway.app/Admins');
      const admins = response.data;

      // Tìm admin có email và password khớp
      const matchedAdmin = admins.find(
        (admin: any) => admin.email === email && admin.password === password
      );

      if (matchedAdmin) {
        // Đăng nhập thành công
        localStorage.setItem('admin', JSON.stringify(matchedAdmin)); // Lưu thông tin admin vào localStorage
        localStorage.setItem('AdminID', matchedAdmin.id); // Lưu ID admin vào localStorage
        alert(`Chào mừng ${matchedAdmin.name}!`);
        navigate('/HomepageAdmin'); // Điều hướng đến trang HomepageAdmin
      } else {
        // Đăng nhập thất bại
        setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="loginAdmin-container">
      <h2>ADMIN LOGIN</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group-Admin">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group-Admin">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default LoginAdmin;
