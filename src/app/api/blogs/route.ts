import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });

    // ✅ Fetch all blogs
    const { data, error } = await supabase.from("blogs").select("*");

    if (error) {
      console.error("Error fetching blogs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });

    // ✅ Parse request body
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // ✅ Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User authentication error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Insert new blog post
    const { data, error } = await supabase
      .from("blogs")
      .insert([{ title, content, author_id: user.id }])
      .select("*");

    if (error) {
      console.error("Error inserting blog:", error);
      return NextResponse.json({ error: error.message, error1:error }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Blog created successfully!", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
