
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

from tools.dogapi_tools import list_dog_breeds, get_dog_breed, list_dog_facts, list_dog_groups, get_dog_group


from model.chat_model import chat_model


class DogChatAgent:
    def __init__(self):
        self.memory = MemorySaver()
        self.tools = [list_dog_breeds, get_dog_breed, list_dog_facts, list_dog_groups, get_dog_group]
        self.model = chat_model
        self.agent_executor = create_react_agent(self.model, self.tools, checkpointer=self.memory)

    def invoke(self, human_message: str, thread_id: str = "abc123"):
        input_message = {"role": "user", "content": human_message}
        config = {"configurable": {"thread_id": thread_id}}
        response = self.agent_executor.invoke({"messages": [input_message]}, config)
        #for msg in response["messages"]:
        #    msg.pretty_print()
        #return response["messages"][-1].content if response["messages"] else None
        return response
    
    def stream(self, human_message: str, thread_id: str = "abc123"):
        input_message = {"role": "user", "content": human_message}
        config = {"configurable": {"thread_id": thread_id}}
        responses = []
        for step in self.agent_executor.stream({"messages": [input_message]}, config, stream_mode="values"):
            for msg in step["messages"]:
                if hasattr(msg, "pretty_print"):
                    msg.pretty_print()
                responses.append(getattr(msg, "content", str(msg)))
        return responses[-1] if responses else None

    def chat(self, human_message: str, thread_id: str = "abc123"):
        # For backward compatibility, use stream
        return self.stream(human_message, thread_id)
