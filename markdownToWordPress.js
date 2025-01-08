/**
 * Converts Markdown headings to WordPress HTML format.
 * @param {string} markdown - The Markdown text to convert.
 * @returns {string} - The converted WordPress HTML.
 */
function convertMarkdownToWordPress(markdown) {
    // Split the input text into lines
    const lines = markdown.split('\n');
    let result = '';
    let unorderedListStarted = false;
    let orderedListStarted = false;
    let tableStarted = false;
    let tableRows = [];

    // Iterate over each line to detect headings
    lines.forEach(line => {
        const headingMatch = line.match(/^(#+)\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length; // Number of '#' indicates heading level
            const content = headingMatch[2]; // The heading text

            // Construct WordPress heading block
            if (level === 1) {
                result += `<!-- wp:heading {\"level\":1} -->\n`;
                result += `<h1 class=\"wp-block-heading\">${content}</h1>\n`;
            } else if (level === 2) {
                result += `<!-- wp:heading -->\n`;
                result += `<h2 class=\"wp-block-heading\">${content}</h2>\n`;
            } else {
                result += `<!-- wp:heading {\"level\":${level}} -->\n`;
                result += `<h${level} class=\"wp-block-heading\">${content}</h${level}>\n`;
            }
            result += `<!-- /wp:heading -->\n`;
            result += `\n`;
        } else if (line.match(/^\d+\. /)) {
            // Handle ordered list
            if (!orderedListStarted) {
                result += `<!-- wp:list {\"ordered\":true} -->\n`;
                result += `<ol class=\"wp-block-list\">\n`;
                orderedListStarted = true;
            }
            result += `<!-- wp:list-item -->\n`;
            result += `<li>${line.slice(line.indexOf(" ") + 1).trim()}</li>\n`;
            result += `<!-- /wp:list-item -->\n\n`;
        } else if (orderedListStarted) {
            result += `</ol>\n`;
            result += `<!-- /wp:list -->\n\n`;
            orderedListStarted = false;
        } else if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
            // Handle unordered list
            if (!unorderedListStarted) {
                result += `<!-- wp:list -->\n`;
                result += `<ul class=\"wp-block-list\">\n`;
                unorderedListStarted = true;
            }
            result += `<!-- wp:list-item -->\n`;
            result += `<li>${line.slice(2).trim()}</li>\n`;
            result += `<!-- /wp:list-item -->\n\n`;
        } else if (unorderedListStarted) {
            result += `</ul>\n`;
            result += `<!-- /wp:list -->\n\n`;
            unorderedListStarted = false;
        } else if (line.startsWith("|")) {
            // Handle table
            if (!tableStarted) {
                tableStarted = true;
            }
            tableRows.push(line);
        } else if (tableStarted) {
            // Process the table rows
            const headers = tableRows[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
            const rows = tableRows.slice(2).map(row => row.split('|').filter(cell => cell.trim()).map(cell => cell.trim()));

            let tableHtml = '<!-- wp:table -->\n<figure class="wp-block-table"><table class="has-fixed-layout"><thead><tr>';
            headers.forEach(header => {
                tableHtml += `<th>${header.replace(/</g, '&lt;').replace(/--/g, '')}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';

            rows.forEach(row => {
                tableHtml += '<tr>';
                row.forEach(cell => {
                    tableHtml += `<td>${cell.replace(/</g, '&lt;')}</td>`;
                });
                tableHtml += '</tr>';
            });

            tableHtml += '</tbody></table></figure>\n<!-- /wp:table -->\n\n';
            result += tableHtml;
            tableStarted = false;
            tableRows = [];
        } else if (line.trim() !== "") {
            // Handle paragraphs
            result += `<!-- wp:paragraph -->\n`;
            result += `<p>${line.trim()}</p>\n`;
            result += `<!-- /wp:paragraph -->\n\n`;
        }
    });

    if (unorderedListStarted) {
        result += `</ul>\n`;
        result += `<!-- /wp:list -->\n\n`;
    }

    if (orderedListStarted) {
        result += `</ol>\n`;
        result += `<!-- /wp:list -->\n\n`;
    }

    if (tableStarted) {
        // Process the table rows
        const headers = tableRows[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        const rows = tableRows.slice(2).map(row => row.split('|').filter(cell => cell.trim()).map(cell => cell.trim()));

        let tableHtml = '<!-- wp:table -->\n<figure class="wp-block-table"><table class="has-fixed-layout"><thead><tr>';
        headers.forEach(header => {
            tableHtml += `<th>${header.replace(/</g, '&lt;').replace(/--/g, '')}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';

        rows.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td>${cell.replace(/</g, '&lt;')}</td>`;
            });
            tableHtml += '</tr>';
        });

        tableHtml += '</tbody></table></figure>\n<!-- /wp:table -->\n\n';
        result += tableHtml;
    }

    return result;
}

// Example usage
const markdownText = '# This is heading';
console.log(convertMarkdownToWordPress(markdownText));
