import azure.functions as func
import logging
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="chat")
def chat(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Chat endpoint triggered.')
    
    # Mocked JSON response
    response_data = {
        "content": "I don't have access to your personal information, so I can't tell you your name. You'd need to provide that information to me directly if you'd like me to use it in our conversation.\n\nIs there something about dog breeds, groups, or facts that I can help you with instead?",
        "thread_id": "c9a4e58d-2cf1-4844-8dfb-6f3cd6180ba5"
    }
    
    return func.HttpResponse(
        json.dumps(response_data),
        mimetype="application/json",
        status_code=200
    )