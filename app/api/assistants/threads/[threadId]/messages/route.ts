import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// export async function POST(request, { params: { threadId } }) {
//   const formData = await request.formData();
//   console.log("formData", formData);
//   const question = formData.get("question");
//   const content = [
//         {
//           type: "text",
//           text: question,
//         },
//       ];
//   await openai.beta.threads.messages.create(threadId, {
//     role: "user",
//     content: content,
//   });

//   const stream = openai.beta.threads.runs.stream(threadId, {
//     assistant_id: assistantId,
//   });

//   return new Response(stream.toReadableStream());
// }

// Send a new message to a thread, possibly including an image
export async function POST(request, { params: { threadId } }) {
  const formData = await request.formData();
  const question = formData.get("question");
  const content = [
    {
      type: "text",
      text: question,
    },
  ];

  if (formData.get("image")) {
    const image = formData.get("image");
    const file = await openai.files.create({
      file: image,
      purpose: "vision",
    });
    content.push({
      "type": "image_file",
      "image_file": { file_id: file.id },
    });
    console.log("file_id", file.id);
  }

  
  // If there's an image, add it to the message content

  // Create a message in the thread with the given content
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
  console.log(content);
  // Stream responses from the thread
  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });
  return new Response(stream.toReadableStream());
}
