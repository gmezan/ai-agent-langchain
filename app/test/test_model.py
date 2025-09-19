from langchain_core.messages import HumanMessage
from app.model.chat_model import chat_model

if __name__ == "__main__":
	print("Testing DeepSeek model...")
	response = chat_model.invoke([HumanMessage(content="Hi! I'm Bob")])
	print("Model response:", response)