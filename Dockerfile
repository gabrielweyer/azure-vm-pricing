# Default architecture
ARG ARCH=amd64

# Use the official lightweight Node.js 22 image
FROM $ARCH/node:22-slim

# Do not download Chromium, will be installed manually from Debian repositories
ENV PUPPETEER_SKIP_DOWNLOAD true
# Set the path to the Chromium executable
ENV PUPPETEER_EXECUTABLE_PATH "/usr/bin/chromium"

# Create a directory for the app
WORKDIR /app

# Create a directory for the app data
RUN mkdir /data

# Set volume for the app data
VOLUME /data

# Install dependencies
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

# Copy the app files (azure-vm-pricing) to the container
COPY ./parser .

# When use a non-root user, the processes under the user will not have access to mounted volumes for some reason
# # Create a non-root user to run Puppeteer
# RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#   && mkdir -p /home/pptruser/Downloads \
#   && chown -R pptruser:pptruser /home/pptruser \
#   && chown -R pptruser:pptruser /app

# # Switch to the non-root user
# USER pptruser

# Install Yarn and dependencies
RUN yarn install
