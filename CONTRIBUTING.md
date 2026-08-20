# Contributing

## Development workflow

All development should start from `dev`.

Do not commit directly to `main` or `dev`.

Create a dedicated branch for each change:

- `feat/<name>`
- `fix/<name>`
- `refactor/<name>`
- `chore/<name>`
- `docs/<name>`

Example:

git checkout dev
git pull
git checkout -b feat/webhook-ingestion

## Pull requests

Changes are merged through pull requests.

Regular development:

feature branch -> dev

Stable releases:

dev -> main

Every pull request must:

- pass all CI checks
- receive at least one approval
- have all review conversations resolved
- be up to date with the target branch

Feature branches are squash-merged into `dev`.

`dev` is merged into `main` using a regular merge commit.

## Commits

Use short and descriptive commit messages.

Examples:

feat: add webhook ingestion
fix: prevent duplicate event processing
test: add idempotency integration tests
docs: update product vision
chore: configure Docker environment

## Testing

Before opening a pull request, run the relevant checks locally.

CI runs the same checks automatically.

## Changelog

Update `CHANGELOG.md` when a pull request introduces a notable user-facing or operational change.

Do not add changelog entries for minor refactoring, formatting or internal maintenance.

New entries should be added under `Unreleased`.

## Code review

The author of a pull request cannot approve their own changes.

Reviewers should check:

- correctness
- tests
- failure scenarios
- readability
- unnecessary complexity
- security implications where relevant

## Scope

Keep changes focused.

Avoid combining unrelated features, refactors and infrastructure changes in the same pull request.

For larger changes, create or reference a GitHub Issue before implementation.
