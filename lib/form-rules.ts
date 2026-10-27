export const JOB_TYPES = ["Full-Time", "Part-Time", "Contract"] as const;

export const FILE_RULES = {
  maxFiles: 4,
  maxFileBytes: 5 * 1024 * 1024,
  maxTotalBytes: 20 * 1024 * 1024,
  extensions: [".pdf", ".doc", ".docx"],
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
    "",
  ],
} as const;
