import { Category } from "@/types/category";
import Crumb from "./crumb";
import Link from "next/link";
import { Project } from "@/types/project";
import Projects from "../projects";

export default function ({
  category,
  projects,
}: {
  category: Category;
  projects: Project[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-4 md:px-10 md:py-4 lg:py-4">
      <Crumb category={category} />
      <div className="mt-16 text-center">
        <h1 className="text-4xl text-primary font-bold mb-2">
          {category.title} 카테고리의 MCP 크루
        </h1>
        <p className="text-lg text-gray-500 mt-4">
          총 <span className="text-primary">{category.projects_count || 0}</span>개의 MCP 크루가 있습니다
        </p>
      </div>

      <div className="w-full text-center">
        {projects && <Projects projects={projects} />}
      </div>
    </div>
  );
}
