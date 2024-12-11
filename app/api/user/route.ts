import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, email, name } = await request.json();

    // Verify the authenticated user matches the requested user
    if (userId !== id) {
      return NextResponse.json(
        { error: 'Unauthorized: User ID mismatch' },
        { status: 403 }
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
      include: {
        organizations: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Check if user has an organization
    if (user.organizations.length === 0) {
      // Create default organization
      const organization = await prisma.organization.create({
        data: {
          name: "My Workspace",
          members: {
            connect: { id: user.id }
          }
        }
      });

      // Add organization to user response
      user.organizations.push({
        id: organization.id,
        name: organization.name
      });
    }

    return NextResponse.json({
      user: {
        ...user,
        organizationId: user.organizations[0]?.id || null,
        organizationRole: 'admin', // Default role for now
      }
    });
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
