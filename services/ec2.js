const AWS = require("aws-sdk");
const colors = require('colors');

function getInstances(region,tag) {
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
        ec2.describeInstances(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } // an error occurred
            else {
                let instanceIds = [];
                data.Reservations.forEach(reservation => {
                    reservation.Instances.forEach(instance => {
                        instanceIds.push(instance.InstanceId);
                    });
                });
                console.log(('\nEC2 instances for ' + region + ':').magenta);
                console.log(JSON.stringify(instanceIds,null,2));
                resolve(data);
            }
        });
    });
}

function getELBs(region,tag) {
    return new Promise(function(resolve,reject) {
        let elb = new AWS.ELBv2({region: region});
        let params = {
        };
        elb.describeLoadBalancers(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                const regex = new RegExp('/'+ '*api-gw*' +'\\b', 'g');
                const matchedELBv2 = data.LoadBalancers.filter(({LoadBalancerName}) => LoadBalancerName.match(regex));

                let loadBalancers = [];
                matchedELBv2.forEach(loadBalancer => {
                    loadBalancers.push(loadBalancer.LoadBalancerName);
                });

                console.log(('\nELBv2s for ' + region + ':').magenta);
                console.log(JSON.stringify(loadBalancers,null,2));
                resolve(data);
            }
        });
    });
}

function getAutoscalingGroups(region,tag) {
    return new Promise(function(resolve,reject) {
        let elb = new AWS.AutoScaling({region: region});
        let params = {
        };
        elb.describeAutoScalingGroups(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                const regex = new RegExp('/'+ tag +'\\b', 'g');
                const matchedAGG = data.AutoScalingGroups.filter(({AutoScalingGroupName}) => AutoScalingGroupName.match(regex));

                let autoscalingGroups = [];
                matchedAGG.forEach(asg => {
                    autoscalingGroups.push(asg.AutoScalingGroupName);
                });

                console.log(('\nAutoscaling Groups for ' + region + ':').magenta);
                console.log(JSON.stringify(autoscalingGroups,null,2));
                resolve(data);
            }
        });
    });
}

function scan(regions,tag) {
    let promises = [];

    regions.forEach(region => {
        promises.push(getInstances(region,tag));

        promises.push(getELBs(region,tag));

        promises.push(getAutoscalingGroups(region,tag));
    });

    Promise.all(promises).then((data) => {
        console.log('_'.repeat(process.stdout.columns));
        console.log('Completed EC2 service scans'.green);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports.scan = scan;
