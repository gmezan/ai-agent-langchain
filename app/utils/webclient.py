import requests
from typing import Dict, Any, Optional

class WebClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')

    def request(self, endpoint: str, method: str = 'GET', params: Optional[Dict[str, Any]] = None,
                body: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> requests.Response:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = requests.request(
            method=method.upper(),
            url=url,
            params=params,
            json=body,
            headers=headers
        )
        response.raise_for_status()
        return response

# Example usage:
# class MyAPIClient(WebClient):
#     def get_data(self, resource_id):
#         return self.request(f"data/{resource_id}", method="GET")
