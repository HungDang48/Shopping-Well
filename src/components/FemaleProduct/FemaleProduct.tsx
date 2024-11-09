import React, { useEffect, useState } from 'react';
import './FemaleProduct.css';
import axios from 'axios';

export interface Product {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    categoryId: number;
    gendersID: number;
    size: string;
    color: string;
    price: number;
    image: string;
}

const FemaleProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 10;
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('http://localhost:5000/products');
                const filteredProducts = response.data.filter(product =>
                    product.gendersID === 2 && 
                    (!selectedCategoryId || product.categoryId === selectedCategoryId)
                );
                setProducts(filteredProducts);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleCategoryClick = (categoryId: number | null) => {
        console.log("Selected Category ID:", categoryId); // Kiểm tra `categoryId` được chọn
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <div className="container-product">
                <body>
                <div className="nav">
                    <div className="header">
                        Nữ
                        <a href="#" onClick={() => handleCategoryClick(2)}>SƠ MI</a>
                        <a href="#" onClick={() => handleCategoryClick(3)}>ÁO VEST</a>
                        <a href="#" onClick={() => handleCategoryClick(4)}>CROPTOP</a>
                        <a href="#" onClick={() => handleCategoryClick(5)}>ÁO NỈ</a>
                    </div>
                </div>
                <div className="product-grid">
                    {currentProducts && currentProducts.map((product) => (
                        <div className="product" key={product.id}>
                            <img alt={product.name} height="400" src={product.image} width="300" />
                            <div className="product-title">{product.name}</div>
                            <div className="product-price">{product.price} VND</div>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <span> Page {currentPage} </span>
                    <button onClick={() => paginate(currentPage + 1)}
                        disabled={!products || currentPage === Math.ceil((products.length || 0) / productsPerPage)}>
                        Next
                    </button>
                </div>
                </body>
                
            </div>
        </div>
    );
}

export default FemaleProduct;
