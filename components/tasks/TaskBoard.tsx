import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '@/types/task';
import { useTask } from '@/contexts/task-context';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from './TaskDialog';

const TASK_STATUS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'TODO':
      return 'border-l-gray-500';
    case 'IN_PROGRESS':
      return 'border-l-blue-500';
    case 'REVIEW':
      return 'border-l-yellow-500';
    case 'DONE':
      return 'border-l-green-500';
  }
};

export function TaskBoard() {
  const { tasks, currentProject, updateTask } = useTask();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    if (sourceStatus === destinationStatus) {
      // Reorder within the same column
      const columnTasks = tasks
        .filter(t => t.status === sourceStatus)
        .sort((a, b) => a.position - b.position);

      const newPosition = calculateNewPosition(
        columnTasks,
        source.index,
        destination.index
      );

      await updateTask(task.id, { position: newPosition });
    } else {
      // Move to different column
      const destinationTasks = tasks
        .filter(t => t.status === destinationStatus)
        .sort((a, b) => a.position - b.position);

      const newPosition = calculateNewPosition(
        destinationTasks,
        -1,
        destination.index
      );

      await updateTask(task.id, {
        status: destinationStatus,
        position: newPosition,
      });
    }
  };

  const calculateNewPosition = (
    columnTasks: Task[],
    sourceIndex: number,
    destinationIndex: number
  ): number => {
    if (columnTasks.length === 0) return 1000;

    if (destinationIndex === 0) {
      return columnTasks[0].position / 2;
    }

    if (destinationIndex >= columnTasks.length) {
      return columnTasks[columnTasks.length - 1].position + 1000;
    }

    const prevTask = columnTasks[destinationIndex - 1];
    const nextTask = columnTasks[destinationIndex];
    return (prevTask.position + nextTask.position) / 2;
  };

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {currentProject ? currentProject.name : 'All Tasks'}
        </h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
          {TASK_STATUS.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col p-4 rounded-lg bg-gray-50 border-l-4 ${getStatusColor(
                    status
                  )} ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
                >
                  <h3 className="font-semibold mb-4">{status}</h3>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {tasks
                      .filter((task) => task.status === status)
                      .sort((a, b) => a.position - b.position)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onEdit={() => {
                                  setEditingTask(task);
                                  setIsDialogOpen(true);
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
}
