import { ZodError } from "zod";

// TODO: write test for this
export const formatZodErrors = (errors: ZodError) => {
  let message = "";

  for (const issue of errors.issues) {
    message += `${issue.path}: ${issue.message} ; `;
  }
  return message;
};
