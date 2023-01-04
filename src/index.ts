import { PathLike, readFileSync, writeFileSync } from "fs";
import { Config, config } from "./config";

function gen(name: string, options: Config) {
	let str = readFileSync(name).toString();
    const imports = str.matchAll(/\w*prgm\w*/g);
    // console.log(Array.from(imports).forEach(console.log));
    Array.from(imports, (imp) => {
        str = str.replace(imp[0], gen(process.cwd() + options.src + '/' + imp[0].replace("prgm", "") + '.8xp', options));
    });
    return str;
};

gen.from = function(path: PathLike) {
    const options = config()
    return gen(process.cwd() + path, options)
}

function combine() {
    const options = config()
    writeFileSync(process.cwd() + options.outfile, gen.from(options.src + options.main))
}

export { gen, combine }