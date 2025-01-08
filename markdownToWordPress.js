// markdownToWordPress.js
function convertMarkdownToWordPress(markdown) {
    // Convert H2 headings
    const converted = markdown.replace(/## (.+)/g, (match, content) => {
        return `<!-- wp:heading -->\n<h2 class="wp-block-heading">${content.trim()}</h2>\n<!-- /wp:heading -->`;
    });

    return converted;
}

// Export the function if needed
window.convertMarkdownToWordPress = convertMarkdownToWordPress;
