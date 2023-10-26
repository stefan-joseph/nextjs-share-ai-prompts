import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) return new Response("Prompt not found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

export const PATCH = async (req, { params }) => {
  const session = await getServerSession(authOptions);
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id).populate("creator");

    if (!existingPrompt)
      return new Response("Prompt not found", { status: 404 });

    if (session?.user?.id !== existingPrompt.creator.id) {
      return new Response("You do not have permission to edit this prompt", {
        status: 403,
      });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Failed to update the prompt", {
      status: 500,
    });
  }
};

export const DELETE = async (req, { params }) => {
  const session = await getServerSession(authOptions);
  try {
    await connectToDB();

    const promptToDelete = await Prompt.findById(params.id).populate("creator");

    if (session?.user?.id !== promptToDelete.creator.id) {
      return new Response("You do not have permission to delete this prompt", {
        status: 403,
      });
    }

    await Prompt.findByIdAndRemove(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to delete prompt", {
      status: 500,
    });
  }
};
