# Chatbot Frontend

Static browser UI for the chatbot project.

## What It Does

`index.html` loads Tailwind from a CDN and `app.js` handles the chat UI, sends messages to the backend, and displays assistant responses.

## Run

Start the backend from `../backend`, then open `index.html` in a browser.

By default, the frontend sends requests to:

```text
http://localhost:3001/chat
```

To override the backend URL, create a `config.js` file next to `index.html`:

```js
window.BACKEND_API_URL = "http://localhost:3001";
```

## Files

- `index.html` - Chat page and Tailwind setup.
- `app.js` - UI events, request handling, and message rendering.

