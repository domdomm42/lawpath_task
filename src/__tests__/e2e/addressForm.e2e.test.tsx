/**
 * @jest-environment jsdom
 */

import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import AddressForm from "@/components/AddressForm";
import { VALIDATE_ADDRESS } from "@/lib/graphql/queries";
import "@testing-library/jest-dom";

// Mock data for successful validation
const validAddressMock = {
  request: {
    query: VALIDATE_ADDRESS,
    variables: {
      postcode: "2000",
      suburb: "Sydney",
      state: "NSW",
    },
  },
  result: {
    data: {
      validateAddress: {
        isValid: true,
        message: "Address is valid",
      },
    },
  },
};

// Mock data for failed validation
const invalidAddressMock = {
  request: {
    query: VALIDATE_ADDRESS,
    variables: {
      postcode: "9999",
      suburb: "Invalid",
      state: "NSW",
    },
  },
  result: {
    data: {
      validateAddress: {
        isValid: false,
        message: "Address could not be validated",
      },
    },
  },
};

// Mock error response
const errorMock = {
  request: {
    query: VALIDATE_ADDRESS,
    variables: {
      postcode: "5000",
      suburb: "Error",
      state: "SA",
    },
  },
  error: new Error("An error occurred"),
};

describe("AddressForm", () => {
  test("renders all form fields correctly", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Check if all form elements are rendered
    expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/suburb/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /validate address/i })
    ).toBeInTheDocument();
  });

  test("displays validation errors when form is submitted with empty fields", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Submit empty form
    fireEvent.click(screen.getByRole("button", { name: /validate address/i }));

    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText(/postcode is required/i)).toBeInTheDocument();
      expect(screen.getByText(/suburb is required/i)).toBeInTheDocument();
      expect(screen.getByText(/state is required/i)).toBeInTheDocument();
    });
  });

  test("shows error when postcode is not 4 digits", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Enter invalid postcode
    await userEvent.type(screen.getByLabelText(/postcode/i), "123");
    await userEvent.type(screen.getByLabelText(/suburb/i), "Test Suburb");
    await userEvent.selectOptions(screen.getByLabelText(/state/i), "NSW");

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /validate address/i }));

    // Check for validation error messages
    await waitFor(() => {
      expect(
        screen.getByText(/postcode must be exactly 4 digits/i)
      ).toBeInTheDocument();
    });
  });

  test("only allows numbers in postcode field", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Try to enter non-numeric characters
    const postcodeInput = screen.getByLabelText(/postcode/i);
    await userEvent.type(postcodeInput, "123a");

    // Check that non-numeric characters are filtered out
    expect(postcodeInput).toHaveValue("123");
  });

  test("shows success message when address is valid", async () => {
    render(
      <MockedProvider mocks={[validAddressMock]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Fill in form with valid data
    await userEvent.type(screen.getByLabelText(/postcode/i), "2000");
    await userEvent.type(screen.getByLabelText(/suburb/i), "Sydney");
    await userEvent.selectOptions(screen.getByLabelText(/state/i), "NSW");

    // Submit form
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /validate address/i })
      );
      // Small delay to allow state to update
      await new Promise((r) => setTimeout(r, 0));
    });

    // Check for success message with proper waiting
    await waitFor(
      () => {
        expect(screen.getByText(/address is valid/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("shows error message when address is invalid", async () => {
    render(
      <MockedProvider mocks={[invalidAddressMock]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Fill in form with invalid data
    await userEvent.type(screen.getByLabelText(/postcode/i), "9999");
    await userEvent.type(screen.getByLabelText(/suburb/i), "Invalid");
    await userEvent.selectOptions(screen.getByLabelText(/state/i), "NSW");

    // Submit form with act()
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /validate address/i })
      );
      // Small delay to allow state to update
      await new Promise((r) => setTimeout(r, 0));
    });

    // Check for error message with proper waiting
    await waitFor(
      () => {
        expect(
          screen.getByText(/address could not be validated/i)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("handles network errors gracefully", async () => {
    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Fill in form with data that will trigger an error
    await userEvent.type(screen.getByLabelText(/postcode/i), "5000");
    await userEvent.type(screen.getByLabelText(/suburb/i), "Error");
    await userEvent.selectOptions(screen.getByLabelText(/state/i), "SA");

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /validate address/i }));

    // Check for error message
    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred while validating the address/i)
      ).toBeInTheDocument();
    });
  });

  test("clears status messages when user types in any field", async () => {
    render(
      <MockedProvider mocks={[validAddressMock]} addTypename={false}>
        <AddressForm />
      </MockedProvider>
    );

    // Fill in form with valid data
    await userEvent.type(screen.getByLabelText(/postcode/i), "2000");
    await userEvent.type(screen.getByLabelText(/suburb/i), "Sydney");
    await userEvent.selectOptions(screen.getByLabelText(/state/i), "NSW");

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /validate address/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/address is valid/i)).toBeInTheDocument();
    });

    // Type in a field to clear the message
    await userEvent.type(screen.getByLabelText(/postcode/i), "2001");

    // Check that the message is cleared
    await waitFor(() => {
      expect(screen.queryByText(/address is valid/i)).not.toBeInTheDocument();
    });
  });
});
