const AWS = require("aws-sdk");

function getBuckets(region,tag) {
    return new Promise(function(resolve,reject) {
        let s3 = new AWS.S3({region: region});
        let params = {
        };
        s3.listBuckets(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedBuckets = data.Buckets.filter(({Name}) => Name.match(regex));

                let buckets = [];
                matchedBuckets.forEach(bucket => {
                    buckets.push(bucket.Name);
                });

                console.log(('\nS3 instances for ' + region + ':').magenta);
                console.log(JSON.stringify(buckets,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getBuckets(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed S3 service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
