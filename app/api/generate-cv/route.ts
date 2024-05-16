// /pages/api/generate-cv.js

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
  
      if (!process.env.HUGGING_FACE_TOKEN) {
        return new Response(
          JSON.stringify({ error: "Missing 'Hugging Face Access Token'" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      const input = requestBody.inputs;
      const token = process.env.HUGGING_FACE_TOKEN;
  
      console.log("Using token:", token); // Debugging line
  
      const response = await fetch(
        "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: input }),
        }
      );
  
      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Hugging Face API Error:", errorDetail); // Debugging line
        return new Response(
          JSON.stringify({ error: "Request Failed", detail: errorDetail }),
          {
            status: response.status,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      const data = await response.json();
  
      return new Response(JSON.stringify(data), {
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
  