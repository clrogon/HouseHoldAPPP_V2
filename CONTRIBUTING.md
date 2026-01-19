# Contributing to HouseHold Hero V2

Thank you for your interest in contributing to HouseHold Hero V2! We welcome contributions from developers of all skill levels.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)
- [Community](#community)

## Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 20 or higher
- npm or yarn package manager
- Git
- Basic knowledge of:
  - React
  - TypeScript
  - TailwindCSS
  - Git and GitHub

### Development Setup

1. **Fork the repository**

   Click the "Fork" button on GitHub and clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/HouseHoldAPPP_V2.git
   cd HouseHoldAPPP_V2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Run tests**

   ```bash
   npm run test
   ```

5. **Run linter**

   ```bash
   npm run lint
   ```

## Code Style

We follow these coding standards:

### TypeScript/JavaScript

- Use **TypeScript strict mode**
- Use functional components and hooks
- Prefer named exports over default exports (except for main entry points)
- Use arrow functions for callbacks
- No `any` types unless absolutely necessary
- Use interface for object shapes, type for unions/primitives

```typescript
// Good
interface User {
  id: string;
  name: string;
}

export function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// Avoid
export default function UserProfile({ user }: { user: any }) {
  return <div>{user.name}</div>;
}
```

### React

- Use functional components with hooks
- Use `useMemo` for expensive computations
- Use `useCallback` for callbacks passed to children
- Clean up effects with return functions
- Use React Hook Form for forms with Zod validation

```typescript
// Good
export function TaskList({ tasks }: { tasks: Task[] }) {
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => !task.completed);
  }, [tasks]);

  return (
    <ul>
      {filteredTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

// Avoid
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.filter(task => !task.completed).map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```

### Styling

- Use TailwindCSS utility classes
- Follow the shadcn/ui component patterns
- Use `cn()` helper for conditional classes
- Avoid custom CSS when possible

```typescript
// Good
<div className="flex items-center justify-between p-4 border rounded-lg">
  <Button variant="primary">Save</Button>
</div>

// Avoid
<div className="custom-container">
  <Button className="my-custom-button">Save</Button>
</div>
```

### File Naming

- Use **PascalCase** for components: `UserProfile.tsx`
- Use **camelCase** for utilities: `formatDate.ts`
- Use **kebab-case** for folders: `user-profile/`

### File Organization

```
src/features/feature-name/
├── components/        # Feature-specific components
├── hooks/             # Feature-specific hooks
├── pages/             # Page components
├── types/             # TypeScript types
├── store/             # Zustand stores
└── index.ts           # Barrel exports
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add two-factor authentication

Implement TOTP-based 2FA with QR code generation.
Users can now enable 2FA in security settings.

Closes #123

fix(tasks): prevent duplicate task creation

Add uniqueness check before creating new tasks.
Prevents users from creating tasks with identical titles.

Fixes #456

docs(readme): update installation instructions

Add Docker setup and environment variable documentation.

refactor(calendar): extract event positioning logic

Move event positioning to separate utility function
for better reusability and testing.

test(auth): add login form tests

Add unit tests for login form validation and submission.
Test coverage improved from 60% to 75%.
```

## Pull Request Process

### Before Submitting

1. **Update your branch**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```

3. **Update documentation** if needed

### PR Guidelines

1. **Provide a clear description**
   - What does this PR do?
   - Why is it needed?
   - How does it work?

2. **Reference related issues**
   - Use `Fixes #123` or `Closes #123` format
   - Link related issues with `Related to #123`

3. **Add screenshots** for UI changes

4. **Keep PRs focused**
   - One feature or bug fix per PR
   - Small, reviewable chunks

5. **Pass all checks**
   - CI/CD pipeline must pass
   - Code coverage must not decrease

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All checks passing

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Testing

We aim for **70% minimum test coverage**. All new features must include tests.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- TaskCard.test.tsx
```

### Writing Tests

Use **React Testing Library** for component tests and **Vitest** for unit tests.

```typescript
// Example test
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = {
      id: '1',
      title: 'Test Task',
      status: 'pending',
    }
    render(<TaskCard task={task} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn()
    const task = {
      id: '1',
      title: 'Test Task',
      status: 'pending',
    }
    render(<TaskCard task={task} onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledWith(task)
  })
})
```

## Reporting Issues

### Bug Reports

Before reporting a bug:

1. Check [existing issues](https://github.com/YOUR_ORG/HouseHoldAPPP_V2/issues)
2. Search the [documentation](README.md)
3. Try to reproduce the issue

When reporting, include:

- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or screen recordings
- Environment info:
  - OS and version
  - Browser and version
  - Node.js version
  - Package version

**Bug Report Template:**

```markdown
## Description
Clear and concise description of the bug

## To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120]
- Node.js: [e.g. 20.10.0]
- Version: [e.g. 0.1.0]

## Additional Context
Any other relevant information
```

### Feature Requests

We welcome feature requests! When proposing a new feature:

- Explain the use case
- Describe the expected behavior
- Consider implementation complexity
- Check if it aligns with project goals

**Feature Request Template:**

```markdown
## Feature Description
What feature would you like?

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives
What alternatives have you considered?

## Additional Context
Any other relevant information
```

## Documentation

Help improve our documentation:

- Fix typos and grammar
- Clarify confusing sections
- Add code examples
- Create tutorials and guides
- Translate documentation

## Community

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and ideas
- **Discord**: Join our community server (link coming soon)

### Getting Help

If you need help contributing:

- Read the existing code
- Check the documentation
- Ask questions in Discussions
- Contact maintainers

### Recognizing Contributors

We recognize all contributors in our project:
- Your name in CONTRIBUTORS.md
- Recognition in release notes
- Badge on your GitHub profile (coming soon)

## Development Resources

### Key Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [shadcn/ui](https://ui.shadcn.com/)

### Project Structure

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed project architecture.

### Current Focus

Check our [Project Roadmap](./docs/ROADMAP.md) for upcoming features and priorities.

## License

By contributing to HouseHold Hero V2, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

## Code of Conduct

Please be respectful and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

Thank you for contributing to HouseHold Hero V2! 🙌

If you have any questions, feel free to open an issue or reach out to the maintainers.
