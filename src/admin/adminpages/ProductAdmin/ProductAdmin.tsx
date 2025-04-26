import './ProductAdmin.css';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Modal from '../../component/modal';
import HeaderAdmin from '../../component/headerAdmin/HeaderAdmin';
import { debounce } from 'lodash'; // Nhớ cài đặt lodash

// Định nghĩa strict types
type GenderID = 0 | 1 | 2 | 3;
type ModalType = 'add' | 'update' | null;

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
    id: number;
    name: string;
    categoriesID: number;
    gendersID: GenderID;
    newSaleID: boolean;
    hotSaleID: boolean;
    stock: Record<string, number>; // Lưu số lượng sản phẩm theo stock
    price: number;
    image: string;
    createdAt: number;
    updatedAt: number;
}

interface Category {
    id: number;
    categoriesID: number;
    name: string;
    gendersID: number;
    createdAt: number;
    updatedAt: number;
}

interface FormData {
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

const ProductAdmin = () => {
    // Gộp các state modal
    const [modalType, setModalType] = useState<ModalType>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Giữ nguyên các state khác nhưng sắp xếp gọn gàng hơn
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [productsList, setProductsList] = useState<Product[] | null>(null);
    const [categoriesList, setCategoriesList] = useState<Category[] | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<FormData>({
        id: 0,
        name: "",
        categoriesID: 0,
        gendersID: 0,
        newSaleID: false,
        hotSaleID: false,
        stock: {},
        price: 0,
        image: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    // Tối ưu search với debounce
    const debouncedSearch = useCallback(
        debounce((keyword: string) => {
            if (!productsList) return;
            
            if (!keyword.trim()) {
                setCurrentPage(1);
                return;
            }

            const filtered = productsList.filter(product =>
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );
            setCurrentPage(1);
        }, 300),
        [productsList]
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };

    // Tối ưu pagination với useMemo
    const { currentProducts, totalPages } = useMemo(() => {
        if (!productsList) return { currentProducts: [], totalPages: 0 };

        const indexOfLastProduct = currentPage * 7;
        const indexOfFirstProduct = indexOfLastProduct - 7;
        const current = productsList.slice(indexOfFirstProduct, indexOfLastProduct);
        const total = Math.ceil(productsList.length / 7);

        return { currentProducts: current, totalPages: total };
    }, [productsList, currentPage]);

    // Tối ưu các hàm xử lý form với useCallback
    const handleUpdateInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['price', 'gendersID'].includes(name) ? Number(value) : value
        }));
    }, []);

    const handleUpdateStockChange = useCallback((size: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            stock: { ...prev.stock, [size]: Number(value) }
        }));
    }, []);

    // Thêm validation
    const validateForm = (data: FormData): string[] => {
        const errors: string[] = [];
        if (!data.name.trim()) errors.push('Tên sản phẩm không được để trống');
        if (data.price <= 0) errors.push('Giá sản phẩm phải lớn hơn 0');
        if (!data.categoriesID) errors.push('Vui lòng chọn danh mục');
        if (!data.image.trim()) errors.push('Vui lòng nhập URL hình ảnh');
        return errors;
    };

    // Tối ưu hàm update
    const handleUpdate = async () => {
        try {
            const errors = validateForm(formData);
            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }

            setIsSubmitting(true);
            const response = await axios.put(
                `https://shopping-well-back-end-production.up.railway.app/products/${formData.id}`,
                {
                    ...formData,
                    updatedAt: Date.now()
                }
            );

            if (response.status === 200) {
                setProductsList(prevList => 
                    prevList?.map(product => 
                        product.id === formData.id ? response.data : product
                    ) || []
                );
                alert('Cập nhật sản phẩm thành công!');
                setModalType(null);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            console.error('Lỗi khi cập nhật sản phẩm:', errorMessage);
            alert('Cập nhật sản phẩm thất bại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tối ưu hàm delete với confirm
    const handleDelete = async (productId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        try {
            await axios.delete(`https://shopping-well-back-end-production.up.railway.app/products/${productId}`);
            setProductsList((prevList) => prevList?.filter(product => product.id !== productId) || []);
            alert('Xóa sản phẩm thành công!');
        } catch (error) {
            console.error("Xóa sản phẩm thất bại:", error);
            alert('Có lỗi xảy ra khi xóa sản phẩm.');
        }
    };

    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        categoriesID: 1,
        gendersID: 0,
        newSaleID: false,
        hotSaleID: false,
        stock: {
            M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, XXXXL: 0
        },
        price: 0,
        image: '',
    });

    const togglePopup = () => {
        setModalType('add');
    };
    const togglePopupUpdate = () => {
        setModalType('update');
    };
    const onUpdate = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            id: product.id,
            name: product.name,
            categoriesID: Number(product.categoriesID),
            gendersID: product.gendersID,
            newSaleID: product.newSaleID,
            hotSaleID: product.hotSaleID,
            stock: product.stock,
            price: product.price,
            image: product.image,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        });
        togglePopupUpdate();
    };

    const onCancel = () => {
        setSelectedProduct(null);
        togglePopupUpdate();
    }

    const handleStockChange = (stock: string, value: string) => {
        setNewProduct(prev => ({
            ...prev,
            stock: { ...prev.stock, [stock]: Number(value) }
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]: name === 'gendersID' ? Number(value) : value, // Chuyển gendersID thành number
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setNewProduct((prevState) => ({
            ...prevState,
            categoriesID: Number(value), // Chuyển đổi từ string sang number
        }));
    };

    const handleNewSaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setNewProduct((prevState) => ({
            ...prevState,
            newSaleID: value === 'true', // 'true' sẽ được set thành Boolean true
        }));
    };

    const handleHotSaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setNewProduct((prevState) => ({
            ...prevState,
            hotSaleID: value === 'true', // 'true' sẽ được set thành Boolean true
        }));
    };
   
    const handleAddProduct = async () => {
        try {
            const newProductId = productsList?.length ? productsList[productsList.length - 1].id + 1 : 1;

            const productWithOrderedFields = {
                id: newProductId,
                name: newProduct.name,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                categoriesID: Number(newProduct.categoriesID),
                gendersID: newProduct.gendersID,
                newSaleID: newProduct.newSaleID,
                hotSaleID: newProduct.hotSaleID,
                stock: newProduct.stock,
                price: newProduct.price,
                image: newProduct.image,
            };
            const response = await axios.post('https://shopping-well-back-end-production.up.railway.app/Products', productWithOrderedFields);
            setProductsList(prev => (prev ? [...prev, response.data] : [response.data]));
            alert('Thêm sản phẩm thành công!');
            togglePopup();
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            alert('Thêm sản phẩm thất bại!');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://shopping-well-back-end-production.up.railway.app/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Product[]>('https://shopping-well-back-end-production.up.railway.app/Products');
                setProductsList(response.data);
                const categoriesResponse = await axios.get<Category[]>('https://shopping-well-back-end-production.up.railway.app/Categories');
                setCategoriesList(categoriesResponse.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getCategoryName = (categoriesID: number): string => {
        const category = categoriesList?.find((cat) => cat.categoriesID === categoriesID);
        return category ? category.name : 'Không xác định';
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <HeaderAdmin />
            <div className="product-admin-container">
                {/* Header */}
                <div className="product-admin-container-top">
                    <h1>DANH SÁCH SẢN PHẨM</h1>
                    <div className="search-bar">
                        <input
                            placeholder="Type to search..."
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="product-admin-button-new-product" onClick={togglePopup} style={{ height: "40px", width: "180px" }}>
                        Thêm sản phẩm 
                    </button>
                    <Modal open={modalType === 'add'} onClose={togglePopup}>
                        <div className="popup-form-container">
                            <h2>Thêm sản phẩm mới</h2>
                            <form className="product-form">
                                <label>Liên kết hình ảnh:</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={newProduct.image}
                                    onChange={handleInputChange}
                                    placeholder="Nhập URL hình ảnh..."
                                    required
                                />
                                <label>Tên sản phẩm:</label>
                                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required />
                                <label>Danh mục:</label>
                                <select name="categoriesID" value={newProduct.categoriesID} onChange={handleCategoryChange} required>
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <label>New Sale:</label>
                                <select name="newSaleID" value={newProduct.newSaleID ? 'true' : 'false'} onChange={handleNewSaleChange} required>
                                    <option value="true">Cực mới</option>
                                    <option value="false">Bình thường</option>
                                </select>
                                <label>Hot Sale:</label>
                                <select name="hotSaleID" value={newProduct.hotSaleID ? 'true' : 'false'} onChange={handleHotSaleChange} required>
                                    <option value="true">Hot</option>
                                    <option value="false">Bình thường</option>
                                </select>
                                <label>Giới tính:</label>
                                <select name="gendersID" value={newProduct.gendersID} onChange={handleInputChange} required>
                                    <option value="0">Chọn giới tính</option>
                                    <option value="1">NAM</option>
                                    <option value="2">NỮ</option>
                                    <option value="3">UNISEX</option>
                                </select>
                                <label>Giá sản phẩm:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    placeholder="Nhập giá sản phẩm..."
                                    required
                                />
                                <label>Tồn kho:</label>
                                {Object.keys(newProduct.stock || {}).map(stock => (
                                    <div key={stock}>
                                        <label>{stock}:</label>
                                        <input
                                            type="number"
                                            value={newProduct.stock?.[stock] || 0}
                                            onChange={(e) => handleStockChange(stock, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <div className="popup-buttons">
                                    <button type="button" className="submit-button" onClick={handleAddProduct}>
                                        Thêm sản phẩm
                                    </button>
                                    <button type="button" className="cancel-button" onClick={togglePopup}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
                {/* Product Table */}
                <div className="product-admin-container-bottom">
                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : currentProducts && currentProducts.length > 0 ? (
                        <>
                            <table className="product-admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Hình ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Danh mục</th>
                                        <th>Stock</th>
                                        <th>Giá</th>
                                        <th>New Sale</th>
                                        <th>Hot Sale</th>
                                        <th>Giới tính</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img src={product.image} alt={product.name} style={{ width: 80, height: 80 }} />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{getCategoryName(product.categoriesID)}</td>
                                            <td>
                                                {Object.entries(product.stock)
                                                    .map(([stock, quantity]) => `${stock}: ${quantity}`)
                                                    .join(', ')}
                                            </td>
                                            <td>{product.price} vnd</td>
                                            <td>{product.newSaleID ? 'Cực mới' : 'Bình thường'}</td>
                                            <td>{product.hotSaleID ? 'Hot' : 'Bình thường'}</td>
                                            <td>{product.gendersID}</td>
                                            <td>
                                                <button className="user-account-button-new-account" onClick={() => onUpdate(product)}>
                                                    UPDATE
                                                </button>
                                                <button className="red" onClick={() => handleDelete(product.id)}>
                                                    Xóa Bỏ
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="pagination">
                                <button disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
                                    Trước
                                </button>
                                <span>
                                    Trang {currentPage}/{totalPages}
                                </span>
                                <button disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                                    Sau
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Không có sản phẩm nào.</p>
                    )}
                </div>
            </div>
            
            {/* Tối ưu Modal với điều kiện render */}
            {modalType === 'update' && (
                <Modal open={true} onClose={onCancel}>
                    <div className="popup-form-container">
                        <h2>Cập nhật sản phẩm</h2>
                        <form className="product-form">
                            <label>Liên kết hình ảnh:</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleUpdateInputChange}
                                placeholder="Nhập URL hình ảnh..."
                                required
                            />
                            <label>Tên sản phẩm:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleUpdateInputChange} required />
                            <label>Danh mục:</label>
                            <select name="categoriesID" value={formData.categoriesID} onChange={handleUpdateInputChange} required>
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <label>New Sale:</label>
                            <select name="newSaleID" value={formData.newSaleID ? 'true' : 'false'} onChange={handleUpdateInputChange} required>
                                <option value="true">Cực mới</option>
                                <option value="false">Bình thường</option>
                            </select>
                            <label>Hot Sale:</label>
                            <select name="hotSaleID" value={formData.hotSaleID ? 'true' : 'false'} onChange={handleUpdateInputChange} required>
                                <option value="true">Hot</option>
                                <option value="false">Bình thường</option>
                            </select>
                            <label>Giới tính:</label>
                            <select name="gendersID" value={formData.gendersID} onChange={handleUpdateInputChange} required>
                                <option value="0">Chọn giới tính</option>
                                <option value="1">NAM</option>
                                <option value="2">NỮ</option>
                                <option value="3">UNISEX</option>
                            </select>
                            <label>Giá sản phẩm:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleUpdateInputChange}
                                placeholder="Nhập giá sản phẩm..."
                                required
                            />
                            <label>Tồn kho:</label>
                            {Object.keys(formData.stock || {}).map(stock => (
                                <div key={stock}>
                                    <label>{stock}:</label>
                                    <input
                                        type="number"
                                        value={formData.stock?.[stock] || 0}
                                        onChange={(e) => handleUpdateStockChange(stock, e.target.value)}
                                    />
                                </div>
                            ))}
                            <div className="popup-buttons">
                                <button type="button" className="submit-button" onClick={handleUpdate}>
                                    Cập nhật
                                </button>
                                <button type="button" className="cancel-button" onClick={onCancel}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );

};

export default ProductAdmin;