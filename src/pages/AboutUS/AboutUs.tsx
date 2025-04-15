import React from 'react'
import './AboutUs.css'
import Header2 from '../../components/Header/Header2';
const AboutUs = () => {
  return (
    <div>
        <Header2 />
          <div className="container">
      <div className="left-section">
        <div className="experience">
          <h2>25+</h2>
          <p>years of experience</p>
        </div>
        <div className="vertical-text">20+ Years Of Experience</div>
        <img
          alt="Placeholder image with dimensions 640x527"
          height={527}
          src="https://storage.googleapis.com/a1aa/image/4_1ANn2lQNiVPc90Q5Rxmp_5ws1lSQegR7CapZRr_7Q.jpg"
          width={640}
        />
      </div>
      <div className="right-section">
        <button>About Our Store</button>
        <h1>Quality Furniture Store On Your Specific Area</h1>
        <p>
          We build and activate brands through cultural insight, strategic
          vision, and the power of emotion across every
        </p>
        <div className="services">
          <div>
            <i className="fas fa-couch"></i>
            <span>Furniture Design</span>
          </div>
          <div>
            <i className="fas fa-paint-brush"></i>
            <span>Home Decoration</span>
          </div>
        </div>
        <div className="features">
          <p>
            <i className="fas fa-check"></i>
            Mix and match colors, sizes, and designs
          </p>
          <p>
            <i className="fas fa-check"></i>
            Top quality prints using the latest technology
          </p>
        </div>
        <div className="author">
          <span>Foqrul Saheb</span> — <span>Senior Artist Developer</span>
        </div>
      </div>
    </div>
  
    </div>
  )
}

export default AboutUs;