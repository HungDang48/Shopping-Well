import React, { useEffect, useState } from 'react';
import './Styleproduct.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
export interface Product {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    categoryId: number;
    gendersID: number;
    newSaleID: boolean;
    hotSaleID: number;
    size: string;
    color: string;
    price: number;
    image: string;
}

const NewProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('https://shopping-well-back-end-production.up.railway.app/products');
                const filteredProducts = response.data.filter(product => product.newSaleID === true);
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <div className="header-low">
                SẢN PHẨM MỚI VỀ
            </div>
            <div className="product-grid">
                {currentProducts && currentProducts.map((product) => (
                    <div className="product" key={product.id}>
                        <Link to={`/ProductDetail/${product.id}`}> {/* Sử dụng Link */}
                            <img alt={product.name} height="400" src={product.image} width="300" />
                        </Link>
                        <div className="product-title">
                            {product.name}
                        </div>
                        <div className="product-price">
                        {product.price.toLocaleString('vi-VN')} VND
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="pagination">
                <button className='BTN-pagination'
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button className='BTN-pagination'
                    onClick={() => paginate(currentPage + 1)}
                    disabled={!products || currentPage === Math.ceil((products.length || 0) / productsPerPage)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default NewProduct;
