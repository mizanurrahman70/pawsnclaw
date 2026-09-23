##########################
# Stage 1: validation     #
##########################
FROM node:22-alpine AS checker

WORKDIR /theme

RUN npm install -g @shopify/cli@latest

COPY . .

# Validate the theme locally: Liquid theme check (no store connection required)
RUN shopify theme check

##########################
# Stage 2: dev server    #
##########################
FROM node:22-alpine

LABEL org.opencontainers.image.title="pawsnclaw-theme" \
      org.opencontainers.image.description="Paws & Claw — Shopify theme development container" \
      org.opencontainers.image.url="https://shopify.dev/docs/themes"

RUN apk add --no-cache git && \
    npm install -g @shopify/cli@latest

WORKDIR /theme

COPY . .

ENV SHOPIFY_FLAG_HOST=0.0.0.0 \
    SHOPIFY_FLAG_PORT=9292

EXPOSE 9292

# Serve the local theme as a development theme against your store.
# Authenticate with a Theme Access token:
#   docker run ... -e SHOPIFY_CLI_THEME_TOKEN=<token> -e SHOPIFY_FLAG_STORE=<store>
CMD ["shopify", "theme", "dev"]