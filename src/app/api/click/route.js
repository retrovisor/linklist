import {Event} from '@/models/Event';
import mongoose from "mongoose";
import clientPromise from "@/libs/mongoClient";

export async function POST(req) {
  const client = await clientPromise; const db = client.db();
  const url = new URL(req.url);
  const clickedLink = atob(url.searchParams.get('url'));
  const page = url.searchParams.get('page');
  await Event.create({type:'click', uri: clickedLink, page});
  return Response.json(true);
}
