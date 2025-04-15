import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminAccount.css';
import HeaderAdmin from '../../component/headerAdmin/HeaderAdmin';
import Modal from '../../component/modal';

interface User {
  id: number;
  AdminID: number;
  name: string;
  username: string;
  email: string;
  birthday: string;
  gender: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

const AdminAccount = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPopup1Open, setIsPopup1Open] = useState(false);
  const [isPopup2Open, setIsPopup2Open] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    birthDate: '',
    gender: 'male',
    password: '',
    confirmPassword: ''
  });

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Admins');
      setUsers(response.data); // Set the fetched users
    } catch (error) {
      console.error('There was an error fetching the users!', error);
    }
  };

  // Call API when component is rendered
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      const response = await axios.get<User[]>('http://localhost:5000/Admins');
      const userList = response.data;

      const emailExists = userList.some(user => user.email === formData.email);
      if (emailExists) {
        alert("Email đã tồn tại. Vui lòng sử dụng email khác.");
        return;
      }

      const newAdminID = userList.length > 0 ? userList[userList.length - 1].AdminID + 1 : 1;
      const newid = userList.length > 0 ? userList[userList.length - 1].id + 1 : 1;

      // Create new user
      await axios.post('http://localhost:5000/Admins', {
        id: newid,
        AdminID: newAdminID,
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        birthday: formData.birthDate,
        gender: formData.gender,
        password: formData.password,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      alert('Tạo tài khoản thành công!');
      setIsPopup1Open(false);
      fetchUsers(); // Re-fetch users after adding a new one

      setFormData({
        fullName: '',
        username: '',
        email: '',
        birthDate: '',
        gender: 'male',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      alert('Có lỗi xảy ra khi tạo tài khoản.');
    }
  };
  // Function to delete a user
  const handleDelete = async (AdminId: number) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/Admins/${AdminId}`);
      alert("Xóa tài khoản thành công!");
      fetchUsers(); // Re-fetch users to update the list
    } catch (error) {
      console.error("Có lỗi xảy ra khi xóa tài khoản:", error);
      alert("Có lỗi xảy ra khi xóa tài khoản.");
    }
  };

  const handleUpdateClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.name,
      username: user.username,
      email: user.email,
      birthDate: user.birthday,
      gender: user.gender,
      password: '',
      confirmPassword: '',
    });
    setIsPopup2Open(true);
  };

  // Function to handle updating the user
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure password confirmation matches if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      // Update user details
      await axios.put(`http://localhost:5000/Admins/${selectedUser?.id}`, {
        ...selectedUser,
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        birthday: formData.birthDate,
        gender: formData.gender,
        password: formData.password || selectedUser?.password, // Keep the old password if not updated
        updatedAt: Date.now(),
      });

      alert("Cập nhật tài khoản thành công!");
      setIsPopup2Open(false);
      fetchUsers(); // Re-fetch users after update
      setSelectedUser(null); // Reset selected user
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật tài khoản:", error);
      alert("Có lỗi xảy ra khi cập nhật tài khoản.");
    }
  };
  // Toggle the modal
  const togglePopup = () => {
    setIsPopup1Open(!isPopup1Open);
  };
  const togglePopup1 = () => {
    setIsPopup2Open(!isPopup2Open);
  };

  return (
    <div>
      <HeaderAdmin />
      <div className="admin-Account-container">
        <div className="admin-Account-container-top">

          <h1>DANH SÁCH TÀI KHOẢN ADMIN</h1>
          <button className="admin-Account-button-new-account" onClick={togglePopup} style={{ height: "40px", width: "180px" }}>
            Tạo Tài Khoản  
          </button>

          <Modal
            open={isPopup1Open}
            onClose={togglePopup}
            style={{
              padding: '20px',
              backgroundColor: '#f1f1f1',
              borderRadius: '10px',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <div className="admin-Account-popup-form-container">
              <h2>Tạo tài khoản ADMIN</h2>
              <form className="admin-Account-account-form" onSubmit={handleSubmit}>
                <label>
                  Họ và Tên:
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                </label>
                <label>
                  Username:
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                </label>
                <label>
                  Email:
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </label>
                <label>
                  Ngày Sinh:
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required />
                </label>
                <label>
                  Giới Tính:
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
                <label>
                  Mật Khẩu:
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </label>
                <label>
                  Xác Nhận Mật Khẩu:
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </label>
                <div className="admin-Account-popup-buttons">
                  <button type="submit" className="submit-button">Tạo Tài Khoản</button>
                  <button type="button" className="cancel-button" onClick={togglePopup}>Hủy</button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
        <div className="admin-Account-container-body">
          <table className="Admin-account-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Birthday</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.birthday}</td>
                  <td>{user.gender}</td>
                  <td>
                    <button
                      className="admin-Account-button-update-account"
                      onClick={() => handleUpdateClick(user)}
                    >
                      Update
                    </button>
                    <Modal
                      open={isPopup2Open}
                      onClose={() => setIsPopup2Open(false)}
                      style={{
                        padding: '20px',
                        backgroundColor: '#f1f1f1',
                        borderRadius: '10px',
                        maxWidth: '500px',
                        width: '100%',
                      }}
                    >
                      <div className="admin-Account-popup-form-container">
                        <h2>Cập Nhật Tài Khoản ADMIN</h2>
                        <form className="admin-Account-account-form" onSubmit={handleUpdateSubmit}>
                          <label>
                            Họ và Tên:
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                            />
                          </label>
                          <label>
                            Username:
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              required
                            />
                          </label>
                          <label>
                            Email:
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </label>
                          <label>
                            Ngày Sinh:
                            <input
                              type="date"
                              name="birthDate"
                              value={formData.birthDate}
                              onChange={handleInputChange}
                              required
                            />
                          </label>
                          <label>
                            Giới Tính:
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="male">Nam</option>
                              <option value="female">Nữ</option>
                              <option value="other">Khác</option>
                            </select>
                          </label>
                          <label>
                            Mật Khẩu (nếu muốn thay đổi):
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                            />
                          </label>
                          <label>
                            Xác Nhận Mật Khẩu:
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                          </label>
                          <div className="admin-Account-popup-buttons">
                            <button type="submit" className="submit-button">Lưu</button>
                            <button
                              type="button"
                              className="cancel-button"
                              onClick={() => setIsPopup2Open(false)}
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      </div>
                    </Modal>

                    <button
                      className="admin-Account-button-delete-account"
                      onClick={() => handleDelete(user.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
