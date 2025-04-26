import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StyleHotProduct.css';

export interface Product {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    categoryId: number;
    gendersID: number;
    newSaleID: number;
    hotSaleID: boolean;
    size: string;
    color: string;
    price: number;
    image: string;
}

const HotSaleProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 8; // Giữ số sản phẩm hiển thị giống HTML1
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('https://shopping-well-back-end-production.up.railway.app/products');
                const filteredProducts = response.data.filter(product => product.hotSaleID === true);
                setProducts(filteredProducts);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleProductClick = (id: string) => {
        navigate(`/productdetail/${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="container-hotsale">
            <div className="title">
                SẢN PHẨM <span>BÁN CHẠY</span>
            </div>

            <div className="product-grid">
                {currentProducts && currentProducts.map((product) => (
                    <div
                        className="product"
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                    >
                        <img alt={product.name} height="300" src={product.image} width="300" />
                        <div className="discount">- 17%</div>
                        <div className="name">{product.name}</div>
                        <div className="price">{product.price.toLocaleString('vi-VN')}₫</div>
                        <div className="old-price">{(product.price * 1.17).toLocaleString('vi-VN')}₫</div>
                    </div>
                ))}
            </div>

            {/* Nút phân trang */}
            <div className="pagination">
                <button className="BTN-pagination" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button className="BTN-pagination" onClick={() => paginate(currentPage + 1)}
                    disabled={!products || currentPage === Math.ceil((products.length || 0) / productsPerPage)}>
                    Next
                </button>
            </div>

            <a className="view-all" href="#">
                XEM TẤT CẢ . SẢN PHẨM BÁN CHẠY
            </a>
        </div>
    );
};

export default HotSaleProduct;
