'use strict'

import fs from 'fs/promises';
import glob from 'glob-promise';

export default class {
    constructor(path) {
        this.path = path;
    }

    async _read(path) {
        return JSON.parse(await fs.readFile(path));
    }

    async readEnvironment(name) {
        return await this._read(`${this.path}/${name}.postman_environment.json`);
    }

    async readCollections(names) {
        let files = [];
        if (names.length > 0) {
            files = names.map(name => `${this.path}/${name}.postman_collection.json`);
        } else {
            files = await glob(`${this.path}/*.postman_collection.json`);
        }
        return await Promise.all(files.map(p => this._read(p)));
    }
}
