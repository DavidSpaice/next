import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "user") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Your secure logic here
  const data = await request.json();

  // Process data...

  return NextResponse.json(
    { message: "Item added successfully" },
    { status: 200 }
  );
}
