#!/usr/bin/env node
'use strict'

import axios from 'axios';
import https from 'https';
import newman from 'newman';
import program from 'commander';
import PostmanApiProvider from './api.js';
import FileSystemProvider from './fs.js';
import handler from './handler.js'

async function run(environment, collections, options) {
    if (options.healthCheckUrl != null) {
        console.log('Health check url provided: ' + options.healthCheckUrl);

        const agent = new https.Agent({ rejectUnauthorized: false });
        const startedAt = new Date();
        while (true) {
            try {
                if (new Date() - startedAt > 300000) {
                    console.log('Health check failed for 5 minutes. Aborting tests.');
                    process.exit(1);
                }

                const resp = await axios.head(options.healthCheckUrl, {
                    timeout: 5000,
                    maxRedirects: 0,
                    httpsAgent: agent,
                    validateStatus: (status) => status == 200,
                });
                console.log(`Health check succeeded with response code ${resp.status}. Proceeding to test.`)
                break;
            } catch (error) {
                console.log(`Health check failed with message "${error.message}". Waiting...`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }

    console.log("Running collections: " + collections.map(c => c.info.name).join(', '));
    collections.forEach(collection => 
        newman.run({
            collection,
            environment,
            insecure: true,
            ignoreRedirects: true,
            reporters: options.quiet ? [] : ['progress'],
        }, handler)
    );
}

async function main() {
    try {
        program
            .option('-e, --environment <name>', 'Environment to run through collections', 'local')
            .option('-c, --collections <names>', 'List of collections to run (comma-separated)', v => v.split(','), [])
            .option('-q, --quiet', 'Show less logs')
            .option('--health-check-url <url>', 'Check server status before running collections')
        
        program
            .command('api <workspace> [key]')
            .description('Provide collections and environment data via Postman API.\nKey can be supplied via both command line argument or `PM_API_KEY` environment variable.')
            .action(async (workspace, key) => {
                if (key == null) {
                    key = process.env.PM_API_KEY;
                }

                const api = await new PostmanApiProvider(key, workspace);

                const environment = await api.fetchEnvironment(program.environment);
                const collections = await api.fetchCollections(program.collections);

                await run(environment, collections, program);
            });
        
        program
            .command('dir <path>')
            .description('Provide collections and environment data from local directory.')
            .action(async (path) => {
                const fs = new FileSystemProvider(path);
                
                const environment = await fs.readEnvironment(program.environment);
                const collections = await fs.readCollections(program.collections);

                await run(environment, collections, program);
            });

        await program.parseAsync();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

main();
