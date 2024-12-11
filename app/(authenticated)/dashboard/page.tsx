import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskBoard } from '@/components/tasks/TaskBoard';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="tasks" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="tasks" className="space-y-4">
          <TaskTable />
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <ProjectTable />
        </TabsContent>

        <TabsContent value="board" className="space-y-4">
          <TaskBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
}