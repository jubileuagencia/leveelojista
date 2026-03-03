# Contributing to Bubble MCP

Thank you for your interest in contributing to Bubble MCP! We welcome contributions from the community and are grateful for any help you can provide.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/bubble_mcp.git
   cd bubble_mcp
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/nocoderoi/bubble_mcp.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file for testing (don't commit this):
   ```bash
   cp .env.example .env
   ```

3. Run tests (when available):
   ```bash
   npm test
   ```

## Making Changes

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, following the coding standards below

3. Test your changes thoroughly

4. Commit your changes with a clear commit message:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for all public functions
- Keep functions small and focused
- Use meaningful variable and function names

## Submitting a Pull Request

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to the original repository on GitHub and create a Pull Request

3. Fill out the PR template with:
   - A clear description of the changes
   - The motivation for the changes
   - Any breaking changes
   - Screenshots if applicable

4. Wait for review and address any feedback

## Testing Your Changes

Before submitting, ensure:
- [ ] The code builds without errors (`npm run build`)
- [ ] All existing tests pass
- [ ] You've added tests for new functionality
- [ ] You've tested with a real Bubble app
- [ ] You've tested both read-only and read-write modes

## Reporting Issues

When reporting issues, please include:
- Node.js version
- Operating system
- Bubble app configuration (without sensitive data)
- Steps to reproduce
- Expected vs actual behavior
- Any error messages

## Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Provide a clear use case
- Explain why the feature would benefit other users
- Be open to discussion about implementation

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect different viewpoints and experiences

## Questions?

If you have questions, feel free to:
- Open an issue for clarification
- Start a discussion in GitHub Discussions
- Review existing documentation

Thank you for contributing to Bubble MCP!
