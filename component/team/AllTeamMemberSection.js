"use client";
import { useEduorContext } from "@/context/EduorContext";
import Link from "next/link";
import React from "react";

const AllTeamMemberSection = () => {
  const {
    currentTeamItems,
    currentTeamPage,
    handleTeamPageChange,
    totalTeamPages,
  } = useEduorContext();
  return (
    <section className="tf__team_page mt_190 xs_mt_95">
      <div className="container">
       
        <section className="tf__popular_services_2 mt_95">
      <div className="container">
        <div className="row wow fadeInUp">
          <div className="col-xl-7 col-xxl-6 col-md-8 col-lg-6 m-auto">
            <div className="tf__heading_area mb_15">
              <h2>Neural Pathway Learning: The Science Behind Our Success</h2>
              <p className="mt-4">At Sypher Academy, we don&#39;t just teach - we build stronger minds. Our
core methodology is a unique, four-step approach that makes learning more effective
and lasting. Click each step to learn more.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-md-6 col-lg-4 wow fadeInUp">
            <div className="tf__single_services">
              <span>
                <i className="fa fa-books-medical"></i>
              </span>
              <h3>Assessment</h3>
              <p>
                Every student begins with an assessment to understand their
individual learning patterns. This helps us see how their brain processes information,
identifying strengths and areas for growth to build a truly personalized foundation.
              </p>
              <a href="#">
                <i className="fa fa-long-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="col-xl-6 col-md-6 col-lg-4 wow fadeInUp">
            <div className="tf__single_services">
              <span>
                <i className="fal fa-book"></i>
              </span>
              <h3>Pathway Design:</h3>
              <p>
                Based on the assessment, we create a customized
curriculum for each student. This plan goes beyond the NC State standards, pushing
students to think critically, creatively, and apply knowledge in new ways.
              </p>
              <a href="#">
                <i className="fa fa-long-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="col-xl-6 col-md-6 col-lg-4 wow fadeInUp">
            <div className="tf__single_services">
              <span>
                <i className="fal fa-car-bus"></i>
              </span>
              <h3>Science in Practice</h3>
              <p>
                We use methods like spaced repetition to reinforce
learning and cognitive load theory to reduce mental strain, making learning more
efficient. This ensures concepts are deeply understood, not just memorized.
              </p>
              <a href="#">
                <i className="fa fa-long-arrow-right"></i>
              </a>
            </div>
          </div>
          <div className="col-xl-6 col-md-6 col-lg-4 wow fadeInUp">
            <div className="tf__single_services">
              <span>
                <i className="far fa-pencil-ruler"></i>
              </span>
              <h3>Competition Outcomes</h3>
              <p>
                Our goal is to prepare students for success in
competitions like Math Bowl and Academic Decathlon. This builds confidence, hones
problem-solving skills, and provides a tangible measure of their advanced capabilities.
              </p>
              <a href="#">
                <i className="fa fa-long-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
      
      </div>
    </section>

    
  );
};

export default AllTeamMemberSection;
