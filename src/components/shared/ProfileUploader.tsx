import React, { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

export const ProfileUploader = ({
  fieldChange,
  mediaUrl,
}: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);

  const [fileUrl, setFuleUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFile: FileWithPath[]) => {
      setFile(acceptedFile);
      fieldChange(acceptedFile);
      setFuleUrl(URL.createObjectURL(acceptedFile[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div>
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};
