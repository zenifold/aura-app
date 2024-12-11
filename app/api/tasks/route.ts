import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId || undefined,
        project: {
          members: {
            some: {
              id: userId
            }
          }
        }
      },
      include: {
        assignedTo: true,
        createdBy: true,
        comments: {
          include: {
            author: true
          }
        },
        subtasks: true
      },
      orderBy: {
        position: 'asc'
      }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error in tasks GET route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, priority, projectId, assignedToIds, dueDate, parentId, position } = body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        creatorId: userId,
        assignedTo: {
          connect: assignedToIds?.map((id: string) => ({ id })) || [{ id: userId }]
        },
        dueDate: dueDate ? new Date(dueDate) : undefined,
        parentId,
        position: position || 0
      },
      include: {
        assignedTo: true,
        createdBy: true
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error in tasks POST route:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, status, priority, assignedToIds, dueDate, parentId, position } = body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        assignedTo: assignedToIds ? {
          set: assignedToIds.map((id: string) => ({ id }))
        } : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        parentId,
        position
      },
      include: {
        assignedTo: true,
        createdBy: true
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error in tasks PATCH route:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in tasks DELETE route:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
