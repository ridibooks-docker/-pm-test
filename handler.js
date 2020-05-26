'use strict'

import program from 'commander';
import colorize from 'json-colorizer'

// collection 1개 실행이 끝날 때 호출
export default function(error, summary) {
    let reported = false;
    const report = (error, execution = null) => {
        let data = { collection: summary.collection.name };
        if (execution == null) {
            data.error = error;
        } else {
            const { item, request, response } = execution;
            data.name = item.name;
            data.error = error;
            if (request != null) {
                data.request = {
                    method: request.method,
                    url: `${request.url.protocol}://${request.url.host.join('.')}/${request.url.path.join('/')}`,
                    query: request.url.query.map(p => `${p.key}=${p.value}`),
                    headers: request.headers.map(p => `${p.key}: ${p.value}`),
                    body: request.body,
                };
            }
            if (response != null) {
                data.response = {
                    status: { text: response.status, code: response.code },
                    headers: response.headers.map(p => `${p.key}: ${p.value}`),
                    body: response.stream.toString(),
                };
            }
        }
        let json = JSON.stringify(data, null, 2);
        if (!program.quiet) {
            json = colorize(json);
        }
        console.log(`\n${json}\n`);
        reported = true;
    }

    if (error != null) {
        report(error);
        return;
    }

    if (summary.error != null) {
        report(summary.error);
        return;
    }

    for (const execution of summary.run.executions) {
        if (execution.requestError != null) {
            report(execution.requestError, execution);
            continue;
        }

        if (execution.assertions != null) {
            for (const assertion of execution.assertions) {
                if (assertion.error != null) {
                    report(assertion.error, execution);
                }
            }
        }
    }

    const stats = summary.run.stats;
    if (reported) {
        console.log(`collection: "${summary.collection.name}" failed (${stats.requests.failed} requests, ${stats.assertions.failed} assertions).`);
        process.exit(1);
    } else {
        console.log(`collection: "${summary.collection.name}" passed (${stats.requests.total} requests, ${stats.assertions.total} assertions).`);
    }
}