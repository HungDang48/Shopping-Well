import React, { useEffect, useState } from 'react';
import './StyleHotProduct.css'
import axios from 'axios';
import Header from '../Header/Header';
import Banner from '../Banner/Banner';
import Footer from '../Footer/Footer';

export interface Product {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    categoryId: number;
    gendersID: number;
    newSaleID: number;
    hotSaleID: number;
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
    const productsPerPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('http://localhost:5000/products');
                const filteredProducts = response.data.filter(product => product.hotSaleID === 1);
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
            <Header />
            <Banner />
            <div className="header-low">
               SẢN PHẨM BÁN CHẠY
            </div>
            <div className="product-grid">
                {currentProducts && currentProducts.map((product) => (
                    <div className="product" key={product.id}>
                        <img alt={product.name} height="400" src={product.image} width="300" />
                        <div className="product-title">
                            {product.name}
                        </div>
                        <div className="product-price">
                            {product.price} VND
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> Page {currentPage} </span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={!products || currentPage === Math.ceil((products.length || 0) / productsPerPage)}
                >
                    Next
                </button>
            </div>
            <Footer/>
        </div>
    );
};

export default HotSaleProduct