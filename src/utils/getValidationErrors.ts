import { ValidationError } from 'yup';

interface IErrors {
  [key: string]: string;
}
export default function getValidationErrors(err: ValidationError): IErrors {
  const ValidationErrors: IErrors = {};
  err.inner.forEach((eachError) => {
    ValidationErrors[eachError.path] = eachError.message;
  });
  return ValidationErrors;
}
