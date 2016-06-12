'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import {
    window,
    commands,
    Disposable,
    ExtensionContext,
    StatusBarAlignment,
    StatusBarItem,
    TextDocument,
    TextDocumentContentProvider,
    TextEditor,
    Range,
    Position,
    ViewColumn,
    Selection,
    workspace

} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "scrollsync" is now active!');

    let scrollsync = new ScrollSync();
    let controller = new ScrollSyncController(scrollsync);

    context.subscriptions.push(controller);
    context.subscriptions.push(scrollsync);
}

// this method is called when your extension is deactivated
export function deactivate() {
}


export class ScrollSync {
    public syncWindows() {
        let editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        let doc = editor.document;

        let editors: TextEditor[] = window.visibleTextEditors;
        var i = 0;
        var previousEditorPos = 0;
        let previousPos: Position;
    
        for (var theEditor of editors) {
            console.log(theEditor.document.positionAt);

            if (theEditor.viewColumn != ViewColumn.One) {
                theEditor.revealRange(new Range(previousPos, previousPos.translate(theEditor.document.lineCount)));
            } else {
                previousPos = theEditor.selection.active;
            }
        }
    }

    dispose() {

    }
}

export class ScrollSyncController {
    private _scollSync: ScrollSync;
    private _disposable: Disposable;

    constructor(scrollSync: ScrollSync) {
        this._scollSync = scrollSync;
        this._scollSync.syncWindows();

        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._scollSync.syncWindows();
    }
}