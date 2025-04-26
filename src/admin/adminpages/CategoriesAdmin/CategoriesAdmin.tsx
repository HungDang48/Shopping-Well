import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesAdmin.css';
import HeaderAdmin from '../../component/headerAdmin/HeaderAdmin';
import Modal from '../../component/modal';

export interface Category {
    id: number;
    categoriesID: number;
    gendersID: number;
    name: string;
}

const CategoriesAdmin = () => {
    const [categories, setCategories] = useState<Category[]>([]); // State để lưu trữ danh mục
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Điều khiển mở đóng popup
    const [formData, setFormData] = useState<Category>({
        id: 0,
        name: '',
        categoriesID: 0,
        gendersID: 1,
    });

    const [isEditing, setIsEditing] = useState(false); // Kiểm tra trạng thái "update"

    // Hàm gọi API để lấy dữ liệu danh mục
    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://shopping-well-back-end-production.up.railway.app/categories');
            setCategories(response.data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Có lỗi khi lấy dữ liệu danh mục:', error);
        }
    };

    // Hàm xử lý khi form thay đổi
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Ensure gendersID is a number
        if (name === "gendersID") {
            setFormData({ ...formData, [name]: Number(value) }); // Convert to number
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Hàm toggle popup
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
        if (!isPopupOpen) {
            setFormData({ id: 0, name: '', categoriesID: 0, gendersID: 1 }); // Reset form khi đóng popup
            setIsEditing(false);
        }
    };

    // Hàm xử lý xóa danh mục
    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa danh mục này không?')) {
            try {
                await axios.delete(`https://shopping-well-back-end-production.up.railway.app/categories/${id}`);
                setCategories(categories.filter((category) => category.id !== id)); // Cập nhật danh sách
                alert('Danh mục đã được xóa!');
            } catch (error) {
                console.error('Có lỗi khi xóa danh mục:', error);
                alert('Xóa danh mục thất bại!');
            }
        }
    };

    // Hàm xử lý submit form tạo hoặc cập nhật danh mục
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            // Cập nhật danh mục
            try {
                const response = await axios.put(`https://shopping-well-back-end-production.up.railway.app/categories/${formData.id}`, formData as Category);
                setCategories(categories.map((cat) => (cat.id === formData.id ? response.data : cat)));
                alert('Danh mục đã được cập nhật!');
            } catch (error) {
                console.error('Có lỗi khi cập nhật danh mục:', error);
                alert('Cập nhật thất bại!');
            }
        } else {
            // Tạo danh mục mới
            const newCategoriesID = categories.length > 0 ? categories[categories.length - 1].categoriesID + 1 : 1; // Lấy categoriesID mới nhất +1
            const newCategory: Category = {
                id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1, // Đặt id mới
                name: formData.name || '',
                categoriesID: newCategoriesID, // categoriesID mới
                gendersID: formData.gendersID, // Đảm bảo gendersID là số
            };

            try {
                await axios.post('https://shopping-well-back-end-production.up.railway.app/categories', newCategory);
                setCategories([...categories, newCategory]);
                alert('Danh mục mới đã được tạo!');
            } catch (error) {
                console.error('Có lỗi khi tạo danh mục:', error);
                alert('Tạo danh mục thất bại!');
            }
        }
        togglePopup(); // Đóng popup sau khi hoàn tất
    };

    // Hàm mở popup và load dữ liệu khi chỉnh sửa
    const handleEdit = (category: Category) => {
        setFormData(category);
        setIsEditing(true);
        setIsPopupOpen(true);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <HeaderAdmin />
            <div className="categories-container">
                <h1>Quản lý danh mục sản phẩm</h1>
                <button className="categories-admin-button-new-categories" onClick={togglePopup} style={{ height: "40px", width: "180px" }}>
                    Tạo danh mục  
                </button>

                <Modal
                    open={isPopupOpen}
                    onClose={togglePopup}
                    style={{
                        padding: '20px',
                        backgroundColor: '#f1f1f1',
                        borderRadius: '10px',
                        maxWidth: '500px',
                        width: '100%',
                    }}
                >
                    <div className="admin-Account-popup-form-container">
                        <h2>{isEditing ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</h2>
                        <form className="admin-Account-account-form" onSubmit={handleSubmit}>
                            <label>
                                Tên danh mục:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </label>
                            <label>
                                Giới tính:
                                <select
                                    name="gendersID"
                                    value={formData.gendersID || 1} // Đảm bảo giá trị là số
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value={1}>Nam</option>
                                    <option value={2}>Nữ</option>
                                    <option value={3}>Khác</option>
                                </select>
                            </label>

                            <div className="admin-Account-popup-buttons">
                                <button type="submit" className="submit-button">
                                    {isEditing ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                                <button type="button" className="cancel-button" onClick={togglePopup}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên danh mục</th>
                            <th>ID Giới tính</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.gendersID}</td>
                                <td>
                                    <button className="update-button" onClick={() => handleEdit(category)}>
                                        Update
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(category.id)} // Gắn sự kiện xóa
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesAdmin;
