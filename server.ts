import { serve } from "std/http/server.ts";
import { serveDir } from "std/http/file_server.ts";
import { extractYaml } from "front-matter";
import { marked } from "marked";

// Use PORT environment variable for Cloud Run, fallback to 8000 for local development
const port = parseInt(Deno.env.get("PORT") || "8000");

// Shopify configuration
const SHOPIFY_CONFIG = {
  storeDomain: Deno.env.get("SHOPIFY_STORE_DOMAIN") || "",
  storefrontAccessToken: Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN") || "",
};

// Airtable configuration
const AIRTABLE_CONFIG = {
  apiKey: Deno.env.get("AIRTABLE_API_KEY") || "",
  baseId: Deno.env.get("AIRTABLE_BASE_ID") || "",
  tableId: Deno.env.get("AIRTABLE_TABLE_ID") || "",
};

// PayPal configuration
const PAYPAL_CONFIG = {
  clientId: Deno.env.get("PAYPAL_CLIENT_ID") || "",
  clientSecret: Deno.env.get("PAYPAL_CLIENT_SECRET") || "",
  environment: Deno.env.get("PAYPAL_ENVIRONMENT") || "sandbox",
  baseUrl: Deno.env.get("PAYPAL_ENVIRONMENT") === "live" 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com",
};

// Email configuration
const SMTP_CONFIG = {
  hostname: "smtp.gmail.com",
  port: 587,
  username: Deno.env.get("SMTP_USERNAME") || "",
  password: Deno.env.get("SMTP_PASSWORD") || "",
};

const RECIPIENT_EMAIL = "aubrey@hellohope.ca";

// Admin configuration
const ADMIN_CONFIG = {
  username: Deno.env.get("ADMIN_USERNAME") || "admin",
  password: Deno.env.get("ADMIN_PASSWORD") || "password",
};

// Client configuration (safe to expose to frontend)
const CLIENT_CONFIG = {
  emailjs: {
    publicKey: Deno.env.get("EMAILJS_PUBLIC_KEY") || "",
    serviceId: Deno.env.get("EMAILJS_SERVICE_ID") || "",
    templateId: Deno.env.get("EMAILJS_TEMPLATE_ID") || "",
    scheduleTemplateId: Deno.env.get("EMAILJS_SCHEDULE_TEMPLATE_ID") || "",
  },
  paypal: {
    clientId: Deno.env.get("PAYPAL_CLIENT_ID") || "",
  },
};

// Simple email sending function
async function sendEmail(formData: any) {
  try {
    // For now, we'll use a simple approach with fetch to a service
    // In production, you'd want to use proper SMTP
    console.log("Email would be sent to:", RECIPIENT_EMAIL);
    console.log("Form data:", formData);

    // Simulate email sending - replace with actual SMTP implementation
    const emailContent = `
New Contact Form Submission from Hello Hope Canada Website

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Organization: ${formData.organization || 'Not provided'}
Program Interest: ${formData.program || 'Not specified'}

Message:
${formData.message}

---
Submitted at: ${new Date().toLocaleString()}
    `;

    console.log("Email content:", emailContent);

    // For development, we'll just log the email
    // In production, implement actual SMTP sending here
    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Failed to send email" };
  }
}

// Blog data management functions
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  lastModified: string;
  featuredImage?: string;
  tags: string[];
  published: boolean;
}

async function loadPosts(): Promise<BlogPost[]> {
  try {
    const posts: BlogPost[] = [];

    for await (const entry of Deno.readDir("./posts")) {
      if (entry.isFile && entry.name.endsWith('.md')) {
        const filePath = `./posts/${entry.name}`;
        const content = await Deno.readTextFile(filePath);

        try {
          const { attrs, body } = extractYaml(content);
          const metadata = attrs as Record<string, any>;

          // Parse markdown content to HTML
          const htmlContent = await marked(body);

          const post: BlogPost = {
            id: metadata.id || entry.name.replace('.md', ''),
            title: metadata.title || 'Untitled',
            content: htmlContent,
            excerpt: metadata.excerpt || '',
            author: metadata.author || 'Unknown',
            publishDate: metadata.publishDate || new Date().toISOString(),
            lastModified: metadata.lastModified || new Date().toISOString(),
            featuredImage: metadata.featuredImage,
            tags: metadata.tags || [],
            published: metadata.published || false,
          };

          posts.push(post);
        } catch (error) {
          console.error(`Error parsing ${entry.name}:`, error);
        }
      }
    }

    return posts;
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
}

async function savePosts(posts: BlogPost[]): Promise<void> {
  // This function is no longer needed for file-based storage
  // Individual posts are saved as separate files
  throw new Error("savePosts not implemented for markdown files");
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await loadPosts();
  return posts.filter(post => post.published).sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

async function getPostById(id: string): Promise<BlogPost | null> {
  const posts = await loadPosts();
  return posts.find(post => post.id === id) || null;
}

async function createPost(postData: Omit<BlogPost, 'id' | 'publishDate' | 'lastModified'>): Promise<BlogPost> {
  const id = generateId();
  const newPost: BlogPost = {
    ...postData,
    id,
    publishDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };

  await savePostToFile(newPost);
  return newPost;
}

async function updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
  const existingPost = await getPostById(id);
  if (!existingPost) return null;

  const updatedPost: BlogPost = {
    ...existingPost,
    ...postData,
    lastModified: new Date().toISOString(),
  };

  await savePostToFile(updatedPost);
  return updatedPost;
}

async function deletePost(id: string): Promise<boolean> {
  try {
    const filePath = `./posts/${id}.md`;
    await Deno.remove(filePath);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    console.error("Error deleting post:", error);
    return false;
  }
}

async function savePostToFile(post: BlogPost): Promise<void> {
  const frontmatter = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    publishDate: post.publishDate,
    lastModified: post.lastModified,
    featuredImage: post.featuredImage,
    tags: post.tags,
    published: post.published,
  };

  // Create YAML frontmatter
  const yamlFrontmatter = Object.entries(frontmatter)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
      } else if (typeof value === 'string') {
        return `${key}: "${value}"`;
      } else {
        return `${key}: ${value}`;
      }
    })
    .join('\n');

  // Convert HTML back to markdown for storage
  // Note: This is a simplification. In a real app, you'd want to store the original markdown
  const markdownContent = post.content; // For now, assume content is already markdown

  const fileContent = `---\n${yamlFrontmatter}\n---\n\n${markdownContent}`;

  const filePath = `./posts/${post.id}.md`;
  await Deno.writeTextFile(filePath, fileContent);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// PayPal API Helpers
async function getPayPalAccessToken() {
  console.log("PayPal Config:", {
    environment: PAYPAL_CONFIG.environment,
    baseUrl: PAYPAL_CONFIG.baseUrl,
    clientId: PAYPAL_CONFIG.clientId ? "Present" : "Missing",
    clientSecret: PAYPAL_CONFIG.clientSecret ? "Present" : "Missing"
  });

  try {
    // Use Deno's built-in btoa for better compatibility
    const auth = btoa(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`);
    console.log("Authorization header created successfully");

    const response = await fetch(`${PAYPAL_CONFIG.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    console.log("PayPal token request status:", response.status);
    console.log("PayPal token request headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("PayPal token response:", {
      hasAccessToken: !!data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      error: data.error,
      errorDescription: data.error_description
    });

    if (!response.ok || !data.access_token) {
      console.error("Failed to get PayPal access token:", data);
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error("Error in getPayPalAccessToken:", error);
    return null;
  }
}

// Authentication functions
const sessions = new Map<string, { username: string; expires: number }>();

function generateSessionId(): string {
  return crypto.getRandomValues(new Uint8Array(16)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), '');
}

function authenticateUser(username: string, password: string): boolean {
  return username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password;
}

function createSession(username: string): string {
  const sessionId = generateSessionId();
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  sessions.set(sessionId, { username, expires });
  return sessionId;
}

function validateSession(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  if (Date.now() > session.expires) {
    sessions.delete(sessionId);
    return false;
  }

  return true;
}

function getSessionUser(sessionId: string): string | null {
  const session = sessions.get(sessionId);
  return session ? session.username : null;
}

function requireAuth(req: Request): boolean {
  const cookies = req.headers.get('cookie') || '';
  const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('session='));
  if (!sessionCookie) return false;

  const sessionId = sessionCookie.split('=')[1];
  return validateSession(sessionId);
}

// Handle API requests
async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Serve client configuration
  if (url.pathname === "/api/config" && req.method === "GET") {
    return new Response(
      JSON.stringify(CLIENT_CONFIG),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }

  if (url.pathname === "/api/contact" && req.method === "POST") {
    try {
      const formData = await req.json();
      
      // Basic validation
      if (!formData.name || !formData.email || !formData.message) {
        return new Response(
          JSON.stringify({ success: false, message: "Missing required fields" }),
          { 
            status: 400,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
      // Send email
      const emailResult = await sendEmail(formData);
      
      if (emailResult.success) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Thank you for your message! We will get back to you within 24-48 hours." 
          }),
          { 
            status: 200,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Sorry, there was an error sending your message. Please try again." 
          }),
          { 
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
      
    } catch (error) {
      console.error("API error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Sorry, there was an error processing your request." 
        }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }

  // Airtable API - Get Products
  if (url.pathname === "/api/airtable/products" && req.method === "GET") {
    try {
      if (!AIRTABLE_CONFIG.apiKey || !AIRTABLE_CONFIG.baseId || !AIRTABLE_CONFIG.tableId) {
        return new Response(
          JSON.stringify({ error: "Airtable configuration missing" }),
          { 
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}`;
      
      console.log("Fetching products from Airtable...");

      const response = await fetch(airtableUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${AIRTABLE_CONFIG.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Airtable API error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to fetch products from Airtable", details: errorText }),
          { 
            status: response.status,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const data = await response.json();
      
      // Transform Airtable records to shop format
      const products = data.records.map((record: any) => {
        const fields = record.fields;
        const inventory = fields["Variant Inventory Qty"] || 0;
        
        return {
          id: record.id,
          title: fields["Title"] || "Untitled Product",
          price: fields["Variant Price"] || "0.00",
          image: fields["Image Src"] || "https://via.placeholder.com/400x400?text=No+Image",
          description: fields["Description"] || "",
          availableForSale: inventory > 0,
          currencyCode: "CAD"
        };
      });

      console.log(`Successfully fetched ${products.length} products from Airtable`);

      return new Response(
        JSON.stringify({ products }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error fetching products from Airtable:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products" }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }

  // Shopify API - Get Products
  if (url.pathname === "/api/shopify/products" && req.method === "GET") {
    try {
      if (!SHOPIFY_CONFIG.storeDomain || !SHOPIFY_CONFIG.storefrontAccessToken) {
        return new Response(
          JSON.stringify({ error: "Shopify configuration missing" }),
          { 
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const shopifyUrl = `https://${SHOPIFY_CONFIG.storeDomain}/api/2024-01/graphql.json`;
      
      const query = `{
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }`;

      const response = await fetch(shopifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.storefrontAccessToken,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.errors) {
        console.error("Shopify API errors:", data.errors);
        return new Response(
          JSON.stringify({ error: "Failed to fetch products", details: data.errors }),
          { 
            status: 500,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      return new Response(
        JSON.stringify(data.data),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products" }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }

  // PayPal API - Create Order
  if (url.pathname === "/api/paypal/create-order" && req.method === "POST") {
    try {
      const { items } = await req.json();

      if (!items || !Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: "No items provided" }), { status: 400 });
      }

      const accessToken = await getPayPalAccessToken();

      if (!accessToken) {
        console.error("Failed to obtain PayPal access token");
        return new Response(JSON.stringify({
          error: "Authentication failed",
          message: "Unable to authenticate with PayPal. Please check server configuration."
        }), { status: 500 });
      }

      const totalAmount = items.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2);

      // We assume CAD for now as per Shopify domain
      const currencyCode = "CAD";

      const orderData = {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: currencyCode,
            value: totalAmount,
            breakdown: {
              item_total: {
                currency_code: currencyCode,
                value: totalAmount
              }
            }
          },
          items: items.map((item: any) => ({
            name: item.title,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: currencyCode,
              value: parseFloat(item.price).toFixed(2)
            }
          }))
        }]
      };

      console.log("Creating PayPal order with data:", {
        totalAmount,
        currencyCode,
        itemCount: items.length,
        accessTokenPresent: !!accessToken
      });

      const response = await fetch(`${PAYPAL_CONFIG.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      console.log("PayPal order creation response:", {
        status: response.status,
        hasId: !!data.id,
        error: data.details || data.error
      });

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("PayPal create order error:", error);
      return new Response(JSON.stringify({ error: "Failed to create PayPal order" }), { status: 500 });
    }
  }

  // PayPal API - Capture Order
  if (url.pathname === "/api/paypal/capture-order" && req.method === "POST") {
    try {
      const { orderID } = await req.json();
      const accessToken = await getPayPalAccessToken();

      const response = await fetch(`${PAYPAL_CONFIG.baseUrl}/v2/checkout/orders/${orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), { 
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("PayPal capture order error:", error);
      return new Response(JSON.stringify({ error: "Failed to capture PayPal order" }), { status: 500 });
    }
  }

  // Blog API endpoints
  // GET /api/posts - Get all published posts
  if (url.pathname === "/api/posts" && req.method === "GET") {
    try {
      const posts = await getPublishedPosts();
      return new Response(
        JSON.stringify(posts),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch posts" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }

  // GET /api/posts/:id - Get individual post
  if (url.pathname.startsWith("/api/posts/") && req.method === "GET") {
    try {
      const id = url.pathname.split("/api/posts/")[1];
      const post = await getPostById(id);

      if (!post) {
        return new Response(
          JSON.stringify({ error: "Post not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      return new Response(
        JSON.stringify(post),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    } catch (error) {
      console.error("Error fetching post:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch post" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }

  // POST /api/admin/login - Admin login
  if (url.pathname === "/api/admin/login" && req.method === "POST") {
    try {
      const { username, password } = await req.json();

      if (!username || !password) {
        return new Response(
          JSON.stringify({ success: false, message: "Username and password required" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            }
          }
        );
      }

      if (!authenticateUser(username, password)) {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid credentials" }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            }
          }
        );
      }

      const sessionId = createSession(username);

      return new Response(
        JSON.stringify({ success: true, message: "Login successful" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Set-Cookie": `session=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
          }
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      return new Response(
        JSON.stringify({ success: false, message: "Login failed" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }
  }

  // GET /api/admin/posts - Get all posts (admin only)
  if (url.pathname === "/api/admin/posts" && req.method === "GET") {
    if (!requireAuth(req)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }

    try {
      const posts = await loadPosts();
      return new Response(
        JSON.stringify(posts),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    } catch (error) {
      console.error("Error fetching admin posts:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch posts" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }
  }

  // GET /api/admin/posts/:id - Get single post for editing (admin only)
  if (url.pathname.startsWith("/api/admin/posts/") && req.method === "GET") {
    if (!requireAuth(req)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }

    try {
      const id = url.pathname.split("/api/admin/posts/")[1];
      const post = await getPostById(id);

      if (!post) {
        return new Response(
          JSON.stringify({ error: "Post not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            }
          }
        );
      }

      return new Response(
        JSON.stringify(post),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    } catch (error) {
      console.error("Error fetching admin post:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch post" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }
  }

  // POST /api/admin/posts - Create new post (admin only)
  if (url.pathname === "/api/admin/posts" && req.method === "POST") {
    if (!requireAuth(req)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }

    try {
      const postData = await req.json();

      // Basic validation
      if (!postData.title || !postData.content || !postData.excerpt || !postData.author) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: title, content, excerpt, author" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            }
          }
        );
      }

      const newPost = await createPost({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        author: postData.author,
        featuredImage: postData.featuredImage,
        tags: postData.tags || [],
        published: postData.published || false,
      });

      return new Response(
        JSON.stringify(newPost),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create post" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }
  }

  // PUT /api/admin/posts/:id - Update post (admin only)
  if (url.pathname.startsWith("/api/admin/posts/") && req.method === "PUT") {
    if (!requireAuth(req)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }

    try {
      const id = url.pathname.split("/api/admin/posts/")[1];
      const postData = await req.json();

      const updatedPost = await updatePost(id, postData);

      if (!updatedPost) {
        return new Response(
          JSON.stringify({ error: "Post not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            }
          }
        );
      }

      return new Response(
        JSON.stringify(updatedPost),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    } catch (error) {
      console.error("Error updating post:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update post" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }
  }

  // DELETE /api/admin/posts/:id - Delete post (admin only)
  if (url.pathname.startsWith("/api/admin/posts/") && req.method === "DELETE") {
    if (!requireAuth(req)) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }

    try {
      const id = url.pathname.split("/api/admin/posts/")[1];
      const deleted = await deletePost(id);

      if (!deleted) {
        return new Response(
          JSON.stringify({ error: "Post not found" }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            }
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Post deleted" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      return new Response(
        JSON.stringify({ error: "Failed to delete post" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
          }
        }
      );
    }
  }

  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }
  
  return new Response("Not Found", { status: 404 });
}

// Helper function to get MIME type based on file extension
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'html': 'text/html',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'otf': 'font/otf',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

// Helper function to handle video file requests with range support
async function handleVideoRequest(req: Request, filePath: string): Promise<Response> {
  try {
    // Get file stats first
    const stat = await Deno.stat(filePath);
    const fileSize = stat.size;
    
    console.log(`Serving video: ${filePath}, size: ${fileSize} bytes`);
    
    const range = req.headers.get("range");
    
    if (!range) {
      // No range header - serve entire file with streaming
      console.log("No range header, serving entire file");
      const file = await Deno.open(filePath, { read: true });
      
      return new Response(file.readable, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": getMimeType(filePath),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }
    
    // Parse range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    
    console.log(`Range request: bytes ${start}-${end}/${fileSize}, chunk size: ${chunkSize}`);
    
    // Validate range
    if (start >= fileSize || end >= fileSize || start > end) {
      console.error(`Invalid range: start=${start}, end=${end}, fileSize=${fileSize}`);
      return new Response("Invalid range", { 
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileSize}`,
        }
      });
    }
    
    // Open file and seek to start position
    const file = await Deno.open(filePath, { read: true });
    await file.seek(start, Deno.SeekMode.Start);
    
    // Create a transform stream to limit the bytes read
    let bytesRead = 0;
    const limitedStream = file.readable.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          const remaining = chunkSize - bytesRead;
          if (remaining <= 0) {
            controller.terminate();
            return;
          }
          
          if (chunk.length <= remaining) {
            bytesRead += chunk.length;
            controller.enqueue(chunk);
          } else {
            // Only enqueue the remaining bytes
            bytesRead += remaining;
            controller.enqueue(chunk.slice(0, remaining));
            controller.terminate();
          }
        },
      })
    );
    
    return new Response(limitedStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": getMimeType(filePath),
        "Cache-Control": "public, max-age=31536000",
      },
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'Unknown';
    
    console.error(`Error serving video file ${filePath}:`, {
      error: errorMessage,
      stack: errorStack,
      name: errorName,
    });
    
    if (error instanceof Deno.errors.NotFound) {
      return new Response("Video file not found", { status: 404 });
    }
    if (error instanceof Deno.errors.PermissionDenied) {
      return new Response("Access denied", { status: 403 });
    }
    
    return new Response("Internal server error", { status: 500 });
  }
}

serve(
  async (req) => {
    const url = new URL(req.url);

    // Handle API requests
    if (url.pathname.startsWith("/api/")) {
      return await handleApiRequest(req);
    }

    // Handle video files explicitly with range support
    if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm') || url.pathname.endsWith('.ogg')) {
      const filePath = `.${url.pathname}`;
      console.log(`Video request: ${filePath}`);
      return await handleVideoRequest(req, filePath);
    }

    // Route handling
    if (url.pathname === "/" || url.pathname === "/home") {
      // Serve index.html for home page
      try {
        const file = await Deno.readFile("./index.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Home page not found", { status: 404 });
      }
    }

    if (url.pathname === "/conference") {
      // Serve conference.html for conference page
      try {
        const file = await Deno.readFile("./conference.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Conference page not found", { status: 404 });
      }
    }

    if (url.pathname === "/contact") {
      // Serve contact.html for contact page
      try {
        const file = await Deno.readFile("./contact.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Contact page not found", { status: 404 });
      }
    }

    if (url.pathname === "/programs") {
      // Serve programs.html for programs page
      try {
        const file = await Deno.readFile("./programs.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Programs page not found", { status: 404 });
      }
    }

    if (url.pathname === "/shop") {
      // Serve shop.html for shop page
      try {
        const file = await Deno.readFile("./shop.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Shop page not found", { status: 404 });
      }
    }

    if (url.pathname === "/articles") {
      // Serve articles.html for articles page
      try {
        const file = await Deno.readFile("./articles.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Articles page not found", { status: 404 });
      }
    }

    if (url.pathname === "/admin") {
      // Serve admin.html for admin page
      try {
        const file = await Deno.readFile("./admin.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Admin page not found", { status: 404 });
      }
    }

    if (url.pathname === "/testimonials") {
      // Serve index.html for testimonials page (clean URL that scrolls to testimonials section)
      try {
        const file = await Deno.readFile("./index.html");
        return new Response(file, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Home page not found", { status: 404 });
      }
    }

    // Handle individual post routes (/articles/{id})
    if (url.pathname.startsWith("/articles/")) {
      try {
        const postId = url.pathname.split("/articles/")[1];
        const post = await getPostById(postId);

        if (!post || !post.published) {
          // Serve 404 page or redirect to articles
          return new Response("Post not found", { status: 404 });
        }

        // Read the post template and inject post data
        let postHtml = await Deno.readTextFile("./post.html");

        // Replace placeholders with post data
        const publishDate = new Date(post.publishDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        postHtml = postHtml
          .replace(/{{title}}/g, post.title)
          .replace(/{{excerpt}}/g, post.excerpt || '')
          .replace(/{{author}}/g, post.author)
          .replace(/{{publishDate}}/g, publishDate)
          .replace(/{{featuredImage}}/g, post.featuredImage || '')
          .replace(/{{tags}}/g, post.tags ? post.tags.join(', ') : '')
          .replace(/{{content}}/g, post.content);

        // Inject post data as JSON for JavaScript
        const postDataScript = `<script>
          window.postData = {
            title: ${JSON.stringify(post.title)},
            content: ${JSON.stringify(post.content)},
            excerpt: ${JSON.stringify(post.excerpt || '')},
            author: ${JSON.stringify(post.author)},
            publishDate: ${JSON.stringify(publishDate)},
            featuredImage: ${JSON.stringify(post.featuredImage || '')},
            tags: ${JSON.stringify(post.tags || [])}
          };
        </script>`;

        return new Response(postHtml + postDataScript, {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
          },
        });
      } catch {
        return new Response("Post not found", { status: 404 });
      }
    }

    // Serve static files for other routes
    return serveDir(req, {
      fsRoot: ".",
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
    });
  },
  { port }
);

console.log(`Hello Hope Canada website running at http://localhost:${port}/`);
