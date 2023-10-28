// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Group, Config } from './extension.type';
import config from './config';
const window = vscode.window;
const workspace = vscode.workspace;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var activeEditor = window.activeTextEditor;

    function fetchConfigAndGroups(): void {
        if(activeEditor) {
            const currentFileLanguage = vscode.window.activeTextEditor?.document.languageId;
            const currentConfig = config(currentFileLanguage);
            fetchGroups(currentConfig);
        }
    }

    window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            fetchConfigAndGroups();
        }
    }, null, context.subscriptions);

    workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            fetchConfigAndGroups();
        }
    }, null, context.subscriptions);

	function fetchGroups(config: Config) {
        let groups: Array<Group> = [];
        if (!activeEditor || !activeEditor.document) {
            return;
        }

        var text: string = activeEditor.document.getText();
        var match: RegExpExecArray | null;
        let currentGroupIndex: number = 0;
        while (match = config.startPattern.exec(text)) {
            // Matching the starting group name
            let colonIndexAfterStart: number = text.indexOf(':', match.index);
            let newLineIndexAfterStart: number = text.indexOf('\n', match.index);
            let startGroupName: string = text.substring(colonIndexAfterStart + 1, newLineIndexAfterStart).trim();
            let endMatch: RegExpExecArray | null;
            if (endMatch = config.stopPattern.exec(text)) {
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
}

// This method is called when your extension is deactivated
export function deactivate() {}
