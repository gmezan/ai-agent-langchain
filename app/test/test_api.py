from app.apis.dogapi_client import DogApiClient

def test_dog_api():
    print("Testing DogApiClient...")
    dog_client = DogApiClient()
    print("Dog breeds:", dog_client.list_breeds())
    print("Dog breed by ID:", dog_client.get_breed("f9643a80-af1d-422a-9f15-18d466822053"))
    print("Dog facts:", dog_client.list_facts(limit=2))
    print("Dog groups:", dog_client.list_groups())
    print("Dog group by ID:", dog_client.get_group("02124eb6-1baa-410c-90ea-6b8629fb0837"))

if __name__ == "__main__":
    test_dog_api()
