import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import PlusIcon from "../../public/assets/plus-solid.svg";
import RichTextEditor from "../components/RichText";

const BioHF = ({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (value: string) => void;
}) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  useEffect(() => {
    if (!input) {
      generateBioInput();
    }
    console.log("input", input);
  }, [input]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        },
        body: JSON.stringify({ inputs: input }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data[0].generated_text);
        onChange(data[0].generated_text);
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
Generate a bio based on the following template for my CV, do not include the template in the response or other instructions.:
###
Name: Sara Johnson
Subtitle: Data Scientist.
Education: Master of Science in Data Science.
Experience: Data Scientist at XYZ Analytics.
Skills: collaborative, forward-thinking environment.

Bio: Hello! I'm Sarah Johnson, a passionate Data Scientist with expertise in machine learning and a drive for creating data-driven solutions.
I hold a Master of Science in Data Science and have hands-on experience as a Data Scientist at XYZ Analytics, where I've contributed to developing cutting-edge data models and extracting valuable insights from complex datasets.
 I'm now seeking opportunities to leverage my skills and knowledge in a collaborative and forward-thinking environment where I can contribute to meaningful projects and drive innovation through data. Let's unlock the power of data together and drive data-enabled success!
###

Name: ${name}
Subtitle: ${subtitle}
Education: ${education}
Experience: ${experience}
Skills: ${skills}
Bio: 
`;

    setInput(inputTemplate);
  };

  console.log("Response", response);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ position: "relative" }}>
          <RichTextEditor
            value={response}
            onChange={onChange}
            placeholder="Click + to add an AI-generated bio after filling other fields or write your own"
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
            {/* <Image  source={PlusIcon} alt="Add Icon" style={{ width: 20, height: 20 }} /> */}
            <PlusIcon alt="Add Icon" style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </form>
    </div>
  );
};
export default BioHF;
