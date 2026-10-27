export type MailAttachment = { filename: string; contentType: string; content: Buffer };

export type MailMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: { email: string; name?: string };
  attachments?: MailAttachment[];
};
