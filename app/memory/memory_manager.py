
from langgraph.checkpoint.memory import MemorySaver

class ChatMemoryManager:
    def __init__(self, thread_id: str):
        self.memory = MemorySaver({"configurable": {"thread_id": thread_id}})

    def save_message(self, message: str, role: str = "user"):
        self.memory.save({"role": role, "content": message})

    def get_history(self):
        return self.memory.load()
