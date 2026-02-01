/**
 * ValidationError mirrors the structure produced by Elysia's validators.
 *
 * @property origin - The source/type of the validation (e.g., "string", "number").
 * @property code - A short machine-friendly error code (e.g., "too_small").
 * @property minimum - Optional numeric boundary used by range validations.
 * @property inclusive - If present, whether the `minimum`/`maximum` is inclusive.
 * @property path - Array describing the path to the invalid field (first element is the field name).
 * @property message - Human-readable message describing the validation failure.
 */
interface ValidationError {
  origin: string;
  code: string;
  minimum?: number;
  inclusive?: boolean;
  path: string[];
  message: string;
}

/**
 * Mapping of field name to an array of validation messages for that field.
 */
interface FieldErrors {
  [key: string]: string[];
}

/**
 * Extracts field-level validation error messages from an error object.
 *
 * The function attempts to handle common shapes returned by Elysia:
 * - If `errorObject.message` is a JSON string it will be parsed.
 * - If the parsed object contains an `errors` array it will collect messages
 *   grouped by the first element of each error's `path`.
 * - If `errorObject.error?.valueError` is present it will also be included.
 * - If `parsed.found` contains empty string values, a generic "cannot be empty"
 *   message will be added for that field.
 *
 * @param errorObject - The error object returned by the server/validator.
 * @returns An object mapping field names to arrays of human-readable messages.
 *
 * @example
 * const errors = extractFieldErrors(rawError);
 * // errors => { userId: ['Too small: expected string to have >=1 characters'] }
 */
function extractFieldErrors(errorObject: any): FieldErrors {
  const fieldErrors: FieldErrors = {};

  try {
    // Parse the message if it's a string
    let parsedData = errorObject;

    if (errorObject.message && typeof errorObject.message === "string") {
      try {
        parsedData = JSON.parse(errorObject.message);
      } catch (e) {
        // If parsing fails, use the original object
        console.warn("Failed to parse error message as JSON");
      }
    }

    // Collect errors from errors array
    if (parsedData.errors && Array.isArray(parsedData.errors)) {
      parsedData.errors.forEach((error: ValidationError) => {
        if (error.path && error.path.length > 0) {
          const fieldName = error.path[0];
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = [];
          }
          // Avoid duplicate messages
          if (!fieldErrors[fieldName].includes(error.message)) {
            fieldErrors[fieldName].push(error.message);
          }
        }
      });
    }

    // Also check for valueError at the root level
    if (errorObject.error?.valueError) {
      const valueError = errorObject.error.valueError;
      if (valueError.path && valueError.path.length > 0) {
        const fieldName = valueError.path[0];
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        if (!fieldErrors[fieldName].includes(valueError.message)) {
          fieldErrors[fieldName].push(valueError.message);
        }
      }
    }

    // Check for errors in the found object (for empty values)
    if (parsedData.found) {
      Object.entries(parsedData.found).forEach(([key, value]) => {
        if (value === "" && !fieldErrors[key]) {
          fieldErrors[key] = [`Field "${key}" cannot be empty`];
        }
      });
    }
  } catch (e) {
    console.error("Error extracting field errors:", e);
  }

  return fieldErrors;
}

// Alternative version that returns a Record<string, string[]> directly
/**
 * Safe parser that returns a simple Record of validation messages per field.
 *
 * Similar to `extractFieldErrors` but returns a plain `Record<string, string[]>`
 * and focuses on parsing `errorResponse.message` (when it contains JSON).
 *
 * @param errorResponse - Error response that may include a JSON `message`.
 * @returns A plain object keyed by field name with arrays of messages.
 *
 * @example
 * const errors = getValidationErrors(response);
 * // errors => { email: ['Invalid email format'] }
 */
function getValidationErrors(errorResponse: any): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  try {
    // Parse the message if it exists
    const message = errorResponse.message || "";
    const parsed = typeof message === "string" ? JSON.parse(message) : message;

    // Extract from errors array
    const errors: ValidationError[] = parsed.errors || [];

    errors.forEach((error) => {
      const field = error.path?.[0];
      if (field) {
        if (!result[field]) {
          result[field] = [];
        }
        if (error.message && !result[field].includes(error.message)) {
          result[field].push(error.message);
        }
      }
    });

    // Add root valueError if present
    if (errorResponse.error?.valueError) {
      const valueError = errorResponse.error.valueError;
      const field = valueError.path?.[0];
      if (field && valueError.message) {
        if (!result[field]) {
          result[field] = [];
        }
        if (!result[field].includes(valueError.message)) {
          result[field].push(valueError.message);
        }
      }
    }
  } catch (error) {
    console.error("Failed to parse validation errors:", error);
  }

  return result;
}

export { extractFieldErrors, getValidationErrors, ValidationError, FieldErrors };
