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

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSnippet();
        });

        searchInput.addEventListener('input', (e) => {
            this.searchSnippets(e.target.value);
        });
    }

    addSnippet() {
        const title = document.getElementById('snippet-title').value.trim();
        const language = document.getElementById('snippet-language').value;
        const code = document.getElementById('snippet-code').value.trim();
        const tags = document.getElementById('snippet-tags').value.trim();

        if (!title || !code) {
            alert('Please fill in title and code fields');
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
    }

    clearForm() {
        document.getElementById('snippet-form').reset();
    }

    saveToStorage() {
        localStorage.setItem('codeSnippets', JSON.stringify(this.snippets));
    }

    renderSnippets(snippetsToRender = this.snippets) {
        const container = document.getElementById('snippets-container');
        
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
            alert('Failed to copy to clipboard');
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const snippetManager = new CodeSnippetManager();