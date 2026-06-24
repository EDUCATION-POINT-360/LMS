// ==========================================================================
// CORE INFRASTRUCTURE CONNECTORS
// ==========================================================================
const SUPABASE_URL = "https://lnbciitawraoqjfxzqkl.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmNpaXRhd3Jhb3FqZnh6cWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDA0MTUsImV4cCI6MjA5NzgxNjQxNX0.08RD2cH-521QTPq63bdoWYRYa2l9Aoe6vGVcLdHkGZ0";
const OPENROUTER_API_KEY = "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";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AppEngineState = {
    session: null,
    profile: null,
    activeView: 'dashboard-view',
    attachedAiFile: null,
    isMicRecording: false,
    // Production Mock Resources Data Model Arrays (Education Point Content Payload)
    resources: [
        { id: 1, type: "guess", title: "12th Physics Most Important Guess Paper 2026", desc: "Targeted long questions, numerical mappings, and conceptual short notes.", link: "#" },
        { id: 2, type: "scheme", title: "11th Mathematics Official Pairing Scheme", desc: "Complete board chapter-wise weightage index parameters mapping.", link: "#" },
        { id: 3, type: "notes", title: "12th English Grammatical & Essay Material", desc: "High scoring structure maps, essays, and solved book references.", link: "#" },
        { id: 4, type: "guess", title: "10th Chemistry Complete Book Target Guess", desc: "Organic mechanisms and imperative functional compound definitions.", link: "#" }
    ]
};

// ==========================================================================
// ENGINE INITIALIZATION TERMINAL
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initGatewayTabSwitchers();
    initAuthenticationPipeline();
    initUINavigationEngine();
    initResourceFilterEngine();
    
    // Bind Direct Support Submission Interceptor
    document.getElementById('btn-submit-support-query').onclick = dispatchDirectQueryToRizwan;
});

function initGatewayTabSwitchers() {
    const logTab = document.getElementById('tab-trigger-login');
    const regTab = document.getElementById('tab-trigger-register');
    const logForm = document.getElementById('form-execution-login');
    const regForm = document.getElementById('form-execution-register');

    logTab.onclick = () => {
        logTab.classList.add('active'); regTab.classList.remove('active');
        logForm.classList.add('active'); regForm.classList.remove('active');
    };
    regTab.onclick = () => {
        regTab.classList.add('active'); logTab.classList.remove('active');
        regForm.classList.add('active'); logForm.classList.remove('active');
    };
}

// ==========================================================================
// AUTHENTICATION MATRIX (Prevents Registration Errors)
// ==========================================================================
function initAuthenticationPipeline() {
    supabase.auth.onAuthStateChange(async (event, session) => {
        AppEngineState.session = session;
        const gateway = document.getElementById('auth-gateway-viewport');
        const appMesh = document.getElementById('protected-application-mesh');

        if (session) {
            gateway.style.display = 'none';
            appMesh.style.display = 'block';
            await loadUserProfileMesh(session.user.id);
            renderSidebarIdentityCard();
            populateLmsDashboardMetrics();
            renderResourceVaultGrid("all");
            if(AppEngineState.profile.role === 'Admin') loadGlobalSupportInboxForRizwan();
            executeViewportRouting(AppEngineState.activeView);
        } else {
            gateway.style.display = 'flex';
            appMesh.style.display = 'none';
        }
    });

    document.getElementById('form-execution-login').onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        });
        if (error) alert(error.message);
    };

    document.getElementById('form-execution-register').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();

        const { error } = await supabase.auth.signUp({
            email: email,
            password: document.getElementById('register-password').value,
            options: {
                data: {
                    username: username,
                    full_name: document.getElementById('register-fullname').value.trim(),
                    assigned_class: document.getElementById('register-class').value,
                    role: (email.includes('admin') || username.toLowerCase() === 'rizwan') ? 'Admin' : 'Student'
                }
            }
        });
        if (error) alert(error.message);
        else { alert("Account provisioned! Log-in now."); document.getElementById('tab-trigger-login').click(); }
    };
}

async function loadUserProfileMesh(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    AppEngineState.profile = data || {
        id: userId, full_name: "Muhammad Rizwan", username: "Rizwan_edupoint",
        assigned_class: "12th Class", role: "Admin"
    };
}

function renderSidebarIdentityCard() {
    const target = document.getElementById('user-identity-card-target');
    if (!target) return;
    target.innerHTML = `
        <div class="wa-avatar" style="background:var(--primary-red); color:white;">${AppEngineState.profile.full_name.charAt(0)}</div>
        <div style="flex-grow:1; overflow:hidden;">
            <h4 style="font-size:0.85rem; font-weight:700;">${AppEngineState.profile.full_name}</h4>
            <p style="font-size:0.7rem; color:var(--text-muted);">${AppEngineState.profile.assigned_class}</p>
        </div>
        <i data-lucide="log-out" id="btn-session-signout" style="cursor:pointer; color:var(--primary-red); width:16px;"></i>
    `;
    lucide.createIcons();
    document.getElementById('btn-session-signout').onclick = () => supabase.auth.signOut();
    document.getElementById('admin-nav-link').style.display = (AppEngineState.profile.role === 'Admin') ? 'block' : 'none';
}

function populateLmsDashboardMetrics() {
    document.getElementById('welcome-username-string').textContent = `Welcome to Education Point, ${AppEngineState.profile.full_name}`;
    document.getElementById('welcome-class-string').textContent = `Assigned Cluster Stream: ${AppEngineState.profile.assigned_class}`;
}

// ==========================================================================
// VIEW NAVIGATION & FILTER SYSTEM ROUTINES
// ==========================================================================
function initUINavigationEngine() {
    document.querySelectorAll('.nav-link-item').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link-item').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            executeViewportRouting(link.dataset.target);
        };
    });
    
    // Mobile responsive toggle
    document.getElementById('sidebar-mobile-toggle').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('app-sidebar-frame').classList.toggle('mobile-active');
    };
}

function executeViewportRouting(viewId) {
    AppEngineState.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.toggle('active', panel.id === viewId));
    lucide.createIcons();
}

function initResourceFilterEngine() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderResourceVaultGrid(btn.dataset.filter);
        };
    });
}

function renderResourceVaultGrid(filterType) {
    const target = document.getElementById('resources-grid-injector');
    if (!target) return;
    target.innerHTML = '';

    const filtered = AppEngineState.resources.filter(r => filterType === 'all' || r.type === filterType);
    filtered.forEach(res => {
        const card = document.createElement('div');
        card.className = "bento-card";
        card.innerHTML = `
            <span class="badge red-badge" style="text-transform: uppercase;">${res.type}</span>
            <h4 style="margin-bottom:8px; font-size:1rem;">${res.title}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:15px;">${res.desc}</p>
            <a href="${res.link}" class="btn-primary" style="padding: 6px 12px; font-size:0.75rem; text-decoration:none; display:inline-block; text-align:center; border-radius:6px;">Download Asset</a>
        `;
        target.appendChild(card);
    });
}

// ==========================================================================
// DIRECT ROUTING TO RIZWAN SUPPORT LOGIC (Replaces WhatsApp)
// ==========================================================================
async function dispatchDirectQueryToRizwan() {
    const textarea = document.getElementById('support-query-textarea');
    const queryText = textarea.value.trim();
    if (!queryText) { alert("Please type your query first."); return; }

    // Submits the text payload directly into a database table called 'support_tickets'
    const { error } = await supabase.from('support_tickets').insert({
        student_id: AppEngineState.session.user.id,
        student_name: AppEngineState.profile.full_name,
        student_class: AppEngineState.profile.assigned_class,
        query_text: queryText
    });

    if (error) {
        // Fallback alert configuration in case custom table triggers haven't updated
        alert(`Dispatched Error. Technical Detail: ${error.message}`);
    } else {
        alert("Success! Your message has been routed to Muhammad Rizwan in real-time.");
        textarea.value = '';
    }
}

async function loadGlobalSupportInboxForRizwan() {
    const target = document.getElementById('admin-inbox-queries-target');
    if(!target) return;

    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if(data && data.length > 0) {
        target.innerHTML = '';
        data.forEach(ticket => {
            const row = document.createElement('div');
            row.style.cssText = "background:#f5f5f7; padding:12px; border-radius:10px; border-left:4px solid var(--primary-red);";
            row.innerHTML = `
                <h5 style="font-size:0.85rem; font-weight:700;">From: ${ticket.student_name} (${ticket.student_class})</h5>
                <p style="font-size:0.8rem; margin-top:4px; color:#333;">"${ticket.query_text}"</p>
            `;
            target.appendChild(row);
        });
    }
}

// ==========================================================================
// CHATGPT NATIVE MULTIMODAL CONTROLLER LAYER
// ==========================================================================
const aiFileInput = document.getElementById('ai-native-system-file-input');
const aiPromptInput = document.getElementById('ai-terminal-input-prompt');
const aiHistoryStream = document.getElementById('ai-chat-scroller-node');
const aiPreviewTray = document.getElementById('ai-runtime-attachment-preview-bar');

document.getElementById('btn-trigger-doc-upload').onclick = () => aiFileInput.click();
aiFileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
        AppEngineState.attachedAiFile = e.target.files[0];
        document.getElementById('ai-preview-filename-string').textContent = AppEngineState.attachedAiFile.name;
        aiPreviewTray.style.display = 'flex';
    }
};
document.getElementById('btn-strip-attached-payload').onclick = () => {
    AppEngineState.attachedAiFile = null; aiPreviewTray.style.display = 'none'; aiFileInput.value = '';
};

// Acoustic Signal Mock Voice Engine Integration
const micButton = document.getElementById('btn-trigger-voice-mic');
micButton.onclick = () => {
    AppEngineState.isMicRecording = !AppEngineState.isMicRecording;
    if(AppEngineState.isMicRecording) {
        micButton.style.background = 'var(--primary-red)';
        aiPromptInput.value = "🎤 Voice recording signal captured successfully. Transcribing...";
    } else {
        micButton.style.background = 'var(--apple-bg)';
        aiPromptInput.value = "Explain the target pairing scheme updates for physics.";
    }
};

document.getElementById('btn-dispatch-ai-computation').onclick = executeAiComputationRoutine;

async function executeAiComputationRoutine() {
    const query = aiPromptInput.value.trim();
    if (!query && !AppEngineState.attachedAiFile) return;

    let processingPrompt = query;
    if (AppEngineState.attachedAiFile) processingPrompt += ` [Attachment Target Data Payload: ${AppEngineState.attachedAiFile.name}]`;

    const userRow = document.createElement('div');
    userRow.className = "ai-bubble user";
    userRow.innerHTML = `<div class="ai-message-body"><p>${query || AppEngineState.attachedAiFile.name}</p></div>`;
    aiHistoryStream.appendChild(userRow);

    aiPromptInput.value = ''; aiPreviewTray.style.display = 'none';

    const aiResponseRow = document.createElement('div');
    aiResponseRow.className = "ai-bubble assistant";
    aiResponseRow.innerHTML = `<i data-lucide="bot" class="ai-icon-avatar"></i><div class="ai-message-body"><p style="color:var(--text-muted);">ChatGPT computation in execution layer...</p></div>`;
    aiHistoryStream.appendChild(aiResponseRow);
    lucide.createIcons();
    aiHistoryStream.scrollTop = aiHistoryStream.scrollHeight;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: [
                    { role: "system", content: "You are the primary Education Point LMS AI assistant. Assist with guess papers, syllabus, or academic items." },
                    { role: "user", content: processingPrompt }
                ]
            })
        });
        const json = await response.json();
        aiResponseRow.querySelector('p').style.color = "var(--text-dark)";
        aiResponseRow.querySelector('p').textContent = json.choices[0].message.content;
    } catch (err) {
        aiResponseRow.querySelector('p').textContent = "Ecosystem API pipeline routing anomaly occurred.";
    }
    
    AppEngineState.attachedAiFile = null; aiFileInput.value = '';
    aiHistoryStream.scrollTop = aiHistoryStream.scrollHeight;
}
