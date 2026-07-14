# Edumind AI

Edumind AI is a full-stack document chat application. Users can register, log in, upload PDFs or videos, let the backend ingest the content into a vector store, and then ask questions that are answered from the uploaded material.

## Features

- User registration, login, logout, and cookie-based auth checks
- PDF and video upload through Cloudinary signed uploads
- Document metadata storage in MongoDB
- RAG ingestion pipeline using Gemini embeddings and Pinecone
- Document-specific chat with saved conversation history
- Sidebar document library with status labels and delete support
- Clear chat history per document
- React dashboard built with Redux Toolkit and Tailwind CSS

## Tech Stack

**Frontend**

- React 19
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- React Markdown and syntax highlighting for chat responses

**Backend**

- Node.js
- Express
- MongoDB and Mongoose
- Redis for token blocklisting on logout
- JWT auth stored in HTTP-only cookies
- Cloudinary for file storage
- Google Gemini / GenAI for AI and embeddings
- Pinecone for vector search

## Project Structure

```text
Edumind-ai/
  Backend/
    index.js
    src/
      config/          # MongoDB, Redis, Cloudinary config
      controllers/     # Auth, upload, chat controllers
      middleware/      # User auth middleware
      models/          # User, Document, ChatHistory models
      routes/          # Auth, document, chat routes
      services/        # RAG, embedding, chat, Pinecone services
  Frontend/
    src/
      api/             # Axios API wrappers
      components/      # Sidebar, upload, chat UI
      pages/           # Login, register, dashboard
      store/           # Redux store and slices
      utils/           # Axios client
```

## Prerequisites

- Node.js
- MongoDB database
- Redis instance
- Cloudinary account
- Pinecone index
- Google Gemini API key

## Environment Variables

Create a `.env` file inside `Backend/`.

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

REDIS_PASSWORD=your_redis_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_gemini_api_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

The frontend currently calls the backend at `http://localhost:5000` from `Frontend/src/utils/axiosclient.js`.

## Installation

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd Frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd Backend
npm start
```

Start the frontend:

```bash
cd Frontend
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

## Main API Routes

### Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/user/register` | Create a new user |
| POST | `/user/login` | Log in and set auth cookie |
| POST | `/user/logout` | Blocklist token and clear cookie |
| GET | `/user/check` | Validate current user session |

### Documents

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/documents/upload-signature?type=pdf` | Get a Cloudinary signed upload payload |
| POST | `/api/documents/save` | Save uploaded file metadata |
| POST | `/api/documents/ingest` | Ingest a document into the RAG pipeline |
| GET | `/api/documents/my-documents` | List the current user's documents |
| DELETE | `/api/documents/:id` | Delete one of the current user's documents |

### Chat

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/chat` | Ask a question about a document |
| GET | `/api/chat/:documentId` | Fetch chat history for a document |
| DELETE | `/api/chat/:documentId` | Clear chat history for a document |

## Workflow

1. Register or log in.
2. Upload a PDF or video from the dashboard sidebar.
3. The frontend requests a signed Cloudinary upload payload.
4. The file uploads directly to Cloudinary.
5. The backend saves metadata in MongoDB.
6. The backend ingests the document, creates embeddings, and stores vectors in Pinecone.
7. Once the document is processed, select it from the sidebar and ask questions.

## Useful Scripts

Backend:

```bash
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

- The backend enables CORS for `http://localhost:5173` and `http://127.0.0.1:5173`.
- Auth uses HTTP-only cookies, so frontend requests must include credentials.
- Document deletion is scoped by both document ID and authenticated user ID.
- The backend `test` script is currently a placeholder.
