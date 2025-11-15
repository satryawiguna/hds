import * as React from "react";
import { Label } from "../atoms/Label";

export interface FormGroupProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  error,
  required,
  children,
}) => {
  return (
    <div className="space-y-2 text-gray-800">
      <Label required={required}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
