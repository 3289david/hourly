# Contributing to Hourly

Thanks for your interest. Contributions are welcome.

## Getting Started

```bash
git clone https://github.com/3289david/hourly.git
cd hourly
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## What to work on

Check the [issues](https://github.com/3289david/hourly/issues) tab. Issues labeled `good first issue` are good starting points.

Ideas that are always welcome:
- New model integrations via OpenRouter
- Workspace UX improvements
- Terminal enhancements (PTY support, tab completion)
- Better mobile layout
- Performance improvements

## Pull Request Process

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm run build` — it must pass with no errors
4. Open a PR with a clear description of what changed and why
5. Keep PRs focused — one feature or fix per PR

## Code Style

- TypeScript strict mode is enforced
- No `any` types
- No emojis in code or UI (SVGs only)
- No comments explaining what the code does — only why when non-obvious
- No unused imports or variables

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
