# Default architecture
ARG ARCH=amd64

# Use the official lightweight Node.js 22 image
FROM $ARCH/node:22-slim

# Do not download Chromium, will be installed manually from Debian repositories
ENV PUPPETEER_SKIP_DOWNLOAD=true
# Set the path to the Chromium executable
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

# Create a directory for the app
WORKDIR /app

# Create a directory for the app data
RUN mkdir /data

# Set volume for the app data
VOLUME /data

# Install dependencies for Puppeteer respectively Chromium/Chrome
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-gitlabci
# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  chromium \
  fonts-liberation \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm-dev \
  libgcc1 \
  libglib2.0-0 \
  libgdk-pixbuf2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  xdg-utils \
  libu2f-udev \
  libvulkan1 \
  --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Copy the app files (azure-vm-pricing/parser) to the container
COPY ./ .

# Install Yarn and dependencies
RUN yarn install \
  && yarn cache clean
