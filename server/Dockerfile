FROM node:24-bookworm-slim
WORKDIR /app
RUN mkdir -p /app/data && chown node:node /app/data
COPY --chown=node:node package.json server.mjs chat.mjs zen-model.mjs ./
USER node
ENV HOST=0.0.0.0 PORT=4000 SOLACE_DATA_DIR=/app/data
EXPOSE 4000
CMD ["node", "server.mjs"]
