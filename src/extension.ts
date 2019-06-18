// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	function removeBlankLines(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

		const { document, selections } = editor;

		if (selections.length === 1 && selections[0].isEmpty) {
			vscode.window.showInformationMessage('Select atleast one line');
			return;
		}

		let ranges: any = [];

		selections.forEach((selection) => {
			ranges.push({ start: selection.start.line, end: selection.end.line });
		});

		deleteEmptyLines(editor, document, ranges);

	}

	function deleteEmptyLines(editor: vscode.TextEditor, document: vscode.TextDocument, ranges: any) {
		editor.edit((edit) => {
			ranges.forEach((range: any) => {
				for (let index = range.start; index < range.end; index++) {
					let line = document.lineAt(index);
					console.log(line.isEmptyOrWhitespace, index+ 1);
					if (line.isEmptyOrWhitespace) {
						edit.delete(line.rangeIncludingLineBreak);
					}
				}
			});
		});
	}

	let disposable = vscode.commands.registerTextEditorCommand('extension.helloWorld', removeBlankLines);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
