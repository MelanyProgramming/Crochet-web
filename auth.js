/* Autenticación simple en localStorage: registro, login, logout */
(function(){
    const USERS_KEY = 'amc_users';
    const SESSION_KEY = 'amc_auth_user';
    const OWNER_EMAIL = (localStorage.getItem('amc_owner_email') || 'arauzmelany0@gmail.com').toLowerCase();
    const OWNER_PASSWORD_PLAIN = 'Melycrochet2407new';

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

    function ensureOwnerAccount(){
        // Persist owner email for other scripts
        localStorage.setItem('amc_owner_email', OWNER_EMAIL);
        const users = getUsers();
        const pwdHash = hash(OWNER_PASSWORD_PLAIN);
        const idx = users.findIndex(u => (u.email || '').toLowerCase() === OWNER_EMAIL);
        if (idx === -1) {
            users.push({ name: 'Mely', email: OWNER_EMAIL, password: pwdHash, createdAt: Date.now() });
            saveUsers(users);
        } else {
            // Keep name, update password to the specified one
            users[idx].password = pwdHash;
            saveUsers(users);
        }
    }

    function updateHeaderUI(){
        const user = getSession();
        const loginBtn = document.getElementById('authOpenBtn');
        const userChip = document.getElementById('authUserChip');
        const dashLink = document.getElementById('dashboardLink');
        const dashIconBtn = document.getElementById('dashboardIconBtn');
        if (!loginBtn || !userChip) return;
        if (user) {
            loginBtn.style.display = 'none';
            userChip.style.display = 'inline-flex';
            userChip.querySelector('.chip-name').textContent = user.name || user.email;
            if (dashLink) {
                const isOwner = (user.email || '').toLowerCase() === OWNER_EMAIL;
                dashLink.style.display = isOwner ? 'inline-flex' : 'none';
            }
            if (dashIconBtn) {
                const isOwner = (user.email || '').toLowerCase() === OWNER_EMAIL;
                dashIconBtn.style.display = isOwner ? 'inline-flex' : 'none';
            }
        } else {
            loginBtn.style.display = 'inline-flex';
            userChip.style.display = 'none';
            if (dashLink) dashLink.style.display = 'none';
            if (dashIconBtn) dashIconBtn.style.display = 'none';
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
            // Si es la cuenta propietaria, redirige al dashboard
            if (email === OWNER_EMAIL) {
                window.location.href = 'dashboard.html';
            }
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
            if (email === OWNER_EMAIL) {
                window.location.href = 'dashboard.html';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function(){
        ensureOwnerAccount();
        updateHeaderUI();
        bindModal();
    });

    // Expose minimal API if needed
    window.AMCAuth = { getSession, clearSession, updateHeaderUI };
})();


