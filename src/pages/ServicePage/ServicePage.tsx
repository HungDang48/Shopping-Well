import React from 'react'
import './ServicePage.css'
import Header2 from '../../components/Header/Header2'
import Footer from '../../components/Footer/Footer'
const ServicePage = () => {
    return (
        <div>
            <Header2 />
            <div className="container-ServicePage">
                <div className="container-ServicePage-top">
                    <img
                        alt="Warm-toned image of a modern living room interior design"
                        src="https://bizweb.dktcdn.net/100/109/683/themes/758672/assets/evo-page-banner.jpg?1655428116870"
                    />
                    <div className="text">Shopping Well Service</div>
                </div>
                <div className="container-ServicePage-body">
                    <div className="service-container">
                        <div className="service-card">
                            <img src="https://suno.vn/blog/wp-content/uploads/2018/11/meo-ship-hang-an-toan-cho-cac-shop-online-707x400.jpg" alt="Dịch vụ giao hàng" className="service-img" />
                            <div className="service-overlay">
                                <i className="fa-solid fa-truck"></i>
                                <div className="service-text">Dịch vụ giao hàng</div>
                            </div>
                        </div>
                        <div className="service-card">
                            <img src="https://i.ex-cdn.com/vietnamfinance.vn/files/f1/news/thanhhang/2018/9/10/vnf-trao-doi-la-gi.jpg" alt="Dịch vụ đổi trả & hoàn tiền" className="service-img" />
                            <div className="service-overlay">
                                <i className="fas fa-undo"></i>
                                <div className="service-text">Dịch vụ đổi trả & hoàn tiền</div>
                            </div>
                        </div>
                        <div className="service-card">
                            <img src="https://lbcint.com/wp-content/uploads/2021/04/giai-quyet-kip-thoi-cac-nhu-cau-cua-khach-hang-la-mot-khia-canh-trong-chat-luong-cham-soc-khach-hang.jpg" alt="Dịch vụ chăm sóc khách hàng" className="service-img" />
                            <div className="service-overlay">
                                <i className="fa-solid fa-phone-volume"></i>
                                <div className="service-text">Dịch vụ chăm sóc khách hàng</div>
                            </div>
                        </div>
                        <div className="service-card">
                            <img src="https://shopquatructuyen.com/wp-content/uploads/2019/07/goi-qua-sang-trong.jpg" alt="Dịch vụ quà tặng & gói quà" className="service-img" />
                            <div className="service-overlay">
                                <i className="fa-solid fa-gifts"></i>
                                <div className="service-text">Dịch vụ quà tặng & gói quà</div>
                            </div>
                        </div>
                        <div className="service-card">
                            <img src="https://www.pace.edu.vn/uploads/news/2023/09/5-cach-dat-cau-hoi-hieu-qua.jpg" alt="Câu hỏi thường gặp (FAQ)" className="service-img" />
                            <div className="service-overlay">
                                <i className="fa-solid fa-circle-question"></i>
                                <div className="service-text">Câu hỏi thường gặp (FAQ)</div>
                            </div>
                        </div>


                    </div>

                </div>


            </div>
            <Footer />

        </div>
    )
}

export default ServicePage