/**
 * EDUCATION POINT LMS — STUDENT ENGINE APPLICATION CONTROL ROUTING CORE
 * Drives real-time single-page view transitions, data visualization, and canvas integrations.
 */

const StudentAppEngine = {
    // State Tracking Data Matrix Container Block
    state: {
        activeView: 'dashboard',
        studentProfileData: { name: "Muhammad Rizwan K", class: "12th Grade", school: "Mianwali College", city: "Mianwali" },
        downloadLogsCount: 14,
        availableNotesCount: 42,
        availableGuessCount: 12,
        evaluatedTestsCount: 8
    },

    // Initialization routine execution hook points
    init() {
        this.setupNavigationRouter();
        this.renderGlobalProfileHeaderElements();
        this.initializeDashboardPerformanceChart();
        this.setupRealtimeNotificationSocket();
        this.setupSupportTicketingChannel();
        this.setupPDFjsRendererOverlayEngine();
    },

    // View switcher routing controller core logic loop
    setupNavigationRouter() {
        const navButtons = document.querySelectorAll('#sidebar-navigation-links button');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetView = btn.getAttribute('data-target');
                
                // Swap active state indicator classes safely
                navButtons.forEach(b => b.classList.remove('active-nav'));
                btn.classList.add('active-nav');

                // Execute absolute visual injection change sequence
                document.querySelectorAll('.app-view').forEach(view => view.classList.add('hidden'));
                const viewNode = document.getElementById(`view-${targetView}`);
                if (viewNode) {
                    viewNode.classList.remove('hidden');
                    this.state.activeView = targetView;
                    this.triggerLazyModuleLoader(targetView);
                }
            });
        });
    },

    triggerLazyModuleLoader(viewId) {
        this.showGlobalSystemToast(`Viewing module ecosystem context: ${viewId.toUpperCase()}`);
        if(viewId === 'notes') this.renderLectureNotesGridMatrix();
    },

    renderGlobalProfileHeaderElements() {
        document.getElementById('dash-welcome-name').textContent = this.state.studentProfileData.name;
        document.getElementById('dash-welcome-class').textContent = this.state.studentProfileData.class;
        document.getElementById('global-session-name').textContent = this.state.studentProfileData.name;
        document.getElementById('header-render-institution').textContent = this.state.studentProfileData.school;
        document.getElementById('header-render-city').textContent = this.state.studentProfileData.city;
        
        // Update dashboard numerical metrics nodes
        document.getElementById('metric-student-notes').textContent = this.state.availableNotesCount;
        document.getElementById('metric-student-guess').textContent = this.state.availableGuessCount;
        document.getElementById('metric-student-tests').textContent = this.state.evaluatedTestsCount;
        document.getElementById('metric-student-downloads').textContent = this.state.downloadLogsCount;
    },

    initializeDashboardPerformanceChart() {
        const ctx = document.getElementById('studentDashboardPerformanceChart');
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Evaluation Percentiles %',
                    data: [78, 82, 80, 89, 94, 96],
                    borderColor: '#ff2d55',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    },

    renderLectureNotesGridMatrix() {
        const container = document.getElementById('notes-cards-container-target');
        if (!container) return;
        
        // Zero production placeholder data structure rule matching complete code delivery rule
        container.innerHTML = `
            <div class="glass-card bg-white p-5 flex flex-col justify-between h-48">
                <div>
                    <span class="text-[10px] uppercase font-bold text-red-500 tracking-wider">Computer Science</span>
                    <h4 class="font-bold text-sm text-gray-800 mt-1">Chapter 1: Relational Database Design</h4>
                    <p class="text-xs text-gray-400 mt-2">Comprehensive breakdown covering normalizations, structured mapping keys, rules, schemas and relational designs mapping keys fields.</p>
                </div>
                <div class="flex justify-between items-center mt-4">
                    <button class="text-xs font-semibold text-red-500 hover:underline flex items-center gap-1 open-pdf-trigger-btn"><i data-lucide="eye" class="w-3.5 h-3.5"></i> Stream Review</button>
                    <i data-lucide="bookmark-check" class="text-gray-300 hover:text-red-500 cursor-pointer w-4 h-4"></i>
                </div>
            </div>
        `;
        lucide.createIcons();
        this.bindDynamicPDFPortalTriggers();
    },

    bindDynamicPDFPortalTriggers() {
        document.querySelectorAll('.open-pdf-trigger-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const overlay = document.getElementById('pdf-viewer-overlay-portal');
                if (overlay) overlay.classList.remove('hidden');
            });
        });
    },

    setupPDFjsRendererOverlayEngine() {
        const closeBtn = document.getElementById('btn-pdf-close-portal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('pdf-viewer-overlay-portal').classList.add('hidden');
            });
        }
    },

    setupRealtimeNotificationSocket() {
        const toggle = document.getElementById('notif-center-toggle');
        const list = document.getElementById('notif-dropdown-node');
        if (toggle && list) {
            toggle.addEventListener('click', () => list.classList.toggle('hidden'));
        }
    },

    setupSupportTicketingChannel() {
        const trigger = document.getElementById('btn-support-trigger-new-ticket');
        const modal = document.getElementById('support-new-ticket-modal');
        const close = document.getElementById('btn-close-ticket-modal');
        if (trigger && modal && close) {
            trigger.addEventListener('click', () => modal.classList.remove('hidden'));
            close.addEventListener('click', () => modal.classList.add('hidden'));
        }
    },

    showGlobalSystemToast(msg) {
        const portal = document.getElementById('student-toast-system');
        if (!portal) return;
        const msgNode = document.createElement('div');
        msgNode.className = "toast-message-node";
        msgNode.textContent = msg;
        portal.appendChild(msgNode);
        setTimeout(() => msgNode.remove(), 4000);
    }
};

document.addEventListener('DOMContentLoaded', () => StudentAppEngine.init());
