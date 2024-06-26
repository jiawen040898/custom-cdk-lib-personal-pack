"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLambdaErrorAlarmConstruct = exports.CustomLambdaErrorAlarmSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
const aws_cloudwatch_actions_1 = require("aws-cdk-lib/aws-cloudwatch-actions");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
dotenv.config();
const healthTopicName = "pulsifi-cw-logs-alarm-topic";
/**
 * CustomLambdaErrorAlarmSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 */
exports.CustomLambdaErrorAlarmSchema = resource_tag_1.CustomResourceTagSchema.omit({
    resourceName: true,
});
class CustomLambdaErrorAlarmConstruct extends constructs_1.Construct {
    /**
     * CustomLambdaErrorAlarmConstruct
     *
     * For AWS region, it will read from environment variable CDK_DEPLOY_REGION or CDK_DEFAULT_REGION.
     * For AWS account ID, it will read from environment variable CDK_DEPLOY_ACCOUNT or CDK_DEFAULT_ACCOUNT
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomLambdaErrorAlarmProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const utils = new utils_1.PulsifiUtils();
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomLambdaErrorAlarmSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        const region = process.env.CDK_DEPLOY_REGION ?? process.env.CDK_DEFAULT_REGION;
        const accountId = process.env.CDK_DEPLOY_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
        /** define a metric for lambda errors */
        const functionErrors = props.lambda.metricErrors({
            period: aws_cdk_lib_1.Duration.minutes(1),
        });
        const alarmName = `${props.lambda.functionName}-error-alarm`;
        /** create an error alarm */
        const errorAlarm = new aws_cloudwatch_1.Alarm(this, "errorAlarm", {
            alarmName,
            metric: functionErrors,
            threshold: 0,
            comparisonOperator: aws_cloudwatch_1.ComparisonOperator.GREATER_THAN_THRESHOLD,
            evaluationPeriods: 1,
            datapointsToAlarm: 1,
            treatMissingData: aws_cloudwatch_1.TreatMissingData.IGNORE,
        });
        aws_cdk_lib_1.Tags.of(this).add("Name", alarmName);
        aws_cdk_lib_1.Tags.of(this).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this).add("Environment", props.awsEnvironment);
        /** adds alarm action to healthTopic */
        const healthTopic = aws_sns_1.Topic.fromTopicArn(this, "healthTopic", `arn:aws:sns:${region}:${accountId}:${healthTopicName}`);
        errorAlarm.addAlarmAction(new aws_cloudwatch_actions_1.SnsAction(healthTopic));
    }
}
exports.CustomLambdaErrorAlarmConstruct = CustomLambdaErrorAlarmConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWVycm9yLWFsYXJtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL2xhbWJkYS1lcnJvci1hbGFybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBNkM7QUFDN0MsK0RBS29DO0FBQ3BDLCtFQUErRDtBQUcvRCxpREFBNEM7QUFDNUMsMkNBQXVDO0FBQ3ZDLGlDQUFpQztBQUVqQyxpREFBeUQ7QUFDekQsbUNBQXVDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQixNQUFNLGVBQWUsR0FBRyw2QkFBNkIsQ0FBQztBQUV0RDs7Ozs7R0FLRztBQUNVLFFBQUEsNEJBQTRCLEdBQUcsc0NBQXVCLENBQUMsSUFBSSxDQUFDO0lBQ3hFLFlBQVksRUFBRSxJQUFJO0NBQ2xCLENBQUMsQ0FBQztBQWlCSCxNQUFhLCtCQUFnQyxTQUFRLHNCQUFTO0lBQzdEOzs7Ozs7Ozs7T0FTRztJQUNILFlBQ0MsS0FBZ0IsRUFDaEIsRUFBVSxFQUNWLEtBQWtDO1FBRWxDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7UUFFakMsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUc3QyxvQ0FBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO1FBQ2pFLE1BQU0sU0FBUyxHQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztRQUVuRSx3Q0FBd0M7UUFDeEMsTUFBTSxjQUFjLEdBQVcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDeEQsTUFBTSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxjQUFjLENBQUM7UUFFN0QsNEJBQTRCO1FBQzVCLE1BQU0sVUFBVSxHQUFHLElBQUksc0JBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hELFNBQVM7WUFDVCxNQUFNLEVBQUUsY0FBYztZQUN0QixTQUFTLEVBQUUsQ0FBQztZQUNaLGtCQUFrQixFQUFFLG1DQUFrQixDQUFDLHNCQUFzQjtZQUM3RCxpQkFBaUIsRUFBRSxDQUFDO1lBQ3BCLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsZ0JBQWdCLEVBQUUsaUNBQWdCLENBQUMsTUFBTTtTQUN6QyxDQUFDLENBQUM7UUFFSCxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLGtCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hELGtCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXZELHVDQUF1QztRQUN2QyxNQUFNLFdBQVcsR0FBRyxlQUFLLENBQUMsWUFBWSxDQUNyQyxJQUFJLEVBQ0osYUFBYSxFQUNiLGVBQWUsTUFBTSxJQUFJLFNBQVMsSUFBSSxlQUFlLEVBQUUsQ0FDdkQsQ0FBQztRQUNGLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxrQ0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNEO0FBL0RELDBFQStEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBUYWdzIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQge1xuXHRBbGFybSxcblx0Q29tcGFyaXNvbk9wZXJhdG9yLFxuXHR0eXBlIE1ldHJpYyxcblx0VHJlYXRNaXNzaW5nRGF0YSxcbn0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1jbG91ZHdhdGNoXCI7XG5pbXBvcnQgeyBTbnNBY3Rpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2gtYWN0aW9uc1wiO1xuaW1wb3J0IHR5cGUgeyBGdW5jdGlvbiBhcyBMYW1iZGFGdW5jdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgdHlwZSB7IE5vZGVqc0Z1bmN0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzXCI7XG5pbXBvcnQgeyBUb3BpYyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc25zXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB0eXBlIHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlVGFnU2NoZW1hIH0gZnJvbSBcIi4vcmVzb3VyY2UtdGFnXCI7XG5pbXBvcnQgeyBQdWxzaWZpVXRpbHMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5cbmNvbnN0IGhlYWx0aFRvcGljTmFtZSA9IFwicHVsc2lmaS1jdy1sb2dzLWFsYXJtLXRvcGljXCI7XG5cbi8qKlxuICogQ3VzdG9tTGFtYmRhRXJyb3JBbGFybVNjaGVtYVxuICpcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKi9cbmV4cG9ydCBjb25zdCBDdXN0b21MYW1iZGFFcnJvckFsYXJtU2NoZW1hID0gQ3VzdG9tUmVzb3VyY2VUYWdTY2hlbWEub21pdCh7XG5cdHJlc291cmNlTmFtZTogdHJ1ZSxcbn0pO1xuXG4vKipcbiAqIEN1c3RvbUVycm9yQWxhcm1Qcm9wc1xuICpcbiAqIEVycm9yIGFsYXJtIHRvIGJlIHVzZWQgYnkgdGhlIGZvbGxvd2luZyBsYW1iZGFcbiAqXG4gKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQge0BsaW5rIEF3c0Vudmlyb25tZW50fVxuICogQHBhcmFtIHJlc291cmNlT3duZXIge0BsaW5rIFB1bHNpZmlUZWFtfVxuICogQHBhcmFtIGxhbWJkYSB7QGxpbmsgTm9kZWpzRnVuY3Rpb259XG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbUxhbWJkYUVycm9yQWxhcm1Qcm9wcyA9IHouaW5mZXI8XG5cdHR5cGVvZiBDdXN0b21MYW1iZGFFcnJvckFsYXJtU2NoZW1hXG4+ICYge1xuXHRsYW1iZGE6IE5vZGVqc0Z1bmN0aW9uIHwgTGFtYmRhRnVuY3Rpb247XG59O1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tTGFtYmRhRXJyb3JBbGFybUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG5cdC8qKlxuXHQgKiBDdXN0b21MYW1iZGFFcnJvckFsYXJtQ29uc3RydWN0XG5cdCAqXG5cdCAqIEZvciBBV1MgcmVnaW9uLCBpdCB3aWxsIHJlYWQgZnJvbSBlbnZpcm9ubWVudCB2YXJpYWJsZSBDREtfREVQTE9ZX1JFR0lPTiBvciBDREtfREVGQVVMVF9SRUdJT04uXG5cdCAqIEZvciBBV1MgYWNjb3VudCBJRCwgaXQgd2lsbCByZWFkIGZyb20gZW52aXJvbm1lbnQgdmFyaWFibGUgQ0RLX0RFUExPWV9BQ0NPVU5UIG9yIENES19ERUZBVUxUX0FDQ09VTlRcblx0ICpcblx0ICogQHBhcmFtIHNjb3BlIHtAbGluayBDb25zdHJ1Y3R9XG5cdCAqIEBwYXJhbSBpZFxuXHQgKiBAcGFyYW0gcHJvcHMge0BsaW5rIEN1c3RvbUxhbWJkYUVycm9yQWxhcm1Qcm9wc31cblx0ICovXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHNjb3BlOiBDb25zdHJ1Y3QsXG5cdFx0aWQ6IHN0cmluZyxcblx0XHRwcm9wczogQ3VzdG9tTGFtYmRhRXJyb3JBbGFybVByb3BzLFxuXHQpIHtcblx0XHRzdXBlcihzY29wZSwgaWQpO1xuXG5cdFx0Y29uc3QgdXRpbHMgPSBuZXcgUHVsc2lmaVV0aWxzKCk7XG5cblx0XHRjb25zdCB6b2RDaGVja091dHB1dCA9IHV0aWxzLnZlcmlmeUN1c3RvbVNjaGVtYTxcblx0XHRcdHR5cGVvZiBDdXN0b21MYW1iZGFFcnJvckFsYXJtU2NoZW1hLFxuXHRcdFx0Q3VzdG9tTGFtYmRhRXJyb3JBbGFybVByb3BzXG5cdFx0PihDdXN0b21MYW1iZGFFcnJvckFsYXJtU2NoZW1hLCBwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoem9kQ2hlY2tPdXRwdXQubWVzc2FnZSkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZ2lvbiA9XG5cdFx0XHRwcm9jZXNzLmVudi5DREtfREVQTE9ZX1JFR0lPTiA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT047XG5cdFx0Y29uc3QgYWNjb3VudElkID1cblx0XHRcdHByb2Nlc3MuZW52LkNES19ERVBMT1lfQUNDT1VOVCA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5UO1xuXG5cdFx0LyoqIGRlZmluZSBhIG1ldHJpYyBmb3IgbGFtYmRhIGVycm9ycyAqL1xuXHRcdGNvbnN0IGZ1bmN0aW9uRXJyb3JzOiBNZXRyaWMgPSBwcm9wcy5sYW1iZGEubWV0cmljRXJyb3JzKHtcblx0XHRcdHBlcmlvZDogRHVyYXRpb24ubWludXRlcygxKSxcblx0XHR9KTtcblxuXHRcdGNvbnN0IGFsYXJtTmFtZSA9IGAke3Byb3BzLmxhbWJkYS5mdW5jdGlvbk5hbWV9LWVycm9yLWFsYXJtYDtcblxuXHRcdC8qKiBjcmVhdGUgYW4gZXJyb3IgYWxhcm0gKi9cblx0XHRjb25zdCBlcnJvckFsYXJtID0gbmV3IEFsYXJtKHRoaXMsIFwiZXJyb3JBbGFybVwiLCB7XG5cdFx0XHRhbGFybU5hbWUsXG5cdFx0XHRtZXRyaWM6IGZ1bmN0aW9uRXJyb3JzLFxuXHRcdFx0dGhyZXNob2xkOiAwLFxuXHRcdFx0Y29tcGFyaXNvbk9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IuR1JFQVRFUl9USEFOX1RIUkVTSE9MRCxcblx0XHRcdGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuXHRcdFx0ZGF0YXBvaW50c1RvQWxhcm06IDEsXG5cdFx0XHR0cmVhdE1pc3NpbmdEYXRhOiBUcmVhdE1pc3NpbmdEYXRhLklHTk9SRSxcblx0XHR9KTtcblxuXHRcdFRhZ3Mub2YodGhpcykuYWRkKFwiTmFtZVwiLCBhbGFybU5hbWUpO1xuXHRcdFRhZ3Mub2YodGhpcykuYWRkKFwiT3duZXJcIiwgcHJvcHMucmVzb3VyY2VPd25lcik7XG5cdFx0VGFncy5vZih0aGlzKS5hZGQoXCJFbnZpcm9ubWVudFwiLCBwcm9wcy5hd3NFbnZpcm9ubWVudCk7XG5cblx0XHQvKiogYWRkcyBhbGFybSBhY3Rpb24gdG8gaGVhbHRoVG9waWMgKi9cblx0XHRjb25zdCBoZWFsdGhUb3BpYyA9IFRvcGljLmZyb21Ub3BpY0Fybihcblx0XHRcdHRoaXMsXG5cdFx0XHRcImhlYWx0aFRvcGljXCIsXG5cdFx0XHRgYXJuOmF3czpzbnM6JHtyZWdpb259OiR7YWNjb3VudElkfToke2hlYWx0aFRvcGljTmFtZX1gLFxuXHRcdCk7XG5cdFx0ZXJyb3JBbGFybS5hZGRBbGFybUFjdGlvbihuZXcgU25zQWN0aW9uKGhlYWx0aFRvcGljKSk7XG5cdH1cbn1cbiJdfQ==