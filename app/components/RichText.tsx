"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// import "react-quill/dist/quill.snow.css";
import "./ql-toolbar.module.css";
import styles from "./ritchTextEditor.module.css";

// Dynamically import ReactQuill with SSR disabled
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
}) => {
  const handleEditorChange = (
    newValue: string,
    _delta: any,
    _source: any,
    _editor: any
  ) => {
    onChange(newValue);
  };

  return (
    <div className="richTextEditorContainer">
      <ReactQuill
        className={styles.richTextEditorContainer}
        value={value}
        onChange={handleEditorChange}
        placeholder={placeholder}
        theme="snow"
      />
    </div>
  );
};

export default RichTextEditor;
