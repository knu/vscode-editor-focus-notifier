# Editor Focus Notifier

A VS Code extension that detects when you enter or leave the text editor area and runs configurable shell commands on those transitions.

## Features

- Detects focus state transitions between editor and non-editor areas
- Runs custom shell commands when entering/leaving editor focus
- Useful for integrating with external tools like Hammerspoon, Karabiner-Elements, and BetterTouchTool

## Use Case

The primary use case is to notify external tools so they can activate UI enhancements and event modifications using Karabiner-Elements and BetterTouchTool.

## Configuration

Configure the extension through VS Code settings:

- **`editorFocusNotifier.enable`**: Enable or disable the extension (default: `true`)
- **`editorFocusNotifier.onEnterEditorCommand`**: Shell command to run when entering editor focus state
- **`editorFocusNotifier.onLeaveEditorCommand`**: Shell command to run when leaving editor focus state

### Example Configuration

```json
{
  "editorFocusNotifier.enable": true,
  "editorFocusNotifier.onEnterEditorCommand": "open \"hammerspoon://vscode-focus?mode=editor\"",
  "editorFocusNotifier.onLeaveEditorCommand": "open \"hammerspoon://vscode-focus?mode=other\""
}
```

Or with Karabiner:

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "karabiner_cli --select-profile 'VSCodeEditor'",
  "editorFocusNotifier.onLeaveEditorCommand": "karabiner_cli --select-profile 'Default'"
}
```

## Commands

- **Editor Focus Notifier: Show Current State** - Display the current focus state
- **Editor Focus Notifier: Force Reevaluate** - Manually trigger state reevaluation

## How It Works

The extension considers the editor to be focused when:
- VS Code window is focused, AND
- An active text editor exists

In all other cases (terminal focused, sidebar focused, window unfocused, etc.), the state is "non-editor".

Commands are executed only when the state actually changes, preventing unnecessary executions.

## Output Channel

Check the "Editor Focus Notifier" output channel for debugging information about state transitions and command execution.

## License

MIT

## Repository

https://github.com/knu/vscode-editor-focus-notifier
