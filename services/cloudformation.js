const AWS = require("aws-sdk");
const colors = require('colors');

function getCloudformationStacks(region,tag) {
    return new Promise(function(resolve,reject) {
        let cloudformation = new AWS.CloudFormation({region: region});
        let params = {
        };
        cloudformation.listStacks(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedStacks = data.StackSummaries.filter(({StackName}) => StackName.match(regex));

                let stacks = [];
                matchedStacks.forEach(stack => {
                    stacks.push(stack.StackName);
                });

                console.log(('\nCloudformation stacks for ' + region + ':').magenta);
                console.log(JSON.stringify(stacks,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getCloudformationStacks(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed Cloudformation service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
