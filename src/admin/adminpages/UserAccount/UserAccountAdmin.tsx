import './UserAccount.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import Modal from '../../component/modal';
import HeaderAdmin from '../../component/headerAdmin/HeaderAdmin';


export interface User {
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
}

const UserAccount: React.FC = () => {
    const [userList, setUserList] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userId, setUserId] = useState<number | null>(null);
    const [isPopup1Open, setIsPopup1Open] = useState(false);




    // popup 2
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [editUserData, setEditUserData] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        id: '',
        UserID: '',
        fullName: '',
        username: '',
        email: '',
        birthDate: '',
        gender: '',
        password: '',
        confirmPassword: '',

    });

    const togglePopup1 = () => setIsEditPopupOpen(!isEditPopupOpen);

    const onUpdate = (userID: number) => {
        setUserId(userID);
        togglePopup1();
    };

    const onCancel = () => {
        setUserId(null);
        togglePopup1();
    }


    const handleDelete = async (userId: number) => {
        try {
            // Gửi yêu cầu DELETE đến API để xoá người dùng
            await axios.delete(`https://shopping-well-back-end-production.up.railway.app/User/${userId}`);

            // Thông báo xoá thành công
            alert('Xoá tài khoản thành công!');

            // Cập nhật lại danh sách người dùng sau khi xoá
            setUserList((prevUserList) => prevUserList?.filter(user => user.id !== userId) || []);
        } catch (error) {
            console.error("Xoá tài khoản thất bại:", error);
            alert('Có lỗi xảy ra khi xoá tài khoản.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const fetchUserData = async (userId: number) => {
        try {
            const response = await axios.get(`https://shopping-well-back-end-production.up.railway.app/User/${userId}`);
            const userData = response.data;

            // Map API response fields to form fields
            setFormData({
                id: userData.id || '',
                UserID: userData.UserID || '',
                fullName: userData.name || '',
                username: userData.username || '',
                email: userData.email || '',
                birthDate: userData.birthday || '',
                gender: userData.gender || '',
                password: userData.password || '',
                confirmPassword: userData.password || '',
            });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    // Fetch user data when popup is opened
    useEffect(() => {
        if (isEditPopupOpen && userId) {
            fetchUserData(userId);
        }
    }, [isEditPopupOpen, userId]);

    // Handle form input changes
    const handleInputChangeUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    // Handle form submission
    const handleSubmitUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra xem password và confirmPassword có khớp nhau không
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu và Xác nhận mật khẩu không khớp!');
            return;
        }

        try {
            // Gửi PATCH request đến API
            await axios.patch(`https://shopping-well-back-end-production.up.railway.app/User/${userId}`, {
                id: userId,
                UserID: formData.UserID || '',
                name: formData.fullName || '',
                username: formData.username || '',
                email: formData.email || '',
                birthDate: formData.birthDate || '',
                gender: formData.gender || '',
                password: formData.password || '',
            });
            alert('Cập nhật thông tin thành công!');
            togglePopup1(); // Đóng popup sau khi cập nhật
            const response = await axios.get<User[]>('https://shopping-well-back-end-production.up.railway.app/User');
            setUserList(response.data);
        } catch (error) {
            console.error('Cập nhật thất bại:', error);
            alert('Cập nhật thông tin thất bại!');
        }
        setUserId(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra xem password và confirmPassword có kh��p nhau không

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        const emailExists = userList?.some(user => user.email === formData.email);
        if (emailExists) {
            alert("Email đã tồn tại. Vui lòng sử dụng email khác.");
            return;
        }

        const newUserID = userList && userList.length > 0 ? userList[userList.length - 1].UserID + 1 : 1;
        const newid = userList && userList.length > 0 ? userList[userList.length - 1].id + 1 : 1;

        try {
            await axios.post('https://shopping-well-back-end-production.up.railway.app/User', {
                id: newid,
                UserID: newUserID,
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

            const response = await axios.get<User[]>('https://shopping-well-back-end-production.up.railway.app/User');
            setUserList(response.data);

            setFormData({
                id: '',
                UserID: '',
                fullName: '',
                username: '',
                email: '',
                birthDate: '',
                gender: '',
                password: '',
                confirmPassword: '',
            });

        } catch (error) {
            console.error("Đã có lỗi xảy ra:", error);
            alert('Có lỗi xảy ra khi tạo tài khoản.');
        }
    };

    const handleEdit = (userId: number) => {
        const selectedUser = userList?.find(user => user.id === userId);
        setEditUserData(selectedUser || null);
        setIsEditPopupOpen(true);
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get<User[]>('https://shopping-well-back-end-production.up.railway.app/User');
                setUserList(response.data);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = userList ? userList.slice(indexOfFirstUser, indexOfLastUser) : [];

    const togglePopup = () => {
        setIsPopup1Open(!isPopup1Open);
    };

    return (
        <div>
            <HeaderAdmin />
            <div className="user-account-container">
                <div className="user-account-container-top">
                    <h1>DANH SÁCH TÀI KHOẢN</h1>
                    <button className="user-account-button-new-account" onClick={togglePopup}  style={{ height: "40px", width: "180px" }}>
                        Tạo Tài Khoản  
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

                        <div className="popup-form-container">
                            <h2>Tạo tài khoản cho người dùng</h2>
                            <form className="user-account-account-form" onSubmit={handleSubmit}>
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
                                <div className="popup-buttons">
                                    <button type="submit" className="submit-button">Tạo Tài Khoản</button>
                                    <button type="button" className="cancel-button">Hủy</button>

                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>

                <div className="user-account-container-bottom">
                    <table className="user-account-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Họ Và Tên</th>
                                <th>UserName</th>
                                <th>Email</th>
                                <th>Birthday</th>
                                <th>Gender</th>
                                
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.birthday}</td>
                                    <td>{user.gender}</td>
                                    
                                    <td>
                                        <button className="user-account-button-new-account" onClick={() => onUpdate(user.id)} >
                                            UPDATE
                                        </button>
                                        <Modal
                                            open={isEditPopupOpen}
                                            onClose={togglePopup1}
                                            style={{
                                                padding: '20px',
                                                backgroundColor: '#f1f1f1',
                                                borderRadius: '10px',
                                                maxWidth: '500px',
                                                width: '100%',
                                            }}

                                        >
                                            <div className="popup-form-container">
                                                <h2>Cập nhật tài khoản người dùng</h2>
                                                <form className="user-account-account-form" onSubmit={handleSubmitUpdate}>
                                                    <label>
                                                        Họ và Tên:
                                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChangeUpdate} required />
                                                    </label>
                                                    <label>
                                                        Username:
                                                        <input type="text" name="username" value={formData.username} onChange={handleInputChangeUpdate} required />
                                                    </label>
                                                    <label>
                                                        Email:
                                                        <input type="email" name="email" value={formData.email} onChange={handleInputChangeUpdate} required />
                                                    </label>
                                                    <label>
                                                        Ngày Sinh:
                                                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChangeUpdate} required />
                                                    </label>
                                                    <label>
                                                        Giới Tính:
                                                        <select name="gender" value={formData.gender} onChange={handleInputChangeUpdate} required>
                                                            <option value="male">Nam</option>
                                                            <option value="female">Nữ</option>
                                                            <option value="other">Khác</option>
                                                        </select>
                                                    </label>
                                                    {/* <label>
                                                        Mật Khẩu:
                                                        <input type="text" name="password" value={formData.password} onChange={handleInputChangeUpdate} required />
                                                    </label>
                                                    <label>
                                                        Xác Nhận Mật Khẩu:
                                                        <input type="text" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChangeUpdate} required />
                                                    </label> */}
                                                    <div className="popup-buttons">
                                                        <button type="submit" className="submit-button">Cập nhật</button>
                                                        <button type="button" className="cancel-button" onClick={onCancel}>Hủy</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </Modal>
                                        <button className="red" onClick={() => handleDelete(user.id)}>
                                            Xóa Bỏ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                </div>
                <div className="pagination">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Prev</button>
                    <span>{currentPage}</span>
                    <button onClick={() => setCurrentPage(prev => (userList && prev < Math.ceil(userList.length / usersPerPage)) ? prev + 1 : prev)}>Next</button>
                </div>
            </div>
        </div>

    );
};

export default UserAccount;
