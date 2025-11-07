import Link from "next/link";
import React from "react";

const FooterSection = () => {
  return (
    <footer className="tf__footer mt_100">
      <div className="tf__footer_overlay pt_75">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-3 col-sm-10 col-md-7 col-lg-6">
              <div className="tf__footer_logo_area">
                <Link className="footer_logo" href="/">
                  <img
                    src="/images/footer_logo.svg"
                    alt="Sypher"
                    className="img-fluid w-100"
                  />
                </Link>
                <p>
                  Welcome to Sypher Academy, your partner in academic excellence. We
are a premium tutoring and academic center located in North Carolina, dedicated to
helping middle and high school students go beyond the standard curriculum.
                </p>
                <ul className="d-flex flex-wrap">
                  <li>
                    <a href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://whatsapp.com/channel/0029Vb6CxN33WHTQbv12KJ2q" target='_blank'>
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </li>
                 
                </ul>
              </div>
            </div>
           <div className="col-xl-2 col-md-5 col-lg-3">
                  <div className="tf__footer_content">
                    <h3>Quick Links</h3>
                    <ul>
                      <li>
                        <Link href="/our-method">Our Method</Link>
                      </li>
                      <li>
                        <Link href="/services">Services</Link>
                      </li>
                      <li>
                        <Link href="/about">About Us</Link>
                      </li>
                      <li>
                        <Link href="/contact">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
             <div class="col-xl-3 col-sm-10 col-md-7 col-lg-col-lg-6">
                <div class="tf__footer_content xs_mt_30">
                    <h3>Our Contacts</h3>
                    
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <p>
                            <span class="address-line">High house road PMB 18,</span>
                            <span class="address-line">Cary, NC 27513</span>
                        </p>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <p>+1 (919) 337-7330</p>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <p>info@sypheracademy.com<br/>support@sypheracademy.com</p>
                    </div>
                </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="tf__copyright">
                <p>© 2025 Sypher Academy. All Rights Reserved.</p>
                <ul className="d-flex flex-wrap">
                  <li>
                    <Link href="/privacy-policy">Privacy policy</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
