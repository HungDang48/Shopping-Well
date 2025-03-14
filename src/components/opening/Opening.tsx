import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Opening.css';

const Opening: React.FC = () => {
    const navigate = useNavigate(); 

    const UniProductPage = () => {
        navigate('/UniProductPage'); // Chuyển hướng đến trang UniProductPage
    };
    const MaleProductPage = () => {
        navigate('/MaleProductPage'); // Chuyển hướng đến trang UniProductPage
    };
    const FemaleProductPage = () => {
        navigate('/FemaleProductPage'); // Chuyển hướng đến trang UniProductPage
    };

    return (
        <div className="container-open">
            <div className="image-box-open"onClick={MaleProductPage} style={{ cursor: 'pointer' }}>
                <img 
                    alt="Warm-toned image of a modern living room interior design"  
                    src="https://jcasablancas.com/wp-content/uploads/2024/07/male-model-runway-poses.webp"   
                />
                <div className="text">NAM</div>
            </div>
            <div className="image-box-open" onClick={UniProductPage} style={{ cursor: 'pointer' }}>
                <img 
                    alt="Black and white image of a modern kitchen interior design"  
                    src="https://cdn1.i-scmp.com/sites/default/files/styles/1020x680/public/2014/07/21/42.jpg?itok=C23bKECt"   
                />
                <div className="text">UNISEX</div>
            </div>
            <div className="image-box-open"onClick={FemaleProductPage} style={{ cursor: 'pointer' }}>
                <img 
                    alt="Warm-toned image of a modern living room interior design"  
                    src="https://img.freepik.com/free-photo/beautiful-blonde-woman-blue-light_23-2149478924.jpg"   
                />
                <div className="text">NỮ</div>
            </div>
        </div>
    );
};

export default Opening;
