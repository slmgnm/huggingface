"use client";
import React, { useEffect, useState } from "react";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useAppContext } from "../context/AppContext";

interface CoverLetterProps {
  formData: any;
  companyName: string;
  role: string;
}

const CoverLetter: React.FC<CoverLetterProps> = () => {
  const { state } = useAppContext();
  const [coverLetterData, setCoverLetterData] = useState<any>({});

  const pdfExportComponent = React.useRef<any>(null);

  useEffect(() => {
    if (state) {
      setCoverLetterData(state);
    }
  }, [state]);
  console.log("state", state);

  const handleExportPDF = () => {
    const pdfName = `CoverLetter-${coverLetterData.name}.pdf`;
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save(pdfName);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <PDFExport
        ref={pdfExportComponent}
        paperSize="auto"
        fileName={`CoverLetter-${coverLetterData.name}`}
      >
        <p>{state && state.name}</p>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Cover Letter</h1>
          {/* Add additional content here */}
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
};

export default CoverLetter;
