export const JOB_TYPES = ["Full-Time", "Part-Time", "Contract"] as const;

/** Visitor uploads (careers + contact). Stored in the Railway bucket under uploads/. */
export const FILE_RULES = {
  maxFiles: 4,
  maxFileBytes: 5 * 1024 * 1024,
  maxTotalBytes: 20 * 1024 * 1024,
  extensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"],
  accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp",
  label: "PDF, Word (DOC, DOCX) or images (JPG, PNG, WEBP) · up to 4 files · 5 MB each",
} as const;
