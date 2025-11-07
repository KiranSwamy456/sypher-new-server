// // components/utils/StickySocialMedia.js
// "use client";
// import React from "react";

// const StickySocialMedia = () => {
//   const socialLinks = [
//     {
//       name: "Facebook",
//       icon: "fab fa-facebook-f",
//       url: "https://facebook.com/sypheracademy",
//       color: "#3b5998"
//     },
//     {
//       name: "Twitter",
//       icon: "fab fa-twitter",
//       url: "https://twitter.com/sypheracademy",
//       color: "#1da1f2"
//     },
//     {
//       name: "Instagram",
//       icon: "fab fa-instagram",
//       url: "https://instagram.com/sypheracademy",
//       color: "#e4405f"
//     },
//     {
//       name: "LinkedIn",
//       icon: "fab fa-linkedin-in",
//       url: "https://linkedin.com/company/sypheracademy",
//       color: "#0077b5"
//     },
//     {
//       name: "YouTube",
//       icon: "fab fa-youtube",
//       url: "https://youtube.com/sypheracademy",
//       color: "#ff0000"
//     },
//     {
//       name: "WhatsApp",
//       icon: "fab fa-whatsapp",
//       url: "https://wa.me/19193377330",
//       color: "#25d366"
//     }
//   ];

//   const handleMouseOver = (e, color, name) => {
//     e.currentTarget.style.backgroundColor = color;
//     e.currentTarget.style.color = 'white';
//     e.currentTarget.style.transform = 'translateX(10px)';
//     e.currentTarget.style.width = '140px';
    
//     // Show the name
//     const nameSpan = e.currentTarget.querySelector('.social-name');
//     if (nameSpan) {
//       nameSpan.style.opacity = '1';
//       nameSpan.style.transform = 'translateX(0)';
//     }
//   };

//   const handleMouseOut = (e, color) => {
//     e.currentTarget.style.backgroundColor = 'white';
//     e.currentTarget.style.color = color;
//     e.currentTarget.style.transform = 'translateX(0)';
//     e.currentTarget.style.width = '50px';
    
//     // Hide the name
//     const nameSpan = e.currentTarget.querySelector('.social-name');
//     if (nameSpan) {
//       nameSpan.style.opacity = '0';
//       nameSpan.style.transform = 'translateX(-20px)';
//     }
//   };

//   return (
//     <div 
//       className="social-media-sticky"
//       style={{
//         position: 'fixed',
//         left: '0',
//         top: '50%',
//         transform: 'translateY(-50%)',
//         zIndex: '9999',
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: '#fff',
//         boxShadow: '2px 0 15px rgba(0,0,0,0.15)',
//         borderRadius: '0 15px 15px 0',
//         overflow: 'visible'
//       }}
//     >
//       {socialLinks.map((social, index) => (
//         <a 
//           key={index}
//           href={social.url} 
//           target="_blank" 
//           rel="noopener noreferrer"
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             padding: '15px',
//             color: social.color,
//             fontSize: '18px',
//             textDecoration: 'none',
//             borderBottom: index < socialLinks.length - 1 ? '1px solid #eee' : 'none',
//             transition: 'all 0.3s ease',
//             width: '50px',
//             height: '50px',
//             justifyContent: 'flex-start',
//             position: 'relative',
//             overflow: 'hidden',
//             whiteSpace: 'nowrap'
//           }}
//           onMouseOver={(e) => handleMouseOver(e, social.color, social.name)}
//           onMouseOut={(e) => handleMouseOut(e, social.color)}
//         >
//           <i 
//             className={social.icon}
//             style={{
//               minWidth: '20px',
//               textAlign: 'center',
//               transition: 'all 0.3s ease'
//             }}
//           ></i>
          
//           <span 
//             className="social-name"
//             style={{
//               marginLeft: '12px',
//               fontSize: '14px',
//               fontWeight: '500',
//               opacity: '0',
//               transform: 'translateX(-20px)',
//               transition: 'all 0.3s ease',
//               position: 'absolute',
//               left: '35px',
//               top: '50%',
//               transform: 'translateY(-50%) translateX(-20px)'
//             }}
//           >
//             {social.name}
//           </span>
//         </a>
//       ))}
//     </div>
//   );
// };

// export default StickySocialMedia;


"use client";
import React from "react";

const StickySocialMedia = () => {
  return (
    <div className="social-media-sticky">
      {/* <a 
        href="https://facebook.com/sypheracademy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link facebook"
      >
        <i className="fab fa-facebook-f"></i>
        <span className="social-name">Facebook</span>
      </a>

      <a 
        href="https://twitter.com/sypheracademy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link twitter"
      >
        <i className="fab fa-twitter"></i>
        <span className="social-name">Twitter</span>
      </a>

      <a 
        href="https://instagram.com/sypheracademy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link instagram"
      >
        <i className="fab fa-instagram"></i>
        <span className="social-name">Instagram</span>
      </a>

      <a 
        href="https://linkedin.com/company/sypheracademy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link linkedin"
      >
        <i className="fab fa-linkedin-in"></i>
        <span className="social-name">LinkedIn</span>
      </a>

      <a 
        href="https://youtube.com/sypheracademy" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link youtube"
      >
        <i className="fab fa-youtube"></i>
        <span className="social-name">YouTube</span>
      </a> */}

      <a 
        href="/register/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link bookdemo"
      >
        <i className="fas fa-calendar-alt me-2"></i>
        <span className="social-name">Book A Free Demo</span>
      </a>
      <a 
        href="https://whatsapp.com/channel/0029Vb6CxN33WHTQbv12KJ2q" 
        target="_blank" 
        rel="noopener noreferrer"
        className="social-link whatsapp"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="social-name">WhatsApp</span>
      </a>
    </div>
  );
};

export default StickySocialMedia;