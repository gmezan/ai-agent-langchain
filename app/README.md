# AI Agent LangChain

A Python-based AI agent built with LangChain that provides conversational AI capabilities through both CLI and web API interfaces. The agent specializes in dog-related conversations and integrates with external APIs for enhanced functionality.

## Project Structure

```
app/
├── agents/              # Core agent implementations
├── apis/               # External API clients (cat facts, dog API)
├── controller/         # FastAPI web controllers
├── memory/             # Memory management for conversations
├── model/              # Chat model configurations
├── tools/              # LangChain tools for agent capabilities
├── utils/              # Utility functions and web clients
├── test/               # Unit tests
├── cli_agent.py        # Command-line interface
└── requirements.txt    # Python dependencies
```

## Features

- **Conversational AI Agent**: Powered by LangChain with memory management
- **Multiple Interfaces**: Both CLI and web API endpoints
- **External API Integration**: Cat facts and dog API integrations
- **Thread-based Conversations**: Maintains conversation context across sessions
- **FastAPI Backend**: RESTful API with CORS support

## Prerequisites

- Python 3.9 or higher
- pip (Python package installer)

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd /path/to/ai-agent-langchain/app
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (create a `.env` file if needed):
   ```bash
   # Add your API keys and configuration
   OPENAI_API_KEY=your_openai_api_key_here
   # Add other environment variables as needed
   ```

## Usage

### Web API Server

Start the FastAPI server with auto-reload for development:

```bash
uvicorn controller.api:app --reload
```

The server will start on `http://localhost:8000` by default.

#### API Endpoints

- **POST** `/api/chat`: Send a message to the agent
  ```json
  {
    "content": "Tell me about dogs",
    "thread_id": "optional-session-id"
  }
  ```

- **GET** `/docs`: Interactive API documentation (Swagger UI)
- **GET** `/redoc`: Alternative API documentation

### Command Line Interface

Run the CLI agent directly:

```bash
python cli_agent.py
```

This will start an interactive command-line session where you can chat with the agent.

### Development Server Options

For production deployment, you can customize the server settings:

```bash
# Custom host and port
uvicorn controller.api:app --host 0.0.0.0 --port 8080

# Production mode (without auto-reload)
uvicorn controller.api:app --host 0.0.0.0 --port 8080 --workers 4
```

## Testing

Run the test suite:

```bash
python -m pytest test/
```

Or run specific test files:

```bash
python -m pytest test/test_agent.py
python -m pytest test/test_api.py
python -m pytest test/test_model.py
```

## Configuration

The application uses several configuration components:

- **Memory Management**: Conversation history is maintained per thread
- **External APIs**: Integration with cat facts and dog APIs
- **CORS**: Configured to allow cross-origin requests
- **Pydantic Models**: Request/response validation

## Dependencies

Key dependencies include:

- **FastAPI**: Web framework for building APIs
- **LangChain**: Framework for developing LLM applications
- **OpenAI**: Language model integration
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation and serialization

See `requirements.txt` for the complete list of dependencies.

## Development

### Project Architecture

- **Agents**: Core AI agent logic using LangChain
- **Controllers**: FastAPI route handlers
- **Models**: Pydantic models for request/response validation
- **Tools**: Custom tools for agent capabilities
- **Memory**: Conversation memory management
- **APIs**: External service integrations

### Adding New Features

1. Create new tools in the `tools/` directory
2. Update agent configuration in `agents/`
3. Add API endpoints in `controller/`
4. Write tests in `test/`

## Troubleshooting

1. **Import Errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
2. **Server Won't Start**: Check that port 8000 is available or specify a different port
3. **API Key Issues**: Verify environment variables are set correctly
4. **Memory Issues**: Check that the memory manager is properly configured

## License

This project is open source. Please check the repository for license details.