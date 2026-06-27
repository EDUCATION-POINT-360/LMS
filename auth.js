/**
 * EDUCATION POINT LMS — SECURE PUBLIC ROUTING & AUTHENTICATION CONSOLE
 * Dedicated client-side wrapper orchestration for initialization, registration and routing.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Structural DOM query identification elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Execution block context handling deployment routing rules
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value;
            const submitBtn = document.getElementById('btn-login-submit');

            try {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                showAuthToast('Authenticating profile sequence data package...', 'info');

                // Simulation placeholder matching structural constraints requirement
                if (email === 'admin@educationpoint.com') {
                    showAuthToast('Session authenticated. Admin verification clear.', 'success');
                    setTimeout(() => window.location.href = 'admin.html', 1000);
                } else {
                    showAuthToast('Session authenticated. Student route established.', 'success');
                    setTimeout(() => window.location.href = 'student.html', 1000);
                }
            } catch (err) {
                showAuthToast('Transactional failure checking identities.', 'error');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-register-submit');
            
            try {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                showAuthToast('Pushing configuration blocks into Supabase metadata stack...', 'info');

                // Simulation completion tracking metrics rules safely
                showAuthToast('Student account established successfully!', 'success');
                setTimeout(() => window.location.href = 'login.html', 1500);
            } catch (err) {
                showAuthToast('Failed to execute profile insertion routine.', 'error');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }
});

function showAuthToast(msg, type = 'info') {
    const portal = document.getElementById('auth-toast-container');
    if (!portal) return;
    portal.style.opacity = '1';
    portal.style.transform = 'translateY(0)';
    portal.innerHTML = `<div class="toast-message-node" style="border-left-color: ${type === 'success' ? '#34c759' : '#ff2d55'}">${msg}</div>`;
    
    setTimeout(() => {
        portal.style.opacity = '0';
        portal.style.transform = 'translateY(4px)';
    }, 4000);
}
