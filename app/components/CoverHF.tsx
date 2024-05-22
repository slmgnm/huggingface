import React, { useState, useEffect } from "react";

import GenerateIcon from "../../public/assets/plus-solid.svg";
import RichTextEditor from "../components/RichText";
import Loader from "./Loader";
import Image from "next/image";
import { PDFExport } from "@progress/kendo-react-pdf";
import { on } from "events";
type FormData = {
  name: string;
  subtitle: string;
  bio: string;
  phone: string;
  address: string;
  email: string;
  education: string[];
  experience: string[];
  skills: string[];
  languages: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  image: string;
  companyName: string;
  jobTitle: string;
};
const CoverHF = ({
  formData = {},
  setFormData,
  onChange,
}: {
  formData: Partial<FormData>;
  setFormData: (value: any) => void;
  onChange: (value: any) => void;
}) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (input === "") {
      generateCoverInput();
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
  const generateCoverInput = () => {
    const {
      name,
      subtitle,
      education,
      experience,
      skills,
      companyName,
      jobTitle,
      address,
      email,
      phone,
    } = formData;

    console.log("formData in coverHF:", formData);

    const inputTemplate = `
###
Generate a cover letter in html tags with Tailwind  based on the following template for my CV, do not include the inputTemplate in the response or other instructions, instruction are everything between :


example cover letter:
 [Your Name]
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
email: ${email}
phone: ${phone}
address: ${address}
companyName: ${companyName}
Job Title: ${jobTitle}
Subtitle: ${subtitle}
Education: ${education}
Experience: ${experience}
Skills: ${skills}
company's name: ${companyName}
###
`;

    setInput(inputTemplate);
  };

  const pdfExportComponent = React.useRef<any>(null);
  // useEffect(() => {
  //   if (state) {
  //     setCoverLetterData(state);
  //   }
  // }, [state]);
  const handleExportPDF = () => {
    const pdfName = `CoverLetter-${formData.name}.pdf`;
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(pdfName);
    }
  };
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   const { name, value } = event.target;
  //   setFormData((prevState: any) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };
  console.log("Response", response);
  return (
    <div className="flex flex-col items-left">
      <button
        className="btn btn-neutral m-3"
        onClick={() =>
          (
            document.getElementById("my_modal_1") as HTMLDialogElement
          ).showModal()
        }
      >
        Cover Letter
      </button>
      <dialog
        id="my_modal_1"
        className="modal flex justify-center items-center"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl"
        >
          <div className="flex flex-col items-center">
            <PDFExport
              ref={pdfExportComponent}
              paperSize="auto"
              fileName={`CoverLetter-${formData?.name}`}
            >
              <p>{formData && formData?.name}</p>
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Cover Letter</h1>
                <div className="flex flex-col items-center w-full">
                  <div className="mb-4 w-full">
                    <label
                      htmlFor="companyName"
                      className="text-lg font-medium"
                    >
                      Company Name:
                    </label>
                    <input
                      type="text"
                      value={formData && formData.companyName}
                      id="companyName"
                      className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                      onChange={onChange}
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <label htmlFor="jobTitle" className="text-lg font-medium">
                      Job Title:
                    </label>
                    <input
                      value={formData && formData.jobTitle}
                      type="text"
                      id="jobTitle"
                      className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter job title"
                      onChange={onChange}
                    />
                  </div>
                  <div className="relative w-full mb-4">
                    <RichTextEditor
                      value={response || ""}
                      onChange={onChange}
                      placeholder={`Click on the 🤖 to add an AI-generated bio after filling other fields or write your own`}
                    />
                    <button
                      type="submit"
                      id="bioSubmit"
                      className="absolute top-0 right-0 mt-2 mr-2"
                    >
                      {loading ? (
                        <Loader />
                      ) : (
                        <GenerateIcon
                          alt="Add Icon"
                          style={{ width: 20, height: 20 }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </PDFExport>
            <div className="pt-4 pb-4">
              <button
                className="block h-fit shadow-none border-0 px-8 py-4 bg-gray-800 rounded-md text-white text-sm font-medium text-center cursor-pointer transition-all duration-200 ease-in-out"
                onClick={handleExportPDF}
              >
                Export Cover Letter as PDF
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
};
export default CoverHF;
