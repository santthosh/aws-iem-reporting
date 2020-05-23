const AWS = require("aws-sdk");
const colors = require('colors');

function getHostedZones(tag) {
    return new Promise(function(resolve,reject) {
        let route53 = new AWS.Route53();
        let params = {
        };
        route53.listHostedZones(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedZones = data.HostedZones.filter(({Name}) => Name.match(regex));

                let zones = [];
                matchedZones.forEach(zone => {
                    zones.push(zone.Id);
                });

                console.log(('\nRoute53 Hosted Zones :').magenta);
                console.log(JSON.stringify(zones,null,2));
                resolve(data);
            }
        });
    });
}

function scan(tag) {
    let promises = [];

    promises.push(getHostedZones(tag));

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed Route53 service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
