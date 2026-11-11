const IP_BACKEND = "10.92.199.61";

// Define a URL base da API automaticamente dependendo de onde o front está a rodar
window.API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:3000"
    : `http://${IP_BACKEND}:3000`;