import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import ContactPageSection from "@/component/contact/ContactPageSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: "Contact Us | Sypher Academy – Get in Touch Today",
  description:
    "Have questions about our courses or services? Contact Sypher Academy for support, inquiries, or partnership opportunities. We’re here to help you succeed.",
  keywords: [
    "contact Sypher Academy",
    "support e-learning",
    "online education help",
    "course inquiries",
    "learning support",
  ],
  verification: {
    google: 'krgQUFQr7GitBtVgP5r6lxwX87d7Y83yfykLTGlf30c',
  },
};
export default function Contact() {
    return (
        <Layout>
            <BreadcrumbSection header='Contact Us' title="Contact us"/>
            <ContactPageSection/>
        </Layout>
    )
}