---
title: Editor Focus Notifier
---

# Editor Focus Notifier

**Editor Focus Notifier** is a Visual Studio Code-compatible extension
that detects focus state transitions between editor, terminal, and
other areas, running configurable shell commands on state changes.

---

## Extension Listings

- **Open VSX Registry**
  [https://open-vsx.org/extension/knu/editor-focus-notifier](https://open-vsx.org/extension/knu/editor-focus-notifier)

- **VS Code Marketplace**
  [https://marketplace.visualstudio.com/items?itemName=knu.editor-focus-notifier](https://marketplace.visualstudio.com/items?itemName=knu.editor-focus-notifier)

- **GitHub Repository**
  [https://github.com/knu/vscode-editor-focus-notifier](https://github.com/knu/vscode-editor-focus-notifier)

---

## What This Extension Does

This extension detects three states:

- **editor**: VS Code window is focused AND an active text editor exists
- **terminal**: VS Code window is focused AND an active terminal exists
  (but no active editor)
- **other**: All other cases (sidebar focused, window unfocused, etc.)

Commands run only when the state changes.  The initial state is
evaluated at startup and its command runs once.

---

## Security Notice

This extension **executes commands exactly as configured by the
user**.

- It does **not** download or execute remote code.
- It does **not** modify commands automatically.

**Users are responsible for ensuring that configured commands are safe
and trusted.**

---

## Author & Responsibility

This extension is written and maintained by Akinori Musha.

For issues or security concerns, please use the GitHub repository
linked above.

---

## License

MIT License (see repository)
