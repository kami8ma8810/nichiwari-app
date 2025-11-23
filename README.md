# Nichiwari! - Smart Shopping with Daily Cost Calculator

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)](https://vuejs.org/)

[🇯🇵 日本語版はこちら](./README.ja.md)

</div>

## 🎯 Overview

**Nichiwari!** (にちわり) is a web application that helps you make smarter purchasing decisions by calculating the **daily cost** of items you're considering buying.

By applying the concept of depreciation to everyday shopping, it visualizes value in the form of "This item costs ¥XX per day."

### ✨ Key Features

- 📊 **Depreciation Calculator** - Calculate daily, monthly, and yearly costs based on purchase price and usage period
- 💡 **Product Suggestions** - Auto-suggest average prices and typical lifespan for popular items
- 😊 **Happiness Score** - Evaluate purchase value with scientifically-backed checklists
- 📈 **Trend Analysis** - View rankings of frequently searched products
- 🌐 **Offline Support** - Core features work without internet connection

## 🚀 Quick Start

### Requirements

- Node.js v20 LTS or higher
- pnpm 8.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nichiwari-app.git
cd nichiwari-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env file to configure Supabase credentials
```

### Development Server

```bash
# Start development server
pnpm dev

# Available at http://localhost:3000
```

### Other Commands

```bash
# Production build
pnpm build

# Production server
pnpm preview

# Run tests
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests

# Code quality checks
pnpm lint           # ESLint
pnpm type-check     # TypeScript type checking

# Start Storybook
pnpm storybook
```

## 📚 Documentation

Detailed project documentation is available in the [`docs/`](./docs/) directory.

### Developer Documentation

- [📋 Requirements](./docs/01-requirements/) - Functional & non-functional requirements
- [🏗️ Architecture](./docs/02-architecture/) - System design & tech stack decisions
- [💻 Development Guide](./docs/03-development/) - Setup & coding standards
- [🧪 Testing Strategy](./docs/04-testing/) - TDD & E2E testing
- [🔧 Implementation Guide](./docs/05-implementation/) - Phase-by-phase implementation
- [☁️ Infrastructure & Operations](./docs/06-infrastructure/) - Deployment & monitoring
- [📖 Reference](./docs/07-reference/) - API specs & data structures

### Getting Started Docs

1. [Setup Guide](./docs/03-development/setup.md)
2. [Architecture Overview](./docs/02-architecture/overview.md)
3. [Coding Standards](./docs/03-development/coding-standards.md)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Nuxt 3 (SSG)
- **UI Library**: Volt (PrimeVue + Tailwind CSS)
- **Language**: TypeScript (strict mode)
- **State Management**: Pinia
- **Validation**: Valibot

### Backend

- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime

### Development Tools

- **Package Manager**: pnpm
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## 🏗️ Project Structure

```
nichiwari-app/
├── docs/                 # Project documentation
├── src/
│   ├── core/            # Business logic layer
│   │   ├── domain/      # Domain models
│   │   ├── usecases/    # Use cases
│   │   └── ports/       # Interfaces
│   ├── infrastructure/  # External services layer
│   ├── presentation/    # Presentation layer
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── composables/ # Vue Composables
│   └── shared/          # Shared utilities
├── tests/               # Test code
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/            # E2E tests
└── public/             # Static files
```

## 🤝 Contributing

Contributions are welcome!

### How to Contribute

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code formatting
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Build/tooling

See [Git Workflow](./docs/03-development/git-workflow.md) for details.

## 📝 License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.

## 📮 Contact

- Issues: [GitHub Issues](https://github.com/yourusername/nichiwari-app/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/nichiwari-app/discussions)

## 🙏 Acknowledgments

This project uses the following amazing open-source projects:

- [Nuxt](https://nuxt.com/)
- [Vue.js](https://vuejs.org/)
- [PrimeVue](https://primevue.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

---

<div align="center">
  Made with ❤️ for smarter shopping decisions
</div>
