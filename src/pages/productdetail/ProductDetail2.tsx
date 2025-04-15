import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetail2.css';
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

const ProductDetail2: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [activeTab, setActiveTab] = useState('prod-details');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/products/${id}`);
                if (!response.ok) throw new Error("Không thể lấy thông tin sản phẩm!");
                const data: Product = await response.json();
                setProduct(data);

                // Chọn size đầu tiên mặc định nếu có
                const availableSizes = Object.keys(data.stock);
                if (availableSizes.length > 0) {
                    setSelectedSize(availableSizes[0]);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;
    if (!product) return <div className="not-found">Không tìm thấy sản phẩm!</div>;

    const stockAvailable = Object.values(product.stock).some((quantity) => quantity > 0);
    const discountPrice = product.price;
    const originalPrice = product.newSaleID ? product.price + 150000 : product.price;

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (selectedSize && newQuantity > 0 && newQuantity <= product.stock[selectedSize]) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div>
            <Header2 />
            <div className="auto-container">
                <div className="upper-box">
                    <div className="row">
                        {/* Gallery Column */}
                        <div className="col-lg-6 col-md-12">
                            <div className="product-image">
                                <img src={product.image} alt={product.name} className="main-image" />
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="col-lg-6 col-md-12">
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                
                                <div className="rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className="fa fa-star"></span>
                                    ))}
                                    <span>(4 đánh giá)</span>
                                </div>

                                <div className="price">
                                    <span className="current-price">{discountPrice.toLocaleString()}đ</span>
                                    {product.newSaleID && (
                                        <span className="original-price">{originalPrice.toLocaleString()}đ</span>
                                    )}
                                </div>

                                <div className="size-selection">
                                    <h4>Kích thước:</h4>
                                    <div className="size-options">
                                        {Object.entries(product.stock).map(([size, stock]) => (
                                            <button
                                                key={size}
                                                className={`size-button ${selectedSize === size ? 'active' : ''} ${stock === 0 ? 'disabled' : ''}`}
                                                onClick={() => stock > 0 && setSelectedSize(size)}
                                                disabled={stock === 0}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="quantity-section">
                                    <h4>Số lượng:</h4>
                                    <div className="quantity-selector">
                                        <button onClick={() => handleQuantityChange(-1)}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => handleQuantityChange(1)}>+</button>
                                    </div>
                                </div>

                                <div className="stock-info">
                                    {selectedSize && (
                                        <p>Còn lại: {product.stock[selectedSize]} sản phẩm</p>
                                    )}
                                </div>

                                <div className="action-buttons">
                                    <button 
                                        className="add-to-cart"
                                        disabled={!selectedSize || !stockAvailable}
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>

                                <div className="product-meta">
                                    <div className="categories">
                                        <span>Danh mục:</span> Giày thể thao
                                    </div>
                                    <div className="tags">
                                        <span>Tags:</span> Giày nam, Thể thao
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Tabs */}
                <div className="product-tabs">
                    <div className="tab-buttons">
                        <button 
                            className={activeTab === 'prod-details' ? 'active' : ''}
                            onClick={() => setActiveTab('prod-details')}
                        >
                            Chi tiết sản phẩm
                        </button>
                        <button 
                            className={activeTab === 'prod-info' ? 'active' : ''}
                            onClick={() => setActiveTab('prod-info')}
                        >
                            Thông tin thêm
                        </button>
                        <button 
                            className={activeTab === 'prod-review' ? 'active' : ''}
                            onClick={() => setActiveTab('prod-review')}
                        >
                            Đánh giá
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'prod-details' && (
                            <div className="product-description">
                                <h4>Mô tả sản phẩm</h4>
                                <p>Thông tin chi tiết về sản phẩm sẽ được hiển thị ở đây.</p>
                            </div>
                        )}

                        {activeTab === 'prod-info' && (
                            <div className="additional-info">
                                <h4>Thông tin thêm</h4>
                                <p>Các thông tin bổ sung về sản phẩm.</p>
                            </div>
                        )}

                        {activeTab === 'prod-review' && (
                            <div className="reviews">
                                <h4>Đánh giá từ khách hàng</h4>
                                <p>Chưa có đánh giá nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail2;
