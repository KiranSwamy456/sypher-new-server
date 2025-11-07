import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import AllCourseSection from "@/component/course/AllCourseSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: "Our Services | Online Learning Solutions – Sypher Academy",
  description:
    "Discover Sypher Academy’s range of e-learning services, from live classes and recorded lessons to career-focused training programs designed for learners of all levels.",
  keywords: [
    "e-learning services",
    "online classes",
    "digital training programs",
    "recorded courses",
    "career learning",
  ],
  verification: {
    google: 'krgQUFQr7GitBtVgP5r6lxwX87d7Y83yfykLTGlf30c',
  },
};
export default function Courses() {
    return (
        <Layout>
            <BreadcrumbSection header='Our Services' title='Our Services'/>
            <AllCourseSection/>
        </Layout>
    )
}