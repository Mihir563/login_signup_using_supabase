import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log(data.session, data.user, data.weakPassword)
    return NextResponse.json({
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
