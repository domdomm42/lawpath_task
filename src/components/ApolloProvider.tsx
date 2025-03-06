"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { createApolloClient } from "@/lib/apollo-client";
import { ReactNode } from "react";

// Create the client instance
const client = createApolloClient();

// Create a provider component
export function ApolloProvider({ children }: { children: ReactNode }) {
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
