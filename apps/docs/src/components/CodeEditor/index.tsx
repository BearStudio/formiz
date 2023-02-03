import React, { useState, HTMLAttributes, useMemo } from "react";
import { importCode, Runner } from "react-runner";
import { CodeMirror } from "react-runner-codemirror";
import * as FormizCore from "@formiz/core";
import * as FormizValidations from "@formiz/validations";
import { withFiles } from "@/components/CodeEditor/withFiles";

type File = {
  name: string;
  code: string;
};

type Import = Record<string, any>;

type CodeEditorProps = HTMLAttributes<HTMLDivElement> & {
  files: File[];
  imports?: Import;
};

export const CodeEditor = ({
  files: _files = [],
  imports: _imports = {},
  ...rest
}: CodeEditorProps) => {
  const [files, setFiles] = useState(_files);
  const [activeFile, setActiveFile] = useState(0);
  const [importError, setImportError] = useState(null);
  const [renderError, setRenderError] = useState(null);

  if (!files.length) {
    throw new Error("At least one file is required");
  }

  const baseImport: Import = {
    react: React,
    "@formiz/core": FormizCore,
    "@formiz/validations": FormizValidations,
  };

  const scope = useMemo(() => {
    try {
      const scope = withFiles(
        { import: baseImport },
        files.slice(1).reduce((acc, item) => {
          if (item.name.endsWith(".css")) return acc;
          acc[`./${item.name}`] = item.code;
          return acc;
        }, {} as Record<string, string>)
      );
      if (importError) setImportError(null);
      return scope;
    } catch (error: any) {
      setImportError(
        `${error.name ? `[${error.name}] ` : ""}${error.toString()}`
      );
    }
  }, [files, importError]);

  return (
    <div className="code-editor__container" {...rest}>
      <div className="code-editor__container__runner-container">
        {importError ||
          (renderError && (
            <div style={{ color: "red" }}>
              {(importError ?? renderError).toString()}
            </div>
          ))}
        <Runner
          code={files[0]?.code}
          scope={scope}
          onRendered={(error) => {
            setRenderError(error);
          }}
        />
        {files.map(
          (file) =>
            file.name.endsWith(".css") && (
              <style key={file.name}>{file.code}</style>
            )
        )}
      </div>
      <div className="code-editor__container__mirror-container">
        <ul className="tabs code-editor__tabs">
          {files.map((file, index) => (
            <li
              key={file.name}
              onClick={() => setActiveFile(index)}
              className={`tabs__item code-editor__tabs__item${
                activeFile === index ? " tabs__item--active" : ""
              }`}
            >
              {file.name}
            </li>
          ))}
        </ul>
        <CodeMirror
          className="code-editor__container__runner-container__runner"
          filename={files[activeFile]?.name}
          defaultValue={files[activeFile]?.code}
          onChange={(newCode) => {
            const newFiles = [...files];
            newFiles[activeFile].code = newCode;
            setFiles(newFiles);
          }}
        />
      </div>
    </div>
  );
};
