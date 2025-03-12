import React, { useEffect, useState } from 'react';
import './Cart.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import RecommentProduct from '../../components/RecommentMale/RecommentProduct';
import Header2 from '../../components/Header/Header2';

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const cart = JSON.parse(localStorage.getItem('carts') || '{}');
  
    // Lấy giỏ hàng của người dùng (dùng user.UserID để lấy cart đúng)
    const userCart = cart[user.UserID] || [];
  
    const getProductInfo = (cartItems: any[]) => {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
  
      // Ghép thông tin sản phẩm vào giỏ hàng dựa trên `id`
      return cartItems.map((item: any) => {
        const product = products.find((product: any) => product.id === item.id);
        return product ? { ...item, ...product } : item;
      });
    };
  
    setCartItems(getProductInfo(userCart));
  
    // Lắng nghe sự kiện thay đổi giỏ hàng
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('carts') || '{}');
      const updatedCartItems = updatedCart[user.UserID] || [];
      setCartItems(getProductInfo(updatedCartItems));
    };
  
    window.addEventListener('cartUpdated', handleCartUpdate);
  
    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const calculateTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + calculateTotal(item.price, item.quantity), 0);
  };

  const updateQuantity = (id: string, color: string, quantity: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === id && item.color === color ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('carts', JSON.stringify({ user: updatedCart }));
  };

  const increaseQuantity = (id: string, color: string) => {
    const updatedCart = cartItems.map(item =>
      item.id === id && item.color === color ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('carts', JSON.stringify({ user: updatedCart }));
  };

  const decreaseQuantity = (id: string, color: string) => {
    const updatedCart = cartItems.map(item =>
      item.id === id && item.color === color && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('carts', JSON.stringify({ user: updatedCart }));
  };

  const removeItem = (id: string, color: string) => {
    const updatedCart = cartItems.filter(item => !(item.id === id && item.color === color));
    setCartItems(updatedCart);
    localStorage.setItem('carts', JSON.stringify({ user: updatedCart }));
  };

  const handleCheckOutClick = () => {
    navigate('/checkout', {
      state: {
        cartItems: cartItems,
        totalPrice: calculateCartTotal(),
      }
    });
  
    // Sau khi điều hướng tới trang Checkout, xóa giỏ hàng khỏi localStorage
    localStorage.removeItem('carts');
  };
  

  const clearCartAfterOrder = () => {
    // Xóa toàn bộ giỏ hàng từ localStorage
    localStorage.removeItem('carts');
    setCartItems([]);
  };

  return (
    <div>
      <Header2 />
      <main>
        <div className="container">
          <div className="cart">
            <div className="cart-header">
              <div>Hình ảnh</div>
              <div>Thông tin</div>
              <div>Số lượng</div>
              <div>Giá tiền</div>
              <div>Thao tác</div>
            </div>

            {cartItems.length === 0 ? (
              <p>Giỏ hàng của bạn đang trống.</p>
            ) : (
              cartItems.map((item, index) => (
                <div className="cart-item" key={index}>
                  <img alt={item.name} src={item.image} />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>- Màu: {item.color}</p>
                    <p>- Kích thước: {item.size || 'Không có'}</p>
                    <a href="#">Xem lại</a>
                  </div>

                  <div className="cart-item-quantity">
                    <button onClick={() => decreaseQuantity(item.id, item.color)}>-</button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={e => updateQuantity(item.id, item.color, Number(e.target.value))}
                    />
                    <button onClick={() => increaseQuantity(item.id, item.color)}>+</button>
                  </div>

                  <div className="cart-item-price">
                    {item.price.toLocaleString('vi-VN')} VND
                  </div>

                  <div className="cart-item-action">
                    <button onClick={() => removeItem(item.id, item.color)}>Xóa</button>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="cart-total">
                <div className="summary">
                  <div className="summary-item">
                    <h4>Tổng tiền hàng:</h4>
                    <p>{calculateCartTotal().toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div className="summary-item">
                    <h4>Tạm tính:</h4>
                    <p>{calculateCartTotal().toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div className="summary-item summary-total">
                    <h4>Tổng tiền:</h4>
                    <p>{calculateCartTotal().toLocaleString('vi-VN')} VND</p>
                  </div>
                  <button className="checkout" onClick={handleCheckOutClick}>
                    TIẾN HÀNH ĐẶT HÀNG
                  </button>
                  <button className="add-more">MUA THÊM SẢN PHẨM</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <RecommentProduct />
      <Footer />
    </div>
  );
};

export default Cart;
