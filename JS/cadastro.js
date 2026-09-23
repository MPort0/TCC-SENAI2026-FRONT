const emailInput = document.getElementById("email");
const avancarBtn = document.querySelector(".branco button");
const voltarBtn = document.querySelector(".voltar button");

function storageAvailable(type) {
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

function getStorageValue(key) {
    if (storageAvailable('localStorage')) {
        const localValue = localStorage.getItem(key);
        if (localValue !== null && localValue !== '') return localValue;
    }
    if (storageAvailable('sessionStorage')) {
        const sessionValue = sessionStorage.getItem(key);
        return sessionValue !== null ? sessionValue : '';
    }
    return '';
}

function setStorageValue(key, value) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem(key, value);
    }
    if (storageAvailable('sessionStorage')) {
        sessionStorage.setItem(key, value);
    }
}

function loadCadastroStep1() {
    emailInput.value = getStorageValue('cadastro_email');
    cpfInput.value = getStorageValue('cadastro_cpf');
    rmInput.value = getStorageValue('cadastro_rm');
}

function saveCadastroStep1() {
    setStorageValue('cadastro_email', emailInput.value.trim());
    setStorageValue('cadastro_cpf', cpfInput.value.trim());
    setStorageValue('cadastro_rm', rmInput.value.trim());
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarFormulario() {
    const email = emailInput.value.trim();
    if (!email) {
        alert("Por favor, preencha todos os campos!");
        return false;
    }
    if (!validarEmail(email)) {
        alert("E-mail inválido! Digite um e-mail válido.");
        emailInput.focus();
        return false;
    }
    return true;
}

if (avancarBtn) {
    avancarBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (validarFormulario()) {
            saveCadastroStep1();
            window.location.href = "cadastro2.html";
        }
    });
} else {
    console.warn('Botão Avançar não encontrado em cadastro.js');
}

if (voltarBtn) {
    voltarBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.history.back();
    });
} else {
    console.warn('Botão Voltar não encontrado em cadastro.js');
}

document.addEventListener('DOMContentLoaded', loadCadastroStep1);