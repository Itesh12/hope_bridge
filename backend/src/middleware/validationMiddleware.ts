import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Multer sends everything as a string. We need to parse fields that are objects/arrays.
      const dataToParse = { ...req.body };
      for (const key in dataToParse) {
        if (typeof dataToParse[key] === 'string') {
          try {
            const parsed = JSON.parse(dataToParse[key]);
            // If it's valid JSON (object, array, boolean, number), use the parsed value
            dataToParse[key] = parsed;
          } catch (e) {
            // Not JSON, leave as is
          }
        }
      }

      await schema.parseAsync(dataToParse);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('Validation failed for request:', req.body);
        console.log('Errors:', error.issues);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};
