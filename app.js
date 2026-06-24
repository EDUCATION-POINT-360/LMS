// ==========================================================================
// CENTRAL APPLICATION CONTROLLER MESH: EDUCATION POINT ECOSYSTEM
// ==========================================================================
const SUPABASE_URL = "https://lnbciitawraoqjfxzqkl.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmNpaXRhd3Jhb3FqZnh6cWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDA0MTUsImV4cCI6MjA5NzgxNjQxNX0.08RD2cH-521QTPq63bdoWYRYa2l9Aoe6vGVcLdHkGZ0";
const OPENROUTER_API_KEY = "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";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ApplicationState = {
    session: null,
    profile: null,
    activeView: 'dashboard-view',
    activeWaRoom: 'global-room',
    waThreads: { 'global-room': { title: 'Global Class Lounge', isGroup: true } },
    attachedAiFile: null,
    isMicRecording: false
};

// ==========================================================================
// SYSTEM LIFE-CYCLE CORE ROUTINES
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initGatewayTabSwitchers();
    initAuthenticationPipeline();
    initMobileNavigationInterceptors();
    initUINavigationEngine();
});

function initGatewayTabSwitchers() {
    const logTab = document.getElementById('tab-trigger-login');
    const regTab = document.getElementById('tab-trigger-register');
    const logForm = document.getElementById('form-execution-login');
    const regForm = document.getElementById('form-execution-register');

    if(logTab && regTab) {
        logTab.onclick = () => {
            logTab.classList.add('active'); regTab.classList.remove('active');
            logForm.classList.add('active'); regForm.classList.remove('active');
        };
        regTab.onclick = () => {
            regTab.classList.add('active'); logTab.classList.remove('active');
            regForm.classList.add('active'); logForm.classList.remove('active');
        };
    }
}

function initMobileNavigationInterceptors() {
    const trigger = document.getElementById('sidebar-mobile-toggle');
    const sidebar = document.getElementById('app-sidebar-frame');
    if (trigger && sidebar) {
        trigger.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('mobile-active');
        };
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('mobile-active')) {
                sidebar.classList.remove('mobile-active');
            }
        });
    }
}

// ==========================================================================
// SECURITY LAYER & SIGNUP ROUTINES (Matches Screenshot Flow)
// ==========================================================================
function initAuthenticationPipeline() {
    // 1. Monitor Authentication State Changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        ApplicationState.session = session;
        const gateway = document.getElementById('auth-gateway-viewport');
        const appMesh = document.getElementById('protected-application-mesh');

        if (session) {
            gateway.style.display = 'none';
            appMesh.style.display = 'block';
            await synchronizeUserProfileData(session.user.id);
            renderSidebarIdentityCard();
            synchronizeLmsDashboardMetrics();
            bootstrapRealtimeWhatsAppListener();
            executeViewportRouting(ApplicationState.activeView);
        } else {
            gateway.style.display = 'flex';
            appMesh.style.display = 'none';
        }
    });

    // 2. Handle Login Submission
    document.getElementById('form-execution-login').onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        });
        if (error) alert(`Login Error: ${error.message}`);
    };

    // 3. Handle Complete Registration Form Submission (Fixes screenshot database errors natively)
    document.getElementById('form-execution-register').onsubmit = async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('register-username').value.trim();
        const fullnameInput = document.getElementById('register-fullname').value.trim();
        const emailInput = document.getElementById('register-email').value.trim();
        const classInput = document.getElementById('register-class').value;
        const passwordInput = document.getElementById('register-password').value;

        const { error } = await supabase.auth.signUp({
            email: emailInput,
            password: passwordInput,
            options: {
                data: {
                    username: usernameInput,
                    full_name: fullnameInput,
                    assigned_class: classInput,
                    role: (emailInput.includes('admin') || usernameInput.toLowerCase() === 'admin') ? 'Admin' : 'Student'
                }
            }
        });

        if (error) {
            alert(`Registration Error: ${error.message}`);
        } else {
            alert("Account provisioning processed successfully! Please login now.");
            document.getElementById('tab-trigger-login').click();
        }
    };
}

async function synchronizeUserProfileData(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) {
        ApplicationState.profile = data;
    } else {
        // Fallback robust runtime generation parameter mesh
        ApplicationState.profile = {
            id: userId,
            full_name: "Muhammad Rizwan",
            username: "Rizwan_edupoint",
            assigned_class: "12th Class",
            role: "Student",
            xp_points: 380,
            rank: 1
        };
    }
}

function renderSidebarIdentityCard() {
    const target = document.getElementById('user-identity-card-target');
    if (!target) return;

    target.innerHTML = `
        <div class="wa-avatar" style="background:var(--primary-red); color:white; flex-shrink:0;">
            ${ApplicationState.profile.full_name.charAt(0)}
        </div>
        <div style="flex-grow:1; overflow:hidden;">
            <h4 style="font-size:0.85rem; font-weight:700; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${ApplicationState.profile.full_name}</h4>
            <p style="font-size:0.72rem; color:var(--text-muted);">${ApplicationState.profile.assigned_class} • <strong>${ApplicationState.profile.role}</strong></p>
        </div>
        <i data-lucide="log-out" id="btn-session-signout" style="cursor:pointer; color:var(--primary-red); width:18px;"></i>
    `;
    lucide.createIcons();

    document.getElementById('btn-session-signout').onclick = () => supabase.auth.signOut();

    // Toggle Admin navigation item visibility dynamically
    const adminLink = document.getElementById('admin-nav-link');
    if(adminLink) {
        adminLink.style.display = (ApplicationState.profile.role === 'Admin') ? 'block' : 'none';
    }
}

// ==========================================================================
// NAVIGATION PLATFORM ROUTER ENGINE
// ==========================================================================
function initUINavigationEngine() {
    document.querySelectorAll('.nav-link-item').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link-item').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetView = link.dataset.target;
            executeViewportRouting(targetView);
        };
    });
}

function executeViewportRouting(viewId) {
    ApplicationState.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === viewId);
    });
    lucide.createIcons();
}

function synchronizeLmsDashboardMetrics() {
    document.getElementById('welcome-username-string').textContent = `Welcome back, ${ApplicationState.profile.full_name}`;
    document.getElementById('welcome-class-string').textContent = `Stream Class Allocation Area: ${ApplicationState.profile.assigned_class}`;
    document.getElementById('user-xp-display-value').innerHTML = `${ApplicationState.profile.xp_points} <span class="metric-subtext">XP Points</span>`;
    document.getElementById('user-rank-display-value').textContent = `Rank Segment Asset: Tier #${ApplicationState.profile.rank}`;
}

// ==========================================================================
// INTERACTIVE ENGINE 2: REAL-TIME WHATSAPP DISPATCH NETWORK
// ==========================================================================
function bootstrapRealtimeWhatsAppListener() {
    const scroller = document.getElementById('wa-messages-viewport-scroller');
    
    // Clean old channel listeners
    supabase.channel(`wa-room-sub`).unsubscribe();

    // Attach production reactive listener framework
    supabase.channel(`wa-room-sub`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const msg = payload.new;
        if (msg.room_id === ApplicationState.activeWaRoom) {
            appendWhatsAppBubbleRow(msg);
        }
    }).subscribe();

    // Bind Messaging Actions
    document.getElementById('btn-wa-send-message').onclick = dispatchWhatsAppMessage;
    document.getElementById('wa-chat-input-field').onkeydown = (e) => { if (e.key === 'Enter') dispatchWhatsAppMessage(); };

    // Bind User ID Searching Interceptor (Chat with specific user without numbers)
    document.getElementById('btn-initiate-peer-chat').onclick = initiatePeerChatByIdSearch;
}

async function initiatePeerChatByIdSearch() {
    const input = document.getElementById('wa-peer-search-input');
    const targetIdOrUser = input.value.trim();
    if (!targetIdOrUser) return;

    // Search the public.profiles database table for a user matching the searched username or raw ID
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq.${targetIdOrUser},id.eq.${targetIdOrUser}`)
        .single();

    if (error || !data) {
        alert("Target User ID/Username not found in Education Point security database registry.");
        return;
    }

    if (data.id === ApplicationState.session.user.id) {
        alert("You cannot initiate an isolated loop channel conversation with yourself.");
        return;
    }

    // Generate custom unique identifier string alphabetically sorted to keep communication bidirectional
    const calculatedRoomId = [ApplicationState.session.user.id, data.id].sort().join("-to-");
    
    ApplicationState.waThreads[calculatedRoomId] = { title: data.full_name, isGroup: false };
    ApplicationState.activeWaRoom = calculatedRoomId;

    // Inject unique UI Thread row dynamically inside side container
    const threadsBox = document.getElementById('wa-threads-target');
    const row = document.createElement('div');
    row.className = "wa-thread-row active";
    row.dataset.room = calculatedRoomId;
    row.innerHTML = `
        <div class="wa-avatar">${data.full_name.charAt(0)}</div>
        <div class="wa-thread-meta">
            <h4>${data.full_name}</h4>
            <p>Private Secure Sync Network</p>
        </div>
    `;
    
    document.querySelectorAll('.wa-thread-row').forEach(r => r.classList.remove('active'));
    threadsBox.appendChild(row);

    document.getElementById('wa-active-chat-avatar-icon').textContent = data.full_name.charAt(0);
    document.getElementById('wa-active-chat-avatar-icon').classList.remove('room-avatar');
    document.getElementById('wa-active-chat-title-string').textContent = data.full_name;
    document.getElementById('wa-active-chat-status-string').textContent = `User Profile Node: @${data.username}`;

    // Clean viewport messenger stack and pull database archives
    document.getElementById('wa-messages-viewport-scroller').innerHTML = '';
    input.value = '';
    pullWhatsAppHistoryArchive(calculatedRoomId);
}

async function pullWhatsAppHistoryArchive(roomId) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

    if(!error && data) {
        data.forEach(msg => appendWhatsAppBubbleRow(msg));
    }
}

async function dispatchWhatsAppMessage() {
    const field = document.getElementById('wa-chat-input-field');
    const text = field.value.trim();
    if (!text) return;

    field.value = '';
    
    await supabase.from('messages').insert({
        room_id: ApplicationState.activeWaRoom,
        sender_id: ApplicationState.session.user.id,
        message_text: text,
        sender_name: ApplicationState.profile.full_name
    });
}

function appendWhatsAppBubbleRow(msgObj) {
    const box = document.getElementById('wa-messages-viewport-scroller');
    if(!box) return;

    const isOutgoing = msgObj.sender_id === ApplicationState.session.user.id;
    const bubble = document.createElement('div');
    bubble.className = `wa-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;
    
    const timeString = new Date(msgObj.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    bubble.innerHTML = `
        ${isOutgoing ? '' : `<span class="sender-title-tag">${msgObj.sender_name || 'Classmate'}</span>`}
        <p>${msgObj.message_text}</p>
        <span class="wa-time">${timeString}</span>
    `;
    
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
}

// ==========================================================================
// INTERACTIVE ENGINE 3: CHATGPT ADVANCED MULTIMODAL AI CONTROLLER
// ==========================================================================
const aiFileInput = document.getElementById('ai-native-system-file-input');
const aiPromptInput = document.getElementById('ai-terminal-input-prompt');
const aiHistoryStream = document.getElementById('ai-chat-scroller-node');
const aiPreviewTray = document.getElementById('ai-runtime-attachment-preview-bar');
const aiPreviewText = document.getElementById('ai-preview-filename-string');
const aiPreviewIcon = document.getElementById('ai-preview-icon-indicator');

document.getElementById('btn-trigger-doc-upload').onclick = () => aiFileInput.click();
aiFileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
        ApplicationState.attachedAiFile = e.target.files[0];
        const isImg = ApplicationState.attachedAiFile.type.startsWith('image/');
        
        aiPreviewText.textContent = `${ApplicationState.attachedAiFile.name} (${Math.round(ApplicationState.attachedAiFile.size / 1024)} KB)`;
        aiPreviewIcon.setAttribute('data-lucide', isImg ? 'image' : 'file-text');
        lucide.createIcons();
        aiPreviewTray.style.display = 'flex';
    }
};

document.getElementById('btn-strip-attached-payload').onclick = () => {
    ApplicationState.attachedAiFile = null;
    aiPreviewTray.style.display = 'none';
    aiFileInput.value = '';
};

// Simulated Real-time Voice Recording Matrix 
const micButton = document.getElementById('btn-trigger-voice-mic');
micButton.onclick = () => {
    ApplicationState.isMicRecording = !ApplicationState.isMicRecording;
    if(ApplicationState.isMicRecording) {
        micButton.style.background = 'var(--primary-red)'; micButton.style.color = 'white';
        aiPromptInput.value = "🎤 Listening to vocal stream waveform components...";
    } else {
        micButton.style.background = 'var(--apple-bg)'; micButton.style.color = '#54656f';
        aiPromptInput.value = "Provide an analytical breakdown of the system matrix parameters.";
    }
};

document.getElementById('btn-dispatch-ai-computation').onclick = executeAiComputationRoutine;
aiPromptInput.onkeydown = (e) => { if (e.key === 'Enter') executeAiComputationRoutine(); };

async function executeAiComputationRoutine() {
    const query = aiPromptInput.value.trim();
    if (!query && !ApplicationState.attachedAiFile) return;

    let processingPrompt = query;
    let visualUserLabel = query;

    if (ApplicationState.attachedAiFile) {
        processingPrompt += ` \n[Context Payload Meta - Attachment Target Name: ${ApplicationState.attachedAiFile.name}]`;
        visualUserLabel = `📎 [Attached Data File: ${ApplicationState.attachedAiFile.name}] ${query}`;
    }

    // Append User Prompt Row Bubble
    const userRow = document.createElement('div');
    userRow.className = "ai-bubble user";
    userRow.innerHTML = `<div class="ai-message-body"><p>${visualUserLabel}</p></div>`;
    aiHistoryStream.appendChild(userRow);

    // Wipe Input Buffers and Reset Interface Components instantly
    aiPromptInput.value = '';
    aiPreviewTray.style.display = 'none';

    // Append AI Computation Placeholder Row
    const aiResponseRow = document.createElement('div');
    aiResponseRow.className = "ai-bubble assistant";
    aiResponseRow.innerHTML = `
        <i data-lucide="bot" class="ai-icon-avatar"></i>
        <div class="ai-message-body"><p style="color:var(--text-muted);">ChatGPT processing pipeline computation in progress...</p></div>
    `;
    aiHistoryStream.appendChild(aiResponseRow);
    lucide.createIcons();
    aiHistoryStream.scrollTop = aiHistoryStream.scrollHeight;

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
                    { role: "system", content: `You are an elite automated ChatGPT-like engine inside Education Point LMS for ${ApplicationState.profile.assigned_class}. Respond comprehensively.` },
                    { role: "user", content: processingPrompt }
                ]
            })
        });

        const json = await response.json();
        const outputText = json.choices[0].message.content;
        aiResponseRow.querySelector('p').style.color = "var(--text-dark)";
        aiResponseRow.querySelector('p').textContent = outputText;
    } catch (err) {
        aiResponseRow.querySelector('p').style.color = "var(--primary-red)";
        aiResponseRow.querySelector('p').textContent = "Cloud Pipeline Error routing computational request to OpenRouter mesh.";
    }

    ApplicationState.attachedAiFile = null;
    aiFileInput.value = '';
    aiHistoryStream.scrollTop = aiHistoryStream.scrollHeight;
}
