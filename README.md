# Australia Post Address Validator

A Next.js application that validates Australian postal addresses by checking if postcode, suburb, and state combinations are valid through the given Australia Post API.

## Overview

This project provides a form interface that validates Australian postal addresses by checking three key relationships:

1. If the suburb exists in the specified state
2. If the postcode matches the specified suburb
3. If all three components together form a valid Australian address

The application uses Next.js 15.2.1 with the App Router, GraphQL, and integrates with the given Australia Post API through a GraphQL proxy.

## Features

- 🌐 GraphQL proxy for the REST API
- 🔄 Form validation with React Hook Form and Zod
- 💅 Responsive UI
- 🚀 Server-side GraphQL implementation using Apollo Server
- 📦 Client-side data fetching with Apollo Client
- 🧪 Type safety with TypeScript

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm

### Environment Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/domdomm42/lawpath_task.git
   cd lawpath_task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the assessment credentials:

   ```
   AUSTRALIA_POST_API_URL=<redacted but for the sake of assessment, it is https://gavg8gilmf.execute-api.ap-southeast-2.amazonaws.com/staging/postcode/search.json>
   AUSTRALIA_POST_API_TOKEN=<redacted but for the sake of assessment, it is 7710a8c5-ccd1-160f-70cf03e8-b2bbaf01>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

I have setup a graphql playground at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) for you to test the api.

## Architecture

### Overview

This app uses Next.js App Router for page routing, Apollo Server for the GraphQL API, and Apollo Client for data fetching.

```
├── src/
│   ├── app/             # Next.js App Router structure
│   │   ├── api/         # API routes
│   │   │   └── graphql/ # GraphQL API endpoint
│   │   └── page.tsx     # Main page component
│   ├── components/      # React components
│   ├── lib/             # Utility functions, constants, and schemas
│   │   ├── graphql/     # GraphQL client setup and queries
│   │   └── validations/ # Form validation schemas
│   └── services/        # Service layer for external API integration
│       └── addressValidation/ # Australia Post API integration
```

### Key Components

1. **Form Layer**: Uses React Hook Form with Zod validation to capture and validate user input.

2. **GraphQL Client**: Apollo Client configured with in-memory cache and same-origin credentials handling.

3. **GraphQL Server**: Next.js API route that implements a GraphQL server using Apollo Server.

4. **API Integration**: Dedicated service layer that connects to the Australia Post API using Apollo's RESTDataSource.

5. **Validation Logic**: Core business logic that determines if an address is valid based on Australia Post data.

### Caching Strategy

The application implements a multi-level caching strategy:

1. **Apollo Server Cache**: The GraphQL server uses Apollo's in-memory cache to store Australia Post API responses, reducing redundant external API calls for the same queries.

2. **Apollo Client Cache**: Client-side caching through Apollo's InMemoryCache to store query results, useLazyQuery defaults to cache-first.

3. **RESTDataSource Caching**: The `LocalitiesAPI` class extends Apollo's `RESTDataSource`, which automatically provides HTTP caching for the external Australia Post API.

## My Approach

### Validation Strategy

I implemented a step-by-step validation approach for Australian addresses:

1. **State and Suburb Validation (First Pass)**:

   - First, I validate if the provided suburb exists within the specified state
   - This initial check prevents unnecessary postcode queries for invalid suburb/state combinations
   - The application queries the Australia Post API to retrieve all localities that match the suburb name

2. **Postcode Validation (Second Pass)**:

   - Once the suburb is confirmed to exist in the state, I validate if the provided postcode matches the suburb through the list of valid postcodes for that suburb

3. **Complete Address Validation**:
   - When both validations pass, the system confirms the address components form a valid Australian address
   - The validation logic handles edge cases like suburbs that exist in multiple states or suburbs with multiple valid postcodes

There are cases where the output format of the api is not what I expected, Those cases are handled in the code.

## Testing

Run the test suite:

```bash
# For all tests
npm test

# For unit tests
npm run test:unit

# For integration tests
npm run test:integration

# For e2e tests
npm run test:e2e
```

DO note that given that the aus post api route sometimes gives an error, integration test might fail once in a while(as we might get an error instead of our expected result). Please run the tests again if that happens.

Unit test should always pass though as we mock the api response.

The project includes tests for:

- Form validation logic
- API integration
- GraphQL resolvers
- React components

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **GraphQL**: Apollo Server, Apollo Client
- **API Integration**: Apollo RESTDataSource
- **Form Handling**: React Hook Form, Zod
- **Testing**: Jest, React Testing Library

## Key Example Validations

The application can validate various Australian address scenarios:

1. **Valid Address**:

   - Postcode: 2000
   - Suburb: Sydney
   - State: NSW
   - Result: ✅ "The postcode, suburb, and state input are valid."

2. **Invalid Postcode**:

   - Postcode: 3000
   - Suburb: Sydney
   - State: NSW
   - Result: ❌ "The postcode 3000 does not match the suburb Sydney."

3. **Invalid Suburb/State Combination**:
   - Postcode: 3000
   - Suburb: Ferntree Gully
   - State: TAS
   - Result: ❌ "The suburb Ferntree Gully does not exist in the state Tasmania (TAS)."

For questions or issues, please reach out to me at limoudom2001@gmail.com
