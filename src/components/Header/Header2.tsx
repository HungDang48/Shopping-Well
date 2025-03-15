import React, { useEffect, useState } from 'react';
import './header2.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
}


const Header2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [cartItemCount, setCartItemCount] = useState<number>(0);

    useEffect(() => {
        const updateState = () => {
            const storedUser = localStorage.getItem("user");
            const user = storedUser ? JSON.parse(storedUser) : null; // ✅ Đọc từ localStorage và kiểm tra null
            const userID = user && (user.userID || user.UserID); // ✅ Đảm bảo không bị lỗi undefined
    
            setIsLoggedIn(!!userID); // ✅ Đúng cú pháp
    
            const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0));
        };
    
        updateState(); // ✅ Chạy ngay khi component load
    
        window.addEventListener("storage", updateState); // ✅ Lắng nghe thay đổi
    
        return () => {
            window.removeEventListener("storage", updateState);
        };
    }, []);
    

    const handleLoginClick = () => navigate('/login');
    const handleRegisterClick = () => navigate('/register');
    const handleHomePageClick = () => navigate('/homepage');
    const handleHomeServiceClick = () => navigate('/ServicePage');
    const handleContactClick = () => navigate('/ContactPage');
    const handleCartClick = () => navigate('/cart');
    const handleUserAccountClick = () => navigate('/userAccount');

    const handleLogoutClick = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/homepage');
    };
    const handleHomeAdminClick = () => {
        if (isLoggedIn) {
          // Nếu đã đăng nhập, cho phép vào trang Admin
          navigate('/HomepageAdmin');
        } else {
          // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập Admin
          navigate('/LoginAdmin');
        }
      };

     

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="container-header2">
            <nav className="navbar">
                <div className="logo">
                    SHOPPING WELL<br />
                    <span className="text-base">Style and beauty</span>
                </div>
                <div className="active">
                    <a href="#" onClick={handleHomePageClick}>TRANG CHỦ</a>
                    <a href="#"onClick={handleHomeServiceClick}>DỊCH VỤ</a>
                    <a href="#">TIN TỨC</a>
                    <a href="#" onClick={handleContactClick}>LIÊN HỆ</a>
                    <a href="#" onClick={handleHomeAdminClick}>TRANG ADMIN</a>
                </div>
                

                {isLoggedIn ? (
                    <>
                        <span className="icon cart-icon" onClick={handleCartClick}>
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                        </span>

                        <span className="icon user-icon">
                            <FontAwesomeIcon icon={faUser} size="lg" />
                            <div className="user-menu">
                                <a href="#" onClick={handleUserAccountClick}>Thông tin cá nhân</a>
                                <a href="#" onClick={handleLogoutClick}>Đăng xuất</a>
                            </div>
                        </span>
                    </>
                ) : (
                    !isAuthPage && (
                        <div className="auth-buttons">
                            <button onClick={handleLoginClick}>Đăng nhập</button>
                            <button onClick={handleRegisterClick}>Đăng kí</button>
                        </div>
                    )
                )}
            </nav>
        </div>
    );
};

export default Header2;
