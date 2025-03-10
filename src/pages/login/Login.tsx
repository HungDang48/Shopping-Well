import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header2';

// Định nghĩa interface User
interface User {
  id: number;
  userID: number;
  name: string;
  email: string;
  password: string;
  birthday: string;
  genders: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Xử lý khi nhấn vào "Đăng kí"
  const handleRegisterClick = () => {
    navigate('/Register');
  };

  // Xử lý khi người dùng submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Gọi API để lấy danh sách người dùng
      const response = await axios.get<User[]>('http://localhost:5000/User');
      const users = response.data;

      // Tìm người dùng có email và mật khẩu khớp
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // Lưu thông tin người dùng vào localStorage
        setErrorMessage(''); // Xóa lỗi nếu đăng nhập thành công
        navigate('/HomePage'); // Điều hướng đến trang HomePage
      } else {
        setErrorMessage('Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="box">
      <Header />
      <div className="container">
        <div className="top-header">
          <header>Iniciar Sesión</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="text"
              className="input"
              placeholder="Usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-field">
            <input
              type="password"
              className="input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="input-field">
            <input type="submit" className="submit" value="Inicio" />
          </div>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="bottom">
          <div className="left">
            <input type="checkbox" id="check" />
            <label htmlFor="check"> Recordarme</label>
          </div>
          <div className="right">
            <label><a href="#">¿Olvidaste la contraseña?</a></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
