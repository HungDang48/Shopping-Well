import React, { useEffect, useState } from 'react';
import './Cart.css';
import Header2 from '../../components/Header/Header2';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import RecommentProduct from '../../components/RecommentMale/RecommentProduct';

// Định nghĩa interface cho item trong giỏ hàng
interface CartItem {
    id: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

// Thêm interface cho Product để lấy thông tin stock
interface Product {
    id: number;
    stock: Record<string, number>;
}

const Cart = () => {
    // Thêm state để lưu thông tin sản phẩm từ API
    const [products, setProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch products từ API để lấy thông tin stock
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
        
        // Load cart items
        const loadCartItems = () => {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        };

        loadCartItems();

        // Lắng nghe sự kiện cập nhật giỏ hàng
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart') {
                loadCartItems();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const calculateTotal = (price: number, quantity: number) => {
        return price * quantity;
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + calculateTotal(item.price, item.quantity), 0);
    };

    // Thêm hàm kiểm tra stock
    const getAvailableStock = (productId: number, size: string): number => {
        const product = products.find(p => p.id === productId);
        return product ? product.stock[size] || 0 : 0;
    };

    // Sửa lại hàm updateQuantity để kiểm tra stock
    const updateQuantity = (id: number, size: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const availableStock = getAvailableStock(id, size);
        
        if (newQuantity > availableStock) {
            alert(`Chỉ còn ${availableStock} sản phẩm trong kho!`);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === id && item.size === size
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id: number, size: string) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            const updatedCart = cartItems.filter(
                item => !(item.id === id && item.size === size)
            );
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const handleCheckOutClick = () => {
        if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        navigate('/checkout', {
            state: {
                cartItems: cartItems,
                totalPrice: calculateCartTotal(),
            }
        });
        
        // Xóa giỏ hàng sau khi chuyển sang trang checkout
        localStorage.removeItem('cart');
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
                            <div className="empty-cart">
                                <p>Giỏ hàng của bạn đang trống.</p>
                                <button onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div className="cart-item" key={`${item.id}-${item.size}`}>
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <p>Size: {item.size}</p>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            disabled={item.quantity >= getAvailableStock(item.id, item.size)}
                                        >
                                            +
                                        </button>
                                        <span className="stock-info">
                                            (Còn {getAvailableStock(item.id, item.size)} sản phẩm)
                                        </span>
                                    </div>

                                    <div className="cart-item-price">
                                        <p>{item.price.toLocaleString('vi-VN')} VND</p>
                                        <p className="total">
                                            Tổng: {calculateTotal(item.price, item.quantity).toLocaleString('vi-VN')} VND
                                        </p>
                                    </div>

                                    <div className="cart-item-action">
                                        <button 
                                            className="remove-button"
                                            onClick={() => removeItem(item.id, item.size)}
                                        >
                                            Xóa
                                        </button>
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
                                        <h4>Phí vận chuyển:</h4>
                                        <p>0 VND</p>
                                    </div>
                                    <div className="summary-item summary-total">
                                        <h4>Tổng thanh toán:</h4>
                                        <p>{calculateCartTotal().toLocaleString('vi-VN')} VND</p>
                                    </div>
                                    <button 
                                        className="checkout-button"
                                        onClick={handleCheckOutClick}
                                    >
                                        TIẾN HÀNH ĐẶT HÀNG
                                    </button>
                                    <button 
                                        className="continue-shopping"
                                        onClick={() => navigate('/')}
                                    >
                                        TIẾP TỤC MUA SẮM
                                    </button>
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
