import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import Layout from "@/component/layout/Layout";
import AllTeamMemberSection from "@/component/team/AllTeamMemberSection";
export const metadata = {
  title: "Our Learning Method | Sypher Academy E-Learning Approach",
  description:
    "At Sypher Academy, we use a proven teaching methodology combining interactive sessions, real-world projects, and personalized mentoring to maximize student success.",
  keywords: [
    "learning method",
    "teaching methodology",
    "Sypher Academy approach",
    "interactive e-learning",
    "student mentoring",
  ],
  verification: {
    google: 'krgQUFQr7GitBtVgP5r6lxwX87d7Y83yfykLTGlf30c',
  },
};
export default function Team() {
    return (
        <Layout>
            <BreadcrumbSection header='Our Method' title='Our Method'/>
            <AllTeamMemberSection/>
        </Layout>
    )
}