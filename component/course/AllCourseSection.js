"use client";
import { useEduorContext } from "@/context/EduorContext";
import Link from "next/link";
import React from "react";

const AllCourseSection = () => {
  const {
    currentCourseItems,
    currentCoursePage,
    handleCoursePageChange,
    totalCoursePages,
  } = useEduorContext();
  return (
      <section className="tf__categories mt_95">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_15">
              <h2>OUR COURSE CATEGORIES</h2>
              <p>We offer a variety of services designed to meet the specific needs of
middle and high school students. All our programs use our Neural Pathway Learning
methodology to ensure maximum effectiveness.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-md-6 wow fadeInUp">
            <div className="tf__single_category light_blue">
              <div className="tf__single_category_icon">
                <i className="fa fa-book"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Middle School Academic Excellence (Grades 6-8)</h3>
                <p>Focus on building a strong foundation in core subjects.</p>
                <p>Preparation for high school-level work and advanced classes.</p>
                <p>Introductory problem-solving for competitions.</p>
                
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-6 wow fadeInUp">
            <div className="tf__single_category blue">
              <div className="tf__single_category_icon">
                <i className="fa fa-book"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>High School Competition Prep (Grades 9-12)</h3>
                <p>Advanced curriculum that goes 20-30% beyond state standards.</p>
                <p>Specific training for Math Bowl, Science Fair, and other academic events.</p>
                <p>College readiness and standardized test preparation.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-6 wow fadeInUp">
            <div className="tf__single_category green">
              <div className="tf__single_category_icon">
                <i className="fa fa-book"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>Small Group Tutoring (3-4 Students)</h3>
                <p>Collaborative learning environment focused on key subjects.</p>
                <p>Peer support and discussion to reinforce concepts.</p>
                <p>Structured sessions to build confidence and teamwork skills.</p>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-6 wow fadeInUp">
            <div className="tf__single_category gray">
              <div className="tf__single_category_icon">
                <i className="fa fa-book"></i>
              </div>
              <div className="tf__single_category_text">
                <h3>1-on-1 Tutoring</h3>
                <p>Highly customized sessions with a dedicated tutor.</p>
                <p>Focused support in specific subjects where a student needs extra help.</p>
                <p>Flexible scheduling to fit your family&#39;s needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCourseSection;
