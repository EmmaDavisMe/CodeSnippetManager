class CodeSnippetManager {
    constructor() {
        this.snippets = JSON.parse(localStorage.getItem('codeSnippets')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderSnippets();
    }

    setupEventListeners() {
        const form = document.getElementById('snippet-form');
        const searchInput = document.getElementById('search-input');
        const exportBtn = document.getElementById('export-btn');
        const importBtn = document.getElementById('import-btn');
        const importFile = document.getElementById('import-file');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSnippet();
        });

        searchInput.addEventListener('input', (e) => {
            this.searchSnippets(e.target.value);
        });

        exportBtn.addEventListener('click', () => {
            this.exportSnippets();
        });

        importBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            this.importSnippets(e.target.files[0]);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement.closest('#snippet-form')) {
                    e.preventDefault();
                    this.addSnippet();
                }
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('search-input');
                if (searchInput.value) {
                    searchInput.value = '';
                    this.renderSnippets();
                    searchInput.focus();
                }
            }
        });
    }

    addSnippet() {
        const title = document.getElementById('snippet-title').value.trim();
        const language = document.getElementById('snippet-language').value;
        const code = document.getElementById('snippet-code').value.trim();
        const tags = document.getElementById('snippet-tags').value.trim();

        if (!title || !code) {
            this.showMessage('Please fill in title and code fields', 'error');
            return;
        }

        const snippet = {
            id: Date.now(),
            title,
            language,
            code,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            createdAt: new Date().toISOString()
        };

        this.snippets.unshift(snippet);
        this.saveToStorage();
        this.renderSnippets();
        this.clearForm();
        this.showMessage('Snippet added successfully!', 'success');
    }

    clearForm() {
        document.getElementById('snippet-form').reset();
    }

    saveToStorage() {
        localStorage.setItem('codeSnippets', JSON.stringify(this.snippets));
    }

    renderSnippets(snippetsToRender = this.snippets) {
        const container = document.getElementById('snippets-container');
        const countBadge = document.getElementById('snippet-count');
        
        // Update count badge
        countBadge.textContent = this.snippets.length;
        
        if (snippetsToRender.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No snippets found. Add your first snippet above!</p>';
            return;
        }

        container.innerHTML = snippetsToRender.map(snippet => `
            <div class="snippet-item">
                <div class="snippet-header">
                    <div class="snippet-title">${this.escapeHtml(snippet.title)}</div>
                    <div>
                        ${snippet.language ? `<span class="snippet-language">${snippet.language}</span>` : ''}
                        <button onclick="snippetManager.copyToClipboard(${snippet.id})" style="background: #38a169; margin-left: 10px;">Copy</button>
                        <button onclick="snippetManager.deleteSnippet(${snippet.id})" style="background: #e53e3e; margin-left: 5px;">Delete</button>
                    </div>
                </div>
                <div class="snippet-code">${this.escapeHtml(snippet.code)}</div>
                ${snippet.tags.length > 0 ? `
                    <div class="snippet-tags">
                        ${snippet.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                <small style="color: #666;">Created: ${new Date(snippet.createdAt).toLocaleDateString()}</small>
            </div>
        `).join('');
    }

    copyToClipboard(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (!snippet) return;

        navigator.clipboard.writeText(snippet.code).then(() => {
            const copyButton = event.target;
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            copyButton.style.background = '#48bb78';
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.style.background = '#38a169';
            }, 2000);
        }).catch(err => {
            this.showMessage('Failed to copy to clipboard', 'error');
            console.error('Copy failed:', err);
        });
    }

    deleteSnippet(id) {
        if (confirm('Are you sure you want to delete this snippet?')) {
            this.snippets = this.snippets.filter(snippet => snippet.id !== id);
            this.saveToStorage();
            this.renderSnippets();
        }
    }

    searchSnippets(query) {
        if (!query.trim()) {
            this.renderSnippets();
            return;
        }

        const filtered = this.snippets.filter(snippet => 
            snippet.title.toLowerCase().includes(query.toLowerCase()) ||
            snippet.code.toLowerCase().includes(query.toLowerCase()) ||
            snippet.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            snippet.language.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSnippets(filtered);
    }

    exportSnippets() {
        if (this.snippets.length === 0) {
            this.showMessage('No snippets to export', 'error');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            snippets: this.snippets
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `code-snippets-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    importSnippets(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.snippets || !Array.isArray(data.snippets)) {
                    this.showMessage('Invalid file format', 'error');
                    return;
                }

                const confirmed = confirm(`Import ${data.snippets.length} snippets? This will add to your existing snippets.`);
                if (!confirmed) return;

                const importedSnippets = data.snippets.map(snippet => ({
                    ...snippet,
                    id: Date.now() + Math.random(),
                    createdAt: snippet.createdAt || new Date().toISOString()
                }));

                this.snippets = [...importedSnippets, ...this.snippets];
                this.saveToStorage();
                this.renderSnippets();
                
                this.showMessage(`Successfully imported ${importedSnippets.length} snippets!`, 'success');
                
                document.getElementById('import-file').value = '';
            } catch (error) {
                this.showMessage('Error reading file. Please make sure it\'s a valid JSON file.', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
    }

    showMessage(text, type = 'info') {
        // Remove existing message if any
        const existingMsg = document.querySelector('.message-toast');
        if (existingMsg) {
            existingMsg.remove();
        }

        const message = document.createElement('div');
        message.className = `message-toast message-${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const snippetManager = new CodeSnippetManager();