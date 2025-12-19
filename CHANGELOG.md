# Changelog

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
