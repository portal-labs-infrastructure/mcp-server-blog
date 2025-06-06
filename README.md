# MCP Server Demo: OAuth, TypeScript & Firestore Patterns

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository provides a stripped-down, illustrative implementation of a Model Context Protocol (MCP) server. It showcases the architectural patterns, security considerations (OAuth 2.0), and development practices (TypeScript, Firestore, Zod) detailed in our accompanying article:

**➡️ Read the full story: "[Building a Production-Ready MCP Server with OAuth, TypeScript, and Our Battle Scars](https://portal.one/blog/mcp-server-with-oauth-typescript/)"**

This demo focuses on the **MCP Resource Server** component and assumes you have a separate OAuth 2.0 Authorization Server.

Update: MCP SDK version 1.12.0 introduced the Authorization Server Metadata (/.well-known/oauth-authorization-server) support and removes the need to proxy the oauth calls through the MCP resource server.

## Purpose

This repository is intended as a learning resource to:

- Demonstrate a practical implementation of an MCP server using the TypeScript MCP SDK.
- Illustrate how to integrate OAuth 2.0 for securing tool calls.
- Showcase patterns for managing workspace context and multi-tenancy.
- Provide examples of using Zod for schema definition and validation.
- Offer insights into structuring tools, using Higher-Order Components (HOCs) for common logic, and interacting with Firestore.

**This is NOT a production-ready, plug-and-play server for all use cases.** It omits specific business logic and assumes a pre-existing OAuth Authorization Server.

## Key Features & Patterns Demonstrated

- **MCP TypeScript SDK Integration:** Core server setup and tool registration.
- **OAuth 2.0 Token Validation:** Securely handling Bearer tokens (via the SDK middleware).
- **Workspace Context Management:**
  - Explicit `workspace_id` in tool arguments.
  - `withWorkspaceAccess` Higher-Order Component (HOC) for authentication and workspace authorization.
- **Firestore Integration:**
  - Fetching user data, OAuth token information (conceptual), and tool-specific data.
  - Using Firestore emulators for local development and testing.
- **Zod for Schemas & Validation:** Defining input schemas for tools and leveraging Zod for runtime validation.
- **Type-Safe Development:** Leveraging TypeScript for robust code.
- **Utility Functions:** Examples of `fetchResourceList` for DRY data fetching.
- **Standardized Error Handling:** Using `throw new Error()` for clear error propagation.
- **Example Tool Structures:** Basic tool definitions showcasing the patterns.
- **Environment Variable Configuration:** For database and OAuth settings.

## Architectural Overview

This demo represents the **MCP Resource Server**. It expects OAuth 2.0 Bearer tokens issued by a separate **OAuth Authorization Server**.

```
[Client / LLM with MCP Client SDK]
       |
       | (HTTPS Request with Bearer Token)
       v
[This MCP Resource Server (Node.js / TypeScript)]
       |  1. MCP SDK Middleware (parses request, extracts token)
       |  2. `withWorkspaceAccess` HOC
       |     a. Using the userId associated with the token
       |     b. Validates the user can access the workspace_id in the request
       |  3. Tool Handler Execution (interacts with Firestore based on validated context)
       |
       v
[Google Firestore (Database)]
```

The OAuth Authorization Server (which you would provide or have existing) is responsible for:

- Authenticating users.
- Issuing OAuth tokens (Access Tokens, Refresh Tokens).
- Managing OAuth clients (Dynamic Discovery).

This Resource Server then validates the tokens received from clients.

## Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- Access to a Google Cloud Project with Firestore enabled OR Google Cloud SDK configured for Firestore Emulator.
- An existing OAuth 2.0 Authorization Server.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/portal-labs-infrastructure/mcp-server-blog
    cd mcp-server-blog
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Copy the `.env.example` file to a new file named `.env`:

    ```bash
    cp .env.example .env
    ```

    Now, edit `.env` and fill in the required configuration values:

    ```dotenv
    # Firestore Configuration
    # If using Firestore Emulator, these might not all be strictly needed,
    # but ensure your gcloud CLI is configured or provide necessary emulator host.
    PROJECT_ID="your-gcp-project-id"
    # FIRESTORE_EMULATOR_HOST="localhost:8081" # Uncomment if using emulator and not relying on gcloud config

    # OAuth 2.0 Configuration (for this Resource Server to validate tokens)
    # This depends on your OAuth Authorization Server's setup.
    OAUTH_ISSUER_URL="https_your_auth_server_com"

    # MCP Server Configuration
    BASE_URL="http://localhost:8080" # URL this server is accessible at
    ```

    **Important:** The OAuth configuration is crucial. This server needs to know how to validate tokens issued by your Authorization Server. Consult your Auth Server's documentation.

4.  **(Optional) Seed Firestore Data:**
    If you have seed scripts or want to manually add some sample users, OAuth tokens (matching what your Auth server would issue), and workspace data to your Firestore instance/emulator, do so now. This will make testing the tools more meaningful.

## Running the Server

- **Development Mode (with Nodemon for auto-restarts):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  `bash
  npm run build
  npm start
  `
  The server will typically start on `http://localhost:8080` (or the port specified in `.env`).

## Running with Firestore Emulator

1.  Ensure Google Cloud SDK is installed and configured.
2.  Start the Firestore emulator in a separate terminal:
    ```bash
    gcloud emulators firestore start --host-port=localhost:8081
    ```
    (Adjust port if needed and update `FIRESTORE_EMULATOR_HOST` in `.env` or ensure your application automatically detects it via `gcloud` environment variables).
3.  Run the MCP server as described above. It should connect to the emulator.

## Key Patterns & Concepts Demonstrated in Code

Look for these patterns in the `src` directory:

- **`src/index.ts`:** Main MCP server setup.
- **`src/controllers/mcpController.ts`:** Tool registration and MCP controller handling incoming requests.
- **`src/services/`:** Service layer for handling Firestore interactions.
- **`src/tools/`:** Example tool definitions.
  - Each tool will have an `inputSchema` (Zod) and a `handler`.
  - Handlers will likely be wrapped with `withWorkspaceAccess`.
- **`src/utils/withWorkspaceAccess.ts`:** The Higher-Order Component for workspace checks.
- **`src/utils/fetchResourceList.ts`:** Example of reusable data fetching utility.
- **`src/utils/types.ts`:** Shared TypeScript types and Zod schemas (e.g., for `EntityType`, `ResourceType`).

## Directory Structure

```
.
├── src/
│   ├── tools/                # Tool definitions
│   │   ├── getAgentTool.ts
│   │   └── ...
│   ├── utils/                # Shared utilities, HOCs, types
│   │   ├── withWorkspaceAccess.ts
│   │   ├── types.ts
│   │   └── ...
│   ├── services/             # Interaction logic
│   │   ├── firestoreService.ts    # Firestore interaction logic
│   │   └── ...
│   ├── config/               # Configuration loading
│   └── index.ts              # Main server setup
├── .env.example              # Example environment variables
├── .env                      # Your local environment variables (ignored by git)
├── package.json
├── tsconfig.json
└── ...
```

## What This Demo Is (and Isn't)

- **IS:** A demonstration of server-side patterns for building a secure, multi-tenant MCP Resource Server.
- **IS:** A way to see TypeScript, Zod, Firestore, and OAuth concepts applied in an MCP context.
- **IS NOT:** A complete, production-ready OAuth Authorization Server (you need to provide that).
- **IS NOT:** A library or SDK to be directly consumed (it's an example application).
- **IS NOT:** Filled with complex business logic (tools are illustrative).

## Contributing

This is primarily a demo repository. However, if you find bugs or have suggestions for improving the clarity of the demonstrated patterns, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

This demo is heavily inspired by the experiences and patterns discussed in the article: "[Building a Production-Ready MCP Server with OAuth, TypeScript, and Our Battle Scars](https://portal.one/blog/mcp-server-with-oauth-typescript/)".
