import fs from 'node:fs';
import path from 'node:path';
import {pages} from './src/pages.mjs';
fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('public','dist',{recursive:true});
for(const [route,html] of Object.entries(pages)){
 const target=path.join('dist',route==='/'?'index.html':route.slice(1)+'.html');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
}
fs.writeFileSync('dist/404.html','<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>Not found</title><body><h1>Page not found</h1><a href="/">Back to The GTM Guy</a></body></html>');
console.log(`Built ${Object.keys(pages).length} pages for Vercel.`);
