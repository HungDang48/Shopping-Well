  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import './UserAccount.css';
  import Header2 from '../../components/Header/Header2';
  import Footer from '../../components/Footer/Footer';
  import Modal from '../../admin/component/modal';
  import axios from 'axios';

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
    email: string;
  }

  const API_BASE_URL = 'https://shopping-well-back-end-production.up.railway.app';

  const UserAccount = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Modal and form states
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedBirthday, setUpdatedBirthday] = useState('');
    const [updatedGender, setUpdatedGender] = useState('');

    const fetchUserData = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    
        if (!localUser.userID) {
          console.error("❌ Không tìm thấy userID trong localStorage");
          setIsLoading(false); // Thêm dòng này!
          return;
        }
    
        const response = await axios.get(`${API_BASE_URL}/User`, {
          params: { userID: localUser.userID }
        });
    
        const user = Array.isArray(response.data) ? response.data[0] : response.data;
        setUserData(user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
      } finally {
        setIsLoading(false); // Luôn setIsLoading false bất kể lỗi hay thành công
      }
    };
    
    useEffect(() => {
      if (showProfileModal && userData) {
        setUpdatedName(userData.name || '');
        setUpdatedUsername(userData.username || '');
        setUpdatedBirthday(userData.birthday || '');
        setUpdatedGender(userData.gender || 'Other');
      }
    }, [showProfileModal, userData]);
    

    useEffect(() => {
      fetchUserData();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userData) return;

      setIsLoading(true);

      try {
        const updateData = {
          ...userData,
          name: updatedName,
          username: updatedUsername,
          birthday: updatedBirthday,
          birthDate: updatedBirthday,
          gender: updatedGender.toLowerCase(),
          updatedAt: Date.now(),
        };

        // Đổi mật khẩu nếu có nhập
        if (newPassword) {
          if (currentPassword !== userData.password) {
            alert('Mật khẩu hiện tại không đúng!');
            setIsLoading(false);
            return;
          }

          if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và xác nhận không khớp!');
            setIsLoading(false);
            return;
          }

          updateData.password = newPassword;
        }

        const response = await axios.put(`${API_BASE_URL}/User/${userData.id}`, updateData);

        if (response.status === 200) {
          alert('Cập nhật thành công!');
          setShowProfileModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          fetchUserData(); // Reload updated info
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin!');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading || !userData) {
      return <div className="loading">Đang tải thông tin...</div>;
    }

    return (
      <div>
        <Header2 />
        <div className="profile-container-account">
          <div className="profile-card-account">
            <div className="profile-info-account">
              <div className="info-row-account"><label>Họ Tên:</label><span>{userData.name}</span></div>
              <div className="info-row-account"><label>Username:</label><span>{userData.username}</span></div>
              <div className="info-row-account"><label>Email:</label><span>{userData.email}</span></div>
              <div className="info-row-account"><label>Ngày Sinh:</label><span>{userData.birthday}</span></div>
              <div className="info-row-account"><label>Giới Tính:</label><span>{userData.gender}</span></div>
            </div>
            <div className="profile-change-account">
              <button className="change-profile-btn-account" onClick={() => setShowProfileModal(true)}>
                Thay đổi thông tin
              </button>
            </div>
          </div>

          <Modal
            open={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            style={{ padding: '20px', backgroundColor: '#f1f1f1', borderRadius: '10px', maxWidth: '400px', width: '100%' }}
          >
            <form onSubmit={handleProfileUpdate}>
              <div><label>Họ tên:</label><input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} required /></div>
              <div><label>Username:</label><input type="text" value={updatedUsername} onChange={(e) => setUpdatedUsername(e.target.value)} required /></div>
              <div><label>Ngày sinh:</label><input type="date" value={updatedBirthday} onChange={(e) => setUpdatedBirthday(e.target.value)} required /></div>
              <div>
                <label>Giới tính:</label>
                <select value={updatedGender} onChange={(e) => setUpdatedGender(e.target.value)} required>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              <div className="password-change-section">
                <h4>Đổi mật khẩu (không bắt buộc)</h4>
                <div><label>Mật khẩu hiện tại:</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
                <div><label>Mật khẩu mới:</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                <div><label>Xác nhận mật khẩu mới:</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowProfileModal(false)}>
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
