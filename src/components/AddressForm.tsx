"use client";

import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import StatusMessage from "@/components/StatusMessage";
import { AUSTRALIAN_STATES } from "@/lib/constants";
import {
  addressSchema,
  AddressFormData,
} from "@/lib/validations/addressSchema";
import { VALIDATE_ADDRESS } from "@/lib/graphql/queries";

interface FormStatus {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

function AddressForm() {
  // Set up React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    // using zod as a schema validation library
    resolver: zodResolver(addressSchema),
    defaultValues: {
      postcode: "",
      suburb: "",
      state: "",
    },
  });

  // Status for API response feedback
  const [status, setStatus] = useState<FormStatus>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: "",
  });

  // Apollo query setup
  const [validateAddress, { loading, error, data }] =
    useLazyQuery(VALIDATE_ADDRESS);

  // Monitor Apollo states
  useEffect(() => {
    // Handle loading state
    if (loading) {
      console.log("loading");
      setStatus({
        isSubmitting: true,
        isSuccess: false,
        isError: false,
        message: "",
      });
      return;
    }

    // Handle error state
    if (error) {
      console.error("GraphQL error:", error);
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        message:
          "An error occurred while validating the address. Please try again.",
      });
      return;
    }

    // Handle successful data
    if (data) {
      setStatus({
        isSubmitting: false,
        isSuccess: data.validateAddress.isValid,
        isError: !data.validateAddress.isValid,
        message: data.validateAddress.message,
      });
    }
  }, [loading, error, data]);

  const handleInputChange = () => {
    if (status.isSuccess || status.isError) {
      setStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        message: "",
      });
    }
  };

  // Submit handler - only runs if zod validation passes
  const onSubmit = (formData: AddressFormData) => {
    validateAddress({
      variables: {
        postcode: formData.postcode,
        suburb: formData.suburb,
        state: formData.state,
      },
    });
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Postcode Field */}
        <FormInput
          id="postcode"
          label="Postcode"
          placeholder="e.g. 2000"
          error={errors.postcode?.message}
          {...register("postcode", {
            onChange: (e) => {
              // Keep only numeric characters for postcode
              const numericValue = e.target.value.replace(/[^0-9]/g, "");
              e.target.value = numericValue;
              handleInputChange();
            },
          })}
        />

        {/* Suburb Field */}
        <FormInput
          id="suburb"
          label="Suburb"
          placeholder="e.g. Sydney"
          error={errors.suburb?.message}
          {...register("suburb", {
            onChange: () => handleInputChange(), // Clear message when the user types
          })}
        />

        {/* State Field */}
        <FormInput
          id="state"
          label="State"
          type="select"
          options={AUSTRALIAN_STATES}
          error={errors.state?.message}
          {...register("state", {
            onChange: () => handleInputChange(), // Clear message when the user types
          })}
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
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out flex justify-center items-center"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {loading ? "Validating..." : "Validate Address"}
        </button>
      </form>
    </div>
  );
}

export default AddressForm;
