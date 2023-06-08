"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

async function uploadFile(file: File, onUpload: (image: string) => void) {
  const reader = new FileReader();

  reader.onabort = () => console.log("file reading was aborted");
  reader.onerror = () => console.log("file reading has failed");
  reader.onload = async () => {
    const fileBuffer = reader.result;

    if (fileBuffer instanceof ArrayBuffer) {
      const fd = new FormData();
      fd.append("file", new Blob([fileBuffer], { type: file.type }), file.name);

      const res = await fetch("/api/images", {
        method: "POST",
        body: fd,
      });

      const url = (await res.json()).retFilePath;

      onUpload(url);
    }
  };

  reader.readAsArrayBuffer(file);
}

function ImagePreviewer({ imageSrc }: { imageSrc: string }) {
  console.log(`ImagePreviewer: ${imageSrc}`);
  return (
    <div className="bg-gray-200 p-10 border-gray-400 border-2 border-dashed">
      <Image src={imageSrc} width={500} height={500} alt={imageSrc} />
    </div>
  );
}

function ImageUploader({ onUpload }: { onUpload: (image: string) => void }) {
  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      await uploadFile(file, onUpload);
    },
    [onUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    maxSize: 1048576,
    onDropAccepted,
  });

  return (
    <div
      className="bg-gray-200 p-10 border-gray-400 border-2 border-dashed"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p>Add an image here</p>
    </div>
  );
}

async function DominantColour({ image }: { image: string }) {
  // Pretend that this is a long-running process and
  // we need to wait for it to finish

  const delay = Math.floor(Math.random() * 3000) + 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return (
    <div className="bg-gray-200 p-10 border-gray-400 border-2 border-dashed">
      RED
    </div>
  );
}

export default async function ImageAnalyzer() {
  const [image, setImage] = useState<string>("");

  const handleUpload = (url: string) => {
    console.log("Handling upload");
		console.log(url)
    setImage(url);
  };
	console.log("HI")

  return (
    <div className="">
      <ImageUploader onUpload={handleUpload} />
      {image && (
        <>
          <ImagePreviewer imageSrc={image} />
          <DominantColour image={image} />
        </>
      )}
    </div>
  );
}
