/* Autenticación simple en localStorage: registro, login, logout */
(function(){
    const USERS_KEY = 'amc_users';
    const SESSION_KEY = 'amc_auth_user';

    function getUsers(){
        try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch(_) { return []; }
    }
    function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
    function setSession(user){ localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
    function getSession(){ try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch(_) { return null; } }
    function clearSession(){ localStorage.removeItem(SESSION_KEY); }

    function hash(s){ return btoa(unescape(encodeURIComponent(s))).replace(/=+$/,''); }

    function showToast(msg){
        const t = document.createElement('div');
        t.className = 'amc-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(()=> t.classList.add('show'));
        setTimeout(()=> { t.classList.remove('show'); setTimeout(()=> t.remove(), 300); }, 2000);
    }

    function updateHeaderUI(){
        const user = getSession();
        const loginBtn = document.getElementById('authOpenBtn');
        const userChip = document.getElementById('authUserChip');
        if (!loginBtn || !userChip) return;
        if (user) {
            loginBtn.style.display = 'none';
            userChip.style.display = 'inline-flex';
            userChip.querySelector('.chip-name').textContent = user.name || user.email;
        } else {
            loginBtn.style.display = 'inline-flex';
            userChip.style.display = 'none';
        }
    }

    function bindModal(){
        const modal = document.getElementById('authModal');
        const openBtn = document.getElementById('authOpenBtn');
        const closeBtn = document.getElementById('closeAuthModal');
        const tabLogin = document.getElementById('tabLogin');
        const tabRegister = document.getElementById('tabRegister');
        const loginView = document.getElementById('loginView');
        const registerView = document.getElementById('registerView');
        const logoutBtn = document.getElementById('logoutBtnHeader');

        function open(){ modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
        function close(){ modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
        if (openBtn) openBtn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (modal) modal.addEventListener('click', (e)=>{ if (e.target === modal) close(); });
        if (tabLogin && tabRegister) {
            tabLogin.addEventListener('click', ()=>{ tabLogin.classList.add('active'); tabRegister.classList.remove('active'); loginView.style.display='block'; registerView.style.display='none'; });
            tabRegister.addEventListener('click', ()=>{ tabRegister.classList.add('active'); tabLogin.classList.remove('active'); loginView.style.display='none'; registerView.style.display='block'; });
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', ()=>{ clearSession(); updateHeaderUI(); showToast('Sesión cerrada'); });
        }

        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) loginForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value.trim().toLowerCase();
            const password = loginForm.querySelector('input[type="password"]').value;
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === hash(password));
            if (!user) { showToast('Credenciales inválidas'); return; }
            setSession({ email: user.email, name: user.name });
            updateHeaderUI();
            showToast('¡Bienvenida!');
            const modal = document.getElementById('authModal');
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        if (registerForm) registerForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const name = registerForm.querySelector('input[name="name"]').value.trim();
            const email = registerForm.querySelector('input[type="email"]').value.trim().toLowerCase();
            const pass = registerForm.querySelector('input[name="password"]').value;
            const pass2 = registerForm.querySelector('input[name="confirm"]').value;
            if (!name) { showToast('Ingresa tu nombre'); return; }
            if (pass.length < 6) { showToast('La contraseña debe tener 6+ caracteres'); return; }
            if (pass !== pass2) { showToast('Las contraseñas no coinciden'); return; }
            const users = getUsers();
            if (users.some(u => u.email === email)) { showToast('Ese correo ya está registrado'); return; }
            users.push({ name, email, password: hash(pass), createdAt: Date.now() });
            saveUsers(users);
            setSession({ email, name });
            updateHeaderUI();
            showToast('Cuenta creada');
            const modal = document.getElementById('authModal');
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    document.addEventListener('DOMContentLoaded', function(){
        updateHeaderUI();
        bindModal();
    });

    // Expose minimal API if needed
    window.AMCAuth = { getSession, clearSession, updateHeaderUI };
})();


