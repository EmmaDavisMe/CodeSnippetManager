# Code Snippet Manager

A simple, lightweight web-based tool for organizing and managing your code snippets. Perfect for developers who want to keep their frequently used code snippets organized and easily accessible.

## Features

- **Add Snippets**: Store code snippets with titles, language tags, and custom tags
- **Search**: Quickly find snippets by title, content, tags, or programming language
- **Copy to Clipboard**: One-click copying of snippet code
- **Export/Import**: Backup and restore your snippets as JSON files
- **Local Storage**: All data is stored locally in your browser
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Languages**: Support for 20+ programming languages

## Supported Languages

JavaScript, Python, Java, C++, C, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, TypeScript, CSS, HTML, SQL, Bash, JSON, XML, YAML

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding your code snippets!

Alternatively, you can serve it locally:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## Usage

### Adding a Snippet
1. Fill in the title field
2. Select the programming language (optional)
3. Paste your code in the text area
4. Add tags separated by commas (optional)
5. Click "Add Snippet"

### Finding Snippets
- Use the search bar to find snippets by any text
- Search works across titles, code content, tags, and languages

### Managing Snippets
- Click "Copy" to copy the code to your clipboard
- Click "Delete" to remove a snippet
- Use "Export All" to download your snippets as a JSON file
- Use "Import" to restore snippets from a backup file

## File Structure

```
CodeSnippetManager/
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # JavaScript functionality
├── package.json        # Project metadata
└── README.md           # This file
```

## Browser Compatibility

This tool uses modern web APIs and requires:
- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+

## License

MIT License - feel free to use and modify as needed.