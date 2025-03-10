import React, { useEffect, useState } from 'react';
import './UniProduct.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export interface Product {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    categoriesID: number;
    gendersID: number;
    size: string;
    color: string;
    price: number;
    image: string;
}

export interface Category {
    id: string;
    categoriesID: number;
    name: string;
    gendersID: number;
    createdAt: number;
    updatedAt: number;
}

const UniProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]); // Lưu tất cả sản phẩm
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Lưu sản phẩm sau khi lọc
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 8;

    // Fetch products (only unisex products, gendersID === 3)
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get<Product[]>('http://localhost:5000/products');
            const filteredProducts = response.data.filter(product => product.gendersID === 3);
            setProducts(filteredProducts);
            setFilteredProducts(filteredProducts); // Ban đầu hiển thị tất cả sản phẩm
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories for unisex products
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get<Category[]>('http://localhost:5000/categories');
            const filteredCategories = response.data.filter(category => category.gendersID === 3);
            setCategories(filteredCategories);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    // Search function
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value.toLowerCase(); // Chuyển từ khóa về chữ thường
        setSearchTerm(keyword); // Lưu từ khóa tìm kiếm
        if (!keyword) {
            setFilteredProducts(products); // Nếu không có từ khóa, hiển thị tất cả sản phẩm
        } else {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(keyword)
            );
            setFilteredProducts(results);
        }
        setCurrentPage(1); // Reset về trang đầu tiên
    };

    // Fetch products and categories on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <div className="body-uni">
                
            </div>
            <div className="container-product">
                <body>
                    <div className="nav">
                        <div className="header-uni">
                            UNISEX
                            {/* Search Bar */}
                            <div className="search-bar">
                                <input
                                    placeholder="Type to search..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            {/* Render category buttons dynamically */}
                            {categories && categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setFilteredProducts(products.filter(product => product.categoriesID === category.categoriesID))}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="product-grid">
                        {currentProducts.map((product) => (
                            <div className="product" key={product.id}>
                                <Link to={`/productdetail/${product.id}`}>
                                    <img alt={product.name} height="200" src={product.image} width="250" />
                                    <div className="product-title">{product.name}</div>
                                    <div className="product-price">
                                        {product.price.toLocaleString('vi-VN')} VND
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="BTN-pagination"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span> Page {currentPage} </span>
                        <button
                            className="BTN-pagination"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </body>
            </div>
        </div>
    );
};

export default UniProduct;
