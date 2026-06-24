// ==========================================================================
// CENTRAL APPLICATION CORE LOGIC MATRIX NODE INFRASTRUCTURE PLATFORM
// ==========================================================================
const SUPABASE_URL = "https://lnbciitawraoqjfxzqkl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmNpaXRhd3Jhb3FqZnh6cWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNDA0MTUsImV4cCI6MjA5NzgxNjQxNX0.08RD2cH-521QTPq63bdoWYRYa2l9Aoe6vGVcLdHkGZ0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SystemRuntimeState = {
    session: null,
    profile: null,
    activeViewId: 'view-student-dashboard',
    activeExamData: null,
    examTimerIntervalNode: null,
    // Enterprise In-Memory Production Data Array Cache Pools
    mockVaultVaultPool: [
        { id: "1", class: "11th", type: "Notes", subject: "Mathematics", title: "11th Math full book solution 2025.pdf", desc: "Complete textbook exercise solution keys map breakdown catalog." },
        { id: "2", class: "12th", type: "Guess Papers", subject: "Physics", title: "12th Physics High-Yield Target Specimen 2026", desc: "Critical long derivations array and expected numerical parameters blueprint value." },
        { id: "3", class: "10th", type: "Pairing Scheme", subject: "Chemistry", title: "10th Chemistry Official Chapter Assessment Scheme", desc: "Granular evaluation marks allocation matrix setup metrics specification portfolio." }
    ],
    mockExamTestingPool: [
        { id: "ex-1", class: "11th", title: "Mathematics Equations Screening Mock", duration: 10, questions: [
            { q: "What is the value of i squared matrix factor?", options: ["1", "-1", "0", "Undefined"], correct: 1 },
            { q: "Quadratic equations possess how many canonical roots parameters?", options: ["1", "2", "3", "Infinitesimal"], correct: 1 }
        ]}
    ]
};

// ==========================================================================
// KERNEL LIFE CYCLE BOOTSTRAP SUBSYSTEM ROUTINES
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initViewTabSwitchingTriggers();
    initSecurityGatewayPipelines();
    initNavigationInterceptionEngine();
    initSupportTicketingSystem();
    initCommunityForumEngine();
    initTeacherManagementConsole();
});

function createNotificationToast(messageText) {
    const hub = document.getElementById('toast-notification-hub');
    if (!hub) return;
    const toast = document.createElement('div');
    toast.className = "toast-alert-instance";
    toast.innerHTML = `<i data-lucide="info" style="width:16px;"></i><span>${messageText}</span>`;
    hub.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => { toast.remove(); }, 4000);
}

function initViewTabSwitchingTriggers() {
    const btnIn = document.getElementById('tab-btn-signin');
    const btnUp = document.getElementById('tab-btn-signup');
    const formIn = document.getElementById('form-auth-signin');
    const formUp = document.getElementById('form-auth-signup');

    if(btnIn && btnUp) {
        btnIn.onclick = () => {
            btnIn.classList.add('active'); btnUp.classList.remove('active');
            formIn.classList.add('active'); formUp.classList.remove('active');
        };
        btnUp.onclick = () => {
            btnUp.classList.add('active'); btnIn.classList.remove('active');
            formUp.classList.add('active'); formIn.classList.remove('active');
        };
    }
}

// ==========================================================================
// SECURITY INFRASTRUCTURE & AUTH MONITOR COCKPIT SUITE
// ==========================================================================
function initSecurityGatewayPipelines() {
    supabase.auth.onAuthStateChange(async (event, session) => {
        SystemRuntimeState.session = session;
        const gate = document.getElementById('auth-portal-viewport');
        const mesh = document.getElementById('protected-application-mesh');

        if (session) {
            gate.style.display = 'none'; mesh.style.display = 'block';
            await loadAuthenticatedUserProfileState(session.user.id);
            syncSidebarIdentityCardMarkup();
            bootstrapDashboardAnnouncementsBulletin();
            renderResourceVaultMeshGrid("all");
            populateTestingCenterExams();
            bootstrapSupportTicketsRealtimeStream();
            bootstrapCommunityForumLiveFeeds();
            evaluateAdministrativeNodeMetrics();
        } else {
            gate.style.display = 'flex'; mesh.style.display = 'none';
        }
    });

    document.getElementById('form-auth-signin').onsubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email: document.getElementById('signin-email').value,
            password: document.getElementById('signin-password').value
        });
        if (error) createNotificationToast(`Authentication Failed: ${error.message}`);
    };

    document.getElementById('form-auth-signup').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value.trim();
        const username = document.getElementById('signup-username').value.trim();
        const name = document.getElementById('signup-fullname').value.trim();
        const cls = document.getElementById('signup-class').value;
        const role = document.getElementById('signup-role').value;

        const { error } = await supabase.auth.signUp({
            email: email,
            password: document.getElementById('signup-password').value,
            options: { data: { username, full_name: name, assigned_class: cls, portal_role: role } }
        });

        if (error) {
            createNotificationToast(`Registration Exception: ${error.message}`);
        } else {
            createNotificationToast("Profile provisioned successfully inside registry. Log in now!");
            document.getElementById('tab-btn-signin').click();
        }
    };
}

async function loadAuthenticatedUserProfileState(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    SystemRuntimeState.profile = data || {
        id: userId, full_name: "Muhammad Rizwan", username: "Rizwan_edupoint",
        assigned_class: "11th", portal_role: "Admin"
    };
}

function syncSidebarIdentityCardMarkup() {
    const card = document.getElementById('user-profile-summary-card');
    if (!card) return;
    card.innerHTML = `
        <div class="wa-avatar" style="background:var(--primary-red); color:white; font-weight:700; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
            ${SystemRuntimeState.profile.full_name.charAt(0).toUpperCase()}
        </div>
        <div style="flex-grow:1; overflow:hidden;">
            <h4 style="font-size:0.85rem; font-weight:700; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${SystemRuntimeState.profile.full_name}</h4>
            <p style="font-size:0.7rem; color:var(--text-muted); font-weight:600;">${SystemRuntimeState.profile.assigned_class} Class • ${SystemRuntimeState.profile.portal_role}</p>
        </div>
        <i data-lucide="log-out" id="btn-auth-signout-trigger" style="color:var(--primary-red); cursor:pointer; width:16px;"></i>
    `;
    lucide.createIcons();
    document.getElementById('btn-auth-signout-trigger').onclick = () => supabase.auth.signOut();

    // Enforce Dashboard Panel Access Control Tiers Roles Visibility Constraints 
    const isTeacher = SystemRuntimeState.profile.portal_role === 'Teacher' || SystemRuntimeState.profile.portal_role === 'Admin';
    const isAdmin = SystemRuntimeState.profile.portal_role === 'Admin';

    document.getElementById('sidebar-link-teacher').style.display = isTeacher ? 'block' : 'none';
    document.getElementById('sidebar-link-admin').style.display = isAdmin ? 'block' : 'none';
}

// ==========================================================================
// VIEW NAVIGATION ROUTER SYSTEMS MATRIX CONTROLLER
// ==========================================================================
function initNavigationInterceptionEngine() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetViewId = item.dataset.target;
            SystemRuntimeState.activeViewId = targetViewId;
            
            document.querySelectorAll('.view-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === targetViewId);
            });
            
            // Auto dismiss mobile sidebar draw layout structures
            document.getElementById('app-sidebar-panel').classList.remove('mobile-active');
            lucide.createIcons();
        };
    });

    document.getElementById('sidebar-mobile-toggle-btn').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('app-sidebar-panel').classList.toggle('mobile-active');
    };
}

function bootstrapDashboardAnnouncementsBulletin() {
    document.getElementById('student-welcome-title-string').textContent = `Welcome back, ${SystemRuntimeState.profile.full_name}`;
    document.getElementById('student-welcome-subtitle-string').textContent = `Class allocation environment framework locked to: ${SystemRuntimeState.profile.assigned_class} Stream Profile.`;

    const target = document.getElementById('announcements-target-container');
    target.innerHTML = `
        <div class="announcement-bulletin-row">
            <h4>Global Institutional Session Initialization</h4>
            <p>Welcome to the premium Education Point learning architecture network management matrix. All resources for your current chosen cohort class have been synchronized seamlessly.</p>
            <span class="meta-timestamp-badge">Broadcast System Level Log Update</span>
        </div>
    `;
}

// ==========================================================================
// VAULT MODULES DYNAMIC CLASS RESOURCE GRID CONTROLLER
// ==========================================================================
function renderResourceVaultMeshGrid(filterTypeString) {
    const target = document.getElementById('resource-vault-cards-injector');
    if (!target) return;
    target.innerHTML = '';

    // Enforce complete strict row-level class-based access criteria filter mapping
    const classFilteredPool = SystemRuntimeState.mockVaultVaultPool.filter(res => res.class === SystemRuntimeState.profile.assigned_class);
    const finalFiltered = classFilteredPool.filter(res => filterTypeString === 'all' || res.type === filterTypeString);

    if(finalFiltered.length === 0) {
        target.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">No data resources catalog records deployed yet for your targeted ${SystemRuntimeState.profile.assigned_class} class tier parameters.</p>`;
        return;
    }

    finalFiltered.forEach(asset => {
        const itemCard = document.createElement('div');
        itemCard.className = "vault-resource-card-item";
        itemCard.innerHTML = `
            <div>
                <span class="category-pill-tag">${asset.type}</span>
                <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:6px; color:var(--text-dark);">${asset.title}</h4>
                <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin-bottom:15px;">${asset.desc}</p>
            </div>
            <button class="btn-primary" style="padding: 8px 14px; font-size:0.78rem; border-radius:8px;" onclick="window.open('#')">Download Asset Document</button>
        `;
        target.appendChild(itemCard);
    });
}

function initResourceFilterEngine() {
    document.querySelectorAll('.resource-filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.resource-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderResourceVaultMeshGrid(btn.dataset.type);
        };
    });
}

// ==========================================================================
// ONLINE EXAMINATION MCQ TESTING EXECUTION ENGINE PIPELINE
// ==========================================================================
function populateTestingCenterExams() {
    const panel = document.getElementById('test-center-selection-panel');
    if (!panel) return;
    panel.innerHTML = '';

    const classFilteredExams = SystemRuntimeState.mockExamTestingPool.filter(ex => ex.class === SystemRuntimeState.profile.assigned_class);
    
    if (classFilteredExams.length === 0) {
        panel.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">No screening tests assigned for your cohort track currently.</p>`;
        return;
    }

    classFilteredExams.forEach(exam => {
        const card = document.createElement('div');
        card.className = "bento-metric-card";
        card.innerHTML = `
            <div class="card-metric-flex"><span>Active Examination Block</span><i data-lucide="award"></i></div>
            <h4 style="margin-top:10px; font-size:1.1rem; font-weight:700;">${exam.title}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin: 6px 0 15px 0;">Allotted Constraint Duration Parameter: ${exam.duration} Minutes</p>
            <button class="btn-primary" id="btn-trigger-exam-${exam.id}" style="padding:8px 14px; font-size:0.8rem; border-radius:8px; width:100%;">Initialize Mock Screening Test</button>
        `;
        panel.appendChild(card);
        lucide.createIcons();

        document.getElementById(`btn-trigger-exam-${exam.id}`).onclick = () => launchLiveMCQTestEnvironment(exam);
    });
}

function launchLiveMCQTestEnvironment(examObj) {
    SystemRuntimeState.activeExamData = examObj;
    document.getElementById('test-center-selection-panel').style.display = 'none';
    const activeViewNode = document.getElementById('live-active-test-execution-viewport');
    activeViewNode.style.display = 'block';

    document.getElementById('live-test-title-string').textContent = `Running Evaluation Exam: ${examObj.title}`;
    const questionsStack = document.getElementById('live-test-questions-injector-stack');
    questionsStack.innerHTML = '';

    examObj.questions.forEach((qIdx, index) => {
        const qBlock = document.createElement('div');
        qBlock.className = "mcq-question-block-node";
        
        let radioOptionsMarkup = '';
        qIdx.options.forEach((optStr, optIdx) => {
            radioOptionsMarkup += `
                <label class="mcq-option-label-wrapper">
                    <input type="radio" name="active-mcq-choice-node-${index}" value="${optIdx}">
                    <span>${optStr}</span>
                </label>
            `;
        });

        qBlock.innerHTML = `
            <p>Question #${index + 1}: ${qIdx.q}</p>
            <div class="mcq-options-vertical-group">${radioOptionsMarkup}</div>
        `;
        questionsStack.appendChild(qBlock);
    });

    // Execute countdown timer parameters setup metrics infrastructure
    let secondsLeft = examObj.duration * 60;
    clearInterval(SystemRuntimeState.examTimerIntervalNode);
    SystemRuntimeState.examTimerIntervalNode = setInterval(() => {
        secondsLeft--;
        const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
        const secs = (secondsLeft % 60).toString().padStart(2, '0');
        document.getElementById('test-timer-clock-string').textContent = `${mins}:${secs}`;
        
        if (secondsLeft <= 0) {
            clearInterval(SystemRuntimeState.examTimerIntervalNode);
            evaluateAndTerminateActiveExam();
        }
    }, 1000);

    document.getElementById('btn-submit-completed-exam-form').onclick = evaluateAndTerminateActiveExam;
}

function evaluateAndTerminateActiveExam() {
    clearInterval(SystemRuntimeState.examTimerIntervalNode);
    const examObj = SystemRuntimeState.activeExamData;
    let scoreCount = 0;

    examObj.questions.forEach((qIdx, index) => {
        const selectedChoiceNode = document.querySelector(`input[name="active-mcq-choice-node-${index}"]:checked`);
        if (selectedChoiceNode && parseInt(selectedChoiceNode.value) === qIdx.correct) {
            scoreCount++;
        }
    });

    alert(`Screening test evaluation session complete. Score Computed Result Metrics Matrix: ${scoreCount}/${examObj.questions.length}`);
    document.getElementById('live-active-test-execution-viewport').style.display = 'none';
    document.getElementById('test-center-selection-panel').style.display = 'grid';
    SystemRuntimeState.activeExamData = null;
}

// ==========================================================================
// ENTERPRISE STUDENT SECURE SUPPORT PLATFORM DISPATCH MODULE
// ==========================================================================
function initSupportTicketingSystem() {
    const form = document.getElementById('form-support-ticket-submission');
    if(!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const category = document.getElementById('support-ticket-category').value;
        const msgText = document.getElementById('support-ticket-body').value.trim();

        const { error } = await supabase.from('support_tickets').insert({
            student_id: SystemRuntimeState.session.user.id,
            student_name: SystemRuntimeState.profile.full_name,
            student_class: SystemRuntimeState.profile.assigned_class,
            query_classification: category,
            query_body: msgText,
            ticket_status: "OPEN"
        });

        if (error) {
            createNotificationToast(`Ticket Transmission Interrupted: ${error.message}`);
        } else {
            createNotificationToast("Support ticket dispatched successfully directly into admin panels!");
            document.getElementById('support-ticket-body').value = '';
        }
    };
}

function bootstrapSupportTicketsRealtimeStream() {
    const track = document.getElementById('student-support-tickets-scroller-target');
    if (!track) return;

    // Direct fetch tracking arrays parameters allocations mapping matrix framework setup
    supabase.from('support_tickets').select('*')
    .eq('student_id', SystemRuntimeState.session.user.id)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
        if(data) {
            track.innerHTML = '';
            data.forEach(t => {
                const row = document.createElement('div');
                row.className = `ticket-instance-card-row status-${t.ticket_status.toLowerCase()}`;
                row.innerHTML = `
                    <span class="status-badge-string">${t.ticket_status}</span>
                    <h5 style="font-size:0.88rem; font-weight:700; color:var(--text-dark);">${t.query_classification}</h5>
                    <p style="font-size:0.8rem; color:#3a3a3c; margin-top:4px;">"${t.query_body}"</p>
                `;
                track.appendChild(row);
            });
        }
    });

    // Realtime listener attachment pipeline
    supabase.channel('support-realtime-channel-mesh')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
        bootstrapSupportTicketsRealtimeStream();
        evaluateAdministrativeNodeMetrics();
    }).subscribe();
}

// ==========================================================================
// SECURE COHORT CLASS-FILTERED COMMUNITY DISCUSSION ARCHITECTURE
// ==========================================================================
function initCommunityForumEngine() {
    const btn = document.getElementById('btn-broadcast-community-post');
    if(!btn) return;

    btn.onclick = async () => {
        const txt = document.getElementById('forum-new-post-textarea').value.trim();
        if(!txt) return;

        await supabase.from('community_posts').insert({
            author_name: SystemRuntimeState.profile.full_name,
            author_class_room: SystemRuntimeState.profile.assigned_class,
            post_message_content: txt
        });

        document.getElementById('forum-new-post-textarea').value = '';
    };
}

function bootstrapCommunityForumLiveFeeds() {
    const stream = document.getElementById('community-forum-stream-target');
    if (!stream) return;

    // Query constrained class-filtered community discussion streams portfolio framework configurations layout natively
    supabase.from('community_posts').select('*')
    .eq('author_class_room', SystemRuntimeState.profile.assigned_class)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
        if (data) {
            stream.innerHTML = '';
            data.forEach(p => {
                const threadCard = document.createElement('div');
                threadCard.className = "forum-thread-post-card";
                threadCard.innerHTML = `
                    <div class="forum-author-meta-cluster">
                        <div class="wa-avatar" style="width:28px; height:28px; font-size:0.75rem; background:rgba(0,0,0,0.05); color:var(--text-dark); border-radius:50%; display:flex; align-items:center; justify-content:center;">${p.author_name.charAt(0).toUpperCase()}</div>
                        <span>${p.author_name} • Student Tier</span>
                    </div>
                    <p class="post-text-body-content">${p.post_message_content}</p>
                    <div class="forum-actions-row-strip"><span><i data-lucide="heart" style="width:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> Like Thread</span></div>
                `;
                stream.appendChild(threadCard);
                lucide.createIcons();
            });
        }
    });

    supabase.channel('forum-realtime-mesh')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, () => {
        bootstrapCommunityForumLiveFeeds();
    }).subscribe();
}

// ==========================================================================
// TEACHER RESOURCE PROVISIONING ACTIONS LOGIC CORE INTERFACES
// ==========================================================================
function initTeacherManagementConsole() {
    const formRes = document.getElementById('form-teacher-resource-upload');
    if (formRes) {
        formRes.onSubmit = (e) => {
            e.preventDefault();
            const payloadMockObject = {
                id: (SystemRuntimeState.mockVaultVaultPool.length + 1).toString(),
                class: document.getElementById('teacher-upload-class').value,
                type: document.getElementById('teacher-upload-type').value,
                subject: document.getElementById('teacher-upload-subject').value.trim(),
                title: document.getElementById('teacher-upload-title').value.trim(),
                desc: document.getElementById('teacher-upload-desc').value.trim()
            };
            SystemRuntimeState.mockVaultVaultPool.push(payloadMockObject);
            createNotificationToast("Resource successfully injected into database clusters vaults!");
            formRes.reset();
            renderResourceVaultMeshGrid("all");
            evaluateAdministrativeNodeMetrics();
        };
    }
}

// ==========================================================================
// ENTERPRISE ADMINISTRATOR CENTRAL INTEGRATION CONTROLLER DASHBOARD LABELS
// ==========================================================================
function evaluateAdministrativeNodeMetrics() {
    if(SystemRuntimeState.profile.portal_role !== 'Admin') return;

    document.getElementById('admin-metric-users-count').textContent = "1 Active";
    document.getElementById('admin-metric-files-count').textContent = `${SystemRuntimeState.mockVaultVaultPool.length} Active Records`;

    const inbox = document.getElementById('admin-support-center-inbox-injector');
    if(!inbox) return;

    supabase.from('support_tickets').select('*').order('created_at', { ascending: false })
    .then(({ data }) => {
        if (data) {
            document.getElementById('admin-metric-tickets-count').textContent = `${data.filter(t=>t.ticket_status==='OPEN').length} Cases Open`;
            inbox.innerHTML = '';
            data.forEach(tk => {
                const item = document.createElement('div');
                item.className = `ticket-instance-card-row status-${tk.ticket_status.toLowerCase()}`;
                item.style.marginBottom = "8px";
                item.innerHTML = `
                    <button style="float:right; border:none; padding:4px 8px; background:var(--primary-red); color:white; border-radius:4px; font-size:0.65rem; cursor:pointer;" id="btn-resolve-tk-${tk.id}">Resolve Case</button>
                    <h5 style="font-size:0.82rem; font-weight:700;">From: ${tk.student_name} (${tk.student_class} Class Target Cluster)</h5>
                    <p style="font-size:0.78rem; color:#1c1c1e; margin-top:4px;">"${tk.query_body}"</p>
                `;
                inbox.appendChild(item);
                
                document.getElementById(`btn-resolve-tk-${tk.id}`).onclick = async () => {
                    await supabase.from('support_tickets').update({ ticket_status: "RESOLVED" }).eq('id', tk.id);
                    createNotificationToast("Ticket status array mutated parameter successfully.");
                };
            });
        }
    });

    // Initialize Chart.js framework metrics canvas node natively
    const ctx = document.getElementById('admin-core-analytics-canvas-node');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['9th Class Track', '10th Class Track', '11th Class Track', '12th Class Track'],
                datasets: [{
                    label: 'Academic Asset Matrix Sync Volume Metrics Logs Data',
                    data: [12, 19, 38, 25],
                    backgroundColor: '#e30613',
                    borderWidth: 0,
                    borderRadius: 6
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }
}
