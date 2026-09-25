FROM node:24-bookworm-slim AS build
RUN npm install --global pnpm@12.6.0
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

FROM build AS migrate
CMD ["pnpm", "db:migrate"]

FROM node:24-bookworm-slim AS web
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
