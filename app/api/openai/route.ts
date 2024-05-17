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
        JSON.stringify({ error: "Missing 'Hugging Face Access Token'" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const input = requestBody.inputs;
    const token = process.env.OPENAI_API_KEY;

    console.log("Using token:", token); // Debugging line

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant specialized in creating short bio based on a resume.",
        },
        { role: "user", content: input },
      ],
      model: "gpt-3.5-turbo",
    });

    const data = completion.choices[0];
    console.log("data", data);
    const generatedText = data.message.content || "No generated text available";
    return new Response(JSON.stringify(generatedText), {
      headers: {
        "Content-Type": "application/json",
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
