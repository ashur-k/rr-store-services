# Ruff

## What is Ruff?

[Ruff](https://docs.astral.sh/ruff/) is a fast Python linter and formatter written in Rust.

It can replace several separate Python development tools, including:

* **Flake8** — Python linting and code-quality checks
* **isort** — Import sorting
* **Black** — Python code formatting

Instead of installing and configuring all three tools separately, this project uses **Ruff** as a single tool for linting, formatting, and import sorting.

---

## Installation

Ruff is installed as a development dependency using `uv`:

```bash
uv add --dev ruff
```

Ruff is listed under the `dev` dependency group in `pyproject.toml`.

---

## Configuration

Ruff is configured directly in:

```text
pyproject.toml
```

Example:

```toml
[tool.ruff]
line-length = 120
exclude = [
    ".git",
    ".tox",
    "*env*",
    "*venv*",
    "__pycache__",
    "*/migrations/*",
    "*/staticfiles/*",
    "*/mediafiles/*",
    "node_modules",
]

[tool.ruff.lint]
select = ["E", "F", "I"]

[tool.ruff.format]
quote-style = "double"
```

### Selected lint rules

```toml
select = ["E", "F", "I"]
```

These provide:

* `E` — pycodestyle-style errors
* `F` — Pyflakes checks for common Python errors
* `I` — import sorting

---

# Ruff Commands

## Check the project

Run Ruff against the entire project:

```bash
uv run ruff check .
```

This checks the Python code for linting issues.

---

## Automatically fix linting issues

```bash
uv run ruff check . --fix
```

Ruff will automatically fix issues that it knows how to safely fix.

---

## Format the project

```bash
uv run ruff format .
```

This formats Python files according to the Ruff formatter.

This replaces the role that **Black** would normally perform.

---

## Check formatting without changing files

```bash
uv run ruff format . --check
```

This is useful in CI/CD because it checks whether the code is correctly formatted without modifying anything.

---

## Check a specific file

```bash
uv run ruff check app/models.py
```

---

## Format a specific file

```bash
uv run ruff format app/models.py
```

---

## Check and fix imports

Import sorting is handled by Ruff through the `I` lint rules.

Check:

```bash
uv run ruff check . --select I
```

Automatically fix imports:

```bash
uv run ruff check . --select I --fix
```

---

# Recommended Development Workflow

Before committing code, run:

```bash
uv run ruff check . --fix
uv run ruff format .
```

Then verify everything:

```bash
uv run ruff check .
uv run ruff format . --check
```

If both commands complete successfully, the code passes the configured Ruff checks.

---

# Ruff vs Previous Tools

The instructor's setup uses three separate tools:

```text
Flake8 → linting
Black  → formatting
isort  → import sorting
```

This project uses:

```text
Ruff
 ├── linting
 ├── formatting
 └── import sorting
```

This keeps the project's development tooling simpler and reduces the number of packages and configuration files that need to be maintained.

---

# Quick Reference

| Task             | Command                                |
| ---------------- | -------------------------------------- |
| Check code       | `uv run ruff check .`                  |
| Fix lint issues  | `uv run ruff check . --fix`            |
| Format code      | `uv run ruff format .`                 |
| Check formatting | `uv run ruff format . --check`         |
| Check imports    | `uv run ruff check . --select I`       |
| Fix imports      | `uv run ruff check . --select I --fix` |
| Check one file   | `uv run ruff check app/models.py`      |
| Format one file  | `uv run ruff format app/models.py`     |

## Useful Links

* Ruff documentation: https://docs.astral.sh/ruff/
* Ruff rules: https://docs.astral.sh/ruff/rules/
* Ruff configuration: https://docs.astral.sh/ruff/configuration/
