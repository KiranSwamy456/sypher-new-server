import Layout from "@/component/layout/Layout";


export const metadata = {
  title: "Register Now | Join Sypher Academy E-Learning Platform",
  description:
    "Sign up today at Sypher Academy and unlock access to world-class online courses, live training, and resources designed to accelerate your learning journey.",
  keywords: [
    "register Sypher Academy",
    "sign up e-learning",
    "join online academy",
    "student registration",
    "enroll courses",
  ],
  verification: {
    google: 'krgQUFQr7GitBtVgP5r6lxwX87d7Y83yfykLTGlf30c',
  },
};

export default function About() {
    return (
        <Layout>
            {/* <NavbarSection style="main_menu_3" logo="images/logo.svg" />     */}
            {/* <BreadcrumbSection header="Registration" title="Registration"/> */}
            <section className="tf__about_us_page mt_110 ">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-md-10 col-lg-8 m-auto wow fadeInUp">
                            <div className="tf__heading_area mb_50 text-center">
                                <h5 className="registration-subtitle">Sypher Academy - Online Tutoring</h5>
                                <h2 className="registration-title">Sypher Academy: Unlock your potential</h2>
                                <p className="registration-description">
                                    We are dedicated to helping middle and high school students go beyond the standard curriculum. Fill out the registration form
                                    below to get started
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-12">
                            <div className="registration-form-wrapper">
                                <div className="form-header">
                                    <div className="form-header-content">
                                        <h3>Registration Form</h3>
                                        <p>Please complete all required fields</p>
                                    </div>
                                </div>
                                
                                <div className="form-container">
                                    <iframe
                                        src="https://docs.google.com/forms/d/e/1FAIpQLScRDNqGcDn9VgRqku3o3RkziiBxeBtapsQ2uZUIn57DyUXhww/viewform?embedded=true"
                                        width="100%"
                                        height="1200"
                                        frameBorder="0"
                                        marginHeight="0"
                                        marginWidth="0"
                                        title="Registration Form"
                                        loading="lazy"
                                    >
                                        <div className="form-loading">
                                            <div className="loading-spinner"></div>
                                            <p>Loading registration form...</p>
                                        </div>
                                    </iframe>
                                </div>
                                
                                <div className="form-footer">
                                    <div className="support-info">
                                        <p>Need help? Contact our support team at <a href="mailto:support@sypheracademy.com">support@sypheracademy.com</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}