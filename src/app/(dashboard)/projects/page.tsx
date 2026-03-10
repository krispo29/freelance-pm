import { getProjects } from "@/server/actions/projects";
import { getClients } from "@/server/actions/clients";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog } from "@/components/projects/project-dialog";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([
    getProjects(),
    getClients()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your freelance projects.</p>
        </div>
        <ProjectDialog clients={clients} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full text-center p-12 border border-dashed rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
            <ProjectDialog clients={clients} />
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
