const IP_BACKEND = "10.92.199.61";

// Define a URL base da API trocando a porta 3000 por 8080
window.API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : `http://${IP_BACKEND}:8080`;
