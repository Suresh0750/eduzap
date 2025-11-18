import { z } from "zod";
import { FormErrors, IRequest } from "./types";

const phoneRegex = /^[0-9]{10}$/;

export const requestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(60, { message: "Name cannot exceed 60 characters" }),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, { message: "Phone must be a 10-digit number" }),
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(120, { message: "Title cannot exceed 120 characters" }),
});

export type RequestPayload = z.infer<typeof requestSchema> & {
  image?: string;
};

export function validateRequestPayload(data: unknown) {
  return requestSchema.safeParse(data);
}

export function mapZodErrors(issues: z.ZodIssue[]): FormErrors {
  const fieldErrors: FormErrors = {};
  issues.forEach((issue) => {
    const field = issue.path[0];
    if (typeof field === "string") {
      fieldErrors[field as keyof FormErrors] = issue.message;
    }
  });
  return fieldErrors;
}

export function buildRequestRecord(payload: RequestPayload): IRequest {
  return {
    name: payload.name,
    phone: payload.phone,
    title: payload.title,
    image: payload.image,
    timestamp: new Date().toISOString(),
  };
}
