#!/usr/bin/env node
"use strict";

import path from 'node:path';
import minimist from 'minimist';
import * as fs from "node:fs";
import getStdin from "get-stdin"
import util from "node:util";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//to access the parameters through the command line passed by user 
//ways for passing the parameters ./cmd.js --hello=world or shortcut way ./cmd.js -hello world (shortcut instead of using -- use -) or ./cmd.js -c9 similar to ./cmd.js -c 9
//so for parsing it properly like into key value pair we can use minimist library like it converts ./cmd.js -c9 or ./cmd.js --c=9 into {_:[],c:9}
//so while parsing if minimist is not able to parse then it will add it in {_:[]} like ./cmd.js - foobar into {_:['_':'foobar']}
// var args=require("minimist")(process.argv.slice(2))


//in require we can also pass the second parmater which tells minimist how to guess things like whenever it sees a word called help consider it as a boolean there is no need for user to specify the boolean eg ./cmd.js - help gives {_:[],help:false}(it gives false as we have not sent value for help) or ./cmd.js --help=foo also gives {_:[],help:true}
var args=minimist(process.argv.slice(2),{
    boolean:["help","in"],
    string:["file"]
})
console.log(args);

//getting the inputs from stdin and stdout is one way getting the inputs through env variables is other way
//so if we nned to set a env variable only for a specfic command bassis just prefix with it e.g HELLO=WORLD ./cmd.js so it will set key with hello and value world
// if(process.env.HELLO){
//     console.log(process.env.HELLO);
// }

//path.resolve is better than __dirname as __dirname gives the full path(/home/sairahul3/cmdLineDemo) like consider it as a static but path.reslove is like if we write ./cmd.js --check ../../hello.txt it gives /home/hello.txt
var BASE_PATH=path.resolve(process.env.BASE_PATH || __dirname);

if(args.help){
    printHelp();
}else if(args.file){
    // var contents=fs.readFileSync(filepath);
    // process.stdout.write(contents); console.log does not works it will print stream so instead this approach works properly
    //or
    // var contents=fs.readFileSync(filepath,{encoding:"utf8"});
    // console.log(contents);
    fs.readFile(path.join(BASE_PATH,args.file),(err,data)=>{
        if(err){
            error(err);
        }else{
            processFile(data.toString());
        }
    })
    // console.log(filepath);
}else if(args.in || args._.includes("in")){
    (async()=>{
        const val=await getStdin();
        processFile(val);
    })();
}else{
    error("Incorrect usage .",true)
}

function processFile(contents){
    contents=contents.toUpperCase();
    process.stdout.write(contents);
}

function printHelp(){
    console.log("ex1 usage ");
    console.log("./ex1.js --file={filename}");
    console.log("./ex1.js --help          print this help");
    console.log("./ex1.js --file={filename}        process this file");
    console.log("--in, -                       process the stdin");
}

function error(msg,includeHelp=true){
    console.log(msg);
    if(includeHelp){
        printHelp();
    }
}
// console.log("Hello");

