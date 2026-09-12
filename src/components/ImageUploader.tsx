"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

type ImageUploaderProps = {
  onUploadComplete: (url: string) => void;
  folder?: string;
};

export default function ImageUploader({
  onUploadComplete,
  folder = "products",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image blob");
      }

      onUploadComplete(data.url);
    } catch (err: any) {
      console.error("Blob upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500 bg-slate-50 hover:bg-slate-100 rounded-2xl cursor-pointer transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <p className="text-sm text-blue-600 font-medium">Uploading Blob photo...</p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="mb-1 text-sm font-semibold text-gray-800">
                  <span className="text-blue-600">Click to upload product photo</span> or drag & drop
                </p>
                <p className="text-xs text-gray-500">Blob Storage Upload (PNG, JPG, WEBP)</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            className="hidden"
            onChange={(e) => {
              if (!e.target.files?.[0]) return;
              handleUpload(e.target.files[0]);
            }}
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

