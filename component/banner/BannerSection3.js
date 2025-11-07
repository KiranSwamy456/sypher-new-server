"use client";
import { useEduorContext } from "@/context/EduorContext";
import Link from "next/link";
import React from "react";

const BannerSection3 = () => {
  const { handleVideoShow } = useEduorContext();
  return (
    <section className="tf__banner_2 tf__banner_3">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-md-10 col-lg-8">
            <div className="tf__banner_text wow fadeInUp">
              <h1 style={{color:"#d19d0b"}}>Welcome to Sypher Academy!</h1>
              <h4>
                Unlock your potential.
              </h4>
              <p>
               Our scientifically-backed, personalized learning pathways are designed to help every student
reach their full potential. All at an affordable cost for parents.
              </p>
              <ul className="d-flex flex-wrap align-items-center">
                <li>
                  <Link className="common_btn_3" href="/our-method">
                    Discover Our Method
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection3;
