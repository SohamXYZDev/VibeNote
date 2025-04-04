    document.getElementById("toggle-password").addEventListener("click", function () {
        const passwordInput = document.getElementById("password");
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        this.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });