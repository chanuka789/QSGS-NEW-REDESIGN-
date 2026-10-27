"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Field } from "./FormBits";
import { FILE_RULES } from "@/lib/form-rules";
import { cn } from "@/lib/utils";

const fmt = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export function DropZone({ id, label, required, files, setFiles, error }: { id: string; label: string; required?: boolean; files: File[]; setFiles: (f: File[]) => void; error?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [local, setLocal] = useState<string>();

  const add = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      const ext = f.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
      if (!(FILE_RULES.extensions as readonly string[]).includes(ext)) return setLocal(`${f.name}: please use PDF, Word or image files.`);
      if (f.size > FILE_RULES.maxFileBytes) return setLocal(`${f.name} is larger than 5 MB.`);
      if (next.length >= FILE_RULES.maxFiles) return setLocal(`You can upload up to ${FILE_RULES.maxFiles} files.`);
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    setLocal(undefined);
    setFiles(next);
  };

  return (
    <Field id={id} label={label} required={required} error={error || local}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-[14px] border border-dashed px-5 py-7 text-center transition-colors",
          drag ? "border-brand bg-brand/5" : "border-ink/25 bg-white/50 hover:border-ink/50",
          (error || local) && "border-[#c0392b]",
        )}
      >
        <UploadCloud className="mx-auto h-7 w-7 text-brand" strokeWidth={1.5} aria-hidden />
        <p className="mt-3 t-small text-ink">
          Drag files here or{" "}
          <button type="button" onClick={() => input.current?.click()} className="font-medium text-brand underline underline-offset-4">
            browse
          </button>
        </p>
        <p className="mt-1 t-xs text-muted">{FILE_RULES.label}</p>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={FILE_RULES.accept}
          className="sr-only"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {files.map((f, i) => (
            <li key={f.name + i} className="flex items-center gap-3 rounded-[12px] bg-white/70 px-4 py-2.5 t-small shadow-[inset_0_0_0_1px_rgb(16_36_46/0.08)]">
              <FileText className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="t-xs text-muted">{fmt(f.size)}</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, k) => k !== i))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink/5">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
