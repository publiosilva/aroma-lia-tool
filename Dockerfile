# Stage 1: Rust build
FROM rust:latest AS rust-build

# Set working directory for Rust
WORKDIR /usr/src/lib/source-code-parser/source-code-parser-web

# Copy only necessary files for Rust build
COPY ./lib/source-code-parser /usr/src/lib/source-code-parser

# Build Rust application in release mode
RUN cargo build --release


# Stage 2: Node.js build
FROM node:20 AS node-build

# Set working directory for Node.js
WORKDIR /usr/src

# Copy necessary files for Node.js build
COPY package*.json tsconfig.json ./
COPY ./src ./src
COPY ./src-web/src ./src-web/src
COPY ./src-web/public ./src-web/public
COPY ./src-web/index.html ./src-web/index.html
COPY ./src-web/vite.config.js ./src-web/vite.config.js
COPY ./src-web/package*.json ./src-web/

# Install dependencies and build backend
RUN npm install && npm run build

# Set working directory for Node.js
WORKDIR /usr/src/src-web

# Install dependencies and build frontend
RUN npm install && npm run build


# Stage 3: Final image
FROM ubuntu:22.04 AS final

# Install required runtime dependencies
RUN apt-get update && apt-get install -y \
    supervisor \
    curl \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Set up application directory
WORKDIR /app

# Copy built Rust binary from Rust build stage
COPY --from=rust-build /usr/src/lib/source-code-parser/target/release/source-code-parser-web ./source-code-parser-web

# Copy built backend from Node.js build stage
COPY --from=node-build /usr/src/dist ./aromalia
COPY --from=node-build /usr/src/node_modules ./aromalia/node_modules

# Copy built frontend from Node.js build stage
COPY --from=node-build /usr/src/src-web/dist ./aromalia-web

# Set up Supervisor configuration
WORKDIR /etc/supervisor
COPY supervisord.conf .

# Expose application ports
EXPOSE 3000 8000 8080

# Define default command to start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
