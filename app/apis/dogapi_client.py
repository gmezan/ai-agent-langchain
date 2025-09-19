from app.utils.webclient import WebClient
from typing import Any, Dict, Optional, Union

class DogApiClient(WebClient):
    def __init__(self):
        super().__init__(base_url="https://dogapi.dog/api/v2")

    def list_breeds(self, page: Optional[int] = None) -> Dict[str, Any]:
        params = {"page[number]": page} if page else None
        response = self.request(endpoint="breeds", method="GET", params=params)
        return response.json()

    def get_breed(self, breed_id: str) -> Dict[str, Any]:
        response = self.request(endpoint=f"breeds/{breed_id}", method="GET")
        return response.json()

    def list_facts(self, limit: Optional[int] = None) -> Dict[str, Any]:
        params = {"limit": limit} if limit else None
        response = self.request(endpoint="facts", method="GET", params=params)
        return response.json()

    def list_groups(self, page: Optional[int] = None) -> Dict[str, Any]:
        params = {"page[number]": page} if page else None
        response = self.request(endpoint="groups", method="GET", params=params)
        return response.json()

    def get_group(self, group_id: str) -> Dict[str, Any]:
        response = self.request(endpoint=f"groups/{group_id}", method="GET")
        return response.json()

# Example usage:
# client = DogApiClient()
# print(client.list_breeds())
# print(client.get_breed("f9643a80-af1d-422a-9f15-18d466822053"))
# print(client.list_facts(limit=5))
# print(client.list_groups())
# print(client.get_group("02124eb6-1baa-410c-90ea-6b8629fb0837"))
