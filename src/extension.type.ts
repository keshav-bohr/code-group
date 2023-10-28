export interface Group {
    name: string;
    start: number;
    end: number;
}

export interface Config {
    fileType: string;
    startPattern: RegExp;
    stopPattern: RegExp;
}