import { serve } from "std/http/server.ts";
import { serveDir } from "std/http/file_server.ts";

// Use PORT environment variable for Cloud Run, fallback to 8000 for local development
const port = parseInt(Deno.env.get("PORT") || "8000");

// Shopify configuration
const SHOPIFY_CONFIG = {
  storeDomain: Deno.env.get("SHOPIFY_STORE_DOMAIN") || "",
  storefrontAccessToken: Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN") || "",
};

// Email configuration
const SMTP_CONFIG = {
  hostname: "smtp.gmail.com",
  port: 587,
  username: Deno.env.get("SMTP_USERNAME") || "",
  password: Deno.env.get("SMTP_PASSWORD") || "",
};

const RECIPIENT_EMAIL = "aubrey@hellohope.ca";

// Client configuration (safe to expose to frontend)
const CLIENT_CONFIG = {
  emailjs: {
    publicKey: Deno.env.get("EMAILJS_PUBLIC_KEY") || "",
    serviceId: Deno.env.get("EMAILJS_SERVICE_ID") || "",
    templateId: Deno.env.get("EMAILJS_TEMPLATE_ID") || "",
    scheduleTemplateId: Deno.env.get("EMAILJS_SCHEDULE_TEMPLATE_ID") || "",
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

  // Shopify API - Create Cart
  if (url.pathname === "/api/shopify/checkout" && req.method === "POST") {
    try {
      const { items } = await req.json();

      if (!items || !Array.isArray(items) || items.length === 0) {
        return new Response(
          JSON.stringify({ error: "No items provided" }),
          { 
            status: 400,
            headers: { 
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const shopifyUrl = `https://${SHOPIFY_CONFIG.storeDomain}/api/2024-01/graphql.json`;
      
      // Format line items for Shopify Cart API
      const lines = items.map((item: any) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));

      const mutation = `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              code
              field
              message
            }
          }
        }
      `;

      const variables = {
        input: {
          lines: lines,
        },
      };

      const response = await fetch(shopifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_CONFIG.storefrontAccessToken,
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const data = await response.json();

      if (data.errors || data.data?.cartCreate?.userErrors?.length > 0) {
        console.error("Shopify cart errors:", data.errors || data.data.cartCreate.userErrors);
        return new Response(
          JSON.stringify({ 
            error: "Failed to create cart", 
            details: data.errors || data.data.cartCreate.userErrors 
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

      return new Response(
        JSON.stringify({ 
          checkoutUrl: data.data.cartCreate.cart.checkoutUrl 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("Error creating cart:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create cart" }),
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
  
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
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
