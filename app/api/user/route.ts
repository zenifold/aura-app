import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id, email, name } = await request.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check database connection
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Create or update the user
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        name,
      },
      create: {
        id,
        email,
        name,
      },
    });

    // Check if user already has an organization
    const existingOrg = await prisma.organization.findFirst({
      where: {
        members: {
          some: {
            id: user.id
          }
        }
      }
    });

    if (!existingOrg) {
      // Create a default organization for the user
      const organization = await prisma.organization.create({
        data: {
          name: "My Workspace",
          members: {
            connect: { id: user.id }
          }
        }
      });

      // Create a default project with sample tasks
      await prisma.project.create({
        data: {
          name: "Getting Started",
          description: "Welcome to Aura! Here are some tasks to help you get started.",
          organization: {
            connect: { id: organization.id }
          },
          members: {
            connect: { id: user.id }
          },
          tasks: {
            create: [
              {
                title: "👋 Welcome to Aura",
                description: "This is your first project in Aura. Feel free to customize it or create a new one!",
                status: "TODO",
                priority: "HIGH",
                createdBy: {
                  connect: { id: user.id }
                },
                assignedTo: {
                  connect: { id: user.id }
                },
                position: 0
              },
              {
                title: "✨ Customize your workspace",
                description: "Try creating a new project, adding tasks, and inviting team members.",
                status: "TODO",
                priority: "MEDIUM",
                createdBy: {
                  connect: { id: user.id }
                },
                assignedTo: {
                  connect: { id: user.id }
                },
                position: 1
              },
              {
                title: "🎯 Set your first milestone",
                description: "Create a milestone by grouping related tasks together.",
                status: "TODO",
                priority: "MEDIUM",
                createdBy: {
                  connect: { id: user.id }
                },
                assignedTo: {
                  connect: { id: user.id }
                },
                position: 2
              }
            ]
          }
        }
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in user API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
