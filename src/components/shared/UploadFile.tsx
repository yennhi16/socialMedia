import { memo, useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
// import React from "react";
import ReactPlayer from "react-player";
type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
  videoLink: string;
};
const UploadFile = ({
  fieldChange,
  mediaUrl,
  videoLink,
}: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);

  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const [videoUrl, setVideoUrl] = useState<string>(videoLink);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      console.log({ acceptedFiles });
      if (acceptedFiles[0].type == "video/mp4") {
        setFileUrl("");
        setVideoUrl(URL.createObjectURL(acceptedFiles[0]));
        fieldChange(acceptedFiles);
        return;
      }
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".mp4"],
    },
    multiple: true,
  });

  return (
    <div className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="" className="file_uploader-img" />
          </div>
          <p {...getRootProps()} className="file_uploader-label">
            Click or drag photo to
          </p>
        </>
      ) : videoUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <ReactPlayer url={videoUrl} controls={true} />
          </div>
          <p {...getRootProps()} className="file_uploader-label">
            Click or drag photo to
          </p>
        </>
      ) : (
        <div {...getRootProps()} className="file_upload-box p-10 text-center">
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
          <p className="text-light-4 small-regular mb-4">SVG, PNG, JPG, MP4 </p>
          <p className="text-light-4 text-xs font-light mb-6">
            Please don't upload file exceed 10MB
          </p>

          <Button className="shad-button_dark_4 w-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(UploadFile);
