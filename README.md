# TypeScript Starter

A modern, minimal starter template for building TypeScript applications with best practices in
formatting, linting, testing, configuration management, and logging.

## Features

- ⚡ **TypeScript** with strict configuration
- 🧪 **Jest** for testing (with watch and coverage support)
- 🧹 **ESLint** + **Prettier** + **lint-staged** for clean code
- 🧪 **husky** + **lint-staged** for pre-commit checks
- 📦 **pnpm** as package manager
- 🌱 **Config**-based environment management
- 📜 **Pino** for performant logging
- 🧾 **Zod** for schema validation

---

### 📦 Installation

```bash
pnpm install
```

---

## Scripts

| Command      | Description                         |
| ------------ | ----------------------------------- |
| `build`      | Compile TypeScript to `dist/`       |
| `start:dev`  | Start development server with watch |
| `start:prod` | Build and run in production mode    |
| `test`       | Run tests                           |
| `test:watch` | Run tests in watch mode             |
| `test:cov`   | Run tests with coverage report      |
| `format`     | Format code with Prettier           |
| `lint`       | Lint code with ESLint (auto-fix)    |

---

## Project Structure

```text
.
├── config/             # Environment-based configs (via `config` package)
│   ├── default.json
│   ├── development.json
│   └── production.json
├── src/                # Application source code
│   ├── app.config.ts
│   ├── logger/         # Pino-based logging setup
│   │   └── index.ts
│   └── main.ts         # Entry point
├── test/               # Jest test files (if any)
├── eslint.config.mjs   # ESLint configuration
├── jest.config.js      # Jest configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project metadata and scripts
├── README.md           # Project readme
├── LICENSE             # MIT License
```

---

## Linting & Formatting

This project uses **Prettier**, **ESLint**, and **CSpell** via `lint-staged` to ensure clean
commits.

Pre-commit hook powered by `husky` will:

- Format code with Prettier
- Lint code with ESLint
- Run spell-check with CSpell
