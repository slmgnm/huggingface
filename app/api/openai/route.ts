import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    if (!requestBody.inputs) {
      return new Response(
        JSON.stringify({ error: "Missing 'inputs' field in the request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing 'OpenAI API Key'" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const input = requestBody.inputs;
    const token = process.env.OPENAI_API_KEY;

    console.log("Using token:", token); // Debugging line

    const responseStream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant specialized in creating short bio based on a resume.",
        },
        { role: "user", content: input },
      ],
      model: "gpt-4", // Use the appropriate model
      stream: true, // Enable streaming
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = responseStream[Symbol.asyncIterator]();

        async function read() {
          try {
            const { value, done } = await reader.next();

            if (done) {
              controller.close();
              return;
            }

            const content = value.choices[0]?.delta?.content || "";
            console.log("content", content);
            controller.enqueue(encoder.encode(content));
            read();
          } catch (error) {
            controller.error(error);
          }
        }

        read();
      },
    });
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
