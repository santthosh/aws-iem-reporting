const AWS = require("aws-sdk");

function getVPCs(region,tag) {
    return new Promise(function(resolve,reject) {
        let ec2 = new AWS.EC2({region: region});
        let params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        tag
                    ]
                }
            ]
        };
        ec2.describeVpcs(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                let vpcs = [];
                data.Vpcs.forEach(vpc => {
                    vpcs.push(vpc.VpcId)
                });
                console.log(('\nVPC ids for ' + region + ':').magenta);
                console.log(JSON.stringify(vpcs,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getVPCs(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed VPC scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
