import { login } from "../services/auth.service.js";

const ERROR_MESSAGES = {
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-disabled": "Usuário desativado.",
  "auth/user-not-found": "E-mail ou senha incorretos.",
  "auth/wrong-password": "E-mail ou senha incorretos.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
};

export function renderLoginView(root) {
  root.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="login-logo">
          <div class="mark">FOCAR.RAW</div>
        </div>
        <form id="login-form">
          <div class="form-error" id="login-error"></div>
          <div class="field">
            <label for="login-email">E-mail</label>
            <input id="login-email" type="email" autocomplete="username" required />
          </div>
          <div class="field">
            <label for="login-password">Senha</label>
            <input id="login-password" type="password" autocomplete="current-password" required />
          </div>
          <button class="btn-primary" type="submit" id="login-submit">Entrar</button>
        </form>
      </div>
    </div>
  `;

  const form = root.querySelector("#login-form");
  const errorEl = root.querySelector("#login-error");
  const submitBtn = root.querySelector("#login-submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorEl.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Entrando...";

    const email = root.querySelector("#login-email").value.trim();
    const password = root.querySelector("#login-password").value;

    try {
      await login(email, password);
    } catch (err) {
      errorEl.textContent = ERROR_MESSAGES[err.code] || "Não foi possível entrar. Tente novamente.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Entrar";
    }
  });
}
