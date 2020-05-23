const AWS = require("aws-sdk");
const colors = require('colors');

function getAuroraDBClusters(region,tag) {
    return new Promise(function(resolve,reject) {
        let rds = new AWS.RDS({region: region});
        let params = {
        };
        rds.describeDBClusters(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedDBClusters = data.DBClusters.filter(({DBClusterIdentifier}) => DBClusterIdentifier.match(regex));

                let DBClusters = [];
                matchedDBClusters.forEach(DBCluster => {
                    DBClusters.push(DBCluster.DBClusterIdentifier);
                });

                console.log(('\nAurora DB Cluster for ' + region + ':').magenta);
                console.log(JSON.stringify(DBClusters,null,2));
                resolve(data);
            }
        });
    });
}

function getDBInstances(region,tag) {
    return new Promise(function(resolve,reject) {
        let rds = new AWS.RDS({region: region});
        let params = {
        };
        rds.describeDBInstances(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedDBInstances = data.DBInstances.filter(({DBInstanceIdentifier}) => DBInstanceIdentifier.match(regex));

                let DBInstances = [];
                matchedDBInstances.forEach(DBInstance => {
                    DBInstances.push(DBInstance.DBInstanceIdentifier);
                });

                console.log(('\nRDS DB instances for ' + region + ':').magenta);
                console.log(JSON.stringify(DBInstances,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getDBInstances(region,tag));
        promises.push(getAuroraDBClusters(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed RDS service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
