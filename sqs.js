"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSqsConstruct = exports.CustomSqsSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
const aws_cloudwatch_actions_1 = require("aws-cdk-lib/aws-cloudwatch-actions");
const aws_kms_1 = require("aws-cdk-lib/aws-kms");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const aws_ssm_1 = require("aws-cdk-lib/aws-ssm");
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
dotenv.config();
const sqsTopic = "service-health-topic";
const utils = new utils_1.PulsifiUtils();
/**
 * CustomSqsSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param sqsName
 * @param fifo
 * @param isDlq default: false
 * @param visibilityTimeoutInSeconds (optional)
 * @param deliveryDelayInSeconds (optional)
 * @param enforceSSL (optional) - default: false, this will be used for both SQS
 * @param highTroughput (optional) - default: false, requires fifo to be enabled
 * @param enablePulsifiKms (optional) - default: true, true = (SSE-KMS), false = (SSE-SQS)
 */
exports.CustomSqsSchema = resource_tag_1.CustomResourceTagSchema.extend({
    sqsName: zod_1.z.string().min(1).max(64),
    fifo: zod_1.z.boolean().default(false).optional(),
    isDlq: zod_1.z.boolean().default(false).optional(),
    visibilityTimeoutInSeconds: zod_1.z.number().default(0).optional(),
    deliveryDelayInSeconds: zod_1.z.number().default(0).optional(),
    enforceSSL: zod_1.z.boolean().default(false).optional(),
    highTroughput: zod_1.z.boolean().default(false).optional(),
    enablePulsifiKms: zod_1.z.boolean().default(true).optional(),
}).omit({ resourceName: true });
const generateSqsName = (props) => {
    let queueName = props.fifo
        ? `${props.sqsName}-queue.fifo`
        : `${props.sqsName}-queue`;
    if (props.isDlq) {
        const dlqQueueName = props.fifo
            ? `${props.sqsName}-dead-queue.fifo`
            : `${props.sqsName}-dead-queue`;
        queueName = dlqQueueName;
    }
    return queueName;
};
class CustomSqsConstruct extends constructs_1.Construct {
    /**
     * CustomSqsConstruct
     *
     * @public sqs {@link Queue}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomSqsProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomSqsSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        const region = process.env.CDK_DEPLOY_REGION ?? process.env.CDK_DEFAULT_REGION;
        const accountId = process.env.CDK_DEPLOY_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
        const kmsKey = aws_kms_1.Key.fromLookup(this, "PulsifiKms", {
            aliasName: "alias/PulsifiSnsSqsKMS",
        });
        const retentionPeriodInSeconds = aws_ssm_1.StringParameter.valueForStringParameter(this, "/configs/sqs/MessageRetentionPeriod");
        const maxMessageSize = aws_ssm_1.StringParameter.valueForStringParameter(this, "/configs/sqs/MaximumMessageSize");
        const visibilityTimeoutInSeconds = aws_ssm_1.StringParameter.valueForStringParameter(this, "/configs/sqs/VisibilityTimeout");
        const deliveryDelayInSeconds = aws_ssm_1.StringParameter.valueForStringParameter(this, "/configs/sqs/DelaySeconds");
        const queueName = generateSqsName(props);
        let sqsConfig = {
            queueName,
            dataKeyReuse: aws_cdk_lib_1.Duration.hours(24),
            enforceSSL: props.enforceSSL,
            receiveMessageWaitTime: aws_cdk_lib_1.Duration.seconds(props.fifo ? 0 : 10),
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            visibilityTimeout: aws_cdk_lib_1.Duration.seconds(props.visibilityTimeoutInSeconds &&
                props.visibilityTimeoutInSeconds > 0
                ? props.visibilityTimeoutInSeconds
                : aws_cdk_lib_1.Token.asNumber(visibilityTimeoutInSeconds)),
            retentionPeriod: aws_cdk_lib_1.Duration.seconds(aws_cdk_lib_1.Token.asNumber(retentionPeriodInSeconds)),
            deliveryDelay: aws_cdk_lib_1.Duration.seconds(props.deliveryDelayInSeconds && props.deliveryDelayInSeconds > 0
                ? props.deliveryDelayInSeconds
                : aws_cdk_lib_1.Token.asNumber(deliveryDelayInSeconds)),
            maxMessageSizeBytes: aws_cdk_lib_1.Token.asNumber(maxMessageSize),
            deadLetterQueue: props.deadLetterQueue,
        };
        if (props.enablePulsifiKms) {
            const pulsifiKmsSqsConfig = {
                ...sqsConfig,
                encryption: aws_sqs_1.QueueEncryption.KMS_MANAGED,
                encryptionMasterKey: kmsKey,
            };
            sqsConfig = pulsifiKmsSqsConfig;
        }
        if (props.fifo) {
            const sqsFifoConfig = {
                ...sqsConfig,
                fifo: true,
                contentBasedDeduplication: true,
            };
            sqsConfig = sqsFifoConfig;
        }
        if (props.fifo && props.highTroughput) {
            const sqsFifoHighThroughputConfig = {
                ...sqsConfig,
                fifo: true,
                contentBasedDeduplication: false,
                fifoThroughputLimit: aws_sqs_1.FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
                deduplicationScope: aws_sqs_1.DeduplicationScope.MESSAGE_GROUP,
            };
            sqsConfig = sqsFifoHighThroughputConfig;
        }
        this.sqs = new aws_sqs_1.Queue(this, "MainQueue", sqsConfig);
        aws_cdk_lib_1.Tags.of(this.sqs).add("Name", queueName);
        aws_cdk_lib_1.Tags.of(this.sqs).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this.sqs).add("Environment", props.awsEnvironment);
        if (props.isDlq) {
            /** create an error alarm */
            const alarmName = props.fifo
                ? `${props.sqsName}-fifo-dead-queue-alarm`
                : `${props.sqsName}-dead-queue-alarm`;
            const errorAlarm = new aws_cloudwatch_1.Alarm(this, "errorAlarm", {
                alarmName,
                metric: this.sqs.metricApproximateNumberOfMessagesVisible({
                    period: aws_cdk_lib_1.Duration.minutes(1),
                }),
                threshold: 0,
                comparisonOperator: aws_cloudwatch_1.ComparisonOperator.GREATER_THAN_THRESHOLD,
                evaluationPeriods: 1,
                datapointsToAlarm: 1,
                treatMissingData: aws_cloudwatch_1.TreatMissingData.NOT_BREACHING,
            });
            aws_cdk_lib_1.Tags.of(errorAlarm).add("Name", alarmName);
            aws_cdk_lib_1.Tags.of(errorAlarm).add("Owner", props.resourceOwner);
            aws_cdk_lib_1.Tags.of(errorAlarm).add("Environment", props.awsEnvironment);
            /** adds alarm action to healthTopic */
            const serviceHealthTopic = aws_sns_1.Topic.fromTopicArn(this, "healthTopic", `arn:aws:sns:${region}:${accountId}:${sqsTopic}`);
            errorAlarm.addAlarmAction(new aws_cloudwatch_actions_1.SnsAction(serviceHealthTopic));
            errorAlarm.addOkAction(new aws_cloudwatch_actions_1.SnsAction(serviceHealthTopic));
        }
    }
}
exports.CustomSqsConstruct = CustomSqsConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3Nxcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBbUU7QUFDbkUsK0RBSW9DO0FBQ3BDLCtFQUErRDtBQUMvRCxpREFBMEM7QUFDMUMsaURBQTRDO0FBQzVDLGlEQU82QjtBQUM3QixpREFBc0Q7QUFDdEQsMkNBQXVDO0FBQ3ZDLGlDQUFpQztBQUNqQyw2QkFBd0I7QUFDeEIsaURBQXlEO0FBQ3pELG1DQUF1QztBQUV2QyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsTUFBTSxRQUFRLEdBQUcsc0JBQXNCLENBQUM7QUFFeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7QUFFakM7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNVLFFBQUEsZUFBZSxHQUFHLHNDQUF1QixDQUFDLE1BQU0sQ0FBQztJQUM3RCxPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2xDLElBQUksRUFBRSxPQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtJQUMzQyxLQUFLLEVBQUUsT0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDNUMsMEJBQTBCLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDNUQsc0JBQXNCLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7SUFDeEQsVUFBVSxFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFO0lBQ2pE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QyxDQUFDLENBQUM7aUJBQzNCLENBQUM7Z0JBQ0YsU0FBUyxFQUFFLENBQUM7Z0JBQ1osa0JBQWtCLEVBQUUsbUNBQWtCLENBQUMsc0JBQXNCO2dCQUM3RCxpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixpQkFBaUIsRUFBRSxDQUFDO2dCQUNwQixnQkFBZ0IsRUFBRSxpQ0FBZ0IsQ0FBQyxhQUFhO2FBQ2hELENBQUMsQ0FBQztZQUVILGtCQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDM0Msa0JBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDdEQsa0JBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFN0QsdUNBQXVDO1lBQ3ZDLE1BQU0sa0JBQWtCLEdBQUcsZUFBSyxDQUFDLFlBQVksQ0FDNUMsSUFBSSxFQUNKLGFBQWEsRUFDYixlQUFlLE1BQU0sSUFBSSxTQUFTLElBQUksUUFBUSxFQUFFLENBQ2hELENBQUM7WUFDRixVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksa0NBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDN0QsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGtDQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7SUFDRixDQUFDO0NBQ0Q7QUE1SUQsZ0RBNElDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24sIFJlbW92YWxQb2xpY3ksIFRhZ3MsIFRva2VuIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQge1xuXHRBbGFybSxcblx0Q29tcGFyaXNvbk9wZXJhdG9yLFxuXHRUcmVhdE1pc3NpbmdEYXRhLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2hcIjtcbmltcG9ydCB7IFNuc0FjdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaC1hY3Rpb25zXCI7XG5pbXBvcnQgeyBLZXkgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWttc1wiO1xuaW1wb3J0IHsgVG9waWMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNuc1wiO1xuaW1wb3J0IHtcblx0dHlwZSBEZWFkTGV0dGVyUXVldWUsXG5cdERlZHVwbGljYXRpb25TY29wZSxcblx0Rmlmb1Rocm91Z2hwdXRMaW1pdCxcblx0UXVldWUsXG5cdFF1ZXVlRW5jcnlwdGlvbixcblx0dHlwZSBRdWV1ZVByb3BzLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNxc1wiO1xuaW1wb3J0IHsgU3RyaW5nUGFyYW1ldGVyIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1zc21cIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSBcImRvdGVudlwiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlVGFnU2NoZW1hIH0gZnJvbSBcIi4vcmVzb3VyY2UtdGFnXCI7XG5pbXBvcnQgeyBQdWxzaWZpVXRpbHMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5cbmNvbnN0IHNxc1RvcGljID0gXCJzZXJ2aWNlLWhlYWx0aC10b3BpY1wiO1xuXG5jb25zdCB1dGlscyA9IG5ldyBQdWxzaWZpVXRpbHMoKTtcblxuLyoqXG4gKiBDdXN0b21TcXNTY2hlbWFcbiAqXG4gKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQge0BsaW5rIEF3c0Vudmlyb25tZW50fVxuICogQHBhcmFtIHJlc291cmNlT3duZXIge0BsaW5rIFB1bHNpZmlUZWFtfVxuICogQHBhcmFtIHNxc05hbWVcbiAqIEBwYXJhbSBmaWZvXG4gKiBAcGFyYW0gaXNEbHEgZGVmYXVsdDogZmFsc2VcbiAqIEBwYXJhbSB2aXNpYmlsaXR5VGltZW91dEluU2Vjb25kcyAob3B0aW9uYWwpXG4gKiBAcGFyYW0gZGVsaXZlcnlEZWxheUluU2Vjb25kcyAob3B0aW9uYWwpXG4gKiBAcGFyYW0gZW5mb3JjZVNTTCAob3B0aW9uYWwpIC0gZGVmYXVsdDogZmFsc2UsIHRoaXMgd2lsbCBiZSB1c2VkIGZvciBib3RoIFNRU1xuICogQHBhcmFtIGhpZ2hUcm91Z2hwdXQgKG9wdGlvbmFsKSAtIGRlZmF1bHQ6IGZhbHNlLCByZXF1aXJlcyBmaWZvIHRvIGJlIGVuYWJsZWRcbiAqIEBwYXJhbSBlbmFibGVQdWxzaWZpS21zIChvcHRpb25hbCkgLSBkZWZhdWx0OiB0cnVlLCB0cnVlID0gKFNTRS1LTVMpLCBmYWxzZSA9IChTU0UtU1FTKVxuICovXG5leHBvcnQgY29uc3QgQ3VzdG9tU3FzU2NoZW1hID0gQ3VzdG9tUmVzb3VyY2VUYWdTY2hlbWEuZXh0ZW5kKHtcblx0c3FzTmFtZTogei5zdHJpbmcoKS5taW4oMSkubWF4KDY0KSxcblx0Zmlmbzogei5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSkub3B0aW9uYWwoKSxcblx0aXNEbHE6IHouYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLm9wdGlvbmFsKCksXG5cdHZpc2liaWxpdHlUaW1lb3V0SW5TZWNvbmRzOiB6Lm51bWJlcigpLmRlZmF1bHQoMCkub3B0aW9uYWwoKSxcblx0ZGVsaXZlcnlEZWxheUluU2Vjb25kczogei5udW1iZXIoKS5kZWZhdWx0KDApLm9wdGlvbmFsKCksXG5cdGVuZm9yY2VTU0w6IHouYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLm9wdGlvbmFsKCksXG5cdGhpZ2hUcm91Z2hwdXQ6IHouYm9vbGVhbigpLmRlZmF1bHQoZmFsc2UpLm9wdGlvbmFsKCksXG5cdGVuYWJsZVB1bHNpZmlLbXM6IHouYm9vbGVhbigpLmRlZmF1bHQodHJ1ZSkub3B0aW9uYWwoKSxcbn0pLm9taXQoeyByZXNvdXJjZU5hbWU6IHRydWUgfSk7XG5cbi8qKlxuICogQ3VzdG9tU3FzUHJvcHNcbiAqXG4gKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQge0BsaW5rIEF3c0Vudmlyb25tZW50fVxuICogQHBhcmFtIHJlc291cmNlT3duZXIge0BsaW5rIFB1bHNpZmlUZWFtfVxuICogQHBhcmFtIHNxc05hbWVcbiAqIEBwYXJhbSBmaWZvXG4gKiBAcGFyYW0gaXNEbHEgZGVmYXVsdDogZmFsc2VcbiAqIEBwYXJhbSB2aXNpYmlsaXR5VGltZW91dEluU2Vjb25kcyAob3B0aW9uYWwpXG4gKiBAcGFyYW0gZGVsaXZlcnlEZWxheUluU2Vjb25kcyAob3B0aW9uYWwpXG4gKiBAcGFyYW0gZW5mb3JjZVNTTCAob3B0aW9uYWwpIC0gZGVmYXVsdDogZmFsc2UsIHRoaXMgd2lsbCBiZSB1c2VkIGZvciBib3RoIFNRU1xuICogQG9wdGlvbmFsIGhpZ2hUcm91Z2hwdXQgKG9wdGlvbmFsKSAtIGRlZmF1bHQ6IGZhbHNlLCByZXF1aXJlcyBmaWZvIHRvIGJlIGVuYWJsZWRcbiAqIEBvcHRpb25hbCBlbmFibGVQdWxzaWZpS21zIChvcHRpb25hbCkgLSBkZWZhdWx0OiB0cnVlLCB0cnVlID0gKFNTRS1LTVMpLCBmYWxzZSA9IChTU0UtU1FTKVxuICogQHBhcmFtIGRlYWRMZXR0ZXJRdWV1ZSAob3B0aW9uYWwpIHtAbGluayBEZWFkTGV0dGVyUXVldWV9XG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbVNxc1Byb3BzID0gei5pbmZlcjx0eXBlb2YgQ3VzdG9tU3FzU2NoZW1hPiAmIHtcblx0ZGVhZExldHRlclF1ZXVlPzogRGVhZExldHRlclF1ZXVlO1xufTtcblxuY29uc3QgZ2VuZXJhdGVTcXNOYW1lID0gKHByb3BzOiBDdXN0b21TcXNQcm9wcykgPT4ge1xuXHRsZXQgcXVldWVOYW1lID0gcHJvcHMuZmlmb1xuXHRcdD8gYCR7cHJvcHMuc3FzTmFtZX0tcXVldWUuZmlmb2Bcblx0XHQ6IGAke3Byb3BzLnNxc05hbWV9LXF1ZXVlYDtcblxuXHRpZiAocHJvcHMuaXNEbHEpIHtcblx0XHRjb25zdCBkbHFRdWV1ZU5hbWUgPSBwcm9wcy5maWZvXG5cdFx0XHQ/IGAke3Byb3BzLnNxc05hbWV9LWRlYWQtcXVldWUuZmlmb2Bcblx0XHRcdDogYCR7cHJvcHMuc3FzTmFtZX0tZGVhZC1xdWV1ZWA7XG5cdFx0cXVldWVOYW1lID0gZGxxUXVldWVOYW1lO1xuXHR9XG5cdHJldHVybiBxdWV1ZU5hbWU7XG59O1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tU3FzQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcblx0cHVibGljIHJlYWRvbmx5IHNxczogUXVldWU7XG5cblx0LyoqXG5cdCAqIEN1c3RvbVNxc0NvbnN0cnVjdFxuXHQgKlxuXHQgKiBAcHVibGljIHNxcyB7QGxpbmsgUXVldWV9XG5cdCAqXG5cdCAqIEBwYXJhbSBzY29wZSB7QGxpbmsgQ29uc3RydWN0fVxuXHQgKiBAcGFyYW0gaWRcblx0ICogQHBhcmFtIHByb3BzIHtAbGluayBDdXN0b21TcXNQcm9wc31cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21TcXNQcm9wcykge1xuXHRcdHN1cGVyKHNjb3BlLCBpZCk7XG5cblx0XHRjb25zdCB6b2RDaGVja091dHB1dCA9IHV0aWxzLnZlcmlmeUN1c3RvbVNjaGVtYTxcblx0XHRcdHR5cGVvZiBDdXN0b21TcXNTY2hlbWEsXG5cdFx0XHRDdXN0b21TcXNQcm9wc1xuXHRcdD4oQ3VzdG9tU3FzU2NoZW1hLCBwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoem9kQ2hlY2tPdXRwdXQubWVzc2FnZSkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZ2lvbiA9XG5cdFx0XHRwcm9jZXNzLmVudi5DREtfREVQTE9ZX1JFR0lPTiA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT047XG5cdFx0Y29uc3QgYWNjb3VudElkID1cblx0XHRcdHByb2Nlc3MuZW52LkNES19ERVBMT1lfQUNDT1VOVCA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5UO1xuXG5cdFx0Y29uc3Qga21zS2V5ID0gS2V5LmZyb21Mb29rdXAodGhpcywgXCJQdWxzaWZpS21zXCIsIHtcblx0XHRcdGFsaWFzTmFtZTogXCJhbGlhcy9QdWxzaWZpU25zU3FzS01TXCIsXG5cdFx0fSk7XG5cdFx0Y29uc3QgcmV0ZW50aW9uUGVyaW9kSW5TZWNvbmRzID1cblx0XHRcdFN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcblx0XHRcdFx0dGhpcyxcblx0XHRcdFx0XCIvY29uZmlncy9zcXMvTWVzc2FnZVJldGVudGlvblBlcmlvZFwiLFxuXHRcdFx0KTtcblx0XHRjb25zdCBtYXhNZXNzYWdlU2l6ZSA9IFN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcblx0XHRcdHRoaXMsXG5cdFx0XHRcIi9jb25maWdzL3Nxcy9NYXhpbXVtTWVzc2FnZVNpemVcIixcblx0XHQpO1xuXHRcdGNvbnN0IHZpc2liaWxpdHlUaW1lb3V0SW5TZWNvbmRzID1cblx0XHRcdFN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcblx0XHRcdFx0dGhpcyxcblx0XHRcdFx0XCIvY29uZmlncy9zcXMvVmlzaWJpbGl0eVRpbWVvdXRcIixcblx0XHRcdCk7XG5cdFx0Y29uc3QgZGVsaXZlcnlEZWxheUluU2Vjb25kcyA9IFN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcblx0XHRcdHRoaXMsXG5cdFx0XHRcIi9jb25maWdzL3Nxcy9EZWxheVNlY29uZHNcIixcblx0XHQpO1xuXG5cdFx0Y29uc3QgcXVldWVOYW1lID0gZ2VuZXJhdGVTcXNOYW1lKHByb3BzKTtcblxuXHRcdGxldCBzcXNDb25maWc6IFF1ZXVlUHJvcHMgPSB7XG5cdFx0XHRxdWV1ZU5hbWUsXG5cdFx0XHRkYXRhS2V5UmV1c2U6IER1cmF0aW9uLmhvdXJzKDI0KSxcblx0XHRcdGVuZm9yY2VTU0w6IHByb3BzLmVuZm9yY2VTU0wsXG5cdFx0XHRyZWNlaXZlTWVzc2FnZVdhaXRUaW1lOiBEdXJhdGlvbi5zZWNvbmRzKHByb3BzLmZpZm8gPyAwIDogMTApLFxuXHRcdFx0cmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuXHRcdFx0dmlzaWJpbGl0eVRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoXG5cdFx0XHRcdHByb3BzLnZpc2liaWxpdHlUaW1lb3V0SW5TZWNvbmRzICYmXG5cdFx0XHRcdFx0cHJvcHMudmlzaWJpbGl0eVRpbWVvdXRJblNlY29uZHMgPiAwXG5cdFx0XHRcdFx0PyBwcm9wcy52aXNpYmlsaXR5VGltZW91dEluU2Vjb25kc1xuXHRcdFx0XHRcdDogVG9rZW4uYXNOdW1iZXIodmlzaWJpbGl0eVRpbWVvdXRJblNlY29uZHMpLFxuXHRcdFx0KSxcblx0XHRcdHJldGVudGlvblBlcmlvZDogRHVyYXRpb24uc2Vjb25kcyhcblx0XHRcdFx0VG9rZW4uYXNOdW1iZXIocmV0ZW50aW9uUGVyaW9kSW5TZWNvbmRzKSxcblx0XHRcdCksXG5cdFx0XHRkZWxpdmVyeURlbGF5OiBEdXJhdGlvbi5zZWNvbmRzKFxuXHRcdFx0XHRwcm9wcy5kZWxpdmVyeURlbGF5SW5TZWNvbmRzICYmIHByb3BzLmRlbGl2ZXJ5RGVsYXlJblNlY29uZHMgPiAwXG5cdFx0XHRcdFx0PyBwcm9wcy5kZWxpdmVyeURlbGF5SW5TZWNvbmRzXG5cdFx0XHRcdFx0OiBUb2tlbi5hc051bWJlcihkZWxpdmVyeURlbGF5SW5TZWNvbmRzKSxcblx0XHRcdCksXG5cdFx0XHRtYXhNZXNzYWdlU2l6ZUJ5dGVzOiBUb2tlbi5hc051bWJlcihtYXhNZXNzYWdlU2l6ZSksXG5cdFx0XHRkZWFkTGV0dGVyUXVldWU6IHByb3BzLmRlYWRMZXR0ZXJRdWV1ZSxcblx0XHR9O1xuXHRcdGlmIChwcm9wcy5lbmFibGVQdWxzaWZpS21zKSB7XG5cdFx0XHRjb25zdCBwdWxzaWZpS21zU3FzQ29uZmlnOiBRdWV1ZVByb3BzID0ge1xuXHRcdFx0XHQuLi5zcXNDb25maWcsXG5cdFx0XHRcdGVuY3J5cHRpb246IFF1ZXVlRW5jcnlwdGlvbi5LTVNfTUFOQUdFRCxcblx0XHRcdFx0ZW5jcnlwdGlvbk1hc3RlcktleToga21zS2V5LFxuXHRcdFx0fTtcblx0XHRcdHNxc0NvbmZpZyA9IHB1bHNpZmlLbXNTcXNDb25maWc7XG5cdFx0fVxuXHRcdGlmIChwcm9wcy5maWZvKSB7XG5cdFx0XHRjb25zdCBzcXNGaWZvQ29uZmlnOiBRdWV1ZVByb3BzID0ge1xuXHRcdFx0XHQuLi5zcXNDb25maWcsXG5cdFx0XHRcdGZpZm86IHRydWUsXG5cdFx0XHRcdGNvbnRlbnRCYXNlZERlZHVwbGljYXRpb246IHRydWUsXG5cdFx0XHR9O1xuXHRcdFx0c3FzQ29uZmlnID0gc3FzRmlmb0NvbmZpZztcblx0XHR9XG5cdFx0aWYgKHByb3BzLmZpZm8gJiYgcHJvcHMuaGlnaFRyb3VnaHB1dCkge1xuXHRcdFx0Y29uc3Qgc3FzRmlmb0hpZ2hUaHJvdWdocHV0Q29uZmlnOiBRdWV1ZVByb3BzID0ge1xuXHRcdFx0XHQuLi5zcXNDb25maWcsXG5cdFx0XHRcdGZpZm86IHRydWUsXG5cdFx0XHRcdGNvbnRlbnRCYXNlZERlZHVwbGljYXRpb246IGZhbHNlLFxuXHRcdFx0XHRmaWZvVGhyb3VnaHB1dExpbWl0OiBGaWZvVGhyb3VnaHB1dExpbWl0LlBFUl9NRVNTQUdFX0dST1VQX0lELFxuXHRcdFx0XHRkZWR1cGxpY2F0aW9uU2NvcGU6IERlZHVwbGljYXRpb25TY29wZS5NRVNTQUdFX0dST1VQLFxuXHRcdFx0fTtcblx0XHRcdHNxc0NvbmZpZyA9IHNxc0ZpZm9IaWdoVGhyb3VnaHB1dENvbmZpZztcblx0XHR9XG5cblx0XHR0aGlzLnNxcyA9IG5ldyBRdWV1ZSh0aGlzLCBcIk1haW5RdWV1ZVwiLCBzcXNDb25maWcpO1xuXG5cdFx0VGFncy5vZih0aGlzLnNxcykuYWRkKFwiTmFtZVwiLCBxdWV1ZU5hbWUpO1xuXHRcdFRhZ3Mub2YodGhpcy5zcXMpLmFkZChcIk93bmVyXCIsIHByb3BzLnJlc291cmNlT3duZXIpO1xuXHRcdFRhZ3Mub2YodGhpcy5zcXMpLmFkZChcIkVudmlyb25tZW50XCIsIHByb3BzLmF3c0Vudmlyb25tZW50KTtcblxuXHRcdGlmIChwcm9wcy5pc0RscSkge1xuXHRcdFx0LyoqIGNyZWF0ZSBhbiBlcnJvciBhbGFybSAqL1xuXHRcdFx0Y29uc3QgYWxhcm1OYW1lID0gcHJvcHMuZmlmb1xuXHRcdFx0XHQ/IGAke3Byb3BzLnNxc05hbWV9LWZpZm8tZGVhZC1xdWV1ZS1hbGFybWBcblx0XHRcdFx0OiBgJHtwcm9wcy5zcXNOYW1lfS1kZWFkLXF1ZXVlLWFsYXJtYDtcblxuXHRcdFx0Y29uc3QgZXJyb3JBbGFybSA9IG5ldyBBbGFybSh0aGlzLCBcImVycm9yQWxhcm1cIiwge1xuXHRcdFx0XHRhbGFybU5hbWUsXG5cdFx0XHRcdG1ldHJpYzogdGhpcy5zcXMubWV0cmljQXBwcm94aW1hdGVOdW1iZXJPZk1lc3NhZ2VzVmlzaWJsZSh7XG5cdFx0XHRcdFx0cGVyaW9kOiBEdXJhdGlvbi5taW51dGVzKDEpLFxuXHRcdFx0XHR9KSxcblx0XHRcdFx0dGhyZXNob2xkOiAwLFxuXHRcdFx0XHRjb21wYXJpc29uT3BlcmF0b3I6IENvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuXHRcdFx0XHRldmFsdWF0aW9uUGVyaW9kczogMSxcblx0XHRcdFx0ZGF0YXBvaW50c1RvQWxhcm06IDEsXG5cdFx0XHRcdHRyZWF0TWlzc2luZ0RhdGE6IFRyZWF0TWlzc2luZ0RhdGEuTk9UX0JSRUFDSElORyxcblx0XHRcdH0pO1xuXG5cdFx0XHRUYWdzLm9mKGVycm9yQWxhcm0pLmFkZChcIk5hbWVcIiwgYWxhcm1OYW1lKTtcblx0XHRcdFRhZ3Mub2YoZXJyb3JBbGFybSkuYWRkKFwiT3duZXJcIiwgcHJvcHMucmVzb3VyY2VPd25lcik7XG5cdFx0XHRUYWdzLm9mKGVycm9yQWxhcm0pLmFkZChcIkVudmlyb25tZW50XCIsIHByb3BzLmF3c0Vudmlyb25tZW50KTtcblxuXHRcdFx0LyoqIGFkZHMgYWxhcm0gYWN0aW9uIHRvIGhlYWx0aFRvcGljICovXG5cdFx0XHRjb25zdCBzZXJ2aWNlSGVhbHRoVG9waWMgPSBUb3BpYy5mcm9tVG9waWNBcm4oXG5cdFx0XHRcdHRoaXMsXG5cdFx0XHRcdFwiaGVhbHRoVG9waWNcIixcblx0XHRcdFx0YGFybjphd3M6c25zOiR7cmVnaW9ufToke2FjY291bnRJZH06JHtzcXNUb3BpY31gLFxuXHRcdFx0KTtcblx0XHRcdGVycm9yQWxhcm0uYWRkQWxhcm1BY3Rpb24obmV3IFNuc0FjdGlvbihzZXJ2aWNlSGVhbHRoVG9waWMpKTtcblx0XHRcdGVycm9yQWxhcm0uYWRkT2tBY3Rpb24obmV3IFNuc0FjdGlvbihzZXJ2aWNlSGVhbHRoVG9waWMpKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==