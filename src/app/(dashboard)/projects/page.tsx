import { getProjects } from "@/server/actions/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your freelance projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full text-center p-12 border border-dashed rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
