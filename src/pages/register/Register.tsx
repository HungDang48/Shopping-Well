import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Header2 from '../../components/Header/Header2';

interface User {
  id: number;
  UserID: number;
  name: string;
  username: string;
  email: string;
  birthday: string;
  gender: string;
  password: string;
}

const Register = () => {
  const [formData, setFormData] = useState({
    id: '',
    UserID: '',
    fullname: '',
    username: '',
    email: '',
    birthday: '',
    gender: 'male',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  // Hàm tạo ID mới tự động tăng
  const generateNewId = async (): Promise<number | null> => {
    try {
      const response = await axios.get<User[]>('http://localhost:5000/User');
      const users = response.data;

      const maxId = users.reduce((maxId: number, user: User) => 
        user.id > maxId ? user.id : maxId, 0
      );

      return maxId + 1;
    } catch (error) {
      console.error('Error generating new user ID:', error);
      return null;
    }
  };

  // Hàm tạo UserID mới tự động tăng
  const generateNewUserID = async (): Promise<number | null> => {
    try {
      const response = await axios.get<User[]>('http://localhost:5000/User');
      const users = response.data;

      const maxUserID = users.reduce((maxUserID: number, user: User) => 
        user.UserID > maxUserID ? user.UserID : maxUserID, 0
      );

      return maxUserID + 1;
    } catch (error) {
      console.error('Error generating new UserID:', error);
      return null;
    }
  };

  // Hàm kiểm tra email đã tồn tại chưa
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get<User[]>('http://localhost:5000/User');
      const users = response.data;

      // Kiểm tra nếu email đã tồn tại trong hệ thống
      const emailExists = users.some((user) => user.email === email);
      return emailExists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Hàm xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Kiểm tra nếu email đã tồn tại
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      setErrorMessage('Email đã tồn tại. Vui lòng nhập email khác.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      // Gọi hàm để tạo ID người dùng mới và UserID mới
      const newId = await generateNewId();
      const newUserID = await generateNewUserID();

      if (newId === null || newUserID === null) {
        setErrorMessage('Có lỗi xảy ra khi tạo ID người dùng hoặc UserID. Vui lòng thử lại.');
        return;
      }

      // Gửi dữ liệu người dùng lên API để đăng ký
      const response = await axios.post('http://localhost:5000/User', {
        id: newId,  // Sử dụng ID mới tạo
        UserID: newUserID,  // Sử dụng UserID mới tạo
        name: formData.fullname,
        username: formData.username,
        email: formData.email,
        birthday: formData.birthday,
        gender: formData.gender,
        password: formData.password,
      });

      // Kiểm tra nếu đăng ký thành công
      if (response.status === 201) {
        setSuccessMessage('Đăng ký thành công!');
        setErrorMessage('');

        // Điều hướng đến trang Login sau khi đăng ký thành công
        setTimeout(() => navigate('/Login'), 2000);
      } else {
        setErrorMessage('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div>
      <Header2 />
      
      <div className="register-container">
        <div className="register-container-header">
        <h2>Đăng ký</h2>
        </div>
        <div className="register-container-body">
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Họ và tên:</label>
          <input type="text" id="fullname" name="fullname" required value={formData.fullname} onChange={handleChange} />

          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required value={formData.username} onChange={handleChange} />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />

          <label htmlFor="birthday">Ngày sinh:</label>
          <input type="date" id="birthday" name="birthday" required value={formData.birthday} onChange={handleChange} />

          <label htmlFor="gender">Giới tính:</label>
          <select id="gender" name="gender" required value={formData.gender} onChange={handleChange}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>

          <label htmlFor="password">Mật khẩu:</label>
          <input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} />

          <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />

          <button type="submit">Đăng ký</button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
        </div>
        
     
        
      </div>
    </div>
  );
};

export default Register;
