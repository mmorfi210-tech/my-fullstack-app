from fastapi import status

def test_crud_items_unauthorized(client):
    # Try reading items without token
    response = client.get("/api/items")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    # Try creating item without token
    response = client.post("/api/items", json={"title": "Test Item", "description": "Desc"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_crud_items_lifecycle(client):
    # Register & Login
    client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "password123", "full_name": "Item User"}
    )
    login_response = client.post(
        "/api/auth/login",
        data={"username": "user@example.com", "password": "password123"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Read items (initially empty)
    response = client.get("/api/items", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0
    
    # 2. Create an item
    response = client.post(
        "/api/items",
        json={"title": "My Task", "description": "Things to do"},
        headers=headers
    )
    assert response.status_code == status.HTTP_201_CREATED
    item_data = response.json()
    assert item_data["title"] == "My Task"
    assert item_data["description"] == "Things to do"
    assert "id" in item_data
    
    item_id = item_data["id"]
    
    # 3. Read items again (should contain 1 item)
    response = client.get("/api/items", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    items = response.json()
    assert len(items) == 1
    assert items[0]["id"] == item_id
    
    # 4. Delete the item
    response = client.delete(f"/api/items/{item_id}", headers=headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # 5. Read items again (should be empty)
    response = client.get("/api/items", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 0

def test_delete_other_user_item_fails(client):
    # Register and Login User A
    client.post(
        "/api/auth/register",
        json={"email": "usera@example.com", "password": "password123", "full_name": "User A"}
    )
    login_a = client.post(
        "/api/auth/login",
        data={"username": "usera@example.com", "password": "password123"}
    )
    token_a = login_a.json()["access_token"]
    
    # Register and Login User B
    client.post(
        "/api/auth/register",
        json={"email": "userb@example.com", "password": "password123", "full_name": "User B"}
    )
    login_b = client.post(
        "/api/auth/login",
        data={"username": "userb@example.com", "password": "password123"}
    )
    token_b = login_b.json()["access_token"]
    
    # User A creates an item
    response = client.post(
        "/api/items",
        json={"title": "User A Item", "description": "Secret"},
        headers={"Authorization": f"Bearer {token_a}"}
    )
    item_id = response.json()["id"]
    
    # User B tries to delete User A's item
    response = client.delete(
        f"/api/items/{item_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
