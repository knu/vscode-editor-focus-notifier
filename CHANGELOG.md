# Changelog

## [0.2.1] - 2026-01-04

### Added
- `EDITOR_APP_NAME` and `EDITOR_NAME` environment variables are now passed to executed commands
- `editorAppName` and `editorName` context variables exposed for use in keybindings

## [0.2.0] - 2025-12-19

### Added
- Three-state detection: editor, terminal, and other (previously only editor/non-editor)
- `editorFocusNotifier.onEnterTerminalCommand` configuration for terminal state
- `editorFocusNotifier.onEnterOtherCommand` configuration for other state

### Changed
- `editorFocusNotifier.onLeaveEditorCommand` automatically migrates to new settings and is removed

### Fixed
- Extension now correctly detects initial state when VS Code launches with or without an editor open

## [0.1.1] - 2024-12-14

### Added
- Icon for the extension

## [0.1.0] - 2024-12-14

### Added
- Initial release
