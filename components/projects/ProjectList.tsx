import { useState } from 'react';
import { useTask } from '@/contexts/task-context';
import { Project } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { ProjectDialog } from './ProjectDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ProjectList() {
  const { projects, currentProject, setCurrentProject } = useTask();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  return (
    <div className="h-full border-r">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-4 space-y-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-colors hover:bg-accent ${
                currentProject?.id === project.id ? 'bg-accent' : ''
              }`}
              onClick={() => setCurrentProject(project)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{project.name}</CardTitle>
                {project.description && (
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{project.tasks.length} tasks</span>
                  <span>
                    {
                      project.tasks.filter((task) => task.status === 'DONE')
                        .length
                    }{' '}
                    completed
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={editingProject}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingProject(null);
        }}
      />
    </div>
  );
}
