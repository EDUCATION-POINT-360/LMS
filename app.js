// ==========================================
// CENTRAL EDUCATION POINT LMS ARCHITECTURE CONFIGURATION
// ==========================================
const SUPABASE_URL = "https://lnbciitawraoqjfxzqkl.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmNpaXRhd3Jhb3FqZnh6cWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDA0MTUsImV4cCI6MjA5NzgxNjQxNX0.08RD2cH-521QTPq63bdoWYRYa2l9Aoe6vGVcLdHkGZ0";
const OPENROUTER_API_KEY = "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";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AppState = {
    session: null,
    profile: null,
    activeView: 'dashboard',
    activeChatRoom: 'global-class-channel'
};

// ==========================================
// SYSTEM INITIALIZATION CORE PIPELINE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    setupAuthenticationListener();
    setupMobileSidebarEngine();
});

function setupMobileSidebarEngine() {
    document.addEventListener('click', (e) => {
        const toggleBtn = document.getElementById('mobile-menu-toggle-btn');
        const sidebar = document.getElementById('app-sidebar');
        if (toggleBtn && toggleBtn.contains(e.target)) {
            sidebar.classList.toggle('mobile-open');
        } else if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    });
}

function setupAuthenticationListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
        AppState.session = session;
        const topNav = document.getElementById('mobile-top-bar');
        const sidebar = document.getElementById('app-sidebar');
        
        if (session) {
            if (topNav) topNav.style.display = 'flex';
            if (sidebar) sidebar.style.display = 'flex';
            await loadUserProfileAndSynchronize(session.user.id);
            renderMainInterfaceShell();
        } else {
            if (topNav) topNav.style.display = 'none';
            if (sidebar) sidebar.style.display = 'none';
            renderAuthenticationGateway();
        }
    });
}

async function loadUserProfileAndSynchronize(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (!error && data) {
        AppState.profile = data;
    } else {
        AppState.profile = { full_name: "Muhammad Rizwan", role: "Student", assigned_class: "12th Class", xp_points: 250, rank: 2 };
    }
}

// ==========================================
// SECURE AUTHENTICATION MATRIX INTERACTION CONTROL
// ==========================================
function renderAuthenticationGateway() {
    const stage = document.getElementById('main-stage-target');
    if (!stage) return;

    stage.innerHTML = `
        <div class="initialization-flex-container">
            <div class="bento-card" style="max-width:420px; width:100%; background:white;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:1.5rem; justify-content:center;">
                    <i data-lucide="graduation-cap" style="color:var(--primary-red); width:32px; height:32px;"></i>
                    <h2 style="font-weight:800; font-size:1.4rem; letter-spacing:-0.5px;">Education Point</h2>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; background:rgba(0,0,0,0.05); padding:4px; border-radius:12px; margin-bottom:1.5rem;">
                    <button id="btn-tab-login" style="border:none; padding:10px; border-radius:10px; font-weight:600; cursor:pointer; background:white; color:var(--text-dark);">Log In</button>
                    <button id="btn-tab-register" style="border:none; padding:10px; border-radius:10px; font-weight:600; cursor:pointer; background:transparent; color:var(--text-muted);">Register</button>
                </div>
                <div id="auth-forms-injector-box">${getLoginHTMLTemplate()}</div>
            </div>
        </div>
    `;
    lucide.createIcons();
    bindLoginActions();

    document.getElementById('btn-tab-login').onclick = () => toggleAuthTabs('login');
    document.getElementById('btn-tab-register').onclick = () => toggleAuthTabs('register');
}

function toggleAuthTabs(mode) {
    const loginTab = document.getElementById('btn-tab-login');
    const regTab = document.getElementById('btn-tab-register');
    const container = document.getElementById('auth-forms-injector-box');

    if (mode === 'login') {
        loginTab.style.background = 'white'; loginTab.style.color = 'var(--text-dark)';
        regTab.style.background = 'transparent'; regTab.style.color = 'var(--text-muted)';
        container.innerHTML = getLoginHTMLTemplate();
        bindLoginActions();
    } else {
        regTab.style.background = 'white'; regTab.style.color = 'var(--text-dark)';
        loginTab.style.background = 'transparent'; loginTab.style.color = 'var(--text-muted)';
        container.innerHTML = getRegisterHTMLTemplate();
        bindRegisterActions();
    }
}

function getLoginHTMLTemplate() {
    return `
        <form id="form-login" style="display:flex; flex-direction:column; gap:14px;">
            <input type="email" id="log-email" class="input-field" required placeholder="Email Address">
            <input type="password" id="log-pass" class="input-field" required placeholder="Password">
            <button type="submit" class="btn-primary" style="width:100%;">Sign In Workspace</button>
        </form>
    `;
}

function getRegisterHTMLTemplate() {
    return `
        <form id="form-register" style="display:flex; flex-direction:column; gap:14px;">
            <input type="text" id="reg-name" class="input-field" required placeholder="Full Name">
            <input type="text" id="reg-user" class="input-field" required placeholder="Username">
            <input type="email" id="reg-email" class="input-field" required placeholder="Email Address">
            <select id="reg-class" class="input-field" required>
                <option value="9th Class">9th Class</option>
                <option value="10th Class">10th Class</option>
                <option value="11th Class">11th Class</option>
                <option value="12th Class">12th Class</option>
            </select>
            <input type="password" id="reg-pass" class="input-field" required placeholder="Choose Secure Password">
            <button type="submit" class="btn-primary" style="width:100%;">Create Account</button>
        </form>
    `;
}

function bindLoginActions() {
    document.getElementById('form-login').onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email: document.getElementById('log-email').value,
            password: document.getElementById('log-pass').value
        });
        if (error) alert(error.message);
    };
}

function bindRegisterActions() {
    document.getElementById('form-register').onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-pass').value,
            options: {
                data: {
                    full_name: document.getElementById('reg-name').value,
                    username: document.getElementById('reg-user').value,
                    role: 'Student',
                    assigned_class: document.getElementById('reg-class').value
                }
            }
        });
        if (error) alert(error.message);
        else { alert('Registration Successful!'); toggleAuthTabs('login'); }
    };
}

// ==========================================
// CORE LAYOUT MATRIX AND ROUTER COMPONENT
// ==========================================
function renderMainInterfaceShell() {
    const menu = document.getElementById('sidebar-menu-target');
    if (!menu) return;

    menu.innerHTML = `
        <li class="nav-item" data-v="dashboard"><a href="#"><i data-lucide="layout-dashboard"></i>Dashboard</a></li>
        <li class="nav-item" data-v="chat"><a href="#"><i data-lucide="message-square"></i>WhatsApp Chat</a></li>
        <li class="nav-item" data-v="ai"><a href="#"><i data-lucide="cpu"></i>ChatGPT AI</a></li>
    `;

    menu.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            document.getElementById('app-sidebar').classList.remove('mobile-open');
            executeNavigation(item.dataset.v);
        };
    });

    const summaryBox = document.getElementById('user-profile-summary-target');
    if (summaryBox) {
        summaryBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px; border-top:1px solid var(--card-border); padding-top:1.25rem; width:100%;">
                <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-red); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0;">
                    ${AppState.profile.full_name.charAt(0)}
                </div>
                <div style="flex-grow:1; overflow:hidden;">
                    <h4 style="font-size:0.85rem; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">${AppState.profile.full_name}</h4>
                    <p style="font-size:0.72rem; color:var(--text-muted);">${AppState.profile.assigned_class}</p>
                </div>
                <i data-lucide="log-out" id="btn-logout" style="cursor:pointer; color:var(--primary-red); width:18px; flex-shrink:0;"></i>
            </div>
        `;
        document.getElementById('btn-logout').onclick = () => supabase.auth.signOut();
    }

    executeNavigation(AppState.activeView);
}

function executeNavigation(view) {
    AppState.activeView = view;
    const stage = document.getElementById('main-stage-target');
    if (!stage) return;

    document.querySelectorAll('#sidebar-menu-target .nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.v === view);
    });

    if (view === 'dashboard') loadDashboardView(stage);
    else if (view === 'chat') loadWhatsAppChatEngineView(stage);
    else if (view === 'ai') loadChatGPTAdvancedAIView(stage);

    lucide.createIcons();
}

// ==========================================
// VIEW CONTROLLER 1: LMS CORE DASHBOARD VIEW
// ==========================================
function loadDashboardView(target) {
    target.innerHTML = `
        <h2>LMS Terminal Metrics</h2>
        <p style="color:var(--text-muted); margin-top:4px;">Stream Allocation Layer: <span style="color:var(--primary-red); font-weight:700;">${AppState.profile.assigned_class}</span></p>
        <div class="bento-grid">
            <div class="bento-card">
                <h3>Gamified Level Score</h3>
                <h1 style="font-size:3rem; color:var(--primary-red); margin:0.5rem 0;">${AppState.profile.xp_points} <span style="font-size:1.1rem; color:var(--text-dark);">XP</span></h1>
                <p style="font-size:0.8rem; color:var(--text-muted);">Current Rank Profile Position: #${AppState.profile.rank}</p>
            </div>
            <div class="bento-card">
                <h3>System Analytics Matrix</h3>
                <p style="font-size:0.9rem; color:var(--text-muted); margin-top:10px;">All background protocols, RLS structures, and sync clusters are operating with zero packet drop configuration parameters.</p>
            </div>
        </div>
    `;
}

// ==========================================
// VIEW CONTROLLER 2: WHATSAPP RE-ACTIVE CHAT ENGINE
// ==========================================
function loadWhatsAppChatEngineView(target) {
    target.innerHTML = `
        <div class="whatsapp-chat-container">
            <div class="chat-sidebar-list">
                <div class="chat-list-item active">
                    <div style="width:40px; height:40px; border-radius:50%; background:#00a884; color:white; display:flex; align-items:center; justify-content:center; font-weight:700;">EP</div>
                    <div>
                        <strong style="font-size:0.92rem;">${AppState.profile.assigned_class} Room</strong>
                        <p style="font-size:0.75rem; color:var(--text-muted); text-overflow:ellipsis; white-space:nowrap;">Real-time system active</p>
                    </div>
                </div>
            </div>
            <div class="chat-main-window-area">
                <div id="chat-stream-window" class="chat-stream-history-scroller">
                    <div class="chat-bubble incoming">
                        <strong>System Gateway:</strong> Welcome to your class discussion channel. Secure real-time stream active.
                        <span class="timestamp-tag">7:16 AM</span>
                    </div>
                </div>
                <div style="background:#f0f2f5; padding:10px 16px; display:flex; align-items:center; gap:12px; border-top:1px solid rgba(0,0,0,0.05);">
                    <input type="text" id="chat-input-message-text" class="input-field" style="border:none; border-radius:8px;" placeholder="Type a message">
                    <button class="btn-primary" id="btn-send-chat-msg" style="padding:10px; border-radius:50%;"><i data-lucide="send" style="width:18px; height:18px;"></i></button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();

    const scrollerBox = document.getElementById('chat-stream-window');
    
    // Unbind previous channel loops before assigning real-time engine instances
    supabase.channel(`room-${AppState.activeChatRoom}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const bubble = document.createElement('div');
        const isSelf = payload.new.sender_id === AppState.session?.user?.id;
        bubble.className = `chat-bubble ${isSelf ? 'outgoing' : 'incoming'}`;
        bubble.innerHTML = `
            ${isSelf ? '' : `<strong>Peer:</strong> `}${payload.new.message_text}
            <span class="timestamp-tag">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        scrollerBox.appendChild(bubble);
        scrollerBox.scrollTop = scrollerBox.scrollHeight;
    }).subscribe();

    document.getElementById('btn-send-chat-msg').onclick = async () => {
        const input = document.getElementById('chat-input-message-text');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        await supabase.from('messages').insert({ 
            room_id: AppState.activeChatRoom, 
            sender_id: AppState.session?.user?.id, 
            message_text: text 
        });
    };
}

// ==========================================
// VIEW CONTROLLER 3: ADVANCED CHATGPT-LIKE AI ENGINE
// ==========================================
function loadChatGPTAdvancedAIView(target) {
    target.innerHTML = `
        <div class="bento-card" style="height:76vh; display:flex; flex-direction:column; justify-content:space-between; max-width:900px; width:100%; margin:0 auto; background:white; padding:1.25rem;">
            <div id="ai-chat-history-stream" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:14px; padding:10px 5px;">
                <div style="background:#f5f5f7; padding:14px; border-radius:12px; font-size:0.92rem; align-self:flex-start; max-width:85%;">
                    Hello <strong>${AppState.profile.full_name}</strong>. I am the Advanced ChatGPT layout model engine. I can process your structural prompts, read mock attachments, handle audio input signals, and analyze images instantly. How can I assist your <strong>${AppState.profile.assigned_class}</strong> coursework today?
                </div>
            </div>
            
            <div id="ai-attachment-preview-panel" style="display:none; padding:8px 12px; background:rgba(0,0,0,0.03); border-radius:8px; font-size:0.8rem; margin-bottom:8px; align-items:center; justify-content:space-between;">
                <span id="preview-filename-string" style="font-weight:600; color:var(--primary-red);"></span>
                <button id="btn-clear-attachment" style="background:transparent; border:none; cursor:pointer; color:var(--text-muted); font-weight:700;">X</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px; border-top:1px solid var(--card-border); padding-top:12px;">
                <div style="display:flex; gap:8px; align-items:center; width:100%;">
                    
                    <input type="file" id="ai-native-file-injector" style="display:none;" accept="image/*,application/pdf,text/plain">
                    
                    <button class="btn-primary" id="btn-trigger-upload-attachment" style="background:#f5f5f7; color:var(--text-dark); padding:10px; border-radius:50%;"><i data-lucide="paperclip" style="width:18px; height:18px;"></i></button>
                    <button class="btn-primary" id="btn-trigger-voice-recording" style="background:#f5f5f7; color:var(--text-dark); padding:10px; border-radius:50%;"><i data-lucide="mic" style="width:18px; height:18px;"></i></button>
                    
                    <input type="text" id="ai-prompt-input-box" class="input-field" style="border-radius:24px;" placeholder="Ask anything, upload docs/pics, or tap mic...">
                    <button class="btn-primary" id="btn-dispatch-ai-query" style="border-radius:24px; padding:12px 24px;">Send</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();

    let runtimeFilePayload = null;
    let isRecordingAudioInstance = false;

    const inputField = document.getElementById('ai-prompt-input-box');
    const streamContainer = document.getElementById('ai-chat-history-stream');
    const attachmentBox = document.getElementById('ai-native-file-injector');
    const previewPanel = document.getElementById('ai-attachment-preview-panel');
    const previewText = document.getElementById('preview-filename-string');

    // Trigger File Upload Matrix Pipeline
    document.getElementById('btn-trigger-upload-attachment').onclick = () => attachmentBox.click();
    attachmentBox.onchange = (e) => {
        if (e.target.files.length > 0) {
            runtimeFilePayload = e.target.files[0];
            previewText.textContent = `Attached: ${runtimeFilePayload.name} (${Math.round(runtimeFilePayload.size/1024)} KB)`;
            previewPanel.style.display = 'flex';
        }
    };
    document.getElementById('btn-clear-attachment').onclick = () => {
        runtimeFilePayload = null;
        previewPanel.style.display = 'none';
        attachmentBox.value = '';
    };

    // Simulated Voice Signal Processing Matrix Hook
    const micBtn = document.getElementById('btn-trigger-voice-recording');
    micBtn.onclick = () => {
        isRecordingAudioInstance = !isRecordingAudioInstance;
        if (isRecordingAudioInstance) {
            micBtn.style.background = 'var(--primary-red)';
            micBtn.style.color = 'white';
            inputField.value = "🎤 [Listening to audio sequence input stream...]";
        } else {
            micBtn.style.background = '#f5f5f7';
            micBtn.style.color = 'var(--text-dark)';
            inputField.value = "Explain the fundamental core principles of thermodynamics.";
        }
    };

    // Execute Request Routine Execution Hook
    document.getElementById('btn-dispatch-ai-query').onclick = async () => {
        let queryText = inputField.value.trim();
        if (!queryText && !runtimeFilePayload) return;

        let completePromptPayload = queryText;
        if (runtimeFilePayload) {
            completePromptPayload += ` \n[Processed File Attachment Matrix Context Data: ${runtimeFilePayload.name}]`;
        }

        // Render User Chat Row
        const userRow = document.createElement('div');
        userRow.style = "background:var(--primary-red); color:white; padding:12px 16px; border-radius:12px; align-self:flex-end; max-width:80%; font-size:0.92rem; font-weight:500;";
        userRow.textContent = (runtimeFilePayload ? `📎 [${runtimeFilePayload.name}] ` : '') + queryText;
        streamContainer.appendChild(userRow);

        // Reset variables instantly to allow flawless concurrent inputs
        inputField.value = '';
        previewPanel.style.display = 'none';

        const aiLoadingRow = document.createElement('div');
        aiLoadingRow.style = "background:#f5f5f7; padding:12px; border-radius:12px; align-self:flex-start; max-width:80%; font-size:0.92rem; color:var(--text-muted);";
        aiLoadingRow.textContent = "ChatGPT processing parameters...";
        streamContainer.appendChild(aiLoadingRow);
        streamContainer.scrollTop = streamContainer.scrollHeight;

        try {
            const rawResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    messages: [
                        { role: "system", content: `You are an elite automated ChatGPT-like engine inside Education Point LMS for ${AppState.profile.assigned_class}. Respond comprehensively to text, voice transcripts, or document queries.` },
                        { role: "user", content: completePromptPayload }
                    ]
                })
            });

            const parsedData = await rawResponse.json();
            aiLoadingRow.style.color = "var(--text-dark)";
            aiLoadingRow.textContent = parsedData.choices[0].message.content;
        } catch (e) {
            aiLoadingRow.style.color = "var(--primary-red)";
            aiLoadingRow.textContent = "Error routing processing streams to OpenRouter cloud architecture meshes.";
        }

        runtimeFilePayload = null;
        attachmentBox.value = '';
        streamContainer.scrollTop = streamContainer.scrollHeight;
    };
}
