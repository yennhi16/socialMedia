import React, { memo, useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import axios from "axios";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};
const UploadFile = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  console.log(mediaUrl);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [showProgressBar, setProgressBar] = useState(0);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      UploadFile(acceptedFiles);
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".pdf"],
    },
    multiple: true,
  });
  const UploadFile = (data: FileWithPath[]) => {
    const file = data[0];
    var formData = new FormData();
    axios.post("url", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        // console.log(
        //   "onUploadProgress",
        //   Math.round(100 * event.loaded) / event?.total
        // );
        // setProgressBar(Math.round(100 * event.loaded) / event?.total);
      },
    });
  };

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to</p>
        </>
      ) : (
        <div className="file_upload-box p-10 text-center">
          <div className="w-full flex flex-center">
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt=""
            />
          </div>

          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
      {/* {showProgressBar == 0 ? (
        ""
      ) : (
        <Progress value={showProgressBar} className="h-[5px] mb-6" />
      )} */}
    </div>
  );
};

export default memo(UploadFile);
