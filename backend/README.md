# Backend audio upload server

This small Express server accepts uploaded audio files and saves them into the `backend` folder.

Quick setup:

1. Open a terminal in the `backend/` folder:

```bash
cd backend
```

2. Install the dependencies (run in `backend/`):

```bash
npm install express multer cors
```

3. Start the server:

```bash
node server.js
```

The server will listen on `http://localhost:3001` and expose `POST /upload-audio` (multipart form field `file`). Uploaded files are saved to the `backend/storage/` directory.

How it works with the app:

- The front-end uses the browser `MediaRecorder` to capture audio, then sends the audio as `file` in a `FormData` POST to `/upload-audio`.
- The server writes the uploaded file to the `backend/` directory and returns a JSON object with the saved filename.

Notes:

- This is a minimal prototype for local development. For production you should:
  - Add authentication and rate-limiting
  - Validate file types and sizes
  - Store files in a durable storage (S3, Azure Blob, etc.)
  - Use HTTPS
