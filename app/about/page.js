import AboutSection3 from "@/component/about/AboutSection3";
import ActivitySection2 from "@/component/activity/ActivitySection2";
import BlogSection from "@/component/blog/BlogSection";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import CourseSection from "@/component/course/CourseSection";
import FaqSection from "@/component/faq/FaqSection";
import Layout from "@/component/layout/Layout";
import PopularServiceSection2 from "@/component/service/PopularServiceSection2";
export const metadata = {
  title: "About Us | Sypher Academy – Your E-Learning Partner",
  description:
    "Learn about Sypher Academy’s mission to empower students through innovative online education, expert faculty, and a supportive digital learning environment.",
  keywords: [
    "about Sypher Academy",
    "e-learning mission",
    "online education team",
    "digital learning goals",
    "student success",
  ],
  verification: {
    google: 'krgQUFQr7GitBtVgP5r6lxwX87d7Y83yfykLTGlf30c',
  },
};
export default function About() {
    return (
        <Layout>
            <BreadcrumbSection header="About us" title="About us"/>
            <section className="tf__about_us_page mt_195 xs_mt_100">
                <AboutSection3 style=''/>
                {/* <PopularServiceSection2/>
                <CourseSection style="tf__popular_courses"/>
                <FaqSection img="images/faq_img_2.jpg"/>
                <ActivitySection2 style="tf__activities_slider_area pt_95 pb_100"/>
                <BlogSection/> */}
            </section>
        </Layout>
    )
}