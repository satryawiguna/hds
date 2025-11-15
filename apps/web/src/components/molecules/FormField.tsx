import * as React from "react";
import { Label } from "../atoms/Label";
import { Input, InputProps } from "../atoms/Input";

export interface FormFieldProps extends InputProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, error, required, ...inputProps }, ref) => {
    return (
      <div className="space-y-2 text-gray-800">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <Input id={id} ref={ref} error={error} {...inputProps} />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
