import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header2";

// Định nghĩa interface User
interface User {
  id: number;
  UserID: number; // ✅ Thêm UserID vào interface
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // API endpoint (nên dùng biến môi trường)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Xử lý khi nhấn vào "Đăng kí"
  const handleRegisterClick = () => {
    navigate("/Register");
  };

  // Xử lý khi người dùng submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Reset lỗi cũ

    try {
      // Gọi API lấy danh sách người dùng
      const response = await axios.get<User[]>(`${API_URL}/User`);
      const users = response.data;

      // Kiểm tra thông tin đăng nhập
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        const userData = {
          userID: user.UserID, // ✅ Đảm bảo lưu userID đúng
          email: user.email, // ✅ Có thể cần nếu dùng sau này
        };
        localStorage.setItem("user", JSON.stringify(userData)); // ✅ Lưu dưới dạng object
        navigate("/HomePage"); // Chuyển hướng
      } else {
        setErrorMessage("Email hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="box">
      <Header />
      <div className="login-container">
        <div className="top-header">
          <header>Đăng Nhập</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="text"
              className="input"
              placeholder="Email"
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
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="input-field">
            <input type="submit" className="submit" value="Đăng nhập" />
          </div>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="bottom">
          <div className="left">
            <input type="checkbox" id="check" />
            <label htmlFor="check"> Ghi nhớ đăng nhập</label>
          </div>
          <div className="right">
            <label>
              <a href="#">Quên mật khẩu?</a>
            </label>
          </div>
        </div>

        <div className="register-link">
          <p>
            Chưa có tài khoản?{" "}
            <button onClick={handleRegisterClick} className="register-button">
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
