// ==============================
// MOCK DATA (Replace with API later)
// ==============================

let leads = [
    {
        id: 'lead_1',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '111-222-3333',
        source: 'Website Form',
        status: 'new',
        notes: [
            { text: 'Initial contact form submission.', date: '2023-10-26T10:00:00Z' }
        ],
        createdAt: '2023-10-26T09:45:00Z'
    },
    {
        id: 'lead_2',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        phone: null,
        source: 'Referral',
        status: 'contacted',
        notes: [],
        createdAt: '2023-10-25T13:30:00Z'
    },
    {
        id: 'lead_3',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        phone: '555-123-4567',
        source: 'LinkedIn Ad',
        status: 'converted',
        notes: [],
        createdAt: '2023-10-20T07:45:00Z'
    }
];

// ==============================
// DOM ELEMENTS
// ==============================

const leadsTableBody = document.getElementById('leads-table-body');
const statTotal = document.getElementById('stat-total');
const statNew = document.getElementById('stat-new');
const statContacted = document.getElementById('stat-contacted');
const statConverted = document.getElementById('stat-converted');
const statConversionRate = document.getElementById('stat-conversion-rate');
const leadSearchInput = document.getElementById('lead-search');
const leadFilterSelect = document.getElementById('lead-filter');
const noLeadsMessage = document.querySelector('.no-leads-message');

const leadDetailModal = document.getElementById('lead-detail-modal');
const closeModalButton = document.querySelector('.close-button');
const modalLeadName = document.getElementById('modal-lead-name');
const modalLeadEmail = document.getElementById('modal-lead-email');
const modalLeadPhone = document.getElementById('modal-lead-phone');
const modalLeadSource = document.getElementById('modal-lead-source');
const modalLeadCreatedAt = document.getElementById('modal-lead-created-at');
const modalLeadStatus = document.getElementById('modal-lead-status');
const saveStatusBtn = document.getElementById('save-status-btn');
const modalLeadNotesList = document.getElementById('modal-lead-notes-list');
const newNoteTextarea = document.getElementById('new-note-text');
const addNoteBtn = document.getElementById('add-note-btn');

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

let currentLeadId = null;

// ==============================
// UTIL FUNCTIONS
// ==============================

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function getStatusBadge(status) {
    return `<span class="status-badge status-${status}">${status}</span>`;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==============================
// RENDER FUNCTIONS
// ==============================

function renderLeads(filteredLeads) {
    leadsTableBody.innerHTML = '';

    if (filteredLeads.length === 0) {
        noLeadsMessage.style.display = 'block';
        return;
    }

    noLeadsMessage.style.display = 'none';

    filteredLeads.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.source}</td>
            <td>${getStatusBadge(lead.status)}</td>
            <td>${formatDate(lead.createdAt)}</td>
            <td class="actions-cell">
                <button data-id="${lead.id}" class="view-details-btn">View Details</button>
            </td>
        `;
        leadsTableBody.appendChild(row);
    });

    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            openModal(e.target.dataset.id);
        });
    });
}

function updateStats() {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'new').length;
    const contactedCount = leads.filter(l => l.status === 'contacted').length;
    const convertedCount = leads.filter(l => l.status === 'converted').length;
    const conversionRate = total ? ((convertedCount / total) * 100).toFixed(1) : 0;

    statTotal.textContent = total;
    statNew.textContent = newCount;
    statContacted.textContent = contactedCount;
    statConverted.textContent = convertedCount;
    statConversionRate.textContent = conversionRate + '%';
}

function applyFilters() {
    const search = leadSearchInput.value.toLowerCase();
    const filter = leadFilterSelect.value;

    const filtered = leads.filter(lead => {
        const matchSearch =
            lead.name.toLowerCase().includes(search) ||
            lead.email.toLowerCase().includes(search);

        const matchStatus =
            filter === 'all' || lead.status === filter;

        return matchSearch && matchStatus;
    });

    renderLeads(filtered);
}

// ==============================
// MODAL FUNCTIONS
// ==============================

function openModal(id) {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    currentLeadId = id;

    modalLeadName.textContent = lead.name;
    modalLeadEmail.textContent = lead.email;
    modalLeadPhone.textContent = lead.phone || 'N/A';
    modalLeadSource.textContent = lead.source;
    modalLeadCreatedAt.textContent = formatDate(lead.createdAt);
    modalLeadStatus.value = lead.status;

    renderNotes(lead.notes);

    leadDetailModal.classList.add('active');
}

function closeModal() {
    leadDetailModal.classList.remove('active');
    currentLeadId = null;
}

function renderNotes(notes) {
    modalLeadNotesList.innerHTML = '';

    if (!notes.length) {
        modalLeadNotesList.innerHTML = '<p>No notes yet.</p>';
        return;
    }

    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-item';
        div.innerHTML = `
            <p>${note.text}</p>
            <small>${formatDate(note.date)}</small>
        `;
        modalLeadNotesList.appendChild(div);
    });
}

// ==============================
// EVENT LISTENERS
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    updateStats();
});

leadSearchInput.addEventListener('input', applyFilters);
leadFilterSelect.addEventListener('change', applyFilters);

closeModalButton.addEventListener('click', closeModal);

leadDetailModal.addEventListener('click', e => {
    if (e.target === leadDetailModal) closeModal();
});

saveStatusBtn.addEventListener('click', () => {
    const lead = leads.find(l => l.id === currentLeadId);
    if (!lead) return;

    const newStatus = modalLeadStatus.value;
    lead.status = newStatus;

    updateStats();
    applyFilters();
    showToast('Status updated successfully!', 'success');
});

addNoteBtn.addEventListener('click', () => {
    const text = newNoteTextarea.value.trim();
    if (!text) {
        showToast('Note cannot be empty!', 'error');
        return;
    }

    const lead = leads.find(l => l.id === currentLeadId);
    if (!lead) return;

    lead.notes.push({
        text,
        date: new Date().toISOString()
    });

    newNoteTextarea.value = '';
    renderNotes(lead.notes);
    showToast('Note added successfully!', 'success');
});

// ==============================
// SIDEBAR TOGGLE (Mobile)
// ==============================

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    document.addEventListener('click', e => {
        if (
            window.innerWidth <= 992 &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {
            sidebar.classList.remove('active');
        }
    });
}