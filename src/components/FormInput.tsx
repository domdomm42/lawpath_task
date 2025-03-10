import React, { forwardRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  options?: Option[];
  error?: string;
}

// Using forwardRef to make it compatible with React Hook Form
const FormInput = forwardRef<
  HTMLInputElement | HTMLSelectElement,
  FormInputProps & React.HTMLAttributes<HTMLInputElement | HTMLSelectElement>
>(
  (
    {
      id,
      name,
      label,
      placeholder = "",
      type = "text",
      options = [],
      error,
      ...rest
    },
    ref
  ) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>

        {type === "select" ? (
          <select
            id={id}
            name={name}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ref={ref as React.ForwardedRef<HTMLSelectElement>}
            {...rest}
          >
            <option value="">Select a {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            {...rest}
          />
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
