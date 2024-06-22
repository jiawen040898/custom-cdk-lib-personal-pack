"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLambdaLogGroupConstruct = exports.CustomLambdaLogGroupSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
dotenv.config();
const utils = new utils_1.PulsifiUtils();
/**
 * CustomLambdaLogGroupSchema
 *
 * Properties for a customised LogGroup
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param lambdaName
 * @param removalPolicy {@link RemovalPolicy}
 */
exports.CustomLambdaLogGroupSchema = resource_tag_1.CustomResourceTagSchema.extend({
    lambdaName: zod_1.z.string().min(1).max(500),
    removalPolicy: zod_1.z.optional(zod_1.z.nativeEnum(aws_cdk_lib_1.RemovalPolicy)),
}).omit({ resourceName: true });
class CustomLambdaLogGroupConstruct extends constructs_1.Construct {
    /**
     * CustomLambdaLogGroupConstruct \
     *
     * CAUTION!!! \
     * Please choose the Log Group removalPolicy wisely. \
     * RETAIN = log group will remain if cdk destroy, Change lambdaName for next deploy to avoid stackrollback \
     * DESTROY = log group will delete once cdk destroy
     *
     * @readonly logGroup
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomLambdaLogGroupProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomLambdaLogGroupSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        let customLogRetention = aws_logs_1.RetentionDays.ONE_MONTH;
        if (process.env.NODE_ENV === utils_1.AwsEnvironment.PRODUCTION) {
            customLogRetention = aws_logs_1.RetentionDays.THREE_MONTHS;
        }
        const logGroupName = `/aws/lambda/${props.lambdaName}`;
        this.logGroup = new aws_logs_1.LogGroup(this, "LogGroup", {
            logGroupName,
            retention: customLogRetention,
            removalPolicy: props.removalPolicy ?? aws_cdk_lib_1.RemovalPolicy.RETAIN,
        });
        aws_cdk_lib_1.Tags.of(this).add("Name", logGroupName);
        aws_cdk_lib_1.Tags.of(this).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this).add("Environment", props.awsEnvironment);
    }
}
exports.CustomLambdaLogGroupConstruct = CustomLambdaLogGroupConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWxvZy1ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9sYW1iZGEtbG9nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFrRDtBQUNsRCxtREFBK0Q7QUFDL0QsMkNBQXVDO0FBQ3ZDLGlDQUFpQztBQUNqQyw2QkFBd0I7QUFDeEIsaURBQXlEO0FBQ3pELG1DQUF1RDtBQUV2RCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7QUFFakM7Ozs7Ozs7OztHQVNHO0FBQ1UsUUFBQSwwQkFBMEIsR0FBRyxzQ0FBdUIsQ0FBQyxNQUFNLENBQUM7SUFDeEUsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUN0QyxhQUFhLEVBQUUsT0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFDLENBQUMsVUFBVSxDQUFDLDJCQUFhLENBQUMsQ0FBQztDQUN0RCxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFnQmhDLE1BQWEsNkJBQThCLFNBQVEsc0JBQVM7SUFHM0Q7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFlBQ0MsS0FBZ0IsRUFDaEIsRUFBVSxFQUNWLEtBQWdDO1FBRWhDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUc3QyxrQ0FBMEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsSUFBSSxrQkFBa0IsR0FBRyx3QkFBYSxDQUFDLFNBQVMsQ0FBQztRQUNqRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLHNCQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDeEQsa0JBQWtCLEdBQUcsd0JBQWEsQ0FBQyxZQUFZLENBQUM7UUFDakQsQ0FBQztRQUVELE1BQU0sWUFBWSxHQUFHLGVBQWUsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXZELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsWUFBWTtZQUNaLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLElBQUksMkJBQWEsQ0FBQyxNQUFNO1NBQzFELENBQUMsQ0FBQztRQUVILGtCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEMsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEQsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNEO0FBakRELHNFQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFRhZ3MgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IExvZ0dyb3VwLCBSZXRlbnRpb25EYXlzIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sb2dzXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYSB9IGZyb20gXCIuL3Jlc291cmNlLXRhZ1wiO1xuaW1wb3J0IHsgQXdzRW52aXJvbm1lbnQsIFB1bHNpZmlVdGlscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3QgdXRpbHMgPSBuZXcgUHVsc2lmaVV0aWxzKCk7XG5cbi8qKlxuICogQ3VzdG9tTGFtYmRhTG9nR3JvdXBTY2hlbWFcbiAqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIGN1c3RvbWlzZWQgTG9nR3JvdXBcbiAqXG4gKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQge0BsaW5rIEF3c0Vudmlyb25tZW50fVxuICogQHBhcmFtIHJlc291cmNlT3duZXIge0BsaW5rIFB1bHNpZmlUZWFtfVxuICogQHBhcmFtIGxhbWJkYU5hbWVcbiAqIEBwYXJhbSByZW1vdmFsUG9saWN5IHtAbGluayBSZW1vdmFsUG9saWN5fVxuICovXG5leHBvcnQgY29uc3QgQ3VzdG9tTGFtYmRhTG9nR3JvdXBTY2hlbWEgPSBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYS5leHRlbmQoe1xuXHRsYW1iZGFOYW1lOiB6LnN0cmluZygpLm1pbigxKS5tYXgoNTAwKSxcblx0cmVtb3ZhbFBvbGljeTogei5vcHRpb25hbCh6Lm5hdGl2ZUVudW0oUmVtb3ZhbFBvbGljeSkpLFxufSkub21pdCh7IHJlc291cmNlTmFtZTogdHJ1ZSB9KTtcblxuLyoqXG4gKiBDdXN0b21MYW1iZGFMb2dHcm91cFByb3BzXG4gKlxuICogUHJvcGVydGllcyBmb3IgYSBjdXN0b21pc2VkIExvZ0dyb3VwXG4gKlxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqIEBwYXJhbSBsYW1iZGFOYW1lXG4gKiBAcGFyYW0gcmVtb3ZhbFBvbGljeSB7QGxpbmsgUmVtb3ZhbFBvbGljeX1cbiAqL1xuZXhwb3J0IHR5cGUgQ3VzdG9tTGFtYmRhTG9nR3JvdXBQcm9wcyA9IHouaW5mZXI8XG5cdHR5cGVvZiBDdXN0b21MYW1iZGFMb2dHcm91cFNjaGVtYVxuPjtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbUxhbWJkYUxvZ0dyb3VwQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcblx0cHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwOiBMb2dHcm91cDtcblxuXHQvKipcblx0ICogQ3VzdG9tTGFtYmRhTG9nR3JvdXBDb25zdHJ1Y3QgXFxcblx0ICpcblx0ICogQ0FVVElPTiEhISBcXFxuXHQgKiBQbGVhc2UgY2hvb3NlIHRoZSBMb2cgR3JvdXAgcmVtb3ZhbFBvbGljeSB3aXNlbHkuIFxcXG5cdCAqIFJFVEFJTiA9IGxvZyBncm91cCB3aWxsIHJlbWFpbiBpZiBjZGsgZGVzdHJveSwgQ2hhbmdlIGxhbWJkYU5hbWUgZm9yIG5leHQgZGVwbG95IHRvIGF2b2lkIHN0YWNrcm9sbGJhY2sgXFxcblx0ICogREVTVFJPWSA9IGxvZyBncm91cCB3aWxsIGRlbGV0ZSBvbmNlIGNkayBkZXN0cm95XG5cdCAqXG5cdCAqIEByZWFkb25seSBsb2dHcm91cFxuXHQgKlxuXHQgKiBAcGFyYW0gc2NvcGUge0BsaW5rIENvbnN0cnVjdH1cblx0ICogQHBhcmFtIGlkXG5cdCAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tTGFtYmRhTG9nR3JvdXBQcm9wc31cblx0ICovXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHNjb3BlOiBDb25zdHJ1Y3QsXG5cdFx0aWQ6IHN0cmluZyxcblx0XHRwcm9wczogQ3VzdG9tTGFtYmRhTG9nR3JvdXBQcm9wcyxcblx0KSB7XG5cdFx0c3VwZXIoc2NvcGUsIGlkKTtcblxuXHRcdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gdXRpbHMudmVyaWZ5Q3VzdG9tU2NoZW1hPFxuXHRcdFx0dHlwZW9mIEN1c3RvbUxhbWJkYUxvZ0dyb3VwU2NoZW1hLFxuXHRcdFx0Q3VzdG9tTGFtYmRhTG9nR3JvdXBQcm9wc1xuXHRcdD4oQ3VzdG9tTGFtYmRhTG9nR3JvdXBTY2hlbWEsIHByb3BzKTtcblx0XHRpZiAoIXpvZENoZWNrT3V0cHV0LnN1Y2Nlc3MpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeSh6b2RDaGVja091dHB1dC5tZXNzYWdlKSk7XG5cdFx0fVxuXG5cdFx0bGV0IGN1c3RvbUxvZ1JldGVudGlvbiA9IFJldGVudGlvbkRheXMuT05FX01PTlRIO1xuXHRcdGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gQXdzRW52aXJvbm1lbnQuUFJPRFVDVElPTikge1xuXHRcdFx0Y3VzdG9tTG9nUmV0ZW50aW9uID0gUmV0ZW50aW9uRGF5cy5USFJFRV9NT05USFM7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbG9nR3JvdXBOYW1lID0gYC9hd3MvbGFtYmRhLyR7cHJvcHMubGFtYmRhTmFtZX1gO1xuXG5cdFx0dGhpcy5sb2dHcm91cCA9IG5ldyBMb2dHcm91cCh0aGlzLCBcIkxvZ0dyb3VwXCIsIHtcblx0XHRcdGxvZ0dyb3VwTmFtZSxcblx0XHRcdHJldGVudGlvbjogY3VzdG9tTG9nUmV0ZW50aW9uLFxuXHRcdFx0cmVtb3ZhbFBvbGljeTogcHJvcHMucmVtb3ZhbFBvbGljeSA/PyBSZW1vdmFsUG9saWN5LlJFVEFJTixcblx0XHR9KTtcblxuXHRcdFRhZ3Mub2YodGhpcykuYWRkKFwiTmFtZVwiLCBsb2dHcm91cE5hbWUpO1xuXHRcdFRhZ3Mub2YodGhpcykuYWRkKFwiT3duZXJcIiwgcHJvcHMucmVzb3VyY2VPd25lcik7XG5cdFx0VGFncy5vZih0aGlzKS5hZGQoXCJFbnZpcm9ubWVudFwiLCBwcm9wcy5hd3NFbnZpcm9ubWVudCk7XG5cdH1cbn1cbiJdfQ==