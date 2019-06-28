import tl = require('azure-pipelines-task-lib/task');
import fs = require('fs');

import {DoClient} from "./doClient";

async function run() {
    try {
        const pat: string = tl.getInput('pat', true);
        const clusterName: string = tl.getInput('clusterName', true);
        const configOutput: string = tl.getInput('configOutput', true).toLowerCase();
        const outputFilePath: string = tl.getPathInput('outputFilePath', false);
        const outputVariable: string = tl.getInput('outputVariable', false);

        console.log("configOutput: " + configOutput);
        console.log("outputFilePath: " + outputFilePath);
        console.log("outputVariable: " + outputVariable);

        if (!pat || !clusterName) {
            tl.setResult(tl.TaskResult.Failed, 'Invalid input');
            return;
        }

        //setup the adapter
        let doAdapter = new DoClient(pat, clusterName);

        var config = await doAdapter.getConfig();


        if(configOutput == 'file')
        {
            let path = outputFilePath
            fs.writeFileSync(outputFilePath + '/config.yaml', config,{
                encoding: 'utf8'
            });
        }
        else if (configOutput == ''){
            console.log("##vso[task.setvariable variable=kubeConfig;]" + config);
        }else{

        }
        
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();