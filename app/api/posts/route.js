import { NextResponse } from "next/server";
import { createPost, getPosts } from "@/lib/posts";

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: error.message || "帖子加载失败" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const post = await createPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "帖子发布失败" },
      { status: error.status || 500 }
    );
  }
}
