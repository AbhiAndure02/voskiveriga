import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (body: unknown) => {
    return schema.parseAsync(body);
  };
