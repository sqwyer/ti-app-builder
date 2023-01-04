import { readFileSync, existsSync } from "fs";

export function config() {
    let cfg = {
        src: '/',
        main: '/CTX.8xp',
        outfile: '/OUT.8xp'
    };
    if(existsSync(process.cwd() + '/ticonfig.json')) {
        cfg = {...cfg, ...JSON.parse(readFileSync(process.cwd() + '/ticonfig.json').toString())}
    }
    return cfg;
}

export type Config = {
    src: string,
    main: string,
    outfile: string
}