# Editor Focus Notifier

A VS Code extension that detects when you enter or leave the text editor area and runs configurable shell commands on those transitions.

[Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=knu.editor-focus-notifier)

## Features

- Detects focus state transitions between editor and non-editor areas
- Runs custom shell commands when entering/leaving editor focus
- Useful for integrating with external tools like Hammerspoon, Karabiner-Elements, and BetterTouchTool

## Use Case

The primary use case is to notify external tools so they can activate UI enhancements and event modifications using those tools' capabilities.

## Configuration

Configure the extension through VS Code settings:

- **`editorFocusNotifier.enable`**: Enable or disable the extension (default: `true`)
- **`editorFocusNotifier.onEnterEditorCommand`**: Shell command to run when entering editor focus state
- **`editorFocusNotifier.onLeaveEditorCommand`**: Shell command to run when leaving editor focus state

### Example Configuration With Hammerspoon

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "open \"hammerspoon://vscode-focus?mode=editor\"",
  "editorFocusNotifier.onLeaveEditorCommand": "open \"hammerspoon://vscode-focus?mode=other\""
}
```

### Example Configuration With Karabiner-Elements

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile 'VSCodeEditor'",
  "editorFocusNotifier.onLeaveEditorCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile 'Default'"
}
```

Or:

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --set-variable '{"vscode_editor_focused": true}'",
  "editorFocusNotifier.onLeaveEditorCommand": "'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --set-variable '{"vscode_editor_focused": false}'"
}
```

### Example Configuration With BetterTouchTool

```json
{
  "editorFocusNotifier.onEnterEditorCommand": "open 'btt://set_number_variable?variableName=VSCodeEditorFocused&value=1'",
  "editorFocusNotifier.onLeaveEditorCommand": "open 'btt://set_number_variable?variableName=VSCodeEditorFocused&value=0'"
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
