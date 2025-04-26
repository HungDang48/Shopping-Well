import React, { useEffect, useState } from 'react';
import './MaleProductPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header2 from '../../components/Header/Header2';
import Footer from '../../components/Footer/Footer';

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

const MaleProductPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Fetch products (only unisex products, gendersID === 3)
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get<Product[]>('https://shopping-well-back-end-production.up.railway.app/products');
            const filteredProducts = response.data.filter(product => product.gendersID === 1);
            setProducts(filteredProducts);
            setFilteredProducts(filteredProducts);
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
            const response = await axios.get<Category[]>('https://shopping-well-back-end-production.up.railway.app/categories');
            const filteredCategories = response.data.filter(category => category.gendersID === 1);
            setCategories(filteredCategories);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    // Search function
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value.toLowerCase();
        setSearchTerm(keyword);
        if (!keyword) {
            setFilteredProducts(products);
        } else {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(keyword)
            );
            setFilteredProducts(results);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <Header2 />
            <div className="body-uni"></div>
            <div className="container-product">
                <body>
                    <div className="nav">
                        <div className="header-uni">
                            <div className="header-uni-title">MALE</div>
                            <div className="header-uni-categories">
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
                            <div className="header-uni-searchBar"></div>
                        </div>
                    </div>
                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <div className="product" key={product.id}>
                                <Link to={`/productdetail/${product.id}`}>
                                    <img alt={product.name} src={product.image} />
                                    <div className="discount">-17%</div>
                                    <div className="product-title">{product.name}</div>
                                    <div className="product-price">{product.price.toLocaleString('vi-VN')}₫</div>
                                    <div className="old-price">{(product.price * 1.17).toLocaleString('vi-VN')}₫</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </body>
            </div>
            <Footer />
        </div>
    );
};

export default MaleProductPage;
