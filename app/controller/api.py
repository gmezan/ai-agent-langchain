from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4
from agents.agent import DogChatAgent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
agent = DogChatAgent()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    content: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    content: str
    thread_id: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    thread_id = request.thread_id or str(uuid4())
    response = agent.invoke(request.content, thread_id=thread_id)
    agent_content = response["messages"][-1].content if response and "messages" in response and response["messages"] else ""
    return ChatResponse(content=agent_content, thread_id=thread_id)
