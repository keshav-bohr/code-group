import { Config } from './extension.type';
import * as vscode from 'vscode';

function config (fileLanguage: string | undefined): Config {
    switch (fileLanguage) {
        case 'javascript':
        case 'typescript':
        case 'javascriptreact':
            return {
                fileType: 'javascript',
                startPattern: /(?:^|\W)\/\/ start group:(?:$|\W)/gi,
                stopPattern: /(?:^|\W)\/\/ end group:(?:$|\W)/gi
            };
        default:
            return {
                fileType: '',
                startPattern: /(?:^|\W)\/\/ start group:(?:$|\W)/gi,
                stopPattern: /(?:^|\W)\/\/ end group:(?:$|\W)/gi
            };
    }
}


export default config;