import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Portfolio from "../../public/assets/portfolio-svgrepo-com.svg";
// import "./PDFForm.css";
export default function socialLinks({
  formData,
  onGithubLinkChange,
}: {
  formData: any;
  onGithubLinkChange: any;
}) {
  const { github, linkedin, portfolio } = formData;

  const handleLinkChange = (socialMedia: string, link: string) => {
    onGithubLinkChange(socialMedia, link);
  };

  const githubInput = (
    <input
      className="inputContact"
      type="text"
      value={github}
      placeholder="GitHub link"
      onChange={(e) => handleLinkChange("github", e.target.value)}
    />
  );
  const linkedInInput = (
    <input
      className="inputContact"
      type="text"
      value={linkedin}
      placeholder="Linkedin link"
      onChange={(e) => handleLinkChange("linkedin", e.target.value)}
    />
  );
  const portfolioInput = (
    <input
      className="inputContact"
      type="text"
      value={portfolio}
      placeholder="Portfolio link"
      onChange={(e) => handleLinkChange("portfolio", e.target.value)}
    />
  );
  return (
    <div className="flex space-x-10 mt-3 mb-3 ">
      <a
        href={formData.github}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.preventDefault()}
      >
        <Tooltip title={githubInput} arrow>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
            width="20"
            height="20"
          />
        </Tooltip>
      </a>
      <a
        href={formData.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.preventDefault()}
      >
        <Tooltip title={linkedInInput} arrow>
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
            alt="linkedin"
            width="20"
            height="20"
          />
        </Tooltip>
      </a>
      <a
        href={formData.portfolio}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.preventDefault()}
      >
        <Tooltip title={portfolioInput} arrow>
          <img
            src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/briefcase.svg"
            alt="portfolio"
            width="20"
            height="20"
          />

          {/* <Portfolio width="20" height="20" fill="blue" stroke="red"/> */}
        </Tooltip>
      </a>
    </div>
  );
}
