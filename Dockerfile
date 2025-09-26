# Use the official Deno runtime as the base image
FROM denoland/deno:alpine

# Set the working directory
WORKDIR /app

# Copy deno.json first for better caching
COPY deno.json ./

# Copy the rest of the application files
COPY . .

# Cache the main server file and its dependencies
RUN deno cache server.ts

# Change ownership of the app directory to the existing deno user
RUN chown -R deno:deno /app
USER deno

# Expose the port (Cloud Run will set the PORT environment variable)
EXPOSE 8080

# Health check for Cloud Run
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD deno eval "fetch('http://localhost:' + (Deno.env.get('PORT') || '8000')).then(() => Deno.exit(0)).catch(() => Deno.exit(1))"

# Start the server
CMD ["deno", "run", "-A", "server.ts"]
