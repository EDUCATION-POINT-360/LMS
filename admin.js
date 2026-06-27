/**
 * EDUCATION POINT LMS — ENTERPRISE INFRASTRUCTURE ADMINISTRATIVE CONTROL SHELL
 * Drives back-office administrative metrics dashboard layout views, systems tracking analytics grids, and modals logic.
 */

const AdminEcosystemEngine = {
    init() {
        this.setupAdminViewRoutingEngine();
        this.initializeClassDensityRegistrationChart();
        this.setupContentDeploymentOverlayLogic();
        this.setupTestingParadigmFormRepeater();
    },

    setupAdminViewRoutingEngine() {
        const links = document.querySelectorAll('#admin-sidebar-navigation-links button');
        links.forEach(btn => {
            btn.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active-nav'));
                btn.classList.add('active-nav');

                const target = btn.getAttribute('data-target');
                document.querySelectorAll('.admin-view').forEach(v => v.classList.add('hidden'));
                
                const activeNode = document.getElementById(`view-${target}`);
                if (activeNode) activeNode.classList.remove('hidden');
                this.fireAdministrativeToast(`Initializing Admin Core Vector Context: ${target.toUpperCase()}`);
            });
        });
    },

    initializeClassDensityRegistrationChart() {
        const canvas = document.getElementById('adminClassDensityChart');
        if (!canvas) return;
        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['9th Class', '10th Class', '11th Class', '12th Class'],
                datasets: [{
                    data: [142, 198, 230, 312],
                    backgroundColor: ['rgba(255,45,85,0.8)', 'rgba(255,69,58,0.8)', 'rgba(255,159,10,0.8)', 'rgba(48,209,88,0.8)'],
                    borderRadius: 12
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    },

    setupContentDeploymentOverlayLogic() {
        const trigger = document.getElementById('btn-admin-trigger-content-upload-modal');
        const overlay = document.getElementById('admin-content-upload-modal-overlay');
        const close = document.getElementById('btn-close-content-modal');
        if (trigger && overlay && close) {
            trigger.addEventListener('click', () => overlay.classList.remove('hidden'));
            close.addEventListener('click', () => overlay.classList.add('hidden'));
        }
    },

    setupTestingParadigmFormRepeater() {
        const btnAppend = document.getElementById('btn-admin-test-append-question-form-node');
        const targetContainer = document.getElementById('admin-test-questions-form-nodes-accumulator');
        
        if (btnAppend && targetContainer) {
            btnAppend.addEventListener('click', () => {
                const nodeIndex = targetContainer.children.length + 1;
                const nodeBlock = document.createElement('div');
                nodeBlock.className = "pt-4 space-y-2 text-xs text-gray-600 border-b border-gray-100 pb-4";
                nodeBlock.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-red-500">Question Node Vector Target #${nodeIndex}</span>
                    </div>
                    <input type="text" placeholder="Enter theoretical question configuration context text string..." class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 mt-1">
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <input type="text" placeholder="Option String Array Alpha" class="bg-white border p-2 rounded-xl">
                        <input type="text" placeholder="Option String Array Beta" class="bg-white border p-2 rounded-xl">
                    </div>
                `;
                targetContainer.appendChild(nodeBlock);
            });
        }
    },

    fireAdministrativeToast(msg) {
        const portal = document.getElementById('admin-toast-system');
        if (!portal) return;
        const toast = document.createElement('div');
        toast.className = "toast-message-node";
        toast.style.borderLeftColor = "#ff453a";
        toast.textContent = msg;
        portal.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

document.addEventListener('DOMContentLoaded', () => AdminEcosystemEngine.init());
