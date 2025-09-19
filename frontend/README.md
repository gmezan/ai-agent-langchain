
# DogChatAgent Frontend

This is the frontend for DogChatAgent, a responsive chat application built with React and Bootstrap. It connects to the FastAPI backend at `/chat` to provide an AI-powered dog chat experience.

## Features
- Chat with an AI agent about dogs
- Session-based memory using thread_id
- Responsive, stylish chat UI
- User and agent messages displayed in a chat format

## Prerequisites
- Node.js 18+
- npm

## Setup & Run
1. Open a terminal in the `frontend` directory:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the development server:
	```sh
	npm run dev
	```
	The app will be available at `http://localhost:5173` (default Vite port).

## Usage
- Type your message in the input box and press "Send".
- The agent will respond and remember your session using a thread ID.
- The chat UI is fully responsive and works well on desktop and mobile.

## Customization
- You can style the chat further by editing `src/App.jsx`.

## License
MIT

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
