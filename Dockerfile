FROM node:20-bookworm-slim

# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srvr

# default to port 80 for node, and 9229 and 9230 (tests) for debug
ARG PORT=80
ENV PORT=${PORT}
EXPOSE $PORT 9229 9230

COPY package.json /srvr/package.json
COPY package-lock.json /srvr/package-lock.json
RUN npm ci

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node healthcheck.js

COPY . /srvr/

CMD [ "node", "bin/www" ]

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /