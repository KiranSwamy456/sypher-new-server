// component/layout/layout.js
"use client";
import React from "react";
import NavbarSection from "../navbar/NavbarSection";
import FooterSection from "../footer/FooterSection";
import ScrollToTopButton from "../utils/ScrollToTopButton";
import StickySocialMedia from "../utils/StickySocialMedia";

const Layout = ({ children }) => {
  return (
    <>
      <NavbarSection style="" logo="/images/logo.svg" />
      {children}
      <ScrollToTopButton style="" />
      <FooterSection />
      {/* Add this at the end */}
      <StickySocialMedia />
    </>
  );
};

export default Layout;