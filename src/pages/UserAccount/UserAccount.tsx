import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAccount.css';
import Header2 from '../../components/Header/Header2';
import Footer from '../../components/Footer/Footer';
import Modal from '../../admin/component/modal';
import { axiosClient } from '../../api/axiosClient';

interface User {
  id: number;
  UserID: number;
  name: string;
  username: string;
  email: string;
  birthday: string;
  gender: string;
  password: string;
  createdAt: number;
  updatedAt: number;
  birthDate: string;
}

interface LocalUser {
  userID: number;
}

const UserAccount = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>({
    id: 0,
    UserID: 0,
    name: '',
    username: '',
    email: '',
    birthday: '',
    gender: '',
    password: '',
    createdAt: 0,
    updatedAt: 0,
    birthDate: ''
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedBirthday, setUpdatedBirthday] = useState('');
  const [updatedGender, setUpdatedGender] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        alert('Vui lòng đăng nhập để xem thông tin');
        navigate('/login');
        return;
      }

      const localUser = JSON.parse(userDataString) as LocalUser;
      console.log("Local user data:", localUser);

      const response = await axiosClient.get<User[]>('/User');
      const users = response.data;
      console.log("API response:", users);

      const matchedUser = users.find((user: User) => user.UserID === localUser.userID);
      console.log("Matched user:", matchedUser);

      if (matchedUser) {
        setUserData(matchedUser);
        setUpdatedName(matchedUser.name || '');
        setUpdatedUsername(matchedUser.username || '');
        setUpdatedBirthday(matchedUser.birthday || '');
        setUpdatedGender(matchedUser.gender || '');
      } else {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

    } catch (error) {
      console.error('Lỗi khi lấy thông tin:', error);
      alert('Không thể lấy thông tin người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        alert('Vui lòng đăng nhập lại!');
        return;
      }

      const localUser = JSON.parse(userDataString) as LocalUser;

      // Tạo object chứa thông tin cập nhật theo đúng format API
      const updateData = {
        id: userData.id,
        UserID: userData.UserID,
        name: updatedName,
        username: updatedUsername,
        email: userData.email,
        birthday: updatedBirthday,
        birthDate: updatedBirthday,
        gender: updatedGender.toLowerCase(),
        password: userData.password,
        createdAt: userData.createdAt,
        updatedAt: Date.now()
      };

      // Chỉ thêm password vào nếu người dùng nhập mật khẩu mới
      if (newPassword) {
        // Kiểm tra mật khẩu hiện tại nếu muốn đổi mật khẩu
        if (currentPassword !== userData.password) {
          alert('Mật khẩu hiện tại không đúng!');
          setIsLoading(false);
          return;
        }

        // Kiểm tra mật khẩu mới và xác nhận
        if (newPassword !== confirmPassword) {
          alert('Mật khẩu mới và xác nhận không khớp!');
          setIsLoading(false);
          return;
        }

        updateData.password = newPassword;
      }

      // Gọi API cập nhật với endpoint đúng
      const response = await axiosClient.put(`/User/${userData.id}`, updateData);

      if (response.status === 200) {
        alert('Cập nhật thông tin thành công!');
        setShowProfileModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchUserData(); // Refresh data
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

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
            
            {/* Phần đổi mật khẩu - không bắt buộc */}
            <div className="password-change-section">
                <h4>Đổi mật khẩu (không bắt buộc)</h4>
                <div>
                    <label>Mật khẩu hiện tại:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
            </div>

            <div className="form-actions">
                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
                <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setShowProfileModal(false)}
                >
                    Hủy
                </button>
            </div>
          </form>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccount;
