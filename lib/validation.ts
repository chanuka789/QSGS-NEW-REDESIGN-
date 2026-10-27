import { z } from "zod";
import { JOB_TYPES } from "./form-rules";

export { FILE_RULES, JOB_TYPES } from "./form-rules";

const text = (max: number) => z.string().trim().max(max);
const singleLine = (max: number, min = 0, message?: string) =>
  z.string().trim().min(min, message).max(max).transform((v) => v.replace(/[\r\n\t]+/g, " "));

export const contactSchema = z.object({
  name: singleLine(120, 2, "Please enter your name."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  phone: singleLine(40).optional().default(""),
  company: singleLine(160).optional().default(""),
  companyType: singleLine(80).optional().default(""),
  country: singleLine(80, 2, "Please select your country."),
  service: singleLine(120).optional().default(""),
  date: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Please choose a valid date.")
    .optional()
    .default(""),
  time: z
    .string()
    .trim()
    .regex(/^(\d{2}:\d{2})?$/, "Please choose a valid time.")
    .optional()
    .default(""),
  timezone: singleLine(80).optional().default(""),
  message: text(5000).optional().default(""),
  consent: z.literal(true, { error: "Please agree so we can reply to your request." }),
  // Spam protection: hidden honeypot field and form-render timestamp.
  website: z.string().max(0).optional().default(""),
  startedAt: z.coerce.number().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const careersSchema = z.object({
  firstName: singleLine(80, 1, "Please enter your first name."),
  lastName: singleLine(80, 1, "Please enter your last name."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(200),
  phone: singleLine(40, 6, "Please enter your phone number."),
  address1: singleLine(200).optional().default(""),
  city: singleLine(100).optional().default(""),
  state: singleLine(100).optional().default(""),
  country: singleLine(80).optional().default(""),
  jobType: z.enum(JOB_TYPES, { error: "Please choose a job type." }),
  info: text(5000).optional().default(""),
  consent: z.literal(true, { error: "Please agree so we can process your application." }),
  website: z.string().max(0).optional().default(""),
  startedAt: z.coerce.number().optional(),
});
export type CareersInput = z.infer<typeof careersSchema>;

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
