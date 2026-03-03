FROM node:22-slim

# Dev tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    vim \
    bash-completion \
    && rm -rf /var/lib/apt/lists/*

# Workspace
WORKDIR /workspace

# Default shell
SHELL ["/bin/bash", "-c"]

# Expose Vite dev server ports
EXPOSE 5173 5174 3000

CMD ["bash"]
