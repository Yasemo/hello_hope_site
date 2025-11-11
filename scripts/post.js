// Individual Post Page - Render markdown content

document.addEventListener('DOMContentLoaded', function() {
    renderPost();
});

function renderPost() {
    if (!window.postData) {
        console.error('Post data not found');
        return;
    }

    const postData = window.postData;

    // Set featured image as hero background if available
    if (postData.featuredImage && postData.featuredImage.trim() !== '') {
        const heroSection = document.getElementById('post-hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url('${postData.featuredImage}')`;
        }
    }

    // Configure marked for GitHub Flavored Markdown with enhanced features
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false, // Keep this for security
    });

    // Custom renderer for enhanced GitHub Flavored Markdown features
    const renderer = new marked.Renderer();

    // Enhanced task list renderer
    renderer.listitem = function(text, task, checked) {
        if (task) {
            return `<li class="task-list-item">
                <input type="checkbox" class="task-list-item-checkbox" disabled${checked ? ' checked' : ''}>
                ${text}
            </li>`;
        }
        return `<li>${text}</li>`;
    };

    // Enhanced table renderer with better styling
    renderer.table = function(header, body) {
        return `<div class="markdown-table-container">
            <table class="markdown-table">
                <thead>${header}</thead>
                <tbody>${body}</tbody>
            </table>
        </div>`;
    };

    // Enhanced table cell renderer
    renderer.tablerow = function(content) {
        return `<tr>${content}</tr>`;
    };

    renderer.tablecell = function(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
            ? `<${type} style="text-align: ${flags.align}">`
            : `<${type}>`;
        return `${tag}${content}</${type}>`;
    };

    // Enhanced image renderer with responsive images
    renderer.image = function(href, title, text) {
        const alt = text || '';
        const titleAttr = title ? ` title="${title}"` : '';

        // Check if it's a video link (YouTube, Vimeo, etc.)
        if (isVideoUrl(href)) {
            return renderVideoEmbed(href, alt);
        }

        return `<img src="${href}" alt="${alt}"${titleAttr} loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`;
    };

    // Enhanced link renderer
    renderer.link = function(href, title, text) {
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    marked.setOptions({ renderer });

    // Render markdown content
    const htmlContent = marked.parse(postData.content);

    // Insert rendered content
    const contentElement = document.getElementById('post-content');
    contentElement.innerHTML = htmlContent;

    // Render tags if they exist
    if (postData.tags && postData.tags.length > 0) {
        const tagsElement = document.getElementById('post-tags');
        tagsElement.innerHTML = `
            <h3>Tags</h3>
            <div class="article-tags">
                ${postData.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
            </div>
        `;
    }

    // Apply syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(contentElement);
    }

    // Process any additional enhancements
    enhanceContent();
}

function isVideoUrl(url) {
    // Check for YouTube, Vimeo, and other video platforms
    const videoPatterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
        /vimeo\.com\/(\d+)/i,
        /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/i,
        /twitch\.tv\/videos\/(\d+)/i
    ];

    return videoPatterns.some(pattern => pattern.test(url));
}

function renderVideoEmbed(url, alt) {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; border-radius: 8px;">
            <iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
    if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        return `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; border-radius: 8px;">
            <iframe src="https://player.vimeo.com/video/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`;
    }

    // DailyMotion
    const dailymotionMatch = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/i);
    if (dailymotionMatch) {
        const videoId = dailymotionMatch[1];
        return `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; border-radius: 8px;">
            <iframe src="https://www.dailymotion.com/embed/video/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`;
    }

    // Twitch
    const twitchMatch = url.match(/twitch\.tv\/videos\/(\d+)/i);
    if (twitchMatch) {
        const videoId = twitchMatch[1];
        return `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0; border-radius: 8px;">
            <iframe src="https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`;
    }

    // Fallback - treat as regular image
    return `<img src="${url}" alt="${alt}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`;
}

function enhanceContent() {
    // Add any additional content enhancements here
    // For example, lazy loading for images, smooth scrolling for anchor links, etc.

    // Make tables responsive
    const tables = document.querySelectorAll('#post-content table');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.style.overflowX = 'auto';
        wrapper.style.margin = '20px 0';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });

    // Add target="_blank" to external links (already handled in renderer)

    // Enhance code blocks
    const codeBlocks = document.querySelectorAll('#post-content pre code');
    codeBlocks.forEach(block => {
        block.style.display = 'block';
        block.style.padding = '16px';
        block.style.borderRadius = '8px';
        block.style.background = 'var(--light-gray)';
        block.style.fontFamily = '"Courier New", monospace';
        block.style.fontSize = '0.875rem';
        block.style.lineHeight = '1.5';
        block.style.overflowX = 'auto';
    });

    // Style blockquotes
    const blockquotes = document.querySelectorAll('#post-content blockquote');
    blockquotes.forEach(blockquote => {
        blockquote.style.borderLeft = '4px solid var(--primary-red)';
        blockquote.style.paddingLeft = '20px';
        blockquote.style.margin = '20px 0';
        blockquote.style.fontStyle = 'italic';
        blockquote.style.color = 'var(--text-light)';
        blockquote.style.background = 'var(--light-gray)';
        blockquote.style.padding = '16px 20px';
        blockquote.style.borderRadius = '0 8px 8px 0';
    });
}
