import React from 'react';
import './stylefooter.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="contact">
          <h3>CONTACT</h3>
          <p>Street: 49 Le Huu Trac</p>
          <p>City: DaNang</p>
          <p>State Full: Quang Nam</p>
          <p>Zip Code: 21090</p>
          <p>Phone Number: 078-861-4615</p>
           
        </div>

        <div className="menu">
          <h3>MENU</h3>
          <a href="#">Home</a>
          <a href="#">Books</a>
          <a href="#">About</a>
          <a href="#">Courses</a>
          <a href="#">Our blog</a>
          <a href="#">Pricing</a>
        </div>

        <div className="recent-posts">
          <h3>RECENT POSTS</h3>
          <a href="#">Breaking Down Barriers</a>
          <a href="#">A Celebration of Success</a>
          <a href="#">A World of Opportunities</a>
        </div>

        <div className="newsletter">
          <h3>NEWSLETTER</h3>
          <input type="email" placeholder="Your email address" />
          <button>SIGN UP</button>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          HungDang. Built using Reactjs  
         
        </p>
      </div>
    </footer>
  );
}

export default Footer;
