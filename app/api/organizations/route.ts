import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const organization = await db.organization.create({
      data: {
        name,
        members: {
          connect: { id: userId }
        }
      }
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.log("[ORGANIZATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
