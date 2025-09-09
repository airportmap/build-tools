const { log } = require( './logger' );
const { mkdir, writeFile } = require( 'node:fs/promises' );
const { dirname } = require( 'node:path' );
const fetch = require( 'node-fetch' ).default;

async function fetchFileList ( repo, branch ) {

    const apiUrl = `https://api.github.com/repos/${ repo }/git/trees/${ branch }?recursive=1`;
    const response = await fetch( apiUrl );

    if ( ! response.ok ) throw new Error (
        `Failed to fetch file list: ${ response.statusText }`
    );

    const data = await response.json();

    return data.tree;

}

async function downloadFile ( repo, branch, filePath, targetPath ) {

    const url = `https://raw.githubusercontent.com/${ repo }/${ branch }/${ filePath }`;
    const response = await fetch( url );

    if ( ! response.ok ) throw new Error (
        `Failed to download ${ filePath }: ${ response.statusText }`
    );

    const content = await response.text();

    await mkdir( dirname( targetPath ), { recursive: true } );
    await writeFile( targetPath, content, 'utf8' );

    log( `   ... ${ filePath } → ${ targetPath }` );

}

module.exports = { fetchFileList, downloadFile };
