# Editor Focus Notifier

A VS Code extension that detects focus state transitions between editor, terminal, and other areas, running configurable shell commands on state changes.

## Install

- Visual Studio Marketplace: https://marketplace.visualstudio.com/items?itemName=knu.editor-focus-notifier.  Official Microsoft marketplace listing for VS Code.
- Open VSX: https://open-vsx.org/extension/knu/editor-focus-notifier.  Alternative registry used by VSCodium and other forks.

## Features

- Detects three distinct focus states: **editor**, **terminal**, and **other**
- Runs custom shell commands when entering each state
- Useful for integrating with external tools like Hammerspoon, Karabiner-Elements, and BetterTouchTool

## Use Case

The primary use case is to notify external tools so they can activate UI enhancements and event modifications using those tools' capabilities.

## Configuration

Configure the extension through VS Code settings:

- **`editorFocusNotifier.enable`**: Enable or disable the extension (default: `true`)
- **`editorFocusNotifier.onEnterEditorCommand`**: Shell command to run when entering editor state
- **`editorFocusNotifier.onEnterTerminalCommand`**: Shell command to run when entering terminal state
- **`editorFocusNotifier.onEnterOtherCommand`**: Shell command to run when entering other state

### Example Configuration With Hammerspoon

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "open \"hammerspoon://vscode-focus?mode=editor\"",
  "editorFocusNotifier.onEnterTerminalCommand": "open \"hammerspoon://vscode-focus?mode=terminal\"",
  "editorFocusNotifier.onEnterOtherCommand": "open \"hammerspoon://vscode-focus?mode=other\""
}
```

### Example Configuration With Karabiner-Elements

Using profile switching:

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile 'VSCodeEditor'",
  "editorFocusNotifier.onEnterTerminalCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile 'VSCodeTerminal'",
  "editorFocusNotifier.onEnterOtherCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile 'Default'"
}
```

Using variables (requires separate variable for each state):

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --set-variable '{\"vscode_state\":\"editor\"}'",
  "editorFocusNotifier.onEnterTerminalCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --set-variable '{\"vscode_state\":\"terminal\"}'",
  "editorFocusNotifier.onEnterOtherCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --set-variable '{\"vscode_state\":\"other\"}'"
}
```

### Example Configuration With BetterTouchTool

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "open 'btt://set_string_variable?variableName=VSCodeState&value=editor'",
  "editorFocusNotifier.onEnterTerminalCommand": "open 'btt://set_string_variable?variableName=VSCodeState&value=terminal'",
  "editorFocusNotifier.onEnterOtherCommand": "open 'btt://set_string_variable?variableName=VSCodeState&value=other'"
}
```

## Commands

- **Editor Focus Notifier: Show Current State** - Display the current focus state
- **Editor Focus Notifier: Force Reevaluate** - Manually trigger state reevaluation

## How It Works

The extension detects three states:

- **editor**: VS Code window is focused AND an active text editor exists
- **terminal**: VS Code window is focused AND an active terminal exists (but no active editor)
- **other**: All other cases (sidebar focused, window unfocused, etc.)

Commands are executed only when the state actually changes, preventing unnecessary executions.  Initial state is determined at startup and the corresponding command runs once.

## Environment Variables

The following environment variables are available in shell commands:

- **`EDITOR_APP_NAME`**: Full application name (e.g., `Visual Studio Code`, `Cursor`)
- **`EDITOR_NAME`**: Normalized short name (e.g., `vscode`, `cursor`)

### Example Usage

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "echo \"Entering editor in $EDITOR_NAME\" >> ~/editor.log"
}
```

## Output Channel

Check the "Editor Focus Notifier" output channel for debugging information about state transitions and command execution.

## Bonus Features

### Context Variables

The extension provides the following context variables for use in `keybindings.json`:

- **`editorAppName`**: Full application name (e.g., `Visual Studio Code`, `Cursor`, `VSCodium`)
- **`editorName`**: Normalized short name (e.g., `vscode`, `cursor`, `vscodium`)

Example keybinding:

```json
{
  "key": "cmd+k",
  "command": "myExtension.doSomething",
  "when": "editorName == 'cursor'"
}
```

## License

Copyright (c) 2025-2026 Akinori Musha

MIT License - see [LICENSE](LICENSE) file for details.

## Repository

https://github.com/knu/vscode-editor-focus-notifier
