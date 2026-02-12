function redirectToLogin() {
    if (!sessionStorage.getItem('isLoggedIn') && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    const createUserBtn = document.getElementById('create-user-btn');
    const userRoleSpan = document.getElementById('user-role');
    
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    const userType = sessionStorage.getItem('userType');
    const username = sessionStorage.getItem('username');
    
    if (userRoleSpan && username) {
        userRoleSpan.textContent = `${username} (${userType})`;
    }
    
    if (createUserBtn && userType === 'manager' || userType === 'final') {
        createUserBtn.style.display = 'inline-block';
        createUserBtn.onclick = () => window.location.href = 'create-user.html';
    }
});

redirectToLogin();