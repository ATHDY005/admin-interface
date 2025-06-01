// Job Management Application - Pure JavaScript Implementation

// Sample initial jobs data (6 jobs)
const initialJobs = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'Amazon',
    location: 'Chennai',
    jobType: 'FullTime',
    salaryMin: 50000,
    salaryMax: 80000,
    description:
      'A user-friendly interface lets you browse stunning photos and videos. Filter destinations based on time, travel style, and create personalized experiences.',
    deadline: '2023-12-31',
    createdAt: new Date(Date.now() - 86400000), // 24 hours ago
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Microsoft',
    location: 'Bangalore',
    jobType: 'FullTime',
    salaryMin: 60000,
    salaryMax: 90000,
    description:
      'Icarily interfaces lets you browse photos and videos for the first time and to find creative personalized solutions.',
    deadline: '2023-11-30',
    createdAt: new Date(Date.now() - 172800000), // 48 hours ago
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'Swiggy',
    location: 'Delhi',
    jobType: 'Contract',
    salaryMin: 70000,
    salaryMax: 100000,
    description:
      'Looking for a backend developer to work on our high-traffic food delivery platform.',
    deadline: '2024-01-15',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Google',
    location: 'Hyderabad',
    jobType: 'FullTime',
    salaryMin: 55000,
    salaryMax: 85000,
    description:
      'Design beautiful interfaces that users love. Work with product teams to create intuitive experiences.',
    deadline: '2023-12-15',
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Mumbai',
    jobType: 'FullTime',
    salaryMin: 80000,
    salaryMax: 120000,
    description:
      'Build and maintain our cloud infrastructure to ensure high availability and scalability.',
    deadline: '2024-02-28',
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: 6,
    title: 'Data Scientist',
    company: 'Uber',
    location: 'Pune',
    jobType: 'PartTime',
    salaryMin: 45000,
    salaryMax: 70000,
    description:
      'Analyze large datasets to extract insights and help drive business decisions.',
    deadline: '2023-12-10',
    createdAt: new Date(Date.now() - 28800000), // 8 hours ago
  },
];

// Application State
let state = {
  jobs: [],
  draftJob: null,
};

// DOM Elements
const elements = {
  jobListView: document.getElementById('job-list-view'),
  jobsGrid: document.getElementById('jobs-grid'),
  jobSearch: document.getElementById('job-search'),
  locationSearch: document.getElementById('location-search'),
  jobTypeFilter: document.getElementById('job-type-filter'),
  salaryRange: document.getElementById('salary-range'),
  createJobForm: document.getElementById('create-job-form'),
  saveDraftBtn: document.getElementById('save-draft-btn'),
  createJobBtn: document.querySelector('.create-job-btn'),
  navLinks: document.querySelectorAll('.nav-link'),
  modalOverlay: document.getElementById('modal-overlay'),
  closeModal: document.querySelector('.close-modal'),
};

// Initialize the application
function init() {
  loadJobs();
  renderJobs();
  setupEventListeners();
  updateActiveNavLink();
  updateSalaryLabel();

  // Setup location dropdown
  setupLocationDropdown();
}

// Load jobs from localStorage or use initial data
function loadJobs() {
  const savedJobs = localStorage.getItem('jobs');
  state.jobs = savedJobs ? JSON.parse(savedJobs) : initialJobs;
}

// Save jobs to localStorage
function saveJobs() {
  localStorage.setItem('jobs', JSON.stringify(state.jobs));
}

// Render jobs to the grid
function renderJobs(filteredJobs = null) {
  const jobsToRender = filteredJobs || state.jobs;

  elements.jobsGrid.innerHTML = jobsToRender
    .map(
      (job) => `
    <div class="job-card-exact">
      <!-- Company Logo -->
      <div class="company-logo">
        <img src="logos/${job.company.toLowerCase()}.png" alt="${
        job.company
      } Logo" onerror="this.src='logos/default.png'">
      </div>
      
      <!-- Time Badge -->
      <div class="time-badge">
        ${formatTimeAgo(job.createdAt)}
      </div>
      
      <!-- Job Header -->
      <div class="job-header">
        <h3>${job.title}</h3>
      </div>
      
      <!-- Job Meta -->
      <div class="job-meta">
        <span>💷 ${formatJobType(job.jobType)}</span>
        <span>💸 ${formatSalary(job.salaryMin, job.salaryMax)}</span>
      </div>
      
      <!-- Job Description -->
      <p class="job-description">${job.description}</p>
      
      <!-- Apply Button -->
      <div class="job-footer">
        <button class="apply-btn">Apply Now</button>
      </div>
    </div>
  `
    )
    .join('');
}

// Format job type for display
function formatJobType(jobType) {
  const types = {
    FullTime: 'Full-time',
    PartTime: 'Part-time',
    Contract: 'Contract',
    Internship: 'Internship',
  };
  return types[jobType] || jobType;
}

// Format salary for display
function formatSalary(min, max) {
  if (min && max) {
    return `${min / 1000}k-${max / 1000}k`;
  }
  return 'Not specified';
}

// Format time ago for display
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  const days = Math.floor(seconds / 86400);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

// Filter jobs based on search and filters
function filterJobs() {
  const searchTerm = elements.jobSearch.value.toLowerCase();
  const locationTerm = elements.locationSearch.value.toLowerCase();
  const jobType = elements.jobTypeFilter.value;
  const maxSalary = parseInt(elements.salaryRange.value);

  const filtered = state.jobs.filter((job) => {
    // Search term matching
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm);

    // Location matching
    const matchesLocation =
      !locationTerm || job.location.toLowerCase().includes(locationTerm);

    // Job type matching
    const matchesJobType = !jobType || job.jobType === jobType;

    // Salary range matching
    const matchesSalary = job.salaryMax <= maxSalary;

    return matchesSearch && matchesLocation && matchesJobType && matchesSalary;
  });

  renderJobs(filtered);
}

// Update salary range label
function updateSalaryLabel() {
  const maxSalary = parseInt(elements.salaryRange.value);
  document.querySelector('.slider-labels span:last-child').textContent = `${
    maxSalary / 1000
  }k`;
}

// Handle create job form submission
function handleCreateJob(e) {
  e.preventDefault();

  const newJob = {
    id: Date.now(),
    title: document.getElementById('job-title').value,
    company: document.getElementById('company-name').value,
    location: document.getElementById('job-location').value,
    jobType: document.getElementById('job-type').value,
    salaryMin: parseInt(document.getElementById('salary-min').value) || 0,
    salaryMax: parseInt(document.getElementById('salary-max').value) || 0,
    description: document.getElementById('job-description').value,
    deadline: document.getElementById('application-deadline').value,
    createdAt: new Date(),
  };

  state.jobs.unshift(newJob);
  saveJobs();
  renderJobs();
  closeModal();
  elements.createJobForm.reset();
  state.draftJob = null;
  localStorage.removeItem('draftJob');
}

// Save job as draft
function saveDraft() {
  state.draftJob = {
    title: document.getElementById('job-title').value,
    company: document.getElementById('company-name').value,
    location: document.getElementById('job-location').value,
    jobType: document.getElementById('job-type').value,
    salaryMin: parseInt(document.getElementById('salary-min').value) || 0,
    salaryMax: parseInt(document.getElementById('salary-max').value) || 0,
    description: document.getElementById('job-description').value,
    deadline: document.getElementById('application-deadline').value,
  };

  localStorage.setItem('draftJob', JSON.stringify(state.draftJob));
  alert('Draft saved! You can continue later.');
}

// Load draft if exists
function loadDraft() {
  const savedDraft = localStorage.getItem('draftJob');
  if (savedDraft) {
    state.draftJob = JSON.parse(savedDraft);
    document.getElementById('job-title').value = state.draftJob.title || '';
    document.getElementById('company-name').value =
      state.draftJob.company || '';
    document.getElementById('job-location').value =
      state.draftJob.location || '';
    document.getElementById('job-type').value =
      state.draftJob.jobType || 'FullTime';
    document.getElementById('salary-min').value =
      state.draftJob.salaryMin || '';
    document.getElementById('salary-max').value =
      state.draftJob.salaryMax || '';
    document.getElementById('job-description').value =
      state.draftJob.description || '';
    document.getElementById('application-deadline').value =
      state.draftJob.deadline || '';
  }
}

// Show modal
function showModal() {
  elements.modalOverlay.classList.add('active');
  loadDraft();
}

// Close modal
function closeModal() {
  elements.modalOverlay.classList.remove('active');
}

// Update active nav link
function updateActiveNavLink() {
  elements.navLinks.forEach((link) => {
    link.classList.remove('active');
  });

  document.querySelector('.nav-link').classList.add('active');
}

// Setup location dropdown
function setupLocationDropdown() {
  const locationFilter = document.querySelector('.location-filter');
  const locationOptions = document.querySelector('.location-options');
  const locationInput = document.getElementById('location-search');

  locationFilter.addEventListener('click', function () {
    locationOptions.style.display =
      locationOptions.style.display === 'block' ? 'none' : 'block';
  });

  document.querySelectorAll('.location-option').forEach((option) => {
    option.addEventListener('click', function () {
      locationInput.value = this.getAttribute('data-value');
      locationOptions.style.display = 'none';
      filterJobs();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!locationFilter.contains(e.target)) {
      locationOptions.style.display = 'none';
    }
  });
}

// Set up event listeners
function setupEventListeners() {
  // Navigation
  elements.createJobBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
  });

  elements.navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      elements.navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Search and filters
  elements.jobSearch.addEventListener('input', filterJobs);
  elements.jobTypeFilter.addEventListener('change', filterJobs);
  elements.salaryRange.addEventListener('input', function () {
    updateSalaryLabel();
    filterJobs();
  });

  // Form submission
  elements.createJobForm.addEventListener('submit', handleCreateJob);
  elements.saveDraftBtn.addEventListener('click', saveDraft);

  // Modal close
  elements.closeModal.addEventListener('click', closeModal);
  elements.modalOverlay.addEventListener('click', function (e) {
    if (e.target === elements.modalOverlay) {
      closeModal();
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
