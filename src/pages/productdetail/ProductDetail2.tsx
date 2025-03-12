import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const ProductDetail2: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

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

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    if (!product) return <p>Không tìm thấy sản phẩm!</p>;

    const stockAvailable = Object.values(product.stock).some((quantity) => quantity > 0);
    const discountPrice = product.price;
    const originalPrice = product.newSaleID ? product.price + 150000 : product.price;

    return (
        <div>
<Header2 />
        <div className="container">
            <div className="image-section">
                <img alt={product.name}   src={product.image}   />
            </div>

            <div className="details-section">
                <h1>{product.name}</h1>
                <p>SKU: {`SP${product.id}`}</p>
                <p>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i> Đánh giá
                </p>

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

                <p className="status">
                    Tình trạng: {stockAvailable ? "Còn hàng" : "Hết hàng"}
                </p>

                <div className="size-options">
                    {Object.entries(product.stock).map(([size, stock]) => (
                        <div
                            key={size}
                            className={stock === 0 ? "size-disabled" : selectedSize === size ? "size-selected" : ""}
                            onClick={() => stock > 0 && setSelectedSize(size)}
                        >
                            {size}
                        </div>
                    ))}
                </div>

                <div className="quantity">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input type="text" value={quantity} readOnly />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <div className="buy-now">MUA NGAY VỚI GIÁ {discountPrice.toLocaleString()}đ</div>
                <p>Đặt mua giao hàng tận nơi</p>

                <div className="contact">
                    Gọi đặt mua: <a href="tel:0937234783">0937.234.783</a> (miễn phí 8:30 - 21:30).
                </div>

                <div className="shipping-info">
                    <i className="fas fa-truck"></i> MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG TỪ 500.000đ
                </div>

                <div className="return-info">
                    <i className="fas fa-sync-alt"></i> ĐỔI HÀNG TRONG 3 NGÀY
                </div>
            </div>
        </div>
        <Footer/>
        </div>
        
    );
};

export default ProductDetail2;
