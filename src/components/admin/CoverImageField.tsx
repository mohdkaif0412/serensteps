"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { adminField } from "@/components/admin/form-ui";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryReady = Boolean(cloudName) && Boolean(uploadPreset);

/**
 * Cover-image picker. When Cloudinary is configured (env), shows an upload
 * widget; always offers a URL field so it works without Cloudinary too.
 */
export function CoverImageField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);

  return (
    <div className="space-y-3">
      {url ? (
        <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-sage-deep/30">
          {/* unoptimized: preview may be an arbitrary/pasted URL */}
          <Image
            src={url}
            alt="Cover preview"
            fill
            sizes="440px"
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove image"
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-pine/85 text-paper hover:bg-pine"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full max-w-md items-center justify-center rounded-xl border border-dashed border-sage-deep/40 text-muted">
          <ImagePlus className="size-6" aria-hidden="true" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {cloudinaryReady && (
          <CldUploadWidget
            uploadPreset={uploadPreset}
            onSuccess={(result) => {
              const info = result.info;
              if (info && typeof info === "object" && "secure_url" in info) {
                setUrl(String(info.secure_url));
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="inline-flex items-center gap-2 rounded-full border border-sage-deep/40 px-4 py-2 text-sm font-medium text-pine hover:bg-sage/60"
              >
                <UploadCloud className="size-4" aria-hidden="true" />
                Upload image
              </button>
            )}
          </CldUploadWidget>
        )}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={
            cloudinaryReady ? "…or paste an image URL" : "Paste an image URL"
          }
          className={`${adminField} min-w-0 flex-1`}
        />
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
