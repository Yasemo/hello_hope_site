// Admin Dashboard - Blog post management

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthStatus();

    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // New post button
    const newPostBtn = document.getElementById('new-post-btn');
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => showPostEditor());
    }

    const createFirstPostBtn = document.getElementById('create-first-post-btn');
    if (createFirstPostBtn) {
        createFirstPostBtn.addEventListener('click', () => showPostEditor());
    }

    // Back to posts button
    const backToPostsBtn = document.getElementById('back-to-posts');
    if (backToPostsBtn) {
        backToPostsBtn.addEventListener('click', () => showPostsList());
    }

    // Post form handlers
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }

    // Editor action buttons
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
        previewBtn.addEventListener('click', showPreview);
    }

    const saveDraftBtn = document.getElementById('save-draft-btn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => savePost(false));
    }

    const publishBtn = document.getElementById('publish-btn');
    if (publishBtn) {
        publishBtn.addEventListener('click', () => savePost(true));
    }

    // Preview modal
    const closePreviewBtn = document.getElementById('close-preview');
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', hidePreview);
    }

    const previewModal = document.getElementById('preview-modal');
    if (previewModal) {
        previewModal.addEventListener('click', function(e) {
            if (e.target === previewModal) {
                hidePreview();
            }
        });
    }

    // Editor toolbar
    setupEditorToolbar();
});

// Authentication functions
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/admin/posts', {
            credentials: 'include'
        });

        if (response.ok) {
            showDashboard();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showDashboard();
        } else {
            errorDiv.textContent = data.message || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Login failed. Please try again.';
        errorDiv.style.display = 'block';
    }
}

function handleLogout() {
    // Clear any client-side session data and redirect to login
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    showLogin();
}

function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadPosts();
}

// Posts management
async function loadPosts() {
    const loadingDiv = document.getElementById('posts-loading');
    const tableDiv = document.getElementById('posts-table');
    const emptyDiv = document.getElementById('posts-empty');
    const postsList = document.getElementById('posts-list');

    loadingDiv.style.display = 'block';
    tableDiv.style.display = 'none';
    emptyDiv.style.display = 'none';

    try {
        const response = await fetch('/api/admin/posts', {
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                showLogin();
                return;
            }
            throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();

        loadingDiv.style.display = 'none';

        if (posts.length === 0) {
            emptyDiv.style.display = 'block';
            return;
        }

        renderPostsTable(posts);
        tableDiv.style.display = 'block';

    } catch (error) {
        console.error('Error loading posts:', error);
        loadingDiv.style.display = 'none';
        // Show error state
    }
}

function renderPostsTable(posts) {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '';

    posts.forEach(post => {
        const row = createPostRow(post);
        postsList.appendChild(row);
    });
}

function createPostRow(post) {
    const row = document.createElement('div');
    row.className = 'post-row';

    const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const lastModified = new Date(post.lastModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    row.innerHTML = `
        <div class="col-title">
            <h3>${post.title}</h3>
            <p class="post-excerpt">${post.excerpt || 'No excerpt'}</p>
        </div>
        <div class="col-author">${post.author}</div>
        <div class="col-date">
            <div>Published: ${publishDate}</div>
            <div>Modified: ${lastModified}</div>
        </div>
        <div class="col-status">
            <span class="status-badge ${post.published ? 'published' : 'draft'}">
                ${post.published ? 'Published' : 'Draft'}
            </span>
        </div>
        <div class="col-actions">
            <button class="action-btn edit-btn" data-post-id="${post.id}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6.02 20.71,5.63L18.37,3.29C17.98,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04Z"/>
                </svg>
                Edit
            </button>
            <button class="action-btn delete-btn" data-post-id="${post.id}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                </svg>
                Delete
            </button>
        </div>
    `;

    // Add event listeners
    const editBtn = row.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => editPost(post.id));

    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deletePost(post.id));

    return row;
}

function showPostsList() {
    document.getElementById('posts-list-view').style.display = 'block';
    document.getElementById('post-editor-view').style.display = 'none';
    document.getElementById('preview-modal').style.display = 'none';
    loadPosts();
}

function showPostEditor(post = null) {
    document.getElementById('posts-list-view').style.display = 'none';
    document.getElementById('post-editor-view').style.display = 'block';

    const form = document.getElementById('post-form');

    if (post) {
        // Editing existing post
        document.getElementById('post-title').value = post.title || '';
        document.getElementById('post-author').value = post.author || '';
        document.getElementById('post-excerpt').value = post.excerpt || '';
        document.getElementById('post-image').value = post.featuredImage || '';
        document.getElementById('post-tags').value = post.tags ? post.tags.join(', ') : '';
        document.getElementById('post-content').value = post.content || '';
        form.dataset.postId = post.id;
    } else {
        // New post
        form.reset();
        delete form.dataset.postId;
    }
}

async function editPost(postId) {
    try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }

        const post = await response.json();
        showPostEditor(post);
    } catch (error) {
        console.error('Error fetching post for editing:', error);
        alert('Failed to load post for editing');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        loadPosts(); // Refresh the list
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
    }
}

async function handlePostSubmit(e) {
    e.preventDefault();
    await savePost(true);
}

async function savePost(publish = false) {
    const form = document.getElementById('post-form');
    const formData = new FormData(form);

    const postData = {
        title: formData.get('title'),
        author: formData.get('author'),
        excerpt: formData.get('excerpt'),
        featuredImage: formData.get('featuredImage'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        content: formData.get('content'),
        published: publish
    };

    const postId = form.dataset.postId;
    const isEditing = !!postId;

    try {
        const url = isEditing ? `/api/admin/posts/${postId}` : '/api/admin/posts';
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error('Failed to save post');
        }

        const savedPost = await response.json();

        // Show success message
        alert(publish ? 'Post published successfully!' : 'Draft saved successfully!');

        // Return to posts list
        showPostsList();

    } catch (error) {
        console.error('Error saving post:', error);
        alert('Failed to save post. Please try again.');
    }
}

function showPreview() {
    const content = document.getElementById('post-content').value;
    const title = document.getElementById('post-title').value;
    const author = document.getElementById('post-author').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const featuredImage = document.getElementById('post-image').value;

    // Configure marked for GitHub Flavored Markdown with enhanced features
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false,
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

    // Enhanced image renderer
    renderer.image = function(href, title, text) {
        const alt = text || '';
        const titleAttr = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${alt}"${titleAttr} loading="lazy" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">`;
    };

    // Enhanced link renderer
    renderer.link = function(href, title, text) {
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    marked.setOptions({ renderer });

    const htmlContent = marked.parse(content);

    const previewBody = document.getElementById('preview-body');
    const backgroundImageStyle = featuredImage && featuredImage.trim() !== '' ? ` style="background-image: url('${featuredImage}');"` : '';
    const excerptHtml = excerpt && excerpt.trim() !== '' ? `<p>${excerpt}</p>` : '';
    previewBody.innerHTML = `
        <article class="post-preview">
            <header class="post-header"${backgroundImageStyle}>
                <h1>${title || 'Untitled Post'}</h1>
                ${excerptHtml}
                <div class="post-meta">
                    <span>By ${author || 'Unknown Author'}</span>
                    <span>${new Date().toLocaleDateString()}</span>
                </div>
            </header>
            <div class="post-content">
                ${htmlContent}
            </div>
        </article>
    `;

    // Apply syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAllUnder(previewBody);
    }

    document.getElementById('preview-modal').style.display = 'flex';
}

function hidePreview() {
    document.getElementById('preview-modal').style.display = 'none';
}

// Editor toolbar functionality
function setupEditorToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    if (!toolbar) return;

    toolbar.addEventListener('click', function(e) {
        if (e.target.classList.contains('toolbar-btn')) {
            e.preventDefault();
            const command = e.target.dataset.command;
            applyFormatting(command);
        }
    });
}

function applyFormatting(command) {
    const textarea = document.getElementById('post-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let replacement = '';

    switch (command) {
        case 'bold':
            replacement = `**${selectedText || 'bold text'}**`;
            break;
        case 'italic':
            replacement = `*${selectedText || 'italic text'}*`;
            break;
        case 'heading':
            replacement = `## ${selectedText || 'Heading'}`;
            break;
        case 'link':
            replacement = `[${selectedText || 'link text'}](url)`;
            break;
        case 'image':
            replacement = `![${selectedText || 'alt text'}](image-url)`;
            break;
        case 'code':
            replacement = `\`${selectedText || 'code'}\``;
            break;
        case 'list':
            replacement = `- ${selectedText || 'list item'}`;
            break;
        case 'tasklist':
            replacement = `- [ ] ${selectedText || 'task item'}`;
            break;
    }

    if (replacement) {
        textarea.setRangeText(replacement, start, end, 'end');
        textarea.focus();
    }
}
