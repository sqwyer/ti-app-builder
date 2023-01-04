#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { basename, join } from "path";
import { combine, gen } from "..";
import { config } from "../config";

let args = process.argv;
if(args[0] == "node") args.splice(0,0)

function copyFileSync( source: string, target: string ) {
    let targetFile = target;
    if ( existsSync( target ) ) {
        if ( lstatSync( target ).isDirectory() ) {
            targetFile = join( target, basename( source ) );
        }
    }
    writeFileSync(targetFile, readFileSync(source));
}

function copyFolderRecursiveSync( source: string, target: string ) {
    let files = [];
    let targetFolder = join( target, basename( source ) );
    if ( !existsSync( targetFolder ) ) {
        mkdirSync( targetFolder );
    }
    if (lstatSync( source ).isDirectory()) {
        files = readdirSync( source );
        files.forEach( function ( file ) {
            let curSource = join( source, file );
            if ( lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

(async function() {
    switch (args[1]) {
        case "build":
            combine()
            break
        case "create":
            copyFolderRecursiveSync(join(__dirname + '/../../template'), process.argv[2] ?? process.cwd())
            break
        case "combine":
            if(!process.argv[2] || !process.argv[3]) return console.error("Missing arguments!\n    Usage: ti combine <from> <output-file>")
            writeFileSync(process.argv[3], gen(readFileSync(process.argv[2]).toString(), config()))
            break
        default:
            console.log('Ti App Builder\n    $ ti build : Compiles app\n    $ ti create : Creates new TI App\n    $ ti combine (file) : Combines file and its imports')
    }
})()