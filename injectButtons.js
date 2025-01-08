// Function to create and inject the Copy Clean and Send to WP buttons
function injectButtons() {
    // Find all response containers
    const responseContainers = document.querySelectorAll('.mt-sm.flex.items-center.justify-between');
    
    responseContainers.forEach(container => {
        // Check if buttons already exist
        if (container.querySelector('.copy-clean-btn') && container.querySelector('.send-wp-btn')) return;

        // Find the rewrite button container
        const rewriteBtn = container.querySelector('button:has(svg[data-icon="repeat"])');
        if (!rewriteBtn) return;

        // Base button class for consistent styling
        const baseButtonClass = 'focus-visible:bg-offsetPlus dark:focus-visible:bg-offsetPlusDark md:hover:bg-offsetPlus text-textOff dark:text-textOffDark md:hover:text-textMain dark:md:hover:bg-offsetPlusDark dark:md:hover:text-textMainDark font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button justify-center text-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm px-sm font-medium h-8';

        // Create a container for our custom buttons if it doesn't exist
        let buttonsContainer = container.querySelector('.custom-buttons-container');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'custom-buttons-container inline-flex';
            // Prevent clicks within the container from bubbling up
            buttonsContainer.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            // Insert container after Rewrite button
            rewriteBtn.parentNode.insertBefore(buttonsContainer, rewriteBtn.nextSibling);
        }

        // Create Copy Clean button if it doesn't exist
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
                // Prevent event propagation
                event.stopPropagation();
                
                // Click the original copy button first
                const copyBtn = container.querySelector('button:has(svg[data-icon="copy"])');
                copyBtn?.click();
                
                // Wait a brief moment for the copy operation to complete
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Get clipboard content and clean it
                try {
                    const text = await navigator.clipboard.readText();
                    const cleanedText = text
                        .split(/Citations:[\s\S]*/)[0]
                        .replace(/\[\d+\]/g, '')
                        .trim();
                    
                    // Copy cleaned text back to clipboard
                    await navigator.clipboard.writeText(cleanedText);
                } catch (error) {
                    console.error('Failed to clean clipboard content:', error);
                }
            });

            // Insert Copy Clean button into the container
            buttonsContainer.appendChild(copyCleanBtn);
        }

        // Create Send to WP button if it doesn't exist
        if (!container.querySelector('.send-wp-btn')) {
            const sendWPBtn = document.createElement('button');
            sendWPBtn.className = `${baseButtonClass} send-wp-btn ml-2`;
            sendWPBtn.type = 'button';
            
            sendWPBtn.innerHTML = `
                <div class="flex items-center min-w-0 justify-center gap-xs">
                    <svg aria-hidden="true" focusable="false" data-icon="paper-plane" class="svg-inline--fa fa-paper-plane fa-fw fa-1x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M502.3 9.6c-12.5-12.5-32.8-12.5-45.3 0L1.4 233.4c-10.7 10.7-10.7 27.9 0 38.6l455.6 455.6c12.5 12.5 32.8 12.5 45.3 0l9.9-9.9c12.5-12.5 12.5-32.8 0-45.3L66.7 256 502.3 9.6zM256 66.7L66.7 256 256 445.3 256 66.7z"/>
                    </svg>
                    <div class="text-align-center relative truncate leading-loose">Send to WP</div>
                </div>`;

            // Add click handler for Send to WP button
            sendWPBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                // Implement the logic to send the content to WordPress
                console.log('Send to WP button clicked. Implement the logic here.');
            });

            // Insert Send to WP button into the container
            buttonsContainer.appendChild(sendWPBtn);
        }
    });
}
