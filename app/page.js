import AboutSection3 from "@/component/about/AboutSection3";
import BannerSection3 from "@/component/banner/BannerSection3";
import FooterSection2 from "@/component/footer/FooterSection2";
import VideoModal from "@/component/modal/VideoModal";
import NavbarSection from "@/component/navbar/NavbarSection";
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
export default function Home() {
  return (
    <div className="home_3">
      <TopbarSection style="tf__topbar tf__topbar_2" />
      <NavbarSection style="main_menu_3" logo="images/logo.svg" />
      <BannerSection3 />
      <AboutSection3 style="about_3" />
      <FooterSection2 style="tf__footer_3" />
      <VideoModal />
      <ScrollToTopButton style="style-3" />
    </div>
    
  );
}
