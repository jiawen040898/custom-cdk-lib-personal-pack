"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSnsConstruct = exports.CustomSnsSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
const aws_cloudwatch_actions_1 = require("aws-cdk-lib/aws-cloudwatch-actions");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_kms_1 = require("aws-cdk-lib/aws-kms");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
dotenv.config();
const utils = new utils_1.PulsifiUtils();
/**
 * CustomSnsSchema
 *
 * Schema for a customised SNS \
 * removalPolicy with default RemovalPolicy.RETAIN
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param snsName
 * @param fifo
 * @param removalPolicy {@link RemovalPolicy}
 * @param enforceSSL (optional) - default: false
 */
exports.CustomSnsSchema = resource_tag_1.CustomResourceTagSchema.extend({
    snsName: zod_1.z.string().min(1).max(251),
    fifo: zod_1.z.boolean().default(false),
    removalPolicy: zod_1.z.optional(zod_1.z.nativeEnum(aws_cdk_lib_1.RemovalPolicy)),
    enforceSSL: zod_1.z.boolean().default(false).optional(),
}).omit({ resourceName: true });
class CustomSnsConstruct extends constructs_1.Construct {
    /**
     * CustomSnsConstruct
     *
     * Generates SNS, related cloudwatch log groups and alarm \
     * contentBasedDeduplication will be automatically enabled for fifo type SNS
     *
     * @public topic {@link Topic}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomSnsProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const region = process.env.CDK_DEPLOY_REGION ?? process.env.CDK_DEFAULT_REGION;
        const accountId = process.env.CDK_DEPLOY_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomSnsSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        const topicName = props.fifo ? `${props.snsName}.fifo` : props.snsName;
        const successFeedbackRole = aws_iam_1.Role.fromRoleName(this, "SuccessFeedbackRole", "SNSSuccessFeedback");
        const failureFeedbackRole = aws_iam_1.Role.fromRoleName(this, "FailureFeedbackRole", "SNSFailureFeedback");
        const kmsKey = aws_kms_1.Key.fromLookup(this, "PulsifiKms", {
            aliasName: "alias/PulsifiSnsSqsKMS",
        });
        let snsConfig = {
            topicName,
            displayName: topicName,
            signatureVersion: "2",
            enforceSSL: props.enforceSSL,
            masterKey: kmsKey,
            loggingConfigs: [
                {
                    protocol: aws_sns_1.LoggingProtocol.SQS,
                    failureFeedbackRole,
                    successFeedbackRole,
                    successFeedbackSampleRate: 0,
                },
            ],
        };
        if (props.fifo) {
            const snsFifoConfig = {
                ...snsConfig,
                fifo: true,
                contentBasedDeduplication: true,
            };
            snsConfig = snsFifoConfig;
        }
        this.topic = new aws_sns_1.Topic(this, "Topic", snsConfig);
        aws_cdk_lib_1.Tags.of(this.topic).add("Name", topicName);
        aws_cdk_lib_1.Tags.of(this.topic).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this.topic).add("Environment", props.awsEnvironment);
        let customLogRetention = aws_logs_1.RetentionDays.ONE_MONTH;
        if (process.env.NODE_ENV === utils_1.AwsEnvironment.PRODUCTION) {
            customLogRetention = aws_logs_1.RetentionDays.THREE_MONTHS;
        }
        const successLogGroupName = `sns/${region}/${accountId}/${topicName}`;
        const successLogGroup = new aws_logs_1.LogGroup(this, "SuccessLogGroup", {
            logGroupName: successLogGroupName,
            retention: customLogRetention,
            removalPolicy: props.removalPolicy ?? aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        aws_cdk_lib_1.Tags.of(successLogGroup).add("Name", successLogGroupName);
        aws_cdk_lib_1.Tags.of(successLogGroup).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(successLogGroup).add("Environment", props.awsEnvironment);
        const failureLogGroupName = `${successLogGroupName}/Failure`;
        const failureLogGroup = new aws_logs_1.LogGroup(this, "FailureLogGroup", {
            logGroupName: failureLogGroupName,
            retention: customLogRetention,
            removalPolicy: props.removalPolicy ?? aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        aws_cdk_lib_1.Tags.of(failureLogGroup).add("Name", failureLogGroupName);
        aws_cdk_lib_1.Tags.of(failureLogGroup).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(failureLogGroup).add("Environment", props.awsEnvironment);
        const metricFilter = new aws_logs_1.MetricFilter(this, "FailureFilter", {
            logGroup: failureLogGroup,
            filterName: "FailureMetric",
            filterPattern: aws_logs_1.FilterPattern.literal('{ $.status = "FAILURE" }'),
            metricNamespace: "LogMetric",
            metricName: `${props.snsName}-failure-Metric`,
            metricValue: "1",
            unit: aws_cloudwatch_1.Unit.NONE,
        });
        /** create an error alarm */
        let alarmName = `${props.snsName}-error-alarm`;
        if (props.fifo) {
            alarmName = `${props.snsName}-fifo-error-alarm`;
        }
        const errorAlarm = new aws_cloudwatch_1.Alarm(this, "errorAlarm", {
            alarmName,
            metric: metricFilter.metric(),
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
        const cwLogsAlarmTopic = aws_sns_1.Topic.fromTopicArn(this, "healthTopic", `arn:aws:sns:${region}:${accountId}:pulsifi-cw-logs-alarm-topic`);
        errorAlarm.addAlarmAction(new aws_cloudwatch_actions_1.SnsAction(cwLogsAlarmTopic));
    }
}
exports.CustomSnsConstruct = CustomSnsConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3Nucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBa0Q7QUFDbEQsK0RBS29DO0FBQ3BDLCtFQUErRDtBQUMvRCxpREFBMkM7QUFDM0MsaURBQTBDO0FBQzFDLG1EQUs4QjtBQUM5QixpREFBOEU7QUFDOUUsMkNBQXVDO0FBQ3ZDLGlDQUFpQztBQUNqQyw2QkFBd0I7QUFDeEIsaURBQXlEO0FBQ3pELG1DQUF1RDtBQUV2RCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7QUFFakM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ1UsUUFBQSxlQUFlLEdBQUcsc0NBQXVCLENBQUMsTUFBTSxDQUFDO0lBQzdELE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkMsSUFBSSxFQUFFLE9BQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ2hDLGFBQWEsRUFBRSxPQUFDLENBQUMsUUFBUSxDQUFDLE9BQUMsQ0FBQyxVQUFVLENBQUMsMkJBQWEsQ0FBQyxDQUFDO0lBQ3RELFVBQVUsRUFBRSxPQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtDQUNqRCxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFnQmhDLE1BQWEsa0JBQW1CLFNBQVEsc0JBQVM7SUFHaEQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXFCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxNQUFNLEdBQ1gsT0FB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QUFDLFlBQVksQ0FDMUMsSUFBSSxFQUNKLGFBQWEsRUFDYixlQUFlLE1BQU0sSUFBSSxTQUFTLDhCQUE4QixDQUNoRSxDQUFDO1FBQ0YsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLGtDQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDRDtBQTFJRCxnREEwSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBUYWdzIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQge1xuXHRBbGFybSxcblx0Q29tcGFyaXNvbk9wZXJhdG9yLFxuXHRUcmVhdE1pc3NpbmdEYXRhLFxuXHRVbml0LFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2hcIjtcbmltcG9ydCB7IFNuc0FjdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2xvdWR3YXRjaC1hY3Rpb25zXCI7XG5pbXBvcnQgeyBSb2xlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcbmltcG9ydCB7IEtleSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mta21zXCI7XG5pbXBvcnQge1xuXHRGaWx0ZXJQYXR0ZXJuLFxuXHRMb2dHcm91cCxcblx0TWV0cmljRmlsdGVyLFxuXHRSZXRlbnRpb25EYXlzLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxvZ3NcIjtcbmltcG9ydCB7IExvZ2dpbmdQcm90b2NvbCwgVG9waWMsIHR5cGUgVG9waWNQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc25zXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYSB9IGZyb20gXCIuL3Jlc291cmNlLXRhZ1wiO1xuaW1wb3J0IHsgQXdzRW52aXJvbm1lbnQsIFB1bHNpZmlVdGlscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3QgdXRpbHMgPSBuZXcgUHVsc2lmaVV0aWxzKCk7XG5cbi8qKlxuICogQ3VzdG9tU25zU2NoZW1hXG4gKlxuICogU2NoZW1hIGZvciBhIGN1c3RvbWlzZWQgU05TIFxcXG4gKiByZW1vdmFsUG9saWN5IHdpdGggZGVmYXVsdCBSZW1vdmFsUG9saWN5LlJFVEFJTlxuICpcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKiBAcGFyYW0gc25zTmFtZVxuICogQHBhcmFtIGZpZm9cbiAqIEBwYXJhbSByZW1vdmFsUG9saWN5IHtAbGluayBSZW1vdmFsUG9saWN5fVxuICogQHBhcmFtIGVuZm9yY2VTU0wgKG9wdGlvbmFsKSAtIGRlZmF1bHQ6IGZhbHNlXG4gKi9cbmV4cG9ydCBjb25zdCBDdXN0b21TbnNTY2hlbWEgPSBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYS5leHRlbmQoe1xuXHRzbnNOYW1lOiB6LnN0cmluZygpLm1pbigxKS5tYXgoMjUxKSxcblx0Zmlmbzogei5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG5cdHJlbW92YWxQb2xpY3k6IHoub3B0aW9uYWwoei5uYXRpdmVFbnVtKFJlbW92YWxQb2xpY3kpKSxcblx0ZW5mb3JjZVNTTDogei5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSkub3B0aW9uYWwoKSxcbn0pLm9taXQoeyByZXNvdXJjZU5hbWU6IHRydWUgfSk7XG5cbi8qKlxuICogQ3VzdG9tU25zUHJvcHNcbiAqXG4gKiByZW1vdmFsUG9saWN5IHdpdGggZGVmYXVsdCBSZW1vdmFsUG9saWN5LlJFVEFJTlxuICpcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKiBAcGFyYW0gc25zTmFtZSBzdWZmaXggJy5maWZvJyB3aWxsIGF1dG9tYXRpY2FsbHkgYmVcbiAqIEBwYXJhbSBmaWZvXG4gKiBAcGFyYW0gcmVtb3ZhbFBvbGljeSB7QGxpbmsgUmVtb3ZhbFBvbGljeX1cbiAqIEBwYXJhbSBlbmZvcmNlU1NMIChvcHRpb25hbCkgLSBkZWZhdWx0OiBmYWxzZVxuICovXG5leHBvcnQgdHlwZSBDdXN0b21TbnNQcm9wcyA9IHouaW5mZXI8dHlwZW9mIEN1c3RvbVNuc1NjaGVtYT47XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21TbnNDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXHRwdWJsaWMgcmVhZG9ubHkgdG9waWM6IFRvcGljO1xuXG5cdC8qKlxuXHQgKiBDdXN0b21TbnNDb25zdHJ1Y3Rcblx0ICpcblx0ICogR2VuZXJhdGVzIFNOUywgcmVsYXRlZCBjbG91ZHdhdGNoIGxvZyBncm91cHMgYW5kIGFsYXJtIFxcXG5cdCAqIGNvbnRlbnRCYXNlZERlZHVwbGljYXRpb24gd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGVuYWJsZWQgZm9yIGZpZm8gdHlwZSBTTlNcblx0ICpcblx0ICogQHB1YmxpYyB0b3BpYyB7QGxpbmsgVG9waWN9XG5cdCAqXG5cdCAqIEBwYXJhbSBzY29wZSB7QGxpbmsgQ29uc3RydWN0fVxuXHQgKiBAcGFyYW0gaWRcblx0ICogQHBhcmFtIHByb3BzIHtAbGluayBDdXN0b21TbnNQcm9wc31cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21TbnNQcm9wcykge1xuXHRcdHN1cGVyKHNjb3BlLCBpZCk7XG5cblx0XHRjb25zdCByZWdpb24gPVxuXHRcdFx0cHJvY2Vzcy5lbnYuQ0RLX0RFUExPWV9SRUdJT04gPz8gcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OO1xuXHRcdGNvbnN0IGFjY291bnRJZCA9XG5cdFx0XHRwcm9jZXNzLmVudi5DREtfREVQTE9ZX0FDQ09VTlQgPz8gcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVDtcblxuXHRcdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gdXRpbHMudmVyaWZ5Q3VzdG9tU2NoZW1hPFxuXHRcdFx0dHlwZW9mIEN1c3RvbVNuc1NjaGVtYSxcblx0XHRcdEN1c3RvbVNuc1Byb3BzXG5cdFx0PihDdXN0b21TbnNTY2hlbWEsIHByb3BzKTtcblx0XHRpZiAoIXpvZENoZWNrT3V0cHV0LnN1Y2Nlc3MpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeSh6b2RDaGVja091dHB1dC5tZXNzYWdlKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdG9waWNOYW1lID0gcHJvcHMuZmlmbyA/IGAke3Byb3BzLnNuc05hbWV9LmZpZm9gIDogcHJvcHMuc25zTmFtZTtcblx0XHRjb25zdCBzdWNjZXNzRmVlZGJhY2tSb2xlID0gUm9sZS5mcm9tUm9sZU5hbWUoXG5cdFx0XHR0aGlzLFxuXHRcdFx0XCJTdWNjZXNzRmVlZGJhY2tSb2xlXCIsXG5cdFx0XHRcIlNOU1N1Y2Nlc3NGZWVkYmFja1wiLFxuXHRcdCk7XG5cdFx0Y29uc3QgZmFpbHVyZUZlZWRiYWNrUm9sZSA9IFJvbGUuZnJvbVJvbGVOYW1lKFxuXHRcdFx0dGhpcyxcblx0XHRcdFwiRmFpbHVyZUZlZWRiYWNrUm9sZVwiLFxuXHRcdFx0XCJTTlNGYWlsdXJlRmVlZGJhY2tcIixcblx0XHQpO1xuXHRcdGNvbnN0IGttc0tleSA9IEtleS5mcm9tTG9va3VwKHRoaXMsIFwiUHVsc2lmaUttc1wiLCB7XG5cdFx0XHRhbGlhc05hbWU6IFwiYWxpYXMvUHVsc2lmaVNuc1Nxc0tNU1wiLFxuXHRcdH0pO1xuXG5cdFx0bGV0IHNuc0NvbmZpZzogVG9waWNQcm9wcyA9IHtcblx0XHRcdHRvcGljTmFtZSxcblx0XHRcdGRpc3BsYXlOYW1lOiB0b3BpY05hbWUsXG5cdFx0XHRzaWduYXR1cmVWZXJzaW9uOiBcIjJcIixcblx0XHRcdGVuZm9yY2VTU0w6IHByb3BzLmVuZm9yY2VTU0wsXG5cdFx0XHRtYXN0ZXJLZXk6IGttc0tleSxcblx0XHRcdGxvZ2dpbmdDb25maWdzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwcm90b2NvbDogTG9nZ2luZ1Byb3RvY29sLlNRUyxcblx0XHRcdFx0XHRmYWlsdXJlRmVlZGJhY2tSb2xlLFxuXHRcdFx0XHRcdHN1Y2Nlc3NGZWVkYmFja1JvbGUsXG5cdFx0XHRcdFx0c3VjY2Vzc0ZlZWRiYWNrU2FtcGxlUmF0ZTogMCxcblx0XHRcdFx0fSxcblx0XHRcdF0sXG5cdFx0fTtcblx0XHRpZiAocHJvcHMuZmlmbykge1xuXHRcdFx0Y29uc3Qgc25zRmlmb0NvbmZpZzogVG9waWNQcm9wcyA9IHtcblx0XHRcdFx0Li4uc25zQ29uZmlnLFxuXHRcdFx0XHRmaWZvOiB0cnVlLFxuXHRcdFx0XHRjb250ZW50QmFzZWREZWR1cGxpY2F0aW9uOiB0cnVlLFxuXHRcdFx0fTtcblx0XHRcdHNuc0NvbmZpZyA9IHNuc0ZpZm9Db25maWc7XG5cdFx0fVxuXG5cdFx0dGhpcy50b3BpYyA9IG5ldyBUb3BpYyh0aGlzLCBcIlRvcGljXCIsIHNuc0NvbmZpZyk7XG5cblx0XHRUYWdzLm9mKHRoaXMudG9waWMpLmFkZChcIk5hbWVcIiwgdG9waWNOYW1lKTtcblx0XHRUYWdzLm9mKHRoaXMudG9waWMpLmFkZChcIk93bmVyXCIsIHByb3BzLnJlc291cmNlT3duZXIpO1xuXHRcdFRhZ3Mub2YodGhpcy50b3BpYykuYWRkKFwiRW52aXJvbm1lbnRcIiwgcHJvcHMuYXdzRW52aXJvbm1lbnQpO1xuXG5cdFx0bGV0IGN1c3RvbUxvZ1JldGVudGlvbiA9IFJldGVudGlvbkRheXMuT05FX01PTlRIO1xuXHRcdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gQXdzRW52aXJvbm1lbnQuUFJPRFVDVElPTikge1xuXHRcdFx0Y3VzdG9tTG9nUmV0ZW50aW9uID0gUmV0ZW50aW9uRGF5cy5USFJFRV9NT05USFM7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3VjY2Vzc0xvZ0dyb3VwTmFtZSA9IGBzbnMvJHtyZWdpb259LyR7YWNjb3VudElkfS8ke3RvcGljTmFtZX1gO1xuXHRcdGNvbnN0IHN1Y2Nlc3NMb2dHcm91cCA9IG5ldyBMb2dHcm91cCh0aGlzLCBcIlN1Y2Nlc3NMb2dHcm91cFwiLCB7XG5cdFx0XHRsb2dHcm91cE5hbWU6IHN1Y2Nlc3NMb2dHcm91cE5hbWUsXG5cdFx0XHRyZXRlbnRpb246IGN1c3RvbUxvZ1JldGVudGlvbixcblx0XHRcdHJlbW92YWxQb2xpY3k6IHByb3BzLnJlbW92YWxQb2xpY3kgPz8gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuXHRcdH0pO1xuXHRcdFRhZ3Mub2Yoc3VjY2Vzc0xvZ0dyb3VwKS5hZGQoXCJOYW1lXCIsIHN1Y2Nlc3NMb2dHcm91cE5hbWUpO1xuXHRcdFRhZ3Mub2Yoc3VjY2Vzc0xvZ0dyb3VwKS5hZGQoXCJPd25lclwiLCBwcm9wcy5yZXNvdXJjZU93bmVyKTtcblx0XHRUYWdzLm9mKHN1Y2Nlc3NMb2dHcm91cCkuYWRkKFwiRW52aXJvbm1lbnRcIiwgcHJvcHMuYXdzRW52aXJvbm1lbnQpO1xuXG5cdFx0Y29uc3QgZmFpbHVyZUxvZ0dyb3VwTmFtZSA9IGAke3N1Y2Nlc3NMb2dHcm91cE5hbWV9L0ZhaWx1cmVgO1xuXHRcdGNvbnN0IGZhaWx1cmVMb2dHcm91cCA9IG5ldyBMb2dHcm91cCh0aGlzLCBcIkZhaWx1cmVMb2dHcm91cFwiLCB7XG5cdFx0XHRsb2dHcm91cE5hbWU6IGZhaWx1cmVMb2dHcm91cE5hbWUsXG5cdFx0XHRyZXRlbnRpb246IGN1c3RvbUxvZ1JldGVudGlvbixcblx0XHRcdHJlbW92YWxQb2xpY3k6IHByb3BzLnJlbW92YWxQb2xpY3kgPz8gUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuXHRcdH0pO1xuXHRcdFRhZ3Mub2YoZmFpbHVyZUxvZ0dyb3VwKS5hZGQoXCJOYW1lXCIsIGZhaWx1cmVMb2dHcm91cE5hbWUpO1xuXHRcdFRhZ3Mub2YoZmFpbHVyZUxvZ0dyb3VwKS5hZGQoXCJPd25lclwiLCBwcm9wcy5yZXNvdXJjZU93bmVyKTtcblx0XHRUYWdzLm9mKGZhaWx1cmVMb2dHcm91cCkuYWRkKFwiRW52aXJvbm1lbnRcIiwgcHJvcHMuYXdzRW52aXJvbm1lbnQpO1xuXG5cdFx0Y29uc3QgbWV0cmljRmlsdGVyID0gbmV3IE1ldHJpY0ZpbHRlcih0aGlzLCBcIkZhaWx1cmVGaWx0ZXJcIiwge1xuXHRcdFx0bG9nR3JvdXA6IGZhaWx1cmVMb2dHcm91cCxcblx0XHRcdGZpbHRlck5hbWU6IFwiRmFpbHVyZU1ldHJpY1wiLFxuXHRcdFx0ZmlsdGVyUGF0dGVybjogRmlsdGVyUGF0dGVybi5saXRlcmFsKCd7ICQuc3RhdHVzID0gXCJGQUlMVVJFXCIgfScpLFxuXHRcdFx0bWV0cmljTmFtZXNwYWNlOiBcIkxvZ01ldHJpY1wiLFxuXHRcdFx0bWV0cmljTmFtZTogYCR7cHJvcHMuc25zTmFtZX0tZmFpbHVyZS1NZXRyaWNgLFxuXHRcdFx0bWV0cmljVmFsdWU6IFwiMVwiLFxuXHRcdFx0dW5pdDogVW5pdC5OT05FLFxuXHRcdH0pO1xuXG5cdFx0LyoqIGNyZWF0ZSBhbiBlcnJvciBhbGFybSAqL1xuXHRcdGxldCBhbGFybU5hbWUgPSBgJHtwcm9wcy5zbnNOYW1lfS1lcnJvci1hbGFybWA7XG5cdFx0aWYgKHByb3BzLmZpZm8pIHtcblx0XHRcdGFsYXJtTmFtZSA9IGAke3Byb3BzLnNuc05hbWV9LWZpZm8tZXJyb3ItYWxhcm1gO1xuXHRcdH1cblx0XHRjb25zdCBlcnJvckFsYXJtID0gbmV3IEFsYXJtKHRoaXMsIFwiZXJyb3JBbGFybVwiLCB7XG5cdFx0XHRhbGFybU5hbWUsXG5cdFx0XHRtZXRyaWM6IG1ldHJpY0ZpbHRlci5tZXRyaWMoKSxcblx0XHRcdHRocmVzaG9sZDogMCxcblx0XHRcdGNvbXBhcmlzb25PcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yLkdSRUFURVJfVEhBTl9USFJFU0hPTEQsXG5cdFx0XHRldmFsdWF0aW9uUGVyaW9kczogMSxcblx0XHRcdGRhdGFwb2ludHNUb0FsYXJtOiAxLFxuXHRcdFx0dHJlYXRNaXNzaW5nRGF0YTogVHJlYXRNaXNzaW5nRGF0YS5OT1RfQlJFQUNISU5HLFxuXHRcdH0pO1xuXG5cdFx0VGFncy5vZihlcnJvckFsYXJtKS5hZGQoXCJOYW1lXCIsIGFsYXJtTmFtZSk7XG5cdFx0VGFncy5vZihlcnJvckFsYXJtKS5hZGQoXCJPd25lclwiLCBwcm9wcy5yZXNvdXJjZU93bmVyKTtcblx0XHRUYWdzLm9mKGVycm9yQWxhcm0pLmFkZChcIkVudmlyb25tZW50XCIsIHByb3BzLmF3c0Vudmlyb25tZW50KTtcblxuXHRcdC8qKiBhZGRzIGFsYXJtIGFjdGlvbiB0byBoZWFsdGhUb3BpYyAqL1xuXHRcdGNvbnN0IGN3TG9nc0FsYXJtVG9waWMgPSBUb3BpYy5mcm9tVG9waWNBcm4oXG5cdFx0XHR0aGlzLFxuXHRcdFx0XCJoZWFsdGhUb3BpY1wiLFxuXHRcdFx0YGFybjphd3M6c25zOiR7cmVnaW9ufToke2FjY291bnRJZH06cHVsc2lmaS1jdy1sb2dzLWFsYXJtLXRvcGljYCxcblx0XHQpO1xuXHRcdGVycm9yQWxhcm0uYWRkQWxhcm1BY3Rpb24obmV3IFNuc0FjdGlvbihjd0xvZ3NBbGFybVRvcGljKSk7XG5cdH1cbn1cbiJdfQ==