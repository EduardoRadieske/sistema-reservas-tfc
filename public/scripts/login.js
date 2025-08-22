const loginBtn = document.getElementById('loginBtn');
const errorDiv = document.getElementById('error');

loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        errorDiv.textContent = "Preencha email e senha.";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Armazena token
            localStorage.setItem('token', data.token);
            // Redireciona para dashboard
            window.location.href = 'dashboard.html?response=' + encodeURIComponent(JSON.stringify(data));
        } else {
            errorDiv.textContent = data.message || 'Erro ao fazer login';
        }

    } catch (err) {
        console.error(err);
        errorDiv.textContent = 'Erro ao conectar com o servidor';
    }
});