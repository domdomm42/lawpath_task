"use client";

import React, { useState } from "react";
import FormInput from "./FormInput";
import StatusMessage from "./StatusMessage";

interface FormData {
  postcode: string;
  suburb: string;
  state: string;
}

interface FormStatus {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

function AddressForm() {
  const [formData, setFormData] = useState<FormData>({
    postcode: "",
    suburb: "",
    state: "",
  });

  const [status, setStatus] = useState<FormStatus>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous status messages when user starts typing again
    if (status.isSuccess || status.isError) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        message: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for now
    // TODO: Add more indepth validation once graphql logic is setup
    if (!formData.postcode || !formData.suburb || !formData.state) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message: "Please fill in all fields",
      });
      return;
    }

    // Simulate form submission for now
    // TODO: Replace with actual API call
    setStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      message: "",
    });

    // Demo testing
    // setTimeout(() => {
    //   setStatus({
    //     isSubmitting: false,
    //     isSuccess: true,
    //     isError: false,
    //     message: "The postcode, suburb, and state input are valid.",
    //   });
    // }, 1000);
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Postcode Field */}
        <FormInput
          id="postcode"
          name="postcode"
          label="Postcode"
          value={formData.postcode}
          onChange={handleChange}
          placeholder="e.g. 2000"
          maxLength={4}
        />

        {/* Suburb Field */}
        <FormInput
          id="suburb"
          name="suburb"
          label="Suburb"
          value={formData.suburb}
          onChange={handleChange}
          placeholder="e.g. Sydney"
        />

        {/* State Field */}
        <FormInput
          id="state"
          name="state"
          label="State"
          value={formData.state}
          onChange={handleChange}
          placeholder="e.g. NSW"
        />

        {/* Status Messages */}
        <StatusMessage
          isError={status.isError}
          isSuccess={status.isSuccess}
          message={status.message}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex justify-center items-center"
        >
          {status.isSubmitting ? (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {status.isSubmitting ? "Validating..." : "Validate Address"}
        </button>
      </form>
    </div>
  );
}

export default AddressForm;
