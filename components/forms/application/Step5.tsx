'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CompanionApplicationStep5 } from '@/lib/validation/schemas';

interface FileUpload {
  url: string;
  file?: File;
  uploading?: boolean;
}

interface Step5Props {
  data: Partial<CompanionApplicationStep5>;
  onChange: (data: Partial<CompanionApplicationStep5>) => void;
}

export default function Step5({ data, onChange }: Step5Props) {
  const [uploads, setUploads] = useState<Record<string, FileUpload>>({
    governmentId: { url: data.governmentIdUrl || '' },
    selfie: { url: data.selfieUrl || '' },
    introVideo: { url: data.introVideoUrl || '' },
  });

  const handleFileChange = async (type: string, file: File | null) => {
    if (!file) return;

    const upload: FileUpload = { url: '', file, uploading: true };
    setUploads((prev) => ({ ...prev, [type]: upload }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      setUploads((prev) => ({ ...prev, [type]: { url, file, uploading: false } }));

      // Update form data
      if (type === 'governmentId') {
        onChange({ ...data, governmentIdUrl: url });
      } else if (type === 'selfie') {
        onChange({ ...data, selfieUrl: url });
      } else if (type === 'introVideo') {
        onChange({ ...data, introVideoUrl: url });
      }
    } catch (err) {
      console.error(`Failed to upload ${type}:`, err);
      setUploads((prev) => ({
        ...prev,
        [type]: { url: uploads[type]?.url || '', uploading: false },
      }));
    }
  };

  const UploadField = ({
    label,
    type,
    accept,
    hint,
  }: {
    label: string;
    type: string;
    accept: string;
    hint: string;
  }) => {
    const upload = uploads[type] || { url: '' };

    return (
      <div className="rounded-lg border border-border p-6">
        <Label>{label} *</Label>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>

        {upload.url ? (
          <div className="mt-4 rounded bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">✓ Uploaded successfully</p>
            <p className="mt-1 text-xs text-green-800 break-all">{upload.url}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setUploads((prev) => ({ ...prev, [type]: { url: '' } }));
                if (type === 'governmentId') {
                  onChange({ ...data, governmentIdUrl: '' });
                } else if (type === 'selfie') {
                  onChange({ ...data, selfieUrl: '' });
                } else if (type === 'introVideo') {
                  onChange({ ...data, introVideoUrl: '' });
                }
              }}
              className="mt-2"
            >
              Change File
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded border-2 border-dashed border-muted-foreground/25 p-8 transition hover:border-primary/50">
              <div className="text-center">
                <p className="font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </div>
              <input
                type="file"
                accept={accept}
                onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
                className="hidden"
                disabled={upload.uploading}
              />
              {upload.uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
            </label>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Documents & Video</h2>
        <p className="mt-1 text-muted-foreground">Final verification step</p>
      </div>

      <div className="space-y-4">
        <UploadField
          label="Government ID"
          type="governmentId"
          accept="image/*"
          hint="Upload a clear photo of your government-issued ID (passport, driver's license, etc.). Used for identity verification."
        />

        <UploadField
          label="Selfie (Liveness Check)"
          type="selfie"
          accept="image/*"
          hint="Upload a recent selfie. This helps us verify you're the person in your ID."
        />

        <UploadField
          label="60-Second Intro Video"
          type="introVideo"
          accept="video/*"
          hint="Record yourself introducing yourself (who you are, why you want to be a companion, what makes you unique). Keep it under 60 seconds."
        />
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-900">What happens next?</p>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li>✓ Our team reviews your documents (24-48 hours)</li>
          <li>✓ We schedule a live interview if approved</li>
          <li>✓ Final approval after interview + training</li>
        </ul>
      </div>
    </div>
  );
}
