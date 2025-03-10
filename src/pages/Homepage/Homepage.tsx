import React, { useState, useEffect } from 'react';
import '../../components/Header/Header';
// import Header from '../../components/Header/Header';
import Header2 from '../../components/Header/Header2';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/Banner';
import NewProduct from '../../components/NewProduct/NewProduct';
import HotSaleProduct from '../../components/HotsaleProduct/HotSaleProduct';
import MaleProduct from '../../components/MaleProduct/MaleProduct';
import FemaleProduct from '../../components/FemaleProduct/FemaleProduct';
import CardProduct from '../../modules/home/components/CardProduct';
import ProductDetail from '../productdetail/ProductDetail';
import Login from '../login/Login';
import Register from '../register/Register';
import ExampleComponent from '../ExampleComponent/ExampleComponent';
import UniProduct from '../../components/UniProduct/UniProduct';
import './homepage.css'
import Opening from '../../components/opening/Opening';


const Homepage = () => {
 

  return (
    <div className="body-homepage">
         <div>
      {/* <Header /> */}
      <Header2 />
      <Banner  />
      <Opening />
      <UniProduct />
      <MaleProduct />
      {/* <FemaleProduct /> */}
      {/* <NewProduct />
      <HotSaleProduct /> */}
      {/* <ProductDetail /> */}
      {/* <ExampleComponent /> */}
      

     
      <Footer />
    </div>

    </div>
 
  );
};

export default Homepage;