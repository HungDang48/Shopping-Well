import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RecommentMale.css'

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

const RecommentProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('http://localhost:5000/products');
                setProducts(response.data);
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
        <div className="container-recomment">
            <div className="title-recomment">CÓ THỂ BẠN SẼ THÍCH - KHÁM PHÁ NGAY!</div>
            <div className="carousel-controls-recomment">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button onClick={() => paginate(currentPage + 1)} disabled={!products || currentPage === Math.ceil((products.length || 0) / productsPerPage)}>
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
            <div className="carousel-recomment">
                {currentProducts.map((product) => (
                    <div className="carousel-item" key={product.id} onClick={() => handleProductClick(product.id)}>
                        <img alt={product.name} src={product.image}   />
                        <p>{product.name}</p>
                        <p className="price">{product.price.toLocaleString('vi-VN')} đ</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommentProduct;