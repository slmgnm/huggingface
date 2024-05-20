import React, { useState, useEffect } from "react";

import GenerateIcon from "../../public/assets/plus-solid.svg";
import RichTextEditor from "../components/RichText";
import Loader from "./Loader";
import Image from "next/image";

const CoverHF = ({
  coverLetterData,
  onChange,
}: {
  coverLetterData: any;
  onChange:(value: any) => void;
}) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (input === "") {
      generateBioInput();
    }
    console.log("input", input);
  }, [input]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: input,
          tokens: 200,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLoading(false);
        setResponse(data.replace(/###[\s\S]*?###/g, ""));
        onChange(data.replace(/###[\s\S]*?###/g, ""));
      } else {
        const errorDetail = await res.json();
        console.error("Error sending request:", errorDetail);
      }
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };
  const generateBioInput = () => {
    const { name, subtitle, education, experience, skills } = coverLetterData;

    console.log("coverLetterData in generateBioInput:", coverLetterData);

    const inputTemplate = `
###
Generate a cover letter based on the following template for my CV, do not include the inputTemplate in the response or other instructions, instruction are everything between :


example cover letter: [Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]
[Date]

[Company's Name]


Dear [Recipient's Name],

I am writing to express my interest in the [Job Title] position at [Company's Name], as advertised on [Job Board/Company's Website]. With a strong background in full stack development, specializing in Next.js and Feathers.js, I am excited about the opportunity to contribute to your team.

In my current role at [Your Current/Most Recent Company], I have successfully developed and maintained web applications using technologies such as JavaScript, React.js, Node.js, and TypeScript. I have a proven track record of delivering high-quality, scalable solutions and thrive in collaborative, fast-paced environments. Additionally, my experience with Firebase and Tailwind has equipped me with a versatile skill set that I am eager to bring to [Company's Name].

I am particularly drawn to [Company's Name] because of [specific reason related to the company or its projects], and I am confident that my technical expertise and passion for innovation would make me a valuable asset to your team.

I look forward to the opportunity to discuss how my skills and experiences align with the needs of your team. Thank you for considering my application. I am excited about the prospect of contributing to [Company's Name] and am available at your earliest convenience for an interview.

Sincerely,
[Your Name]

use for my cover letter:
Name: ${name}
Subtitle: ${subtitle}
Education: ${education}
Experience: ${experience}
Skills: ${skills}
company's name: [Company's Name]
###
`;

    setInput(inputTemplate);
  };

  console.log("Response", response);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <RichTextEditor
            value={coverLetterData || ""}
            onChange={onChange}
            placeholder={`Click  on the 🤖 to add an AI-generated bio after filling other fields or write your own`}
          />

          <button
            type="submit"
            id="bioSubmit"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
              background: "transparent",
              border: "none",

              outline: "none",
            }}
          >
            {loading ? (
              <Loader />
            ) : (
              <GenerateIcon alt="Add Icon" style={{ width: 20, height: 20 }} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CoverHF;
