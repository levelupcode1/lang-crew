import Faq from "../components/faq";
import Hero from "../components/hero";
import { Page } from "@/types/landing";
import { Project } from "@/types/project";
import Projects from "../components/projects";
import Search from "../components/search";

export default function ({
  page,
  projects,
  projectsCount,
}: {
  page: Page;
  projects: Project[];
  projectsCount: number;
}) {
  return (
    <div>
      {/* Hero 영역 주석 처리: 메인 상단 배너 숨김 */}
      {/* {page.hero && <Hero hero={page.hero} count={projectsCount} />} */}
      <Search />
      <Projects projects={projects} />
      {page.faq && <Faq section={page.faq} />}
    </div>
  );
}
