import { ProjectList } from '@/components/projects/ProjectList';
import { TaskBoard } from '@/components/tasks/TaskBoard';

export default function TasksPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80">
        <ProjectList />
      </div>
      <div className="flex-1">
        <TaskBoard />
      </div>
    </div>
  );
}
