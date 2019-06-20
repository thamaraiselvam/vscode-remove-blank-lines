import * as vscode from 'vscode';
import { commands, StatusBarAlignment, window, workspace  } from 'vscode';

//It will be invoked on deactivation
export function activate(context: vscode.ExtensionContext) {

	let config: any = {};

	function removeBlankLines(isSelected: Boolean, editor: vscode.TextEditor) {

		let ranges: any = isSelected ? getSelectedRange(editor) : getDocumentRange(editor);

		if (ranges === false) {
			return; //if selection empty or empty document
		}

		setConfig();

		parseEmptyLines(editor, ranges);
	}

	function setConfig() {
		config.allowedNumberOfEmptyLines = workspace.getConfiguration().get('remove-empty-lines.allowedNumberOfEmptyLines');
		if (config.allowedNumberOfEmptyLines < 0 || config.allowedNumberOfEmptyLines > 500) {
			config.allowedNumberOfEmptyLines = 1;
		}
	}


	function getSelectedRange(editor: vscode.TextEditor) {

		const { selections } = editor;

		if (selections.length === 1 && selections[0].isEmpty) {
			return false; //selected text empty
		}

		let ranges: any = [];

		selections.forEach((selection) => {
			ranges.push({ start: selection.start.line, end: selection.end.line }); //Get range for all selected portions
		});

		return ranges;
	}

	function getDocumentRange(editor: vscode.TextEditor) {
		const { document } = editor;
		return [{ start: 0, end: document.lineCount - 1 }];
	}

	function parseEmptyLines(editor: vscode.TextEditor, ranges: any) {

		const { document } = editor;

		let deletedLinesCounter = 0;
		editor.edit((edit) => {
			ranges.forEach((range: any) => { //process every selected range
				deletedLinesCounter += deleteEmptyLines(range, edit, document);
			});
		});

		showStatusMsg(deletedLinesCounter);
	}

	function deleteEmptyLines(range: any, edit: vscode.TextEditorEdit, document: vscode.TextDocument) {
		let deletedLinesCounter = 0;
		let numberOfConsequtiveEmptyLines = 0;
		for (let index = range.start; index < range.end; index++) {

			let line = document.lineAt(index);

			if (!line.isEmptyOrWhitespace) {
				numberOfConsequtiveEmptyLines = 0;
				continue;
			}

			numberOfConsequtiveEmptyLines++;
			if (numberOfConsequtiveEmptyLines > config.allowedNumberOfEmptyLines) {
				deletedLinesCounter++;
				edit.delete(line.rangeIncludingLineBreak);
			}
		}

		return deletedLinesCounter;
	}

	function showStatusMsg(deletedLinesCounter: number) {
		if (!deletedLinesCounter) {
			return;
		}

		statusBar.text = `${deletedLinesCounter} blank line(s) removed`;
		statusBar.show();

		setTimeout(() => {
			statusBar.hide();
		}, 2000);
	}

	//Registering commands
	let _removeOnSelectedLines = commands.registerTextEditorCommand('extension.removeOnSelectedLines', removeBlankLines.bind(null, true));
	let _removeOnDocument = commands.registerTextEditorCommand('extension.removeOnDocument', removeBlankLines.bind(null, false));

	//Registering Status bar
	let statusBar = window.createStatusBarItem(StatusBarAlignment.Right, 100);

	context.subscriptions.push(_removeOnSelectedLines, _removeOnDocument, statusBar);
}

//It will be invoked on deactivation
export function deactivate() { }
