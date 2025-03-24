# React TypeScript Project Conventions

## READ THIS!!! OR I WILL REACH YOU (c) Bigdo

This document outlines the conventions and best practices for naming and organizing code in a React TypeScript project.

## General Naming Conventions

- **File Names**: Use kebab-case for file names. For example, `my-component.tsx`.
- **Directories**: Use kebab-case for directory names. For example, `my-components`.

## Component Naming

- **Component Files**: Use PascalCase for React component file names. For example, `MyComponent.tsx`.
- **Component Names**: Use PascalCase for React component names. For example, `MyComponent`.

## Function Naming

- **Function Names**: Use camelCase for function names. For example, `fetchData`.
- **Event Handlers**: Prefix event handler functions with `handle`. For example, `handleClick`.

## Variable Naming

- **Variable Names**: Use camelCase for variable names. For example, `userName`.
- **Constants**: Use UPPER_SNAKE_CASE for constants. For example, `MAX_USERS`.

## Class Naming

- **Class Names**: Use PascalCase for class names. For example, `UserService`.

## Interface Naming

- **Interface Names**: Use PascalCase and prefix with `I`. For example, `IUser`.

## Type Naming

- **Type Aliases**: Use PascalCase. For example, `UserType`.

## Props and State

- **Props Interface**: Use `Props` suffix. For example, `MyComponentProps`.
- **State Interface**: Use `State` suffix. For example, `MyComponentState`.

## Hooks

- **Custom Hooks**: Prefix with `use` and use camelCase. For example, `useFetchData`.

## CSS Modules

- **CSS Module Files**: Use kebab-case and `.module.css` or `.module.scss` extension. For example, `my-component.module.css`.
- **Class Names**: Use camelCase for CSS class names. For example, `.myComponent`.

## Testing

- **Test Files**: Use the same name as the component or module being tested, followed by `.test.tsx` or `.test.ts`. For example, `MyComponent.test.tsx`.

## Example

Here is an example of a simple component following these conventions:

```typescript
// src/components/my-component.tsx
import React from 'react';
import styles from './my-component.module.css';

interface MyComponentProps {
  userName: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ userName }) => {
  const handleClick = () => {
    console.log(`Hello, ${userName}`);
  };

  return (
    <div className={styles.myComponent}>
      <p>Hello, {userName}!</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default MyComponent;