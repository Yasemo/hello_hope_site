// Articles Page - Display blog posts

document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
});

// Load and display articles
async function loadArticles() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const articlesGrid = document.getElementById('articles-grid');
    const emptyState = document.getElementById('empty-state');

    try {
        const response = await fetch('/api/posts');

        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }

        const posts = await response.json();

        // Hide loading state
        loadingState.style.display = 'none';

        if (posts.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        // Display articles
        renderArticles(posts);
        articlesGrid.style.display = 'grid';

    } catch (error) {
        console.error('Error loading articles:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
    }
}

// Render articles to the grid
function renderArticles(posts) {
    const articlesGrid = document.getElementById('articles-grid');
    articlesGrid.innerHTML = '';

    posts.forEach(post => {
        const articleCard = createArticleCard(post);
        articlesGrid.appendChild(articleCard);
    });
}

// Create an article card element
function createArticleCard(post) {
    const card = document.createElement('article');
    card.className = 'article-card';

    const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const excerpt = post.excerpt || post.content.substring(0, 150) + '...';

    card.innerHTML = `
        ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" class="article-image" loading="lazy">` : ''}
        <div class="article-content">
            <div class="article-meta">
                <span class="article-author">By ${post.author}</span>
                <span class="article-date">${publishDate}</span>
            </div>
            <h2 class="article-title">${post.title}</h2>
            <p class="article-excerpt">${excerpt}</p>
            <div class="article-footer">
                ${post.tags && post.tags.length > 0 ? `
                    <div class="article-tags">
                        ${post.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="/articles/${post.id}" class="read-more-btn">Read More</a>
            </div>
        </div>
    `;

    return card;
}

// Handle retry button
document.getElementById('retry-btn')?.addEventListener('click', function() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const articlesGrid = document.getElementById('articles-grid');
    const emptyState = document.getElementById('empty-state');

    // Reset states
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    articlesGrid.style.display = 'none';
    emptyState.style.display = 'none';

    // Retry loading
    loadArticles();
});
