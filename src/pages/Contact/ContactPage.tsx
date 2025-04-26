import React from "react";
import './Contact.css'
import Header2 from "../../components/Header/Header2";
import Footer from "../../components/Footer/Footer";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa"; // Import icon từ react-icons
const Contact: React.FC = () => {
  return (
    <div>
      <Header2 />
      <div className="contact-container">
        <h2 className="contact-title">Liên Hệ Với Chúng Tôi</h2>

        {/* Thông tin liên hệ */}
        <div className="contact-content">
          {/* Thông tin liên hệ */}
          <div className="contact-info">
            <h3 className="contact-info-title">_________    Liên Hệ</h3>
            <p className="contact-text">
              Điện thoại:{" "}
              <a href="tel:02836222999" title="(028) 36.222.999">
                (07) 88.614.615
              </a>
            </p>
            <p className="contact-text">
              Email:{" "}
              <a href="mailto:hungdang040801@gmail.com" title="hungdang040801@gmail.com">
                hungdang040801@gmail.com
              </a>
            </p>
            <p className="contact-text">
              Website:{" "}
              <a href="https://viet-hung-portfolio.vercel.app/" title="">
               Viet Hung Portfolio
              </a>
            </p>
            <p className="contact-text">
              Fanpage:{" "}
              <a
                href="https://www.facebook.com/HungDang0481"
                title="https://www.facebook.com/HungDang0481"
                target="_blank"
                rel="noreferrer"
              >
                https://www.facebook.com/HungDang0481
              </a>
            </p>

            {/* Liên kết mạng xã hội */}


            <div className="contact-social">
              <h3 className="contact-info-title">Theo Dõi Chúng Tôi</h3>
              <div className="contact-social-links">
                <a
                  href="https://www.facebook.com/HungDang0481"
                  className="social-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="social-img" src="https://gonline.vn/wp-content/uploads/2019/03/facebook-icon-3.png" alt="Facebook" />
                </a>
                <a
                  href="https://www.instagram.com/hngd_48/"
                  className="social-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="social-img" src="https://e7.pngegg.com/pngimages/343/366/png-clipart-new-black-instagram-logo-2020-tech-companies.png" alt="Instagram" />
                </a>
                <a
                  href="https://www.tiktok.com/@hugn.dang?is_from_webapp=1&sender_device=pc"
                  className="social-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="social-img" src="https://banner2.cleanpng.com/20240214/ja/transparent-tiktok-logo-logo-design-brand-mark-letter-t-blue-a-simple-recognizable-t-logo-with-depth-1710878272905.webp" alt="TikTok" />
                </a>
                <a
                  href="https://zalo.me/0788614615"
                  className="social-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img className="social-img" src="https://i.pinimg.com/736x/82/53/22/82532235b1c99e391706a9c6e396aeaa.jpg" alt="Zalo" />
                </a>

              </div>
            </div>


          </div>

          {/* Biểu mẫu liên hệ */}
          <div className="contact-form-wrapper">
            <h3 className="contact-info-title">Gửi Tin Nhắn</h3>
            <form className="contact-form">
              <input type="text" placeholder="Họ và tên" className="contact-input" />
              <input type="email" placeholder="Email" className="contact-input" />
              <input type="tel" placeholder="Số điện thoại" className="contact-input" />
              <textarea placeholder="Nội dung liên hệ" className="contact-textarea"></textarea>
              <button type="submit" className="contact-button">Gửi</button>
            </form>
          </div>
        </div>

        {/* Google Map */}
        <div className="contact-map">
          <h3 className="contact-info-title">Bản Đồ</h3>
          <iframe
            className="map-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d388.32495176724603!2d108.23864523938721!3d16.057440892938956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142177e111bd84b%3A0xde002dffc3bb1705!2zNDkgTMOqIEjhu691IFRyw6FjLCBBbiBI4bqjaSDEkMO0bmcsIFPGoW4gVHLDoCwgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1742068745809!5m2!1svi!2s"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default Contact;
