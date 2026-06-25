const passwordField = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

const toast = document.getElementById("toast");
const themeBtn = document.getElementById("themeBtn");

const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function secureRandom(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatePassword() {

    const selected = [];

    if (uppercase.checked)
        selected.push(CHARSETS.uppercase);

    if (lowercase.checked)
        selected.push(CHARSETS.lowercase);

    if (numbers.checked)
        selected.push(CHARSETS.numbers);

    if (symbols.checked)
        selected.push(CHARSETS.symbols);

    if (selected.length === 0) {
        alert("Selecione pelo menos uma opção.");
        return;
    }

    const length = Number(lengthSlider.value);

    let passwordArray = [];

    // Garante ao menos um caractere de cada grupo
    selected.forEach(group => {
        passwordArray.push(
            group[secureRandom(group.length)]
        );
    });

    const allChars = selected.join("");

    while (passwordArray.length < length) {
        passwordArray.push(
            allChars[secureRandom(allChars.length)]
        );
    }

    passwordArray = shuffle(passwordArray);

    passwordField.value =
        passwordArray.slice(0, length).join("");

    passwordField.classList.remove("animate");

    void passwordField.offsetWidth;

    passwordField.classList.add("animate");

    updateStrength();
}

function updateStrength() {

    let score = 0;

    if (uppercase.checked) score++;
    if (lowercase.checked) score++;
    if (numbers.checked) score++;
    if (symbols.checked) score++;

    const len = Number(lengthSlider.value);

    if (len >= 12) score++;
    if (len >= 20) score++;
    if (len >= 32) score++;

    if (score <= 2) {
        strengthText.textContent = "Fraca";
        strengthFill.style.width = "25%";
        strengthFill.style.background = "#ef4444";
    }
    else if (score <= 4) {
        strengthText.textContent = "Média";
        strengthFill.style.width = "50%";
        strengthFill.style.background = "#f59e0b";
    }
    else if (score <= 6) {
        strengthText.textContent = "Forte";
        strengthFill.style.width = "75%";
        strengthFill.style.background = "#22c55e";
    }
    else {
        strengthText.textContent = "Muito Forte";
        strengthFill.style.width = "100%";
        strengthFill.style.background = "#16a34a";
    }
}

async function copyPassword() {

    if (!passwordField.value) return;

    await navigator.clipboard.writeText(
        passwordField.value
    );

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    themeBtn.textContent =
        document.body.classList.contains("dark-mode")
        ? "☀️"
        : "🌙";
});

generateBtn.addEventListener(
    "click",
    generatePassword
);

copyBtn.addEventListener(
    "click",
    copyPassword
);

[
    uppercase,
    lowercase,
    numbers,
    symbols,
    lengthSlider
].forEach(element => {
    element.addEventListener(
        "change",
        updateStrength
    );
});

generatePassword();
