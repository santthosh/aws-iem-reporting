const AWS = require("aws-sdk");
const colors = require('colors');

function getCacheClusters(region,tag) {
    return new Promise(function(resolve,reject) {
        let elastiCache = new AWS.ElastiCache({region: region});
        let params = {
        };
        elastiCache.describeCacheClusters(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedClusters = data.CacheClusters.filter(({CacheSubnetGroupName}) => CacheSubnetGroupName.match(regex));

                let clusters = [];
                matchedClusters.forEach(cluster => {
                    clusters.push({id: cluster.CacheClusterId, CacheSubnetGroupName:cluster.CacheSubnetGroupName});
                });

                console.log(('\nElasticache clusters for ' + region + ':').magenta);
                console.log(JSON.stringify(clusters,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getCacheClusters(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed Elasticache service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
