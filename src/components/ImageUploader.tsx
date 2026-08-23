"use client";

import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

type ImageUploaderProps = {
  onUploadComplete: (url: string) => void;
  folder?: string;
};

export default function ImageUploader({
  onUploadComplete,
  folder = "products",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);

    const fileRef = ref(
      storage,
      `${folder}/${Date.now()}-${file.name}`
    );

    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    setUploading(false);
    onUploadComplete(url);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          if (!e.target.files?.[0]) return;
          handleUpload(e.target.files[0]);
        }}
      />
      {uploading && <p className="text-sm">Uploading...</p>}
    </div>
  );
}
