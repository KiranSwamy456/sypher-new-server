// import React from "react";
// import ContactForm from "../form/ContactForm";

// const ContactPageSection = () => {
//   return (
//     <section className="tf__contact_page mt_190 xs_mt_95">
//       <div className="container">
//         <div className="row">
//           <div className="col-xxl-8 col-xl-7 col-lg-6 wow fadeInLeft">
//             <div className="tf__contact_form">
//               <div className="tf__heading_area tf__heading_area_left mb_25">
//                 {/* <h5>OUR contact Us</h5> */}
//                 <h2>Get in Touch</h2>
//               </div>
//               <p>
//                We are excited to hear from you and learn how we can help your student
// achieve academic success. Please fill out the form below or use our contact details to
// reach us.
//               </p>
//               <ContactForm />
//             </div>
//           </div>
//           <div className="col-xxl-4 col-xl-5 col-lg-6 wow fadeInRight">
//             <div className="tf__contact_text">
//               <div className="tf__contact_single">
//                 <div className="icon blue">
//                   <i className="fas fa-phone-alt"></i>
//                 </div>
//                 <div className="text">
//                   <h3>Call</h3>
//                   <a href="callto:+1(919)3377330">+1(919)3377330</a>
//                 </div>
//               </div>
//               <div className="tf__contact_single">
//                 <div className="icon blue">
//                   <i className="fas fa-envelope"></i>
//                 </div>
//                 <div className="text">
//                   <h3>mail</h3>
//                   <a href="mailto:info@sypheracademy.com">info@sypheracademy.com</a>
//                   <a href="mailto:support@sypheracademy.com">support@sypheracademy.com</a>
//                 </div>
//               </div>
//               <div className="tf__contact_single">
//                 <div className="icon blue">
//                   <i className="fas fa-map-marker-alt"></i>
//                 </div>
//                 <div className="text">
//                   <h3>address</h3>
//                   <p>964 High house road PMB 18, Cary, NC 27513</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="col-xl-12 wow fadeInUp">
//             <div className="tf__contact_map mt_100">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d130297.09824016165!2d-78.92184327155292!3d35.77058634806073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acbd54ff4a8b43%3A0x44568fdb5a444be1!2sCary%2C%20NC%2C%20USA!5e1!3m2!1sen!2sin!4v1756305908343!5m2!1sen!2sin"
//                 allowFullScreen=""
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               ></iframe>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactPageSection;


import React from 'react';

const ContactSection = () => {
  return (
    <section className="tf__contact mt_100 xs_mt_70" id="contact">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="tf__contact_form wow fadeInLeft">
              <div className="tf__heading_area tf__heading_area_left mb_25">
                <h5>CONTACT US</h5>
                <h2>Get in Touch</h2>
                <p>Ready to unlock your child's academic potential? Contact us today to learn more about our programs and schedule a consultation.</p>
              </div>
              
              {/* Embedded Google Form */}
              <div className="google_form_container">
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfkAf6BTgo-SR3OECxKRXJt521Fwa9tRJmxLuB9zfNobpIdiw/viewform?embedded=true" 
                  width="100%" 
                  height="600" 
                  frameBorder="0" 
                  marginHeight="0" 
                  marginWidth="0"
                  title="Contact Form"
                >
                  Loading…
                </iframe>
              </div>
            </div>
          </div>
          
           <div className="col-xxl-4 col-xl-5 col-lg-6 wow fadeInRight">
             <div className="tf__contact_text">
               <div className="tf__contact_single">
                 <div className="icon blue">
                   <i className="fas fa-phone-alt"></i>
                 </div>
                 <div className="text">
                   <h3>Call</h3>
                   <a href="callto:+1(919)3377330">+1(919)3377330</a>
                 </div>
               </div>
               <div className="tf__contact_single">
                 <div className="icon blue">
                   <i className="fas fa-envelope"></i>
                 </div>
                 <div className="text">
                   <h3>mail</h3>
                   <a href="mailto:info@sypheracademy.com">info@sypheracademy.com</a>
                   <a href="mailto:support@sypheracademy.com">support@sypheracademy.com</a>
                 </div>
               </div>
               <div className="tf__contact_single">
                 <div className="icon blue">
                   <i className="fas fa-map-marker-alt"></i>
                 </div>
                 <div className="text">
                   <h3>address</h3>
                   <p>964 High house road PMB 18, Cary, NC 27513</p>
                 </div>
               </div>
             </div>
           </div>
           <div className="col-xl-12 wow fadeInUp">
             <div className="tf__contact_map mt_100">
               <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d130297.09824016165!2d-78.92184327155292!3d35.77058634806073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acbd54ff4a8b43%3A0x44568fdb5a444be1!2sCary%2C%20NC%2C%20USA!5e1!3m2!1sen!2sin!4v1756305908343!5m2!1sen!2sin"
                 allowFullScreen=""
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;