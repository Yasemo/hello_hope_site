import { serve } from "std/http/server.ts";
import { serveDir } from "std/http/file_server.ts";

// Use PORT environment variable for Cloud Run, fallback to 8000 for local development
const port = parseInt(Deno.env.get("PORT") || "8000");

// Email configuration
const SMTP_CONFIG = {
  hostname: "smtp.gmail.com",
  port: 587,
  username: Deno.env.get("SMTP_USERNAME") || "",
  password: Deno.env.get("SMTP_PASSWORD") || "",
};

const RECIPIENT_EMAIL = "yaseen@rep.company";

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

serve(
  async (req) => {
    const url = new URL(req.url);
    
    // Handle API requests
    if (url.pathname.startsWith("/api/")) {
      return await handleApiRequest(req);
    }
    
    // Serve static files
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
