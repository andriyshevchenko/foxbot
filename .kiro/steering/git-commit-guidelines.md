# Git Commit Message Guidelines

When helping with git commits, follow these best practices based on Conventional Commits specification:

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types (Required)

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Breaking Changes

- Add `!` after the type/scope to indicate breaking changes: `feat!:` or `feat(api)!:`
- Include `BREAKING CHANGE:` in the footer with description

## Best Practice Rules

- Use imperative mood in description ("add" not "added" or "adds")
- Keep description under 50 characters
- Don't capitalize the first letter of description
- Don't end description with a period
- Use body to explain what and why, not how
- Wrap body at 72 characters
- Separate subject from body with blank line
- Use footer for issue references and breaking changes

## Scope Guidelines

- Use lowercase
- Be specific but concise
- Common scopes: `api`, `ui`, `auth`, `db`, `config`, `deps`
- Omit scope if change affects multiple areas

## Examples

### Feature with scope

```
feat(auth): add OAuth2 integration

Implement OAuth2 authentication flow with Google and GitHub providers.
This allows users to sign in using their existing accounts without
creating new passwords.

Closes #123
```

### Bug fix

```
fix(api): handle null response in user endpoint

The user endpoint was throwing 500 errors when no user was found.
Now returns proper 404 response with descriptive error message.

Fixes #456
```

### Breaking change

```
feat(api)!: remove deprecated v1 endpoints

Remove all v1 API endpoints as announced in deprecation notice.
All clients must migrate to v2 endpoints.

BREAKING CHANGE: v1 endpoints `/api/v1/*` are no longer available.
Use `/api/v2/*` endpoints instead.

Closes #789
```

### Simple changes

```
docs: update installation instructions
test: add unit tests for user service
chore: update dependencies
```

## Footer Keywords

- `Fixes #123` - Links and closes issue
- `Closes #123` - Links and closes issue
- `Refs #123` - References issue without closing
- `BREAKING CHANGE:` - Describes breaking changes
