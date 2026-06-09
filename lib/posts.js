import { DEFAULT_COVER } from "@/lib/constants";
import { createSeedPosts } from "@/lib/seed-posts";
import { getDb } from "@/lib/mongodb";

const COLLECTION = "posts";

function publicPost(post) {
  if (!post) return null;
  const { _id, ...rest } = post;
  return {
    ...rest,
    images: Array.isArray(rest.images) && rest.images.length ? rest.images : [DEFAULT_COVER],
    comments: Array.isArray(rest.comments) ? rest.comments : [],
    likes: Number(rest.likes || 0)
  };
}

function cleanText(value) {
  return String(value || "").trim();
}

function cleanImages(images) {
  if (!Array.isArray(images)) return [DEFAULT_COVER];
  const cleaned = images.filter((src) => typeof src === "string" && src.trim()).map((src) => src.trim());
  return cleaned.length ? cleaned : [DEFAULT_COVER];
}

async function postsCollection() {
  const db = await getDb();
  const collection = db.collection(COLLECTION);
  await collection.createIndex({ id: 1 }, { unique: true });
  return collection;
}

export async function ensureSeedPosts() {
  const collection = await postsCollection();
  const count = await collection.estimatedDocumentCount();
  if (count > 0) return;

  try {
    await collection.insertMany(createSeedPosts(), { ordered: false });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }
}

export async function getPosts() {
  await ensureSeedPosts();
  const collection = await postsCollection();
  const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return posts.map(publicPost);
}

export async function getPost(id) {
  await ensureSeedPosts();
  const collection = await postsCollection();
  return publicPost(await collection.findOne({ id }));
}

export async function createPost(input) {
  const title = cleanText(input.title);
  const body = cleanText(input.body);
  if (!title || !body) {
    const error = new Error("标题和正文不能为空");
    error.status = 400;
    throw error;
  }

  const post = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.slice(0, 60),
    body,
    images: cleanImages(input.images),
    createdAt: Date.now(),
    likes: 0,
    comments: []
  };

  const collection = await postsCollection();
  await collection.insertOne(post);
  return publicPost(post);
}

export async function likePost(id) {
  await ensureSeedPosts();
  const collection = await postsCollection();
  const result = await collection.updateOne({ id }, { $inc: { likes: 1 } });
  if (!result.matchedCount) return null;
  return publicPost(await collection.findOne({ id }));
}

export async function addComment(id, input) {
  const nickname = cleanText(input.nickname);
  const content = cleanText(input.content);
  if (!nickname || !content) {
    const error = new Error("昵称和评论内容不能为空");
    error.status = 400;
    throw error;
  }

  await ensureSeedPosts();
  const collection = await postsCollection();
  const comment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nickname: nickname.slice(0, 20),
    content,
    createdAt: Date.now()
  };
  const result = await collection.updateOne({ id }, { $push: { comments: comment } });
  if (!result.matchedCount) return null;
  return publicPost(await collection.findOne({ id }));
}
