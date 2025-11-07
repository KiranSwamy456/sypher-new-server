import React from "react";

const AboutSection3 = ({ style }) => {
  return (
    <div className={`${style} tf__about_2_area`}>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 wow fadeInLeft">
            <div className="tf__about_2_img">
              <div className="tf__about_small">
                <img
                  src="/images/about_2_img_2.jpg"
                  alt="about us"
                  className="img-fluid w-100"
                />
              </div>
              <div className="tf__about_large">
                <img
                  src="/images/about_2_img_1.jpg"
                  alt="about us"
                  className="img-fluid w-100"
                />
              </div>
              {/* <p>
                <span>4+</span> Years of Experience
              </p> */}
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 wow fadeInRight">
            <div className="tf__about_2_text">
              <div className="tf__heading_area tf__heading_area_left mb_25">
                <h5>About Us</h5>
                <h2>Our Story and Vision</h2>
              </div>
              <p style={{ textAlign: "justify", }} className="mt-4">
               Sypher Academy was founded on a simple idea that with the right guidance, every student can
achieve academic greatness. Our team of educators, each with unique professional backgrounds,
joined forces to build a learning center that prepares students for the future, not just their next test.
Our mission is to connect every student's potential to breakthrough academic results through a
scientifically-backed, personalized learning approach. This method helps students exceed
expectations and gives them the confidence they need to succeed in life.
              </p>
            </div>
             <div className="tf__about_2_text">
              <div className="tf__heading_area tf__heading_area_left mb_25">
               
                <h2>Ph.D.-led Academics</h2>
              </div>
              <p style={{ textAlign: "justify", }} className="mt-4">
               Founded and guided by experts, bringing a unique scientific rigor to our educational approach.
              </p>
            </div>
          </div>
          
          <div className="col-12 mt_110 xs_mt_100 wow fadeInUp">
            {/* <div className="tf__about_us_counter d-flex flex-wrap align-items-center">
              <p>
                <span className="counter">27,0000</span> More Students courde
                youn do best !
              </p>
              <a href="#">Export All</a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection3;
