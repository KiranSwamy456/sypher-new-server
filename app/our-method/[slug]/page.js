import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import Layout from "@/component/layout/Layout";
import TeamDetailSection from "@/component/team/TeamDetailSection";
import { teamData } from "@/data/Data";

export const metadata = {
  title: "Sypher Team Details Page",
  description: "Developed by Azizur Rahman",
};

// Generate static params for all team members
export async function generateStaticParams() {
  return teamData.map((team) => ({
    slug: team.slug,
  }));
}

const ErrorSection = ({ type }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h2 className="text-2xl font-bold mb-4">404 - {type} Not Found</h2>
    <p className="text-gray-600">The {type.toLowerCase()} you're looking for doesn't exist.</p>
  </div>
);

export default function TeamDetails({ params }) {
  const { slug } = params;
  const teamDesc = teamData.find((item) => item.slug === slug);
  return (
    <Layout>
      <BreadcrumbSection header="Team Details" title="Team Details" />
      {teamDesc ? (
        <TeamDetailSection teamInfo={teamDesc} />
      ) : (
        <ErrorSection type="Team Member" />
      )}
    </Layout>
  );
}