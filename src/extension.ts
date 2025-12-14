import * as vscode from "vscode";
import { spawn } from "child_process";

type FocusState = "editor" | "non-editor";

let outputChannel: vscode.OutputChannel;
let currentState: FocusState | null = null;
let config: {
  enable: boolean;
  onEnterEditorCommand: string;
  onLeaveEditorCommand: string;
};

function loadConfiguration(): void {
  const cfg = vscode.workspace.getConfiguration("editorFocusNotifier");
  config = {
    enable: cfg.get<boolean>("enable", true),
    onEnterEditorCommand: cfg.get<string>("onEnterEditorCommand", ""),
    onLeaveEditorCommand: cfg.get<string>("onLeaveEditorCommand", ""),
  };
}

function runCommand(cmd: string): void {
  const trimmed = cmd.trim();
  if (trimmed.length === 0) return;

  outputChannel.appendLine(`Executing: ${trimmed}`);

  try {
    const child = spawn(trimmed, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });

    child.unref();

    child.on("error", (err) => {
      outputChannel.appendLine(`Error spawning command: ${err.message}`);
    });
  } catch (err) {
    outputChannel.appendLine(`Exception running command: ${err}`);
  }
}

function computeState(): FocusState {
  const windowFocused = vscode.window.state.focused;
  const hasActiveEditor = vscode.window.activeTextEditor !== undefined;

  return windowFocused && hasActiveEditor ? "editor" : "non-editor";
}

function evaluateState(): void {
  if (!config.enable) return;

  const newState = computeState();

  if (newState === currentState) return;

  currentState = newState;

  switch (newState) {
    case "editor":
      outputChannel.appendLine("[enter] editor");
      runCommand(config.onEnterEditorCommand);
      break;
    default:
      outputChannel.appendLine("[leave] editor");
      runCommand(config.onLeaveEditorCommand);
  }
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Editor Focus Notifier");

  loadConfiguration();

  // Set initial state and run corresponding command
  currentState = computeState();
  outputChannel.appendLine(`Initial state: ${currentState}`);

  if (config.enable) {
    switch (currentState) {
      case "editor":
        runCommand(config.onEnterEditorCommand);
        break;
      case "non-editor":
        runCommand(config.onLeaveEditorCommand);
        break;
    }
  }

  // Subscribe to configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("editorFocusNotifier")) {
        outputChannel.appendLine("Configuration changed");
        loadConfiguration();
      }
    }),
  );

  // Subscribe to state-changing events
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => evaluateState()),
  );

  context.subscriptions.push(
    vscode.window.onDidChangeWindowState(() => evaluateState()),
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTerminal(() => evaluateState()),
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "editorFocusNotifier.showCurrentState",
      () => {
        const state = currentState ?? "unknown";
        outputChannel.appendLine(`Current state: ${state}`);
        vscode.window.showInformationMessage(
          `Editor Focus Notifier state: ${state}`,
        );
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "editorFocusNotifier.forceReevaluate",
      () => {
        outputChannel.appendLine("Force reevaluate triggered");
        evaluateState();
      },
    ),
  );

  outputChannel.appendLine("Editor Focus Notifier activated");
}

export function deactivate() {}
