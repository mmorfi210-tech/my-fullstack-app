from fastapi import status

def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data
    assert "hashed_password" not in data

def test_register_duplicate_email(client):
    user_data = {"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    client.post("/api/auth/register", json=user_data)
    
    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client):
    # Register first
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    )
    
    # Login using OAuth2 form data
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure(client):
    response = client.post(
        "/api/auth/login",
        data={"username": "wrong@example.com", "password": "password123"}
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_me_success(client):
    # Register & Login
    client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    )
    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    token = login_response.json()["access_token"]
    
    # Get me
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
