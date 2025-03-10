import React, { useState, useEffect } from 'react';
import './HeaderAdmin.css';
import { useNavigate } from 'react-router-dom';

const HeaderAdmin = () => {
  const navigate = useNavigate();

  // Lấy dữ liệu admin từ localStorage
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    // Xóa dữ liệu admin trong localStorage
    localStorage.removeItem('admin');
    localStorage.removeItem('AdminID');
    alert('Đăng xuất thành công!');
    navigate('/LoginAdmin'); // Điều hướng về trang đăng nhập
  };

  const handleProductAdminClick = () => {
    navigate('/ProductAdmin');
  };

  const handleUserAccountAdminClick = () => {
    navigate('/UserAccountAdmin');
  };

  const handleAdminAccountAClick = () => {
    navigate('/AdminAccount');
  };

  const handleOrderAdminClick = () => {
    navigate('/OrderAdmin');
  };

  const handleCategoriesAdminClick = () => {
    navigate('/CategoriesAdmin');
  };

  return (
    <div>
      <div className="header-container">
        <div className="navbar">
          <div className="navbar-left">
            <div className="logo">
              <span>SHOPPING WELL</span>
            </div>
            <div className="search-bar">
              {/* <input placeholder="Type to search..." type="text" /> */}
            </div>
            <div className="nav-links">
              <a href="#" onClick={handleUserAccountAdminClick}>KHÁCH HÀNG</a>
              <a href="#" onClick={handleAdminAccountAClick}>ADMIN</a>
              <a href="#" onClick={handleOrderAdminClick}>ĐƠN HÀNG</a>
              <a href="#" onClick={handleProductAdminClick}>SẢN PHẨM</a>
              <a href="#" onClick={handleCategoriesAdminClick}>DANH MỤC</a>
            </div>
          </div>
          <div className="navbar-right">
            <div className="profile">
              {admin ? (
                <>
                   
                  <div className="name">
                    <span>{admin.name}</span>
                    <small>{admin.role || 'Admin'}</small>
                  </div>
                  <div className="button-admin">
                  <button onClick={handleLogout}>Đăng xuất</button>
                  </div>
                 
                </>
              ) : (
                <span>Chưa có người dùng đăng nhập</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
