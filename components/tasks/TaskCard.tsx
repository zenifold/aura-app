import { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useTask } from '@/contexts/task-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, MoreVertical, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-yellow-500',
  URGENT: 'bg-red-500',
};

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-500',
  IN_PROGRESS: 'bg-blue-500',
  REVIEW: 'bg-yellow-500',
  DONE: 'bg-green-500',
};

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { updateTask, deleteTask } = useTask();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      setIsLoading(true);
      await updateTask(task.id, { status });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsLoading(true);
        await deleteTask(task.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          <Badge className={statusColors[task.status]}>
            {task.status}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange('TODO')}>
              Set to Todo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>
              Set to In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('REVIEW')}>
              Set to Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('DONE')}>
              Set to Done
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg">{task.title}</CardTitle>
        {task.description && (
          <CardDescription className="mt-2">
            {task.description}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {task.assignedTo.map((user) => (
            <Avatar key={user.id} className="border-2 border-white">
              <AvatarFallback>
                {user.name?.[0] || user.email[0]}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </span>
            </div>
          )}
          {task.subtasks.length > 0 && (
            <Badge variant="outline">
              {task.subtasks.filter(t => t.status === 'DONE').length}/{task.subtasks.length}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
