"use client";
import React, { useEffect, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useAppContext } from "../../context/AppContext";
import CoverHF from "../components/CoverHF";

export default function CoverLetter() {
  const { state } = useAppContext();
  const [coverLetterData, setCoverLetterData] = useState<any>({
    companyName: "",
    jobTitle: "",
  });

  const pdfExportComponent = React.useRef<any>(null);
  useEffect(() => {
    if (state) {
      setCoverLetterData(state);
    }
  }, [state]);

  console.log("state", state);
  console.log("coverLetterData", coverLetterData);
  const handleExportPDF = () => {
    const pdfName = `CoverLetter-${coverLetterData.name}.pdf`;
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(pdfName);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setCoverLetterData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center">
      <PDFExport
        ref={pdfExportComponent}
        paperSize="auto"
        fileName={`CoverLetter-${coverLetterData.name}`}
      >
        <p>{coverLetterData && coverLetterData.name}</p>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Cover Letter</h1>
          <form className="flex flex-col items-center">
            <div className="mb-4">
              <label htmlFor="companyName" className="text-lg font-medium">
                Company Name:
              </label>
              <input
                type="text"
                value={coverLetterData && coverLetterData.companyName}
                id="companyName"
                className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="jobTitle" className="text-lg font-medium">
                Job Title:
              </label>
              <input
                value={coverLetterData && coverLetterData.jobTitle}
                type="text"
                id="jobTitle"
                className="border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter job title"
                onChange={handleInputChange}
              />
            </div>
            <div>
                <CoverHF coverLetterData={coverLetterData} onChange={handleInputChange} />
              </div>
          </form>
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
  );
}
