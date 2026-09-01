"use client";

import { useId, useState } from "react";
import { Upload } from "lucide-react";

const MAX_UPLOAD_BYTES = 2.5 * 1024 * 1024; // 2.5MB — keeps the content document small in MongoDB

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClass: string;
  labelClass: string;
}

/**
 * A single image field that accepts either a pasted URL or a direct
 * upload. Uploaded files are converted to a base64 data URL and stored
 * straight in the content document — no separate file storage needed,
 * and nothing ever touches localStorage or a local file cache.
 */
export default function ImageField({ label, value, onChange, inputClass, labelClass }: ImageFieldProps) {
  const inputId = useId();
  const [uploadError, setUploadError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("Image is too large — please use one under 2.5MB, or paste an image URL instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.onerror = () => setUploadError("Couldn't read that file.");
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          className={inputClass}
          placeholder="Paste an image URL…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <label
          htmlFor={inputId}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload
        </label>
        <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-16 w-16 rounded-lg border border-gray-100 object-cover"
          onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          onLoad={(e) => (e.currentTarget.style.visibility = "visible")}
        />
      )}
    </div>
  );
}
