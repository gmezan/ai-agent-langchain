import azure.functions as func
import logging
import json
import os
import time
from uuid import uuid4
from agents.agent import DogChatAgent
from utils.secrets import get_secret

# Configure logging for Azure Functions
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Create a logger for this module
logger = logging.getLogger(__name__)

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Initialize the agent once
logger.info("Initializing DogChatAgent...")
try:
    dog_agent = DogChatAgent()
    logger.info("DogChatAgent initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize DogChatAgent: {str(e)}")
    raise

@app.function_name(name="ChatApi")
@app.route(route="chat")
def chat(req: func.HttpRequest) -> func.HttpResponse:
    start_time = time.time()
    request_id = str(uuid4())[:8]  # Short request ID for tracking
    
    logger.info(f"[{request_id}] Chat endpoint triggered - Method: {req.method}, URL: {req.url}")
    
    try:
        # Get the request body
        req_body = req.get_json()
        if not req_body:
            logger.warning(f"[{request_id}] Request body is missing or invalid")
            return func.HttpResponse(
                json.dumps({"error": "Request body is required"}),
                mimetype="application/json",
                status_code=400
            )
        
        message = req_body.get('content', 'Hi')
        thread_id = req_body.get('thread_id') or str(uuid4())
        
        logger.info(f"[{request_id}] Processing message - Thread: {thread_id}, Message length: {len(message)}")
        
        # Use the DogChatAgent to process the message
        agent_start_time = time.time()
        response = dog_agent.invoke(message, thread_id)
        agent_duration = time.time() - agent_start_time
        
        logger.info(f"[{request_id}] Agent processing completed in {agent_duration:.2f}s")
        
        # Extract the content from the response
        if response and "messages" in response and response["messages"]:
            content = response["messages"][-1].content
            logger.info(f"[{request_id}] Response generated - Content length: {len(content)}")
        else:
            content = "I'm sorry, I couldn't process your request."
            logger.warning(f"[{request_id}] No valid response from agent, using fallback message")
        
        response_data = {
            "content": content,
            "thread_id": thread_id
        }
        
        total_duration = time.time() - start_time
        logger.info(f"[{request_id}] Request completed successfully in {total_duration:.2f}s")
        
        return func.HttpResponse(
            json.dumps(response_data),
            mimetype="application/json",
            status_code=200
        )
        
    except Exception as e:
        total_duration = time.time() - start_time
        logger.error(f"[{request_id}] Error processing chat request after {total_duration:.2f}s: {str(e)}", exc_info=True)
        
        return func.HttpResponse(
            json.dumps({
                "error": "Internal server error",
                "request_id": request_id
            }),
            mimetype="application/json",
            status_code=500
        )