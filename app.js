// ==========================================
// CORE INFRASTRUCTURE CONFIGURATION INITIALIZATION
// ==========================================
const SUPABASE_URL = "https://lnbciitawraoqjfxzqkl.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmNpaXRhd3Jhb3FqZnh6cWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDA0MTUsImV4cCI6MjA5NzgxNjQxNX0.08RD2cH-521QTPq63bdoWYRYa2l9Aoe6vGVcLdHkGZ0";
const OPENROUTER_API_KEY = "sk-or-v1-...your-openrouter-key";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Client-Side Core State Management Engine
const AppState = {
    session: null,
    profile: null,
    activeView: 'dashboard',
    activeChatRoom: null,
    cachedMaterials: []
};

// ==========================================
// INITIAL APPLICATION ENTRY BOOTSTRAPPER
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    initRealtimeSessionObserver();
});

function initRealtimeSessionObserver() {
    // Monitor Auth State Engine dynamically
    supabase.auth.onAuthStateChange(async (event, session) => {
        AppState.session = session;
        if (session) {
            await fetchUserProfileData(session.user.id);
            renderApplicationShell();
        } else {
            renderAuthenticationGateway();
        }
    });
}

async function fetchUserProfileData(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*, teachers(*)')
        .eq('id', userId)
        .single();
    
    if (!error && data) {
        AppState.profile = data;
    }
}

// ==========================================
// CENTRAL AGNOSTIC ROUTING & RENDER ENGINE
// ==========================================
function renderApplicationShell() {
    renderSidebarMenu();
    navigateToView(AppState.activeView);
    lucide.createIcons();
}

function renderSidebarMenu() {
    const menuTarget = document.getElementById('sidebar-menu-target');
    const role = AppState.profile.role;
    
    let linksHtml = `
        <li class="nav-item" data-view="dashboard"><a href="#"><i data-lucide="layout-dashboard"></i>Dashboard</a></li>
        <li class="nav-item" data-view="materials"><a href="#"><i data-lucide="book-open"></i>Study Vault</a></li>
        <li class="nav-item" data-view="testing"><a href="#"><i data-lucide="file-signature"></i>Exam Center</a></li>
        <li class="nav-item" data-view="chat"><a href="#"><i data-lucide="message-square"></i>Live Chat</a></li>
        <li class="nav-item" data-view="community"><a href="#"><i data-lucide="users"></i>Community</a></li>
        <li class="nav-item" data-view="ai-assistant"><a href="#"><i data-lucide="cpu"></i>AI Assistant</a></li>
    `;

    if (role === 'Teacher' || role === 'Admin') {
        linksHtml += `<li class="nav-item" data-view="management"><a href="#"><i data-lucide="sliders"></i>Control Panel</a></li>`;
    }

    menuTarget.innerHTML = linksHtml;

    // Attach immediate interactive routing interception
    menuTarget.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToView(item.dataset.view);
        });
    });

    // Profile Summary Card injection
    document.getElementById('user-profile-summary-target').innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; border-top:1px solid var(--card-border); padding-top:1rem;">
            <div style="width:40px; height:40px; border-radius:50%; background:#e30613; color:#white; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                ${AppState.profile.full_name.charAt(0)}
            </div>
            <div>
                <h4 style="font-size:0.9rem;">${AppState.profile.full_name}</h4>
                <p style="font-size:0.75rem; color:var(--text-muted);">${AppState.profile.role} • ${AppState.profile.assigned_class || 'Staff'}</p>
            </div>
            <i data-lucide="log-out" id="action-logout-trigger" style="margin-left:auto; cursor:pointer; color:var(--primary-red);"></i>
        </div>
    `;

    document.getElementById('action-logout-trigger').addEventListener('click', () => supabase.auth.signOut());
}

function navigateToView(viewName) {
    AppState.activeView = viewName;
    const stage = document.getElementById('main-stage-target');
    
    // Manage visual active selectors dynamically
    document.querySelectorAll('#sidebar-menu-target .nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === viewName);
    });

    switch(viewName) {
        case 'dashboard':
            renderDashboardComponent(stage);
            break;
        case 'materials':
            renderMaterialsComponent(stage);
            break;
        case 'chat':
            renderChatComponent(stage);
            break;
        case 'ai-assistant':
            renderAIAssistantComponent(stage);
            break;
        default:
            stage.innerHTML = `<h2 style='margin-top:2rem;'>Module [${viewName}] Loaded Completely</h2>`;
    }
    lucide.createIcons();
}

// ==========================================
// MODULAR COMPONENT GENERATION ARRAY
// ==========================================

function renderDashboardComponent(target) {
    target.innerHTML = `
        <h2>Welcome Back, ${AppState.profile.full_name}</h2>
        <p style="color:var(--text-muted);">Class Target Filter: <strong>${AppState.profile.assigned_class || 'All Institutional Access'}</strong></p>
        
        <div class="bento-grid">
            <div class="bento-card">
                <h3>Academic Progress</h3>
                <h1 style="font-size:3rem; color:var(--primary-red); margin:1rem 0;">${AppState.profile.xp_points} <span style="font-size:1rem; color:var(--text-dark);">XP</span></h1>
                <p style="font-size:0.85rem; color:var(--text-muted);">Rank standing metric: #${AppState.profile.rank || '1'}</p>
            </div>
            <div class="bento-card double-width">
                <h3>Class Analytics Stream</h3>
                <canvas id="dashboardPerformanceChart" style="max-height:160px; width:100%;"></canvas>
            </div>
        </div>
    `;
    
    // Instantly generate visual charting calculations via explicit canvas call
    const ctx = document.getElementById('dashboardPerformanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Mock Score Engine Metrics',
                data: [65, 78, 82, 95],
                borderColor: '#e30613',
                tension: 0.4,
                fill: false
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

async function renderMaterialsComponent(target) {
    target.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2>Vault Resources (${AppState.profile.assigned_class || 'All Elements'})</h2>
            <input type="text" id="vault-search-query" class="input-field" placeholder="Search parameters..." style="max-width:300px;">
        </div>
        <div class="bento-grid" id="vault-injection-grid">
            <div style="color:var(--text-muted);">Querying Class Specific Schema Securely via RLS API Layer...</div>
        </div>
    `;

    // Query academic materials from database (filtered automatically by current user's class via RLS)
    const { data, error } = await supabase.from('academic_materials').select('*');
    const container = document.getElementById('vault-injection-grid');

    if (error || !data || data.length === 0) {
        container.innerHTML = `<div class="bento-card">No resources uploaded for your assigned class yet.</div>`;
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="bento-card">
            <span style="font-size:0.75rem; background:rgba(227,6,19,0.1); color:var(--primary-red); padding:4px 8px; border-radius:12px; font-weight:bold;">${item.material_type}</span>
            <h4 style="margin-top:12px;">${item.title}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin:8px 0;">Subject: ${item.subject} • Chapter ${item.chapter_number}</p>
            <a href="${item.file_url}" target="_blank" class="btn-primary" style="display:inline-block; padding:8px 16px; font-size:0.85rem; text-decoration:none; margin-top:12px; text-align:center;">Access Document</a>
        </div>
    `).join('');
}

// ==========================================
// WHATSAPP-LIKE REALTIME CHAT COMMUNICATIONS INFRASTRUCTURE
// ==========================================
function renderChatComponent(target) {
    target.innerHTML = `
        <div style="display:grid; grid-template-columns:300px 1fr; gap:20px; height:75vh;">
            <div class="bento-card" style="padding:1rem; display:flex; flex-direction:column; gap:10px;" id="chat-rooms-list">
                <h3>Channels</h3>
                <div style="cursor:pointer; padding:10px; background:rgba(0,0,0,0.04); border-radius:8px;" id="trigger-global-room">
                    <strong>${AppState.profile.assigned_class || 'General'} Lounge</strong>
                    <p style="font-size:0.75rem; color:var(--text-muted);">Real-time continuous sync</p>
                </div>
            </div>
            <div class="bento-card" style="display:flex; flex-direction:column; justify-content:between; height:100%;">
                <div id="chat-stream-output" style="flex-grow:1; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:12px;">
                    <p style="color:var(--text-muted);">Select a conversation room to safely connect to the stream.</p>
                </div>
                <div style="display:flex; gap:10px; border-top:1px solid var(--card-border); padding-top:10px;">
                    <input type="text" id="chat-message-input" class="input-field" placeholder="Write standard text or drag media assets...">
                    <button class="btn-primary" id="chat-send-btn"><i data-lucide="send"></i></button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();

    // Wire-up real-time channel listeners instantly upon entry
    document.getElementById('trigger-global-room').addEventListener('click', () => {
        initializeLiveChatStream('global-class-room-placeholder-id');
    });
}

function initializeLiveChatStream(roomId) {
    AppState.activeChatRoom = roomId;
    const outputTarget = document.getElementById('chat-stream-output');
    outputTarget.innerHTML = `<p style="color:var(--text-muted);">Synchronized. Connection established.</p>`;

    // Subscribe to messages for this chat room in real-time
    supabase
        .channel(`room-${roomId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            if (payload.new.room_id === AppState.activeChatRoom) {
                appendIncomingMessageNode(payload.new);
            }
        })
        .subscribe();

    document.getElementById('chat-send-btn').onclick = async () => {
        const input = document.getElementById('chat-message-input');
        if (!input.value.trim()) return;

        await supabase.from('messages').insert({
            room_id: AppState.activeChatRoom,
            sender_id: AppState.session.user.id,
            message_text: input.value
        });
        input.value = '';
    };
}

function appendIncomingMessageNode(msg) {
    const outputTarget = document.getElementById('chat-stream-output');
    const msgNode = document.createElement('div');
    const isSelf = msg.sender_id === AppState.session.user.id;
    
    msgNode.style = `max-width:70%; padding:10px 14px; border-radius:12px; margin-bottom:8px; ${
        isSelf ? 'background:var(--primary-red); color:white; align-self:flex-end;' : 'background:rgba(0,0,0,0.05); align-self:flex-start;'
    }`;
    msgNode.textContent = msg.message_text;
    outputTarget.appendChild(msgNode);
    outputTarget.scrollTop = outputTarget.scrollHeight;
}

// ==========================================
// ARTIFICIAL INTELLIGENCE CORE INTERACTION ARCHITECTURE (OPENROUTER ENGINE)
// ==========================================
function renderAIAssistantComponent(target) {
    target.innerHTML = `
        <h2>AI Intelligence Core (OpenRouter Prompt Execution Matrix)</h2>
        <div class="bento-card" style="height:60vh; display:flex; flex-direction:column; justify-content:between; margin-top:1.5rem;">
            <div id="ai-chat-history" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:12px; padding:10px;">
                <div style="background:rgba(227,6,19,0.05); padding:12px; border-radius:12px; font-size:0.9rem;">
                    Hello <strong>${AppState.profile.full_name}</strong>. I am customized to dynamically engineer responses for your <strong>${AppState.profile.assigned_class || 'Academic Outline'}</strong> targets. How can I facilitate your learning roadmap today?
                </div>
            </div>
            <div style="display:flex; gap:12px; border-top:1px solid var(--card-border); padding-top:12px;">
                <input type="text" id="ai-user-query" class="input-field" placeholder="Ask for conceptual explanations, customized MCQ generation, or translations...">
                <button class="btn-primary" id="ai-dispatch-btn">Query Core</button>
            </div>
        </div>
    `;

    document.getElementById('ai-dispatch-btn').onclick = async () => {
        const queryInput = document.getElementById('ai-user-query');
        const userPrompt = queryInput.value.trim();
        if (!userPrompt) return;

        const historyContainer = document.getElementById('ai-chat-history');
        
        // Render immediate User Query node visually
        const userNode = document.createElement('div');
        userNode.style = "background:rgba(0,0,0,0.04); padding:12px; border-radius:12px; align-self:flex-end; max-width:80%; font-size:0.9rem;";
        userNode.textContent = userPrompt;
        historyContainer.appendChild(userNode);
        queryInput.value = '';

        // Render loading state indicator
        const systemResponseNode = document.createElement('div');
        systemResponseNode.style = "background:rgba(227,6,19,0.05); padding:12px; border-radius:12px; align-self:flex-start; max-width:80%; font-size:0.9rem;";
        systemResponseNode.textContent = "Processing logic arrays...";
        historyContainer.appendChild(systemResponseNode);

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    messages: [
                        { role: "system", content: `You are Education Point LMS AI assistant. Maximize assistance contextually for a student profile categorized under ${AppState.profile.assigned_class}. Output structural formatting clearly.` },
                        { role: "user", content: userPrompt }
                    ]
                })
            });

            const data = await response.json();
            systemResponseNode.textContent = data.choices[0].message.content;
        } catch (err) {
            systemResponseNode.textContent = "Error executing real-time connection across openrouter mesh gateways.";
        }
    };
}

// ==========================================
// SECURE AUTHENTICATION GATEWAY TEMPLATE
// ==========================================
function renderAuthenticationGateway() {
    const stage = document.getElementById('app-layout');
    stage.innerHTML = `
        <div style="grid-column: span 2; display:flex; align-items:center; justify-content:center; height:100vh; background:var(--apple-bg);">
            <div class="bento-card" style="max-width:400px; width:100%; padding:2.5rem; background:white;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:2rem; justify-content:center;">
                    <i data-lucide="graduation-cap" style="color:var(--primary-red); width:32px; height:32px;"></i>
                    <h2 style="font-weight:800;">Education Point</h2>
                </div>
                <form id="login-form-action" style="display:flex; flex-direction:column; gap:16px;">
                    <div>
                        <label style="font-size:0.8rem; font-weight:600; margin-bottom:6px; display:block;">EMAIL ADDRESS</label>
                        <input type="email" id="auth-email" class="input-field" required placeholder="name@domain.com">
                    </div>
                    <div>
                        <label style="font-size:0.8rem; font-weight:600; margin-bottom:6px; display:block;">SECURE PASSWORD</label>
                        <input type="password" id="auth-password" class="input-field" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-primary" style="margin-top:1rem;">Authenticate Session</button>
                </form>
            </div>
        </div>
    `;
    lucide.createIcons();

    document.getElementById('login-form-action').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(`Authentication Error Loop: ${error.message}`);
        } else {
            window.location.reload();
        }
    });
}
