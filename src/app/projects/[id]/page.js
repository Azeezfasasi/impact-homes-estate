"use client";
import MainNav from "@/components/home-component/MainNav";
import ProjectDetails from "@/components/home-component/ProjectDetails";
import { useParams } from "next/navigation";

export default function ProjectDetailsPage() {
  const params = useParams();
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects' }
  ]
  return (
    <>
      <MainNav
        title="Our Projects"
        breadcrumbs={breadcrumbs}
      />
      <ProjectDetails projectId={params.id} />
    </>
  );
}
