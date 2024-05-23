"use client";
import React, { useState, useRef, useEffect } from "react";
// import "../components/PDForm.css";
import { PDFExport } from "@progress/kendo-react-pdf";
import BioHF from "../components/BioHF";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SocialLinks from "../components/SocialLinks";
import placeholder from "../../public/assets/user.png";
import RichTextEditor from "../components/RichText";
import Image from "next/image.js";
import { useAppContext } from "../../context/AppContext";
import CoverHF from "../components/CoverHF";
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
export default function CVForm() {
  const pdfExportComponent = useRef(null);
  const storedData = localStorage.getItem("formData");
  const { state, setState } = useAppContext();
  const initialFormData = storedData
    ? JSON.parse(storedData)
    : {
        name: "",
        subtitle: "",
        bio: "",
        phone: "",
        address: "",
        email: "",
        education: [""],
        experience: [""],
        skills: [""],
        languages: [""],
        github: "",
        linkedin: "",
        portfolio: "",
        image: "",
      };
  // console.log("placeholder", placeholder);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    // storing input name
    localStorage.setItem("formData", JSON.stringify(formData));
    setState(formData);
  }, [formData]);
  console.log("formData", formData);
  console.log("state", state);

  const handleLinkChange = (socialMedia: string, link: string) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [socialMedia]: link,
    }));
  };
  const handleBio = (newBio: string) => {
    if (newBio !== formData.bio) {
      setFormData((prevData: any) => ({
        ...prevData,
        bio: newBio,
      }));
    }
  };
  const addField = (fieldName: string) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [fieldName]: Array.isArray(prevState[fieldName])
        ? [...prevState[fieldName], ""]
        : [""],
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    e.preventDefault();
    const image = e.target.files[0];

    // Read the image as a base64 string
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        setFormData({
          ...formData,
          image: event.target.result as string, // Add type assertion here
        });
      }
    };
    reader.readAsDataURL(image);
  };

  const handleLanguageChange = (index: number, event: any) => {
    const { value } = event.target;
    setFormData((prevState: any) => {
      const newLanguages = [...prevState.languages];
      newLanguages[index] = value;
      if (index === newLanguages.length - 1 && value.trim() !== "") {
        // Add a new empty language field if the last field is not empty
        newLanguages.push("");
      }
      return {
        ...prevState,
        languages: newLanguages,
      };
    });
  };
  const handleExperienceChange = (index: number, newValue: any) => {
    setFormData((prevState: any) => {
      const newExp = [...prevState.experience];
      newExp[index] = newValue;
      if (index === newExp.length - 1 && newValue.trim() !== "") {
        newExp.push("");
      }
      return {
        ...prevState,
        experience: newExp,
      };
    });
  };

  const handleEdChange = (index: number, newValue: any) => {
    setFormData((prevState: any) => {
      const newEd = [...prevState.education];
      newEd[index] = newValue;
      if (index === newEd.length - 1 && newValue.trim() !== "") {
        // Add a new empty education field if the last field is not empty
        newEd.push("");
      }
      return {
        ...prevState,
        education: newEd,
      };
    });
  };

  const handleSkillsChange = (index: number, event: any) => {
    const { value } = event.target;
    setFormData((prevState: any) => {
      const newSkill = [...prevState.skills];
      newSkill[index] = value;
      if (index === newSkill.length - 1 && value.trim() !== "") {
        // Add a new empty language field if the last field is not empty
        newSkill.push("");
      }
      return {
        ...prevState,
        skills: newSkill,
      };
    });
  };

  const handleExportPDF = () => {
    const pdfName = `CV-${formData.name}.pdf`;
    if (pdfExportComponent.current) {
      (pdfExportComponent.current as any).save(pdfName);
    }
    // console.log("current", pdfExportComponent.current);
  };
  const removeField = (fieldName: any, index: number) => {
    setFormData((prevState: any) => {
      const newField = [...prevState[fieldName]];
      newField.splice(index, 1);
      return {
        ...prevState,
        [fieldName]: newField,
      };
    });
  };

  return (
    <div className="flex flex-col items-center pt-24">
      {/* <div className="flex flex-col items-start">
        <CoverHF
          formData={formData}
          setFormData={setFormData}
          onChange={handleInputChange}
        />
      </div> */}
      <PDFExport
        ref={pdfExportComponent}
        paperSize="auto"
        fileName={`${formData?.name}-Resume`}
      >
        <div className="flex flex-row min-h-screen w-[8.5in] mx-auto">
          <div
            data-theme="base"
            className="flex flex-col w-[30%] max-w-[30%] bg-base-100 text-base pt-24 pb-24"
          >
            <div className="relative overflow-hidden w-full border-dashed border-yellow-600 ">
              <Image
                src={formData.image ? formData.image : placeholder}
                alt="Profile picture"
                className="object-cover w-full h-full "
                width={400}
                height={400}
              />
              <label className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <LibraryAddIcon
                  className="text-white"
                  style={{ fontSize: 48 }}
                />
              </label>
            </div>

            <div data-theme="base" className="pt-4 pl-4 pr-4 text-left">
              <div className="flex flex-row mb-0.5">
                <input
                  className="bg-base-100  border-none mb-0.5 text-2xl w-full"
                  type="text"
                  name="name"
                  aria-label="dark"
                  placeholder="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row mb-0.5">
                <input
                  className="bg-base-100  border-none w-full mb-0.5 text-base text-"
                  type="text"
                  name="subtitle"
                  placeholder="Current title"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <SocialLinks
                  formData={formData}
                  onGithubLinkChange={handleLinkChange}
                />
              </div>
              <div className="flex flex-row mb-0.5">
                <input
                  className="bg-base-100 text-white border-none w-full mb-0.5 text-base"
                  type="text"
                  name="address"
                  placeholder="address"
                  value={formData?.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row mb-0.5">
                <input
                  className="bg-base-100 text-white border-none w-full mb-0.5 text-base"
                  type="text"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row mb-0.5">
                <input
                  className="bg-base-100 text-white border-none w-full mb-0.5 text-base"
                  type="text"
                  name="phone"
                  placeholder="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <h4>Languages</h4>
                <hr className="border-primary mt-1 mb-1" />
                {formData.languages.map((language: any, index: number) => (
                  <div key={index} className="flex flex-row mb-0.5">
                    <input
                      className="bg-base-100 text-white border-none w-full mb-0.5 text-base"
                      type="text"
                      name={`language-${index}`}
                      value={language}
                      onChange={(event) => handleLanguageChange(index, event)}
                      placeholder="Add a language"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h4>Skills</h4>
                <hr className="border-primary mt-1 mb-1" />
                {formData.skills?.map((skill: any, index: number) => (
                  <div key={index} className="flex flex-row mb-0.5">
                    <input
                      className="bg-base-100 text-white border-none w-full mb-0.5 text-base"
                      type="text"
                      name={`skill-${index}`}
                      value={skill}
                      onChange={(event) => handleSkillsChange(index, event)}
                      placeholder="Insert a skill"
                    />
                  </div>
                ))}
              </div>
              <hr className="border-primary mt-1 mb-1" />
            </div>
          </div>
          <div className="w-[70%] pl-8 pr-8 pt-24 bg-gray-200 box-border">
            <div className="mb-20">
              <h1 className="text-xl">Bio</h1>
              <hr className="border-primary mt-1 mb-1" />
              <div>
                <BioHF formData={formData} onChange={handleBio} />
              </div>
            </div>
            <div className="group mb-20">
              <h1 className="text-xl">Experience</h1>
              <hr className="border-primary mt-1 mb-1" />
              {formData?.experience?.map((exp: any, index: number) => (
                <div className=" flex flex-row mb-1 relative" key={index}>
                  <RichTextEditor
                    value={exp}
                    onChange={(newExp) => handleExperienceChange(index, newExp)}
                    placeholder={"Add an experience"}
                  />
                  <button className="absolute top-0 right-0 hidden group-hover:block bg-transparent border-none w-12 h-12">
                    <RemoveCircleOutlineIcon
                      onClick={() => removeField("experience", index)}
                    />
                  </button>
                </div>
              ))}
              <button className="mt-8  hidden group-hover:block bg-transparent w-12 h-12 border-none cursor-pointer">
                <AddCircleOutlineIcon onClick={() => addField("experience")} />
              </button>
            </div>
            <div className="pb-16 group">
              <h1 className="text-xl">Education</h1>
              <hr className="border-primary mt-1 mb-1" />
              {formData?.education?.map((edu: any, index: number) => (
                <div className="flex flex-row mb-1 relative " key={index}>
                  <RichTextEditor
                    value={edu}
                    onChange={(newEd) => handleEdChange(index, newEd)}
                    placeholder="Add an education"
                  />
                  <button className="absolute top-0 right-0 hidden group-hover:block bg-transparent border-none w-12 h-12">
                    <RemoveCircleOutlineIcon
                      onClick={() => removeField("education", index)}
                    />
                  </button>
                </div>
              ))}
              <button className="mt-8  hidden group-hover:block bg-transparent w-12 h-12 border-none cursor-pointer">
                <AddCircleOutlineIcon onClick={() => addField("education")} />
              </button>
            </div>
          </div>
        </div>
      </PDFExport>
      <div className="pt-4 pb-4">
        <button className="btn btn-neutral m-3" onClick={handleExportPDF}>
          Export CV as PDF
        </button>
      </div>
    </div>
  );
}
