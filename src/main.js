import "./styles/theme.css";
import "./styles/components.css";
import { watchAuthState, logout } from "./services/auth.service.js";
import { renderLoginView } from "./views/LoginView.js";

const root = document.querySelector("#app");

function renderAppShell(user) {
  root.innerHTML = `
    <div class="app-shell">
      <header>
        <strong>FOCAR.RAW</strong>
        <button class="btn-logout" id="btn-logout">Sair (${user.email})</button>
      </header>
      <main>
        <p>Dashboard em construção.</p>
      </main>
    </div>
  `;
  root.querySelector("#btn-logout").addEventListener("click", () => logout());
}

watchAuthState((user) => {
  if (user) {
    renderAppShell(user);
  } else {
    renderLoginView(root);
  }
});
