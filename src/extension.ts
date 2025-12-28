import * as vscode from "vscode";
import { spawn } from "child_process";

type FocusState = "editor" | "terminal" | "other";

let outputChannel: vscode.OutputChannel;
let currentState: FocusState | null = null;
let config: {
  enable: boolean;
  onEnterEditorCommand: string;
  onEnterTerminalCommand: string;
  onEnterOtherCommand: string;
};

async function loadConfiguration(): Promise<void> {
  const cfg = vscode.workspace.getConfiguration("editorFocusNotifier");

  // Migration: if legacy onLeaveEditorCommand exists, migrate and remove it
  const inspectLeave = cfg.inspect<string>("onLeaveEditorCommand");
  const legacyOnLeaveEditorCommand = cfg.get<string>("onLeaveEditorCommand", "");

  if (legacyOnLeaveEditorCommand) {
    if (inspectLeave?.globalValue !== undefined) {
      await cfg.update("onEnterTerminalCommand", legacyOnLeaveEditorCommand, vscode.ConfigurationTarget.Global);
      await cfg.update("onEnterOtherCommand", legacyOnLeaveEditorCommand, vscode.ConfigurationTarget.Global);
      await cfg.update("onLeaveEditorCommand", undefined, vscode.ConfigurationTarget.Global);
    }
    if (inspectLeave?.workspaceValue !== undefined) {
      await cfg.update("onEnterTerminalCommand", legacyOnLeaveEditorCommand, vscode.ConfigurationTarget.Workspace);
      await cfg.update("onEnterOtherCommand", legacyOnLeaveEditorCommand, vscode.ConfigurationTarget.Workspace);
      await cfg.update("onLeaveEditorCommand", undefined, vscode.ConfigurationTarget.Workspace);
    }
  }

  config = {
    enable: cfg.get<boolean>("enable", true),
    onEnterEditorCommand: cfg.get<string>("onEnterEditorCommand", ""),
    onEnterTerminalCommand: cfg.get<string>("onEnterTerminalCommand", ""),
    onEnterOtherCommand: cfg.get<string>("onEnterOtherCommand", ""),
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

function computeState(ignoreFocus = false): FocusState {
  if (!ignoreFocus && !vscode.window.state.focused) return "other";
  if (vscode.window.activeTextEditor !== undefined) return "editor";
  if (vscode.window.activeTerminal !== undefined) return "terminal";
  return "other";
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
    case "terminal":
      outputChannel.appendLine("[enter] terminal");
      runCommand(config.onEnterTerminalCommand);
      break;
    case "other":
      outputChannel.appendLine("[enter] other");
      runCommand(config.onEnterOtherCommand);
      break;
  }
}

export async function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Editor Focus Notifier");

  await loadConfiguration();

  // Set initial state and run corresponding command
  currentState = computeState(true);
  outputChannel.appendLine(`Initial state: ${currentState}`);

  if (config.enable) {
    switch (currentState) {
      case "editor":
        runCommand(config.onEnterEditorCommand);
        break;
      case "terminal":
        runCommand(config.onEnterTerminalCommand);
        break;
      case "other":
        runCommand(config.onEnterOtherCommand);
        break;
    }
  }

  // Re-evaluate state after a delay to detect correct initial status
  const retryTimer = setTimeout(() => {
    outputChannel.appendLine("Re-evaluating initial state after delay");
    evaluateState();
  }, 3000);

  context.subscriptions.push({
    dispose: () => clearTimeout(retryTimer),
  });

  // Subscribe to configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration("editorFocusNotifier")) {
        outputChannel.appendLine("Configuration changed");
        await loadConfiguration();
      }
    })
  );

  // Subscribe to state-changing events
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => evaluateState()));

  context.subscriptions.push(vscode.window.onDidChangeWindowState(() => evaluateState()));

  context.subscriptions.push(vscode.window.onDidChangeActiveTerminal(() => evaluateState()));

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("editorFocusNotifier.showCurrentState", () => {
      const state = currentState ?? "unknown";
      outputChannel.appendLine(`Current state: ${state}`);
      vscode.window.showInformationMessage(`Editor Focus Notifier state: ${state}`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("editorFocusNotifier.forceReevaluate", () => {
      outputChannel.appendLine("Force reevaluate triggered");
      evaluateState();
    })
  );

  outputChannel.appendLine("Editor Focus Notifier activated");
}

export function deactivate() {}
