# Takenlijst

A simple to-do list ("takenlijst" is Dutch for task list) built with plain HTML, CSS and JavaScript. Your tasks are saved in your browser, so they're still there next time.

**[Try it live](https://beemo12.github.io/Takenlijst/)**

<img width="772" height="652" alt="takenlijst foto" src="https://github.com/user-attachments/assets/a5058cc4-8fa7-4cae-b79c-0bb155dc6f8b" />

## Features

- Add tasks with Enter
- Tick tasks off, and untick them again
- Double-click a task (or click "Wijzig") to rename it; Enter saves, Escape cancels
- Delete tasks, or remove all finished tasks at once
- Filter on all, open or finished tasks
- A counter of open and finished tasks
- Saved automatically in your browser with localStorage
- Works with the keyboard, on phone and on desktop

## Project structure

```
├── index.html            Page layout
├── css/style.css         Styling
├── js/tasks.js           Task logic: add, tick off, rename, delete, filter, save (no browser code, so it's testable)
├── js/app.js             Page logic: drawing the list and handling clicks and typing
└── tests/tasks.test.js   Unit tests for tasks.js
```

## Run it locally

Download the project and open `index.html` in your browser.

To run the tests (needs [Node.js](https://nodejs.org) 18 or newer):

```
npm test
```

## Built with

- HTML, CSS and plain JavaScript (no frameworks, no build step)
- localStorage to keep your tasks
- Node's built-in test runner

## What I learned

- Keeping data and display separate: every change creates a new task list, then the page is redrawn from it
- Saving to localStorage, and handling broken or missing data
- Editing in place with keyboard shortcuts
- Building a custom checkbox that still works with the keyboard and screen readers
- Writing unit tests
