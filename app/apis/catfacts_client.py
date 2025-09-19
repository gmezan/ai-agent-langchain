from app.utils.webclient import WebClient
from typing import Any, Dict, Optional, Union

class CatFactsClient(WebClient):
    def __init__(self):
        super().__init__(base_url="https://cat-fact.herokuapp.com")

    def get_random_facts(self, animal_type: str = "cat", amount: int = 1) -> Union[Dict[str, Any], list]:
        params = {"animal_type": animal_type, "amount": amount}
        response = self.request(endpoint="facts/random", method="GET", params=params)
        return response.json()

    def get_fact_by_id(self, fact_id: str, animal_type: Optional[str] = None) -> Dict[str, Any]:
        params = {"animal_type": animal_type} if animal_type else None
        response = self.request(endpoint=f"facts/{fact_id}", method="GET", params=params)
        return response.json()

# Example usage:
# client = CatFactsClient()
# print(client.get_random_facts(amount=2))
# print(client.get_fact_by_id("591f98803b90f7150a19c229"))
# print(client.get_queued_facts())
