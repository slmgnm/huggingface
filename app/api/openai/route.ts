import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    // Check for API key first
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    const input = requestBody.inputs;

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

    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (error?.status === 401 || error?.code === "invalid_api_key") {
      errorMessage = "Invalid OpenAI API key. Please check your API key in .env.local";
      statusCode = 401;
    } else if (error?.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
      statusCode = 429;
    } else if (error?.status === 503) {
      errorMessage = "OpenAI service is temporarily unavailable. Please try again later.";
      statusCode = 503;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
}
