// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Group } from './extension.type';
const window = vscode.window;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var startPattern: RegExp = /(?:^|\W)\/\/ start group:(?:$|\W)/gi;
    var stopPattern: RegExp = /(?:^|\W)\/\/ end group:(?:$|\W)/gi;
	var activeEditor = window.activeTextEditor;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-group" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('code-group.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from code-group!');
		const currentFileLanguage = vscode.window.activeTextEditor?.document.languageId;
		if (currentFileLanguage === 'javascript') {
			vscode.window.showInformationMessage('This extension only works with Markdown files');
			return;
		}
	});

	if(activeEditor) {
		fetchGroups();
	}


	function fetchGroups() {
        let groups: Array<Group> = [];
        if (!activeEditor || !activeEditor.document) {
            return;
        }

        var text: string = activeEditor.document.getText();
        var match: RegExpExecArray | null;
        let currentGroupIndex: number = 0;
        while (match = startPattern.exec(text)) {
            // Matching the starting group name
            let colonIndexAfterStart: number = text.indexOf(':', match.index);
            let newLineIndexAfterStart: number = text.indexOf('\n', match.index);
            let startGroupName: string = text.substring(colonIndexAfterStart + 1, newLineIndexAfterStart).trim();
            let endMatch: RegExpExecArray | null;
            if (endMatch = stopPattern.exec(text)) {
                // Matching the ending group name
                let colonIndexAfterStop: number = text.indexOf(':', endMatch.index);
                let newLineIndexAfterStop: number = text.indexOf('\n', endMatch.index);
                let stopGroupName: string = text.substring(colonIndexAfterStop + 1, newLineIndexAfterStop).trim();
                if(startGroupName.toLocaleLowerCase() === stopGroupName.toLocaleLowerCase()) {
                    // If the group names match, we have a valid group
                    let group: Group = {
                        name: startGroupName,
                        start: match.index,
                        end: endMatch.index
                    };
                    groups.push(group);
                }
            }
            currentGroupIndex++;
        }
        console.log(groups);
    }

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
