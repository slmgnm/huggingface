"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

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
  const { state, setState, theme } = useAppContext();
  console.log("state in coverHF:", state);
  useEffect(() => {
    if (input === "" && state) {
      generateCoverInput();
    }
    console.log("input", input);
  }, [input, state]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate required fields
    if (!state?.companyName || !state?.jobTitle) {
      toast.warning("Please enter company name and job title first");
      return;
    }

    if (!state?.name || !state?.experience?.length) {
      toast.warning("Please fill in your CV details first (name, experience)");
      return;
    }

    try {
      setLoading(true);
      setResponse("");
      toast.info("Generating your cover letter...", { autoClose: 2000 });

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: input,
          tokens: 200,
          stream: true,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setResponse((prev) => prev + chunk);
        }

        setLoading(false);
        toast.success("Cover letter generated successfully!");
      } else {
        const errorDetail = await res.json();
        console.error("Error sending request:", errorDetail);
        setLoading(false);
        toast.error(errorDetail?.error || "Failed to generate cover letter. Please try again.");
      }
    } catch (err: any) {
      console.error("Error sending request:", err);
      setLoading(false);
      if (err?.name === "TypeError" && err?.message?.includes("fetch")) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(err?.message || "An unexpected error occurred. Please try again.");
      }
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
    if (!response) {
      toast.warning("Please generate a cover letter first");
      return;
    }
    const pdfName = `CoverLetter-${state.name}.pdf`;
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(pdfName);
      toast.success("Cover letter exported as PDF!");
    }
  };

  const closeModal = () => {
    (document.getElementById("my_modal_1") as HTMLDialogElement).close();
  };

  return (
    <div className="flex flex-col items-left">
      <button
        className="btn btn-neutral m-3"
        onClick={() => {
          (
            document.getElementById("my_modal_1") as HTMLDialogElement
          ).showModal();
        }}
      >
        Cover Letter
      </button>
      <dialog
        id="my_modal_1"
        className="modal modal-bottom sm:modal-middle"
      >
        <div
          data-theme={theme}
          className="modal-box bg-base-100 text-base-content w-full max-w-4xl max-h-[90vh] p-0 overflow-hidden"
        >
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-base-200 px-6 py-4 border-b border-base-300 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Cover Letter Generator</h1>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="form-control w-full">
                <label className="label" htmlFor="companyName">
                  <span className="label-text font-medium">Company Name</span>
                </label>
                <input
                  type="text"
                  value={state?.companyName || ""}
                  id="companyName"
                  name="companyName"
                  className="input input-bordered w-full"
                  placeholder="Enter company name"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control w-full">
                <label className="label" htmlFor="jobTitle">
                  <span className="label-text font-medium">Job Title</span>
                </label>
                <input
                  type="text"
                  value={state?.jobTitle || ""}
                  id="jobTitle"
                  name="jobTitle"
                  className="input input-bordered w-full"
                  placeholder="Enter job title"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Generate button */}
            <div className="flex justify-center mb-4">
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader />
                    Generating...
                  </>
                ) : (
                  <>
                    <AutoAwesomeIcon style={{ width: 20, height: 20 }} />
                    Generate with AI
                  </>
                )}
              </button>
            </div>

            {/* Cover Letter Preview - Professional paper style */}
            <div className="bg-base-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-base-content/70 mb-2">Preview</p>
              <PDFExport
                ref={pdfExportComponent}
                paperSize="a4"
                fileName={`CoverLetter-${state?.name}`}
                margin={{ top: 40, left: 40, right: 40, bottom: 40 }}
              >
                <div className="bg-slate-50 text-slate-800 p-8 min-h-[400px] shadow-md rounded">
                  {/* Letter header */}
                  <div className="mb-6 text-sm">
                    <p className="font-semibold text-lg">{state?.name || "Your Name"}</p>
                    {state?.address && <p>{state.address}</p>}
                    {state?.email && <p>{state.email}</p>}
                    {state?.phone && <p>{state.phone}</p>}
                    <p className="mt-2 text-slate-500">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {state?.companyName && (
                    <div className="mb-6 text-sm">
                      <p className="font-medium">{state.companyName}</p>
                    </div>
                  )}

                  {/* Letter content */}
                  <div className="max-w-none text-sm leading-relaxed">
                    <RichTextEditor
                      value={response || ""}
                      onChange={onChange}
                      placeholder="Click 'Generate with AI' to create your cover letter, or write your own here..."
                    />
                  </div>
                </div>
              </PDFExport>
            </div>
          </form>

          {/* Footer with export button */}
          <div className="sticky bottom-0 bg-base-200 px-6 py-4 border-t border-base-300 flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-neutral"
              onClick={handleExportPDF}
            >
              Export as PDF
            </button>
          </div>
        </div>
        {/* Backdrop that closes modal on click */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CoverHF;
