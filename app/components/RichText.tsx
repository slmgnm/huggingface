"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "./ql-toolbar.module.css";
import styles from "./ritchTextEditor.module.css";


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
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    // This will set editorLoaded to true after the component mounts
    setEditorLoaded(true);
  }, []);

  const handleEditorChange = (
    newValue: string,
    _delta: any,
    _source: any,
    _editor: any
  ) => {
    onChange(newValue);
  };

  // Render a placeholder or loading spinner until the editor is loaded
  if (!editorLoaded) {
    return <div>Loading editor...</div>;
  }

  // Render the editor once it's loaded
  return (
    <div className="richTextEditorContainer">
      <ReactQuill
        className={styles.richTextEditorContainer}
        value={value}
        onChange={handleEditorChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;