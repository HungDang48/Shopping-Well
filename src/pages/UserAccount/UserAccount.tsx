import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserAccount.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Modal from '../../admin/component/modal';
import { axiosClient } from '../../api/axiosClient';
import Header2 from '../../components/Header/Header2';

const UserAccount = () => {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    birthday: '',
    gender: '',
    password: '',
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Mới thay đổi: Thêm các state cho các trường thông tin cá nhân
  const [updatedName, setUpdatedName] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedBirthday, setUpdatedBirthday] = useState('');
  const [updatedGender, setUpdatedGender] = useState('');

  // Hàm gọi API để lấy thông tin người dùng
  const fetchUserData = async () => {
    const userId_local: any = localStorage.getItem('user');
    const datauser = JSON.parse(userId_local);

    if (userId_local) {
      try {
        const response = await axiosClient.get(`/User/${datauser?.id}`);
        const user = response.data;
        setUserData(user);
        setUpdatedName(user.name);
        setUpdatedUsername(user.username);
        setUpdatedBirthday(user.birthday);
        setUpdatedGender(user.gender);
      } catch (error) {
        console.error('Có lỗi khi gọi API:', error);
      }
    } else {
      console.log('Không tìm thấy UserID trong localStorage');
      // window.location.href = "/login"; // Chuyển hướng nếu cần
    }
  };

  // Sử dụng useEffect để gọi API khi component render
  useEffect(() => {
    fetchUserData();
  }, []);

  // Hàm xử lý thay đổi thông tin cá nhân
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Kiểm tra mật khẩu hiện tại có đúng không
    if (currentPassword !== userData.password) {
      alert('Mật khẩu hiện tại không đúng!');
      return;
    }
  
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận không khớp!');
      return;
    }
  
    try {
      const userId_local: any = localStorage.getItem('user');
      const datauser = JSON.parse(userId_local);
  
      if (!datauser?.id) {
        alert('Không tìm thấy thông tin người dùng!');
        return;
      }
  
      // Gửi yêu cầu cập nhật thông tin người dùng qua API
      const response = await axiosClient.put(`/User/${datauser.id}`, {
        name: updatedName,
        username: updatedUsername,
        birthday: updatedBirthday,
        gender: updatedGender,
        password: newPassword || userData.password,  // Chỉ thay đổi mật khẩu nếu có
        email: userData.email, // Giữ nguyên email
      });
  
      if (response.status === 200) {
        alert('Thông tin đã được cập nhật thành công!');
        setShowProfileModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Tự động reload trang sau khi cập nhật thành công
        window.location.reload(); // Reload lại trang để hiển thị thông tin mới
      } else {
        throw new Error('Cập nhật thông tin thất bại!');
      }
    } catch (error) {
      console.error('Có lỗi khi cập nhật thông tin:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };
  

  return (
    <div>
      <Header2 />
      <div className="profile-container-account">
        <div className="profile-card-account">
          <div className="profile-info-account">
            <div className="info-row-account">
              <label>Họ Tên:</label>
              <span>{userData.name}</span>
            </div>
            <div className="info-row-account">
              <label>Username:</label>
              <span>{userData.username}</span>
            </div>
            <div className="info-row-account">
              <label>Email:</label>
              <span>{userData.email}</span>
            </div>
            <div className="info-row-account">
              <label>Ngày Sinh:</label>
              <span>{userData.birthday}</span>
            </div>
            <div className="info-row-account">
              <label>Giới Tính:</label>
              <span>{userData.gender}</span>
            </div>
            <div className="info-row-account">
              <label>Mật khẩu:</label>
              <span>********</span>
            </div>
          </div>
          <div className="profile-change-account">
            <button
              className="change-profile-btn-account"
              onClick={() => setShowProfileModal(true)}
            >
              Thay đổi thông tin
            </button>
          </div>
        </div>

        {/* Modal thay đổi thông tin cá nhân */}
        <Modal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          style={{
            padding: '20px',
            backgroundColor: '#f1f1f1',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <form onSubmit={handleProfileUpdate}>
            <div>
              <label>Họ tên:</label>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={updatedUsername}
                onChange={(e) => setUpdatedUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Ngày sinh:</label>
              <input
                type="date"
                value={updatedBirthday}
                onChange={(e) => setUpdatedBirthday(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Giới tính:</label>
              <select
                value={updatedGender}
                onChange={(e) => setUpdatedGender(e.target.value)}
                required
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            <div>
              <label>Mật khẩu hiện tại:</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit">Cập nhật thông tin</button>
          </form>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccount;
