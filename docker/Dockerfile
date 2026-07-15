FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends bash make \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable \
  && corepack prepare pnpm@10.26.2 --activate

COPY docker/bin/ /opt/pf-mocks/bin/
RUN chmod +x /opt/pf-mocks/bin/*

WORKDIR /app

ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["bash"]
