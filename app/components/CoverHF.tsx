import React, { useState, useEffect } from "react";

import RichTextEditor from "../components/RichText";
import Loader from "./Loader";

import { PDFExport } from "@progress/kendo-react-pdf";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useAppContext } from "@/context/AppContext";

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

const CoverHF = ({ onChange }: { onChange: (value: any) => void }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { state, setState } = useAppContext();
  console.log("state in coverHF:", state);
  useEffect(() => {
    if (input === "" && state) {
      generateCoverInput();
    }
    console.log("input", input);
  }, [input, state]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResponse(""); // Clear the previous response

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: input,
          tokens: 200,
          stream: true, // Enable streaming
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        // Continuously read and append chunks to the response
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setResponse((prev) => prev + chunk);
        }

        setLoading(false);
      } else {
        const errorDetail = await res.json();
        console.error("Error sending request:", errorDetail);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error sending request:", err);
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target) {
      console.error("Event target is undefined");
      return;
    }

    const { name, value } = event.target;
    setState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
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
    } = state || {};

    console.log("state in coverHF:", companyName, jobTitle);

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

  const handleExportPDF = (event: React.MouseEvent) => {
    event.preventDefault();
    const pdfName = `CoverLetter-${state.name}.pdf`;
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(pdfName);
    }
  };

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
        className="modal flex justify-center items-center "
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl  max-h-[80vh] overflow-y-auto "
        >
          <div className="flex flex-col items-center">
            <p>{state && state?.name}</p>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold mb-4">Cover Letter</h1>
              <div className="flex flex-col items-center w-full">
                <div className="mb-4 w-full">
                  <label htmlFor="companyName" className="text-lg font-medium">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    value={state?.companyName}
                    id="companyName"
                    name="companyName"
                    className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4 w-full">
                  <label htmlFor="jobTitle" className="text-lg font-medium">
                    Job Title:
                  </label>
                  <input
                    type="text"
                    value={state?.jobTitle}
                    id="jobTitle"
                    name="jobTitle"
                    className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job title"
                    onChange={handleInputChange}
                  />
                </div>
                <PDFExport
                  ref={pdfExportComponent}
                  paperSize="a4"
                  fileName={`CoverLetter-${state?.name}`}
                >
                  <div className="relative w-full mb-4 pl-4">
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
                        <AutoAwesomeIcon
                          component="svg"
                          style={{ width: 20, height: 20 }}
                        />
                      )}
                    </button>
                  </div>
                </PDFExport>
              </div>
            </div>

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
