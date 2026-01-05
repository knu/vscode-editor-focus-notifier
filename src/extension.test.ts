import * as assert from "assert";
import * as fs from "fs/promises";
import * as path from "path";
import * as vscode from "vscode";

async function waitForFile(filePath: string, timeoutMs = 8000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await fs.access(filePath);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  throw new Error(`Timed out waiting for file: ${filePath}`);
}

async function activateExtension(): Promise<vscode.Extension<unknown>> {
  const extension = vscode.extensions.getExtension("knu.editor-focus-notifier");
  assert.ok(extension, "Extension is not found");
  await extension.activate();
  return extension;
}

function createCommand(markerPath: string): string {
  const script = `require("fs").writeFileSync(${JSON.stringify(markerPath)}, "ok")`;
  return `${JSON.stringify(process.execPath)} -e ${JSON.stringify(script)}`;
}

suite("Editor Focus Notifier", () => {
  test("executes external command on editor focus", async () => {
    const extension = await activateExtension();

    const tmpDir = path.join(extension.extensionPath, ".tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    const markerPath = path.join(tmpDir, "editor-focus-marker.txt");
    const cfg = vscode.workspace.getConfiguration("editorFocusNotifier");
    await fs.rm(markerPath, { force: true });

    await cfg.update("onEnterEditorCommand", createCommand(markerPath), vscode.ConfigurationTarget.Global);

    try {
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");

      const doc = await vscode.workspace.openTextDocument({ content: "focus test" });
      await vscode.window.showTextDocument(doc, vscode.ViewColumn.One, false);

      await vscode.commands.executeCommand("editorFocusNotifier.forceReevaluate");

      await waitForFile(markerPath);
    } finally {
      await cfg.update("onEnterEditorCommand", "", vscode.ConfigurationTarget.Global);
    }
  });

  test("executes external command on terminal focus", async () => {
    const extension = await activateExtension();

    const tmpDir = path.join(extension.extensionPath, ".tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    const markerPath = path.join(tmpDir, "terminal-focus-marker.txt");
    const cfg = vscode.workspace.getConfiguration("editorFocusNotifier");
    await fs.rm(markerPath, { force: true });

    await cfg.update("onEnterTerminalCommand", createCommand(markerPath), vscode.ConfigurationTarget.Global);

    try {
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");

      const terminal = vscode.window.createTerminal("Focus Notifier Test");
      terminal.show();

      await vscode.commands.executeCommand("editorFocusNotifier.forceReevaluate");
      await waitForFile(markerPath);

      terminal.dispose();
    } finally {
      await cfg.update("onEnterTerminalCommand", "", vscode.ConfigurationTarget.Global);
    }
  });

  test("executes external command on other focus", async () => {
    const extension = await activateExtension();

    const tmpDir = path.join(extension.extensionPath, ".tmp");
    await fs.mkdir(tmpDir, { recursive: true });

    const markerPath = path.join(tmpDir, "other-focus-marker.txt");
    const cfg = vscode.workspace.getConfiguration("editorFocusNotifier");
    await fs.rm(markerPath, { force: true });

    await cfg.update("onEnterOtherCommand", createCommand(markerPath), vscode.ConfigurationTarget.Global);

    try {
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");

      const terminal = vscode.window.createTerminal("Focus Notifier Test");
      terminal.show();
      terminal.dispose();

      await vscode.commands.executeCommand("editorFocusNotifier.forceReevaluate");
      await waitForFile(markerPath);
    } finally {
      await cfg.update("onEnterOtherCommand", "", vscode.ConfigurationTarget.Global);
    }
  });
});
