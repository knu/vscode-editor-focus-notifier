# Changelog

## [0.2.0] - 2025-12-19

### Added
- Three-state detection: editor, terminal, and other (previously only editor/non-editor)
- `editorFocusNotifier.onEnterTerminalCommand` configuration for terminal state
- `editorFocusNotifier.onEnterOtherCommand` configuration for other state

### Changed
- Renamed state "non-editor" to "other" for clarity
- Initial state detection now ignores window focus check to correctly detect state at startup
- Updated all configuration examples in README for three-state model

### Deprecated
- `editorFocusNotifier.onLeaveEditorCommand` - automatically migrates to `onEnterOtherCommand`

### Fixed
- Extension now correctly detects initial state when VS Code launches with or without an editor open

## [0.1.1] - 2024-12-14

### Added
- Icon for the extension

## [0.1.0] - 2024-12-14

### Added
- Initial release
