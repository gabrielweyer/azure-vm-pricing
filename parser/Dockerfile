FROM node:20-bookworm

WORKDIR /app

COPY src ./src/

COPY out ./out/

COPY babel.config.js package.json tsconfig.json yarn.lock ./

# Dependencies required by Chrome
# To find the package containing the 'libxkbcommon.so.0' library:
# https://packages.debian.org/search?searchon=contents&keywords=libxkbcommon.so.0+&mode=exactfilename&suite=bookworm&arch=any
RUN apt-get update \
    && apt-get install -y --no-install-recommends libnss3 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2

# corepack is now the recommended way to install Yarn
RUN corepack enable

# See .yarnrc.yml, pnp doesn't work for me
# See https://yarnpkg.com/features/linkers
RUN yarn config set nodeLinker node-modules

# From https://github.com/puppeteer/puppeteer/blob/main/docker/Dockerfile
RUN groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

RUN chown -R pptruser:pptruser /app

# Can't use --no-sandbox as root, so we need to install Puppeteer
# using the pptruser
USER pptruser

RUN yarn install

ENTRYPOINT [ "sh" ]
