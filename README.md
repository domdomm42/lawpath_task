# Australia Post Address Validator

A Next.js application that validates Australian postal addresses by checking if postcode, suburb, and state combinations are valid through the Australia Post API.

## Overview

This project provides a user-friendly form interface that validates Australian postal addresses by checking three key relationships:

1. If the suburb exists in the specified state
2. If the postcode matches the specified suburb
3. If all three components together form a valid Australian address

The application uses Next.js 14 with the App Router, GraphQL, and integrates with the Australia Post API through a GraphQL proxy.

## Features

- ✅ Real-time address validation using Australia Post API
- 🌐 GraphQL proxy for the REST API
- 🔄 Form validation with React Hook Form and Zod
- 💅 Responsive UI with dark mode support
- 🚀 Server-side GraphQL implementation using Apollo Server
- 📦 Client-side data fetching with Apollo Client
- 🧪 Type safety with TypeScript

## Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Australia Post API credentials (see below)

### Australia Post API Credentials

You need to obtain credentials for the Australia Post API:

1. Sign up for the Australia Post Developer account at [https://developers.auspost.com.au/](https://developers.auspost.com.au/)
2. Subscribe to the PAF (Postal Address File) API
3. Generate an API key to use in this application

### Environment Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/australia-post-address-validator.git
   cd australia-post-address-validator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Australia Post API credentials:

   ```
   AUSTRALIA_POST_API_URL=https://digitalapi.auspost.com.au/postcode/search.json
   AUSTRALIA_POST_API_TOKEN=your-api-token-here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Architecture

### Overview

This application follows a modern architecture leveraging Next.js App Router for page routing, Apollo Server for the GraphQL API, and Apollo Client for data fetching.

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

2. **Apollo Client Cache**: Client-side caching through Apollo's InMemoryCache to store query results, though configured with a network-only fetch policy to ensure fresh data for address validation.

3. **RESTDataSource Caching**: The `LocalitiesAPI` class extends Apollo's `RESTDataSource`, which automatically provides HTTP caching for the external Australia Post API.

This multi-level approach minimizes external API calls while ensuring data freshness for critical validation operations.

## Testing

Run the test suite:

```bash
npm test
```

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

## Example Validations

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

For questions or issues, please open an issue on this repository.
