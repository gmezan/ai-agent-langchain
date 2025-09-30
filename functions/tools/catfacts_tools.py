from langchain_core.tools import tool
from app.apis.catfacts_client import CatFactsClient

catfacts_client = CatFactsClient()

@tool
def get_random_cat_facts(animal_type: str = "cat", amount: int = 1):
    """Retrieve one or more random cat facts."""
    return catfacts_client.get_random_facts(animal_type=animal_type, amount=amount)

@tool
def get_cat_fact_by_id(fact_id: str, animal_type: str = "cat"):
    """Retrieve a cat fact by its ID."""
    return catfacts_client.get_fact_by_id(fact_id, animal_type)