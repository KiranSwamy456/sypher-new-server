import AboutSection3 from "@/component/about/AboutSection3";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import Layout from "@/component/layout/Layout";
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
               
            </section>
        </Layout>
    )
}