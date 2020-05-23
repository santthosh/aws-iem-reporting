const AWS = require("aws-sdk");
const colors = require('colors');

function getTables(region,tag) {
    return new Promise(function(resolve,reject) {
        let dynamoDB = new AWS.DynamoDB({region: region});
        let params = {
        };
        dynamoDB.listTables(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                let tableNames = [];
                data.TableNames.forEach((tableName) => {
                    if(tableName.match(regex)) {
                        tableNames.push(tableName);
                    }
                });

                console.log(('\nDynamoDB tables for ' + region + ':').magenta);
                console.log(JSON.stringify(tableNames,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getTables(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed DynamoDB service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
