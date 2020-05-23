let ec2 = require('./services/ec2');
let s3 = require('./services/s3');
let vpcs = require('./services/vpcs');
let dynamodb = require('./services/dynamodb');
let rds = require('./services/rds');
let cloudformation = require('./services/cloudformation');
let elasticache = require('./services/elasticache');
let route53 = require('./services/route53');

const AWS = require("aws-sdk");
const colors = require('colors');

const sts = new AWS.STS();
sts.getCallerIdentity({}, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log(JSON.stringify(data.Account).red);
        ec2.scan(['us-west-2','us-east-1'],'*prod*',);
        s3.scan(['us-west-2','us-east-1'],'*prod*',);
        vpcs.scan(['us-west-2','us-east-1'],'default',);
        dynamodb.scan(['us-west-2','us-east-1'], '*prod*');
        rds.scan(['us-west-2','us-east-1'], '*prod*');
        cloudformation.scan(['us-west-2','us-east-1'], '*prod*');
        elasticache.scan(['us-west-2','us-east-1'], '*prod*');
        route53.scan('*services*')
    }
});
