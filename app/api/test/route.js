import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const GET = async (req) => {
  console.log("hello");
  const session = await getServerSession(authOptions);
  console.log("session", session);

  return new Response("hello");
  //   try {
  //     // await connectToDB();

  //     const prompts = await Prompt.find({}).populate("creator");
  //     return new Response(JSON.stringify(prompts), { status: 200 });
  //   } catch (error) {
  //     return new Response("Failed to fetch all prompts", {
  //       status: 500,
  //     });
  //   }
};
