# Contributing to Enhanced File Explorer for Chrome

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Enhanced-File-Explorer-for-Chrome.git
   ```
3. **Load the extension** in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

## Development

### Project Structure

```
Enhanced-File-Explorer-for-Chrome/
├── manifest.json      # Extension manifest
├── content.js         # Main content script (injected into file:// pages)
├── styles.css         # Styling for file explorer
├── themes.js          # Theme and font definitions
├── background.js      # Service worker for extension events
├── options/           # Settings page
├── popup/             # Browser action popup
├── icons/             # SVG icons for files/folders
└── images/            # Extension icons
```

### Key Files

- **themes.js**: Add new themes or fonts here
- **styles.css**: Modify styling and add new CSS features
- **content.js**: Main logic for enhancing the file explorer
- **options/**: Settings page UI and logic

## Making Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style:
   - Use 2-space indentation
   - Use `"use strict";` at the top of JS files
   - Keep functions small and focused
   - Use meaningful variable names

3. Test your changes:
   - Load the unpacked extension in Chrome
   - Navigate to any `file://` directory
   - Test all affected features
   - Test with different themes

4. Commit your changes:
   ```bash
   git commit -m "Add: brief description of your change"
   ```

## Pull Request Process

1. Update the README.md if needed
2. Update version in manifest.json for significant changes
3. Push to your fork and create a Pull Request
4. Describe your changes clearly in the PR description
5. Link any related issues

## Reporting Issues

When reporting bugs, please include:

- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

We welcome feature requests! Please:

- Check if it's already been requested
- Describe the use case
- Explain how it would benefit users

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
