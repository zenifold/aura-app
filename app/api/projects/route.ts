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
    const organizationId = searchParams.get('organizationId');

    const projects = await prisma.project.findMany({
      where: {
        organizationId: organizationId || undefined,
        members: {
          some: {
            id: userId
          }
        }
      },
      include: {
        members: true,
        tasks: {
          include: {
            assignedTo: true,
            createdBy: true
          }
        }
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in projects GET route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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
    const { name, description, organizationId, memberIds } = body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        organizationId,
        members: {
          connect: memberIds?.map((id: string) => ({ id })) || [{ id: userId }]
        }
      },
      include: {
        members: true
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in projects POST route:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
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
    const { id, name, description, status, memberIds } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        members: memberIds ? {
          set: memberIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        members: true
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in projects PATCH route:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in projects DELETE route:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
