// import AboutSection from "@/component/about/AboutSection";
// import ActivitySection from "@/component/activity/ActivitySection";
// import BannerSection from "@/component/banner/BannerSection";
// import BlogSection from "@/component/blog/BlogSection";
// import CategorySection from "@/component/category/CategorySection";
// import EventSection from "@/component/event/EventSection";
// import FaqSection from "@/component/faq/FaqSection";
// import FooterSection from "@/component/footer/FooterSection";
// import VideoModal from "@/component/modal/VideoModal";
// import NavbarSection from "@/component/navbar/NavbarSection";
// import TestimonialSection from "@/component/testimonial/TestimonialSection";
// import ScrollToTopButton from "@/component/utils/ScrollToTopButton";
// import VideoSection from "@/component/video/VideoSection";
// import WorkSection from "@/component/work/WorkSection";

// export const metadata = {
//   title: "Sypher Home Page 1",
//   description: "Developed by Azizur Rahman",
// };

// export default function Home() {
//   return (
//     <>
//       <NavbarSection style="" logo="images/logo.png" />
//       <BannerSection />
//       <CategorySection />
//       <AboutSection />
//       <EventSection section="tf__event mt_95" startIndex={0} endIndex={4} />
//       <FaqSection img="images/faq_img.jpg" />
//       <WorkSection />
//       <TestimonialSection />
//       <ActivitySection />
//       <VideoSection />
//       <BlogSection />
//       <FooterSection />
//       <VideoModal />
//       <ScrollToTopButton style="" />
//     </>
//   );
// }


import AboutSection3 from "@/component/about/AboutSection3";
import ActivitySection2 from "@/component/activity/ActivitySection2";
import BannerSection3 from "@/component/banner/BannerSection3";
import BlogSection2 from "@/component/blog/BlogSection2";
import CategorySection3 from "@/component/category/CategorySection3";
import ContactSection from "@/component/contact/ContactSection";
import ContactSection2 from "@/component/contact/ContactSection2";
import CounterSection from "@/component/counter/CounterSection";
import CourseSection2 from "@/component/course/CourseSection2";
import FooterSection2 from "@/component/footer/FooterSection2";
import VideoModal from "@/component/modal/VideoModal";
import NavbarSection from "@/component/navbar/NavbarSection";
import TeamSection from "@/component/team/TeamSection";
import TopbarSection from "@/component/topbar/TopbarSection";
import ScrollToTopButton from "@/component/utils/ScrollToTopButton";
export const metadata = {
  title: "Sypher Academy: Unlock your potential",
  description: "Explore Sypher Academy – your trusted e-learning platform offering interactive courses, expert guidance, and personalized learning to help you achieve academic and professional success.",
  keywords: [
    "e-learning",
    "online courses",
    "digital learning",
    "Sypher Academy",
    "online education platform",
    "interactive learning",
    "career growth",
  ],
};
export default function Home3() {
  return (
    <div className="home_3">
      <TopbarSection style="tf__topbar tf__topbar_2" />
      <NavbarSection style="main_menu_3" logo="images/logo.svg" />
      <BannerSection3 />
      <CategorySection3 />
      <AboutSection3 style="about_3" />
      {/* <ContactSection /> */}
      {/* <CourseSection2 /> */}
      {/* <CounterSection /> */}
      {/* <TeamSection style="tf__team_3 pt_250 pb_100" /> */}
      {/* <ContactSection2 /> */}
      {/* <ActivitySection2 style="tf__activities_3 tf__activities_slider_area mt_100 pt_95 pb_100" /> */}
      {/* <BlogSection2 /> */}
      {/* <FooterSection2 style="tf__footer_3" logo="images/footer_logo3.png" /> */}
      <FooterSection2 style="tf__footer_3" />
      <VideoModal />
      <ScrollToTopButton style="style-3" />
    </div>
    
  );
}
