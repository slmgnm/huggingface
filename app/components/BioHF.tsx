import React, { useState, useEffect } from "react";

import GenerateIcon from "../../public/assets/plus-solid.svg";
import RichTextEditor from "../components/RichText";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Loader from "./Loader";
import Image from "next/image";

const BioHF = ({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (value: string) => void;
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
    const { name, subtitle, education, experience, skills } = formData;

    console.log("formData in generateBioInput:", formData);

    const inputTemplate = `
###
Generate a bio based on the following template for my CV, do not include the inputTemplate in the response or other instructions, instruction are everything between :


example Bio: Hello! I'm Sarah Johnson, a passionate Data Scientist with expertise in machine learning and a drive for creating data-driven solutions.
I hold a Master of Science in Data Science and have hands-on experience as a Data Scientist at XYZ Analytics, where I've contributed to developing cutting-edge data models and extracting valuable insights from complex datasets.
 I'm now seeking opportunities to leverage my skills and knowledge in a collaborative and forward-thinking environment where I can contribute to meaningful projects and drive innovation through data. Let's unlock the power of data together and drive data-enabled success!

use for my bio:
Name: ${name}
Subtitle: ${subtitle}
Education: ${education}
Experience: ${experience}
Skills: ${skills}
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
            value={formData.bio || ""}
            onChange={onChange}
            placeholder={`Click  on the ✨ to add an AI-generated bio after filling other fields or write your own`}
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
            <AutoAwesomeIcon
              component="svg"
              style={{ width: 20, height: 20 }}
            />
          </button>
        </div>
      </form>
    </div>
  );
};
export default BioHF;
