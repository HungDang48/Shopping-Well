import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ProductDetail.css';
import Header2 from "../../components/Header/Header2";
import Footer from "../../components/Footer/Footer";

interface Product {
    id: number;
    name: string;
    categoriesID: number;
    gendersID: number;
    newSaleID: boolean;
    hotSaleID: boolean;
    stock: Record<string, number>;
    price: number;
    image: string;
    createdAt: number;
    updatedAt: number;
}

// Custom hook for product fetching
const useProduct = (id: string | undefined) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://shopping-well-back-end-production.up.railway.app/products/${id}`);
                if (!response.ok) throw new Error("Không thể lấy thông tin sản phẩm!");
                const data: Product = await response.json();
                setProduct(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    return { product, loading, error };
};

// Custom hook for cart management
const useCart = () => {
    const navigate = useNavigate();

    const addToCart = (product: Product, selectedSize: string, quantity: number) => {
        // Kiểm tra user đã đăng nhập chưa
        const user = localStorage.getItem('user');
        if (!user) {
            if (window.confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Đến trang đăng nhập?')) {
                navigate('/login');
            }
            return false;
        }

        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingIndex = cartItems.findIndex(
            (item: any) => item.id === product.id && item.size === selectedSize
        );

        if (existingIndex !== -1) {
            // Kiểm tra số lượng tồn kho trước khi cộng thêm
            const newQuantity = cartItems[existingIndex].quantity + quantity;
            if (newQuantity > product.stock[selectedSize]) {
                alert(`Chỉ còn ${product.stock[selectedSize]} sản phẩm trong kho!`);
                return false;
            }
            cartItems[existingIndex].quantity = newQuantity;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                size: selectedSize,
                quantity,
                price: product.newSaleID ? product.price : product.price + 150000,
                image: product.image,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));
        return true;
    };

    return { addToCart };
};

// Custom hook for product selection
const useProductSelection = (product: Product | null) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [outOfStockMessage, setOutOfStockMessage] = useState<string | null>(null);
    const [maxQuantityMessage, setMaxQuantityMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedSize && product) {
            const stockAvailable = product.stock[selectedSize];
            if (stockAvailable === 0) {
                setQuantity(0);
            } else {
                setQuantity(Math.min(1, stockAvailable));
            }
        }
    }, [selectedSize, product]);

    useEffect(() => {
        if (product) {
            const availableSizes = Object.keys(product.stock);
            if (availableSizes.length > 0) {
                setSelectedSize(availableSizes[0]);
            }
        }
    }, [product]);

    return {
        selectedSize,
        setSelectedSize,
        quantity,
        setQuantity,
        outOfStockMessage,
        setOutOfStockMessage,
        maxQuantityMessage,
        setMaxQuantityMessage
    };
};

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading, error } = useProduct(id);
    const { addToCart } = useCart();
    const {
        selectedSize,
        setSelectedSize,
        quantity,
        setQuantity,
        outOfStockMessage,
        setOutOfStockMessage,
        maxQuantityMessage,
        setMaxQuantityMessage
    } = useProductSelection(product);
    const navigate = useNavigate();

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <p>Lỗi: {error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
    );
    
    if (!product) return <p>Không tìm thấy sản phẩm!</p>;

    const stockAvailable = Object.values(product.stock).some((quantity) => quantity > 0);
    const discountPrice = product.newSaleID ? product.price : product.price + 150000;
    const originalPrice = product.newSaleID ? product.price + 150000 : product.price;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Vui lòng chọn size!");
            return;
        }
        if (quantity <= 0) {
            alert("Sản phẩm đã hết hàng!");
            return;
        }

        // Kiểm tra số lượng tồn kho
        if (quantity > product.stock[selectedSize]) {
            alert(`Chỉ còn ${product.stock[selectedSize]} sản phẩm trong kho!`);
            return;
        }

        const success = addToCart(product, selectedSize, quantity);
        if (success) {
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        }
    };

    return (
        <div>
            <Header2 />
            <div className="container">
                <div className="image-section">
                    <img alt={product.name} src={product.image} />
                    <div className="image-zoom">
                        <i className="fas fa-search-plus"></i>
                    </div>
                </div>

                <div className="details-section">
                    <h1>{product.name}</h1>
                    <p>SKU: {`SP${product.id}`}</p>
                    <div className="rating">
                        <div className="stars">
                            {[...Array(5)].map((_, index) => (
                                <i key={index} className="fas fa-star"></i>
                            ))}
                        </div>
                        <span>Đánh giá</span>
                    </div>

                    <div className="price-container">
                        <p className="price">
                            {discountPrice.toLocaleString()}đ
                            {product.newSaleID && (
                                <span className="old-price">{originalPrice.toLocaleString()}đ</span>
                            )}
                        </p>

                        {product.newSaleID && (
                            <p className="discount">
                                Tiết kiệm: {(originalPrice - discountPrice).toLocaleString()}đ
                            </p>
                        )}
                    </div>

                    <p className={`status ${stockAvailable ? "in-stock" : "out-of-stock"}`}>
                        Tình trạng: {stockAvailable ? "Còn hàng" : "Hết hàng"}
                    </p>

                    <div className="size-options">
                        {Object.entries(product.stock).map(([size, stock]) => (
                            <button
                                key={size}
                                className={`size-button ${stock === 0 ? "size-disabled" : selectedSize === size ? "size-selected" : ""}`}
                                onClick={() => {
                                    if (stock > 0) {
                                        setSelectedSize(size);
                                        setOutOfStockMessage(null);
                                        setMaxQuantityMessage(null);
                                    }
                                }}
                                disabled={stock === 0}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {outOfStockMessage && <p className="out-of-stock-message">{outOfStockMessage}</p>}
                    {maxQuantityMessage && <p className="max-quantity-message">{maxQuantityMessage}</p>}

                    <div className="quantity">
                        <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            disabled={quantity === 0}
                        >
                            -
                        </button>

                        <input type="text" value={quantity} readOnly />
                        <button
                            onClick={() => {
                                const maxStock = product?.stock[selectedSize!] || 1;
                                if (quantity + 1 > maxStock) {
                                    setMaxQuantityMessage("Đã đạt đến giới hạn số lượng của size này!");
                                } else {
                                    setQuantity(prev => prev + 1);
                                    setMaxQuantityMessage(null);
                                }
                            }}
                            disabled={quantity === 0}
                        >
                            +
                        </button>
                    </div>

                    <div className="buy-now" onClick={handleAddToCart}>
                        MUA NGAY VỚI GIÁ {discountPrice.toLocaleString()}đ
                    </div>

                    <div className="shipping-info">
                        <i className="fas fa-truck"></i> MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG TỪ 500.000đ
                    </div>
                    <div className="return-info">
                        <i className="fas fa-sync-alt"></i> ĐỔI HÀNG TRONG 3 NGÀY
                    </div>
                    <div className="contact">
                        Gọi đặt mua: <a href="tel:0937234783">0788.614.615</a> (8:00 - 22:30)
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;