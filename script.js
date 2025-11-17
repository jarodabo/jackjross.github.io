// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const tabTriggers = document.querySelectorAll('.tab-trigger');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');
const commandPalette = document.getElementById('command-palette');
const closePalette = document.getElementById('close-palette');
const commitInfo = document.getElementById('commit-info');
const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');

// Content storage
const content = {
    projects: `# Projects

## Chicago Streets (Ongoing)
Documenting the urban landscape and human stories of Chicago through street photography.

- Black and white urban photography
- Focus on human moments and architectural interplay
- Exploring neighborhoods and communities

## Vietnam 2025 (Upcoming)
Returning to Vietnam for a new photographic series.

- Building on 2018-2023 documentation
- New perspectives and stories
- Cultural exploration

## Vietnam 2018-2023
Five years of documenting Vietnam's streets, people, and culture.

- Long-term photographic project
- Multiple visits and deep cultural immersion
- Published work and exhibitions
`,
    tools: `# Tools

## Photography Gear
- Primary camera body
- Street photography lenses
- Editing software (Lightroom, Capture One)

## Digital Tools
- Squarespace for portfolio
- Substack for newsletter
- Social media management

## Workflow
- RAW file management
- Cloud backup solutions
- Project organization systems
`,
    blog: `# Blog

Coming soon - thoughts on photography, travel, and creative process.

Check out my [Substack](https://jackjross.substack.com) for the latest writing.
`
};

// Tab switching
function switchTab(tabName) {
    tabTriggers.forEach(trigger => {
        if (trigger.dataset.tab === tabName) {
            trigger.classList.add('active');
        } else {
            trigger.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === `${tabName}-content`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Load content
    const bodyElement = document.getElementById(`${tabName}-body`);
    if (bodyElement && content[tabName]) {
        bodyElement.innerHTML = `<code>${marked.parse(content[tabName])}</code>`;
    }

    // Random additions/deletions for effect
    const additions = Math.floor(Math.random() * 20);
    const deletions = Math.floor(Math.random() * 10);
    document.getElementById('additions').textContent = `+${additions}`;
    document.getElementById('deletions').textContent = `-${deletions}`;
}

// Tab click handlers
tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        switchTab(trigger.dataset.tab);
    });
});

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update icon
    themeIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    lucide.createIcons();
}

themeToggle.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.setAttribute('data-lucide', 'moon');
    lucide.createIcons();
}

// Command palette
function toggleCommandPalette() {
    commandPalette.classList.toggle('active');
}

closePalette.addEventListener('click', () => {
    commandPalette.classList.remove('active');
});

commandPalette.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
        commandPalette.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Skip if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
            commandPalette.classList.remove('active');
        }
        return;
    }

    // Command palette toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
    }

    // Close command palette
    if (e.key === 'Escape') {
        commandPalette.classList.remove('active');
        return;
    }

    // Tab shortcuts
    switch (e.key.toLowerCase()) {
        case 'p':
            switchTab('projects');
            break;
        case 't':
            switchTab('tools');
            break;
        case 'b':
            switchTab('blog');
            break;
    }
});

// Sidebar resizing
let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.classList.add('resizing');
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const newWidth = e.clientX;
    if (newWidth >= 250 && newWidth <= 600) {
        sidebar.style.width = `${newWidth}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        document.body.classList.remove('resizing');
    }
});

// Update commit info
function updateCommitInfo() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    commitInfo.textContent = `last updated ${formattedDate}`;
}

// Sidebar link handlers
document.querySelectorAll('.sidebar a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        switchTab(tabName);
    });
});

// Initialize
switchTab('projects');
updateCommitInfo();

// Refresh commit info every 15 minutes
setInterval(updateCommitInfo, 15 * 60 * 1000);
