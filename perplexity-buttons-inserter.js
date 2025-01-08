// perplexity-buttons-inserter.js
// Version: 1.0.0
// This file contains the dynamic button insertion logic for the Perplexity to WordPress Chrome extension

/**
 * Injects Copy Clean and Send to WP buttons into Perplexity AI interface
 * @returns {void}
 */
function injectButtons() {
    // Find all response containers
    const responseContainers = document.querySelectorAll('.mt-sm.flex.items-center.justify-between');
    
    responseContainers.forEach(container => {
        // Check if buttons already exist to prevent duplication
        if (container.querySelector('.copy-clean-btn') && container.querySelector('.send-wp-btn')) return;
        
        // Find the rewrite button container as reference point
        const rewriteBtn = container.querySelector('button:has(svg[data-icon="repeat"])');
        if (!rewriteBtn) return;
        
        // Define base button class for consistent styling with Perplexity's UI
        const baseButtonClass = 'focus-visible:bg-offsetPlus dark:focus-visible:bg-offsetPlusDark md:hover:bg-offsetPlus text-textOff dark:text-textOffDark md:hover:text-textMain dark:md:hover:bg-offsetPlusDark dark:md:hover:text-textMainDark font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button justify-center text-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm px-sm font-medium h-8';

        // Create container for custom buttons
        let buttonsContainer = container.querySelector('.custom-buttons-container');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'custom-buttons-container inline-flex';
            // Prevent event bubbling
            buttonsContainer.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            // Insert after the rewrite button
            rewriteBtn.parentNode.insertBefore(buttonsContainer, rewriteBtn.nextSibling);
        }

        // Create and inject Copy Clean button
        if (!container.querySelector('.copy-clean-btn')) {
            const copyCleanBtn = document.createElement('button');
            copyCleanBtn.className = `${baseButtonClass} copy-clean-btn ml-2`;
            copyCleanBtn.type = 'button';
            
            copyCleanBtn.innerHTML = `
                <div class="flex items-center min-w-0 justify-center gap-xs">
                    <svg aria-hidden="true" focusable="false" data-icon="broom" class="svg-inline--fa fa-broom fa-fw fa-1x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M566.6 9.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0l-96-96c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L352 178.7 521.4 9.4c12.5-12.5 32.8-12.5 45.3 0zM160 256c0-17.7 14.3-32 32-32s32 14.3 32 32v48h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H224v48c0 17.7-14.3 32-32 32s-32-14.3-32-32V368H48.1c-42.6 0-64.2-51.7-33.9-81.9l99.2-99.2c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-99.2 99.2c-1.5 1.5-.7 4.4 1.7 4.4H160V256zm256 64h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
                    </svg>
                    <div class="text-align-center relative truncate leading-loose">Copy Clean</div>
                </div>`;
            
            // Add click handler for Copy Clean button
            copyCleanBtn.addEventListener('click', async (event) => {
                event.stopPropagation();
                
                // Trigger original copy button
                const copyBtn = container.querySelector('button:has(svg[data-icon="copy"])');
                copyBtn?.click();
                
                // Wait for clipboard operation
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    const text = await navigator.clipboard.readText();
                    const cleanedText = text
                        .split(/Citations:[\s\S]*/)[0]
                        .replace(/\[\d+\]/g, '')
                        .trim();
                    
                    await navigator.clipboard.writeText(cleanedText);
                } catch (error) {
                    console.error('Failed to clean clipboard content:', error);
                }
            });

            buttonsContainer.appendChild(copyCleanBtn);
        }

        // Create and inject Send to WP button
        if (!container.querySelector('.send-wp-btn')) {
            const sendWPBtn = document.createElement('button');
            sendWPBtn.className = `${baseButtonClass} send-wp-btn ml-2`;
            sendWPBtn.type = 'button';
            
            sendWPBtn.innerHTML = `
                <div class="flex items-center min-w-0 justify-center gap-xs">
                    <svg aria-hidden="true" focusable="false" data-icon="wordpress" class="svg-inline--fa fa-wordpress fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M61.7 169.4l101.5 278C92.2 413 43.3 340.2 43.3 256c0-30.9 6.6-60.1 18.4-86.6zm337.9 75.9c0-26.3-9.4-44.5-17.5-58.7-10.8-17.5-20.9-32.4-20.9-49.9 0-19.6 14.8-37.8 35.7-37.8.9 0 1.8.1 2.8.2-37.9-34.7-88.3-55.9-143.7-55.9-74.3 0-139.7 38.1-177.8 95.9 5 .2 9.7.3 13.7.3 22.2 0 56.7-2.7 56.7-2.7 11.5-.7 12.8 16.2 1.4 17.5 0 0-11.5 1.3-24.3 2l77.5 230.4L249.8 247l-33.1-90.8c-11.5-.7-22.3-2-22.3-2-11.5-.7-10.1-18.2 1.3-17.5 0 0 35.1 2.7 56 2.7 22.2 0 56.7-2.7 56.7-2.7 11.5-.7 12.8 16.2 1.4 17.5 0 0-11.5 1.3-24.3 2l76.9 228.7 21.2-70.9c9.1-29.3 16.1-50.3 16.1-68.5zM472.6 169.4c0 51.2-10.1 100.1-28.4 144.2l-91.3-251.3c54-31.7 92-92.1 92-160.9 0-31.9-8.1-61.9-22.2-88.2C470.6 40.5 503.4 94.6 512 156.6c-11.8-21.3-29.1-36.8-49.7-43.7 4.3 17.7 6.6 36.6 6.6 56.5 0 40.7-11.1 80.2-31.9 113.3-20.2 32-49.1 59.3-83.4 77.4l102.2 280.4c49.6-50.6 80.1-119.2 80.1-194.7-.1-81.1-34.9-154.3-90.8-205zm-230.5 9.9l-96.9 266.4c29.1 8.5 59.8 13.1 91.8 13.1 37.8 0 74-7.7 106.9-21.5l-101.8-258zm-130.7-9.9c0 65.5 30.5 134.1 80.1 184.7l-79-216.9c-.7 10.8-1.1 21.7-1.1 32.2z"/>
                    </svg>
                    <div class="text-align-center relative truncate leading-loose">Send to WP</div>
                </div>`;

            // Add click handler for Send to WP button
            sendWPBtn.addEventListener('click', async (event) => {
                event.stopPropagation();
                
                // Trigger Copy Clean functionality first
                const copyCleanBtn = container.querySelector('.copy-clean-btn');
                copyCleanBtn?.click();
                
                // Wait for clipboard operation
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    // Send message to background script to handle WordPress posting
                    chrome.runtime.sendMessage({ action: 'sendToWordPress' });
                } catch (error) {
                    console.error('Failed to send content to WordPress:', error);
                }
            });

            buttonsContainer.appendChild(sendWPBtn);
        }
    });
}

// Create and run mutation observer for dynamic content
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            injectButtons();
        }
    });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial injection
injectButtons();
