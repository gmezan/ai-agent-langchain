from langchain_core.tools import tool
from app.apis.dogapi_client import DogApiClient

dogapi_client = DogApiClient()

@tool
def list_dog_breeds(page: int = 1):
    """List dog breeds with optional pagination."""
    return dogapi_client.list_breeds(page=page)

@tool
def get_dog_breed(breed_id: str):
    """Get details for a specific dog breed by ID."""
    return dogapi_client.get_breed(breed_id)

@tool
def list_dog_facts(limit: int = 1):
    """List dog facts with optional limit."""
    return dogapi_client.list_facts(limit=limit)

@tool
def list_dog_groups(page: int = 1):
    """List dog groups with optional pagination."""
    return dogapi_client.list_groups(page=page)

@tool
def get_dog_group(group_id: str):
    """Get details for a specific dog group by ID."""
    return dogapi_client.get_group(group_id)
