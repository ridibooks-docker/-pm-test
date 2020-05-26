'use strict'

import axios from 'axios';

export default class {
    constructor(apiKey, workspaceName) {
        this.key = apiKey;

        return (async () => {
            const resp = await this._fetch('/workspaces');
            const workspaceId = resp.workspaces.filter(w => w.name === workspaceName)[0].id;
            this.workspace = (await this._fetch('/workspaces/' + workspaceId)).workspace;

            return this;
        })();
    }

    async _fetch(path) {
        console.log(`Fetching '${path}' ...`);
        return (await axios.get(path, {
            baseURL: 'https://api.getpostman.com',
            headers: {'X-Api-Key': this.key},
        })).data;
    }

    async fetchEnvironment(name) {
        const uid = this.workspace.environments.filter(e => e.name === name)[0].uid;
        return (await this._fetch('/environments/' + uid)).environment;
    }

    async fetchCollections(names) {
        let collections = this.workspace.collections;
        if (names.length > 0) {
            collections = collections.filter(c => names.includes(c.name));
            if (collections.length !== names.length) {
                const missings = names.filter(x => !collections.map(c => c.name).includes(x));
                throw new Error(`Collection [${missings.join(', ')}] are not found in workspace.`);
            }
        }
        const responses = await axios.all(collections.map(c => this._fetch('/collections/' + c.uid)));
        return responses.map(r => r.collection);
    }
}