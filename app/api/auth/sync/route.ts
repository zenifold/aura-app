import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.redirect(new URL("/sign-in"));
    }

    // Sync user with database
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
      create: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
    });

    // Create default organization if none exists
    const existingOrg = await prisma.organization.findFirst({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!existingOrg) {
      await prisma.organization.create({
        data: {
          name: "My Workspace",
          members: {
            connect: { id: userId },
          },
        },
      });
    }

    return NextResponse.redirect(new URL("/dashboard"));
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
