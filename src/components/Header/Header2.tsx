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
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const userInLocal = localStorage.getItem('user') || '';
        return userInLocal ? true : false;
    });

    const [cartItemCount, setCartItemCount] = useState<number>(0);

    useEffect(() => {
        // Lấy giỏ hàng từ localStorage
        const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');

        // Tính tổng số lượng sản phẩm trong giỏ hàng
        const totalQuantity = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
        setCartItemCount(totalQuantity);
    }, []);

    const handleLoginClick = () => navigate('/login');
    const handleRegisterClick = () => navigate('/Register');
    const handleHomePageClick = () => navigate('/Homepage');
    const handleCartClick = () => navigate('/Cart');
    const handleUserAccountClick = () => navigate('/UserAccount');
    const handleLogoutClick = () => {
        localStorage.removeItem('user'); // Xóa thông tin người dùng
        setIsLoggedIn(false); // Cập nhật lại trạng thái đăng nhập
        navigate('/Homepage');
    };

    // Kiểm tra nếu đang ở trang Login hoặc Register
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
                    <a href="#">DỊCH VỤ</a>
                    <a href="#">TIN TỨC</a>
                    <a href="#">LIÊN HỆ</a>
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
                    !isAuthPage && ( // Ẩn nút Đăng nhập / Đăng ký nếu đang ở trang login hoặc register
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
