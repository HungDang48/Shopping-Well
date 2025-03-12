import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../pages/Homepage/Homepage';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import ProductDetail from '../pages/productdetail/ProductDetail';
import LoginAdmin from '../admin/adminpages/LoginAdmin/LoginAdmin';
import HomepageAdmin from '../admin/homepageAdmin/HomepageAdmin';
import SetMale from '../pages/SetMale/SetMale';
import SetFemale from '../pages/SetFemale/SetFemale';
import FemaleProduct from '../components/FemaleProduct/FemaleProduct';
import MaleProduct from '../components/MaleProduct/MaleProduct';
import UserAccountAdmin from '../admin/adminpages/UserAccount/UserAccountAdmin';
import ProductAdmin from '../admin/adminpages/ProductAdmin/ProductAdmin';
import UserAccount from '../pages/UserAccount/UserAccount';
import Cart from '../pages/Cart/Cart';
import NewProduct from '../components/NewProduct/NewProduct';
import HotSaleProduct from '../components/HotsaleProduct/HotSaleProduct';
import UniProduct from '../components/UniProduct/UniProduct';
import CheckOut from '../pages/CheckOut/CheckOut';
import OrderAdmin from '../admin/adminpages/Order/OrderAdmin';
import OrderStatus from '../pages/OrderStatus/OrderStatus';
import AdminAccount from '../admin/adminpages/AdminAccount/AdminAccount';
import CategoriesAdmin from '../admin/adminpages/CategoriesAdmin/CategoriesAdmin';
import RecommentProduct from '../components/RecommentMale/RecommentProduct';
import UniProductPage from '../pages/Uniproduct/UniProductPage';
import MaleProductPage from '../pages/MaleProduct/MaleProductPage';
import FemaleProductPage from '../pages/FemaleProduct/FemaleProductPage';

const RouterPages = () => {
  return (
    <Routes>
      {/* Định nghĩa các tuyến đường */}
      <Route path="/" element={<Homepage />} />
      <Route path="/productdetail/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/LoginAdmin" element={<LoginAdmin />} />
      <Route path="/HomepageAdmin" element={<HomepageAdmin />} />
      <Route path="/useraccount" element={<UserAccount />} />
      <Route path="/ProductAdmin" element={<ProductAdmin />} />
      
      <Route path="/setmale" element={<SetMale />} />
      <Route path="/setfemale" element={<SetFemale />} />
      <Route path="/femaleproduct" element={<FemaleProduct />} />
      <Route path="/maleproduct" element={<MaleProduct />} />
      <Route path="/useraccountadmin" element={<UserAccountAdmin />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/CheckOut" element={<CheckOut />} />
      <Route path="/newproduct" element={<NewProduct />} /> {/* Thay vì `/`, đặt tên cụ thể */}
      <Route path="/hotsale" element={<HotSaleProduct />} />
      <Route path="/uniproduct" element={<UniProduct />} />
      <Route path="/OrderAdmin" element={<OrderAdmin />} />
      <Route path="/OrderStatus" element={<OrderStatus />} />
      <Route path="/AdminAccount" element={<AdminAccount />} />
      <Route path="/CategoriesAdmin" element={<CategoriesAdmin />} />
      <Route path="/RecommentProduct" element={<RecommentProduct />} />
      <Route path="/UniProductPage" element={<UniProductPage />} />
      <Route path='/MaleProductPage' element={<MaleProductPage />} />
      <Route path='/FemaleProductPage' element={<FemaleProductPage />} />
   

    </Routes>
  );
};

export default RouterPages;
