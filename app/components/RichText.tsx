"use client";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css";

import "./ql-toolbar.module.css";
import styles from "./ritchTextEditor.module.css";

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
      />
    </div>
  );
};
export default RichTextEditor;
