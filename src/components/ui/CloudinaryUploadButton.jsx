'use client';

import { useEffect, useState } from 'react';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

export default function CloudinaryUploadButton({
  children,
  onUpload,
  options,
  disabledFallback,
}) {
  const [Widget, setWidget] = useState(null);

  useEffect(() => {
    if (!cloudName) return;
    import('next-cloudinary').then((mod) => {
      setWidget(() => mod.CldUploadWidget);
    });
  }, []);

  if (!cloudName || !Widget) {
    return disabledFallback || null;
  }

  return (
    <Widget
      uploadPreset={uploadPreset}
      options={options}
      onSuccess={(result) => {
        if (result?.info?.secure_url) {
          onUpload(result.info.secure_url, result);
        }
      }}
    >
      {children}
    </Widget>
  );
}
