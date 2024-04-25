"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomApiLogGroupConstruct = exports.verifyCustomApiLogGroupSchema = exports.CustomApiLogGroupSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
dotenv.config();
/**
 * CustomApiLogGroupSchema
 *
 * Properties for a customised LogGroup \
 * removalPolicy with default RemovalPolicy.RETAIN
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param apiName
 * @param removalPolicy {@link RemovalPolicy}
 */
exports.CustomApiLogGroupSchema = resource_tag_1.CustomResourceTagSchema.extend({
    apiName: zod_1.z.string().min(1).max(499),
    removalPolicy: zod_1.z.optional(zod_1.z.nativeEnum(aws_cdk_lib_1.RemovalPolicy)),
}).omit({ resourceName: true });
/**
 * verifyCustomApiLogGroupSchema
 *
 * @param props {@link CustomApiLogGroupProps}
 * @returns output {@link CustomZodResponse}
 */
const verifyCustomApiLogGroupSchema = (props) => {
    const zodCheckOutput = exports.CustomApiLogGroupSchema.safeParse(props);
    if (!zodCheckOutput.success) {
        return {
            success: zodCheckOutput.success,
            message: zodCheckOutput.error.issues,
        };
    }
    return {
        success: zodCheckOutput.success,
    };
};
exports.verifyCustomApiLogGroupSchema = verifyCustomApiLogGroupSchema;
class CustomApiLogGroupConstruct extends constructs_1.Construct {
    /**
     * CustomApiLogGroupConstruct \
     *
     * CAUTION!!! \
     * Please choose the Log Group removalPolicy wisely. \
     * RETAIN = log group will remain if cdk destroy, Change apiName for next deploy to avoid stackrollback \
     * DESTROY = log group will delete once cdk destroy
     *
     * @readonly logGroup
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomApiLogGroupProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const zodCheckOutput = (0, exports.verifyCustomApiLogGroupSchema)(props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        let customLogRetention = aws_logs_1.RetentionDays.ONE_MONTH;
        if (process.env.NODE_ENV === utils_1.AwsEnvironment.PRODUCTION) {
            customLogRetention = aws_logs_1.RetentionDays.THREE_MONTHS;
        }
        const logGroupName = `/ecs/service/${props.apiName}`;
        this.logGroup = new aws_logs_1.LogGroup(this, "LogGroup", {
            logGroupName,
            retention: customLogRetention,
            removalPolicy: props.removalPolicy ?? aws_cdk_lib_1.RemovalPolicy.RETAIN,
        });
        new resource_tag_1.CustomResourceTagConstruct(this, "Tagging", {
            construct: this.logGroup,
            awsEnvironment: props.awsEnvironment,
            resourceOwner: props.resourceOwner,
            resourceName: logGroupName,
        });
    }
}
exports.CustomApiLogGroupConstruct = CustomApiLogGroupConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWxvZy1ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9hcGktbG9nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUE0QztBQUM1QyxtREFBK0Q7QUFDL0QsMkNBQXVDO0FBQ3ZDLGlDQUFpQztBQUNqQyw2QkFBd0I7QUFDeEIsaURBR3dCO0FBQ3hCLG1DQUFpRTtBQUVqRSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEI7Ozs7Ozs7Ozs7R0FVRztBQUNVLFFBQUEsdUJBQXVCLEdBQUcsc0NBQXVCLENBQUMsTUFBTSxDQUFDO0lBQ3JFLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7SUFDbkMsYUFBYSxFQUFFLE9BQUMsQ0FBQyxRQUFRLENBQUMsT0FBQyxDQUFDLFVBQVUsQ0FBQywyQkFBYSxDQUFDLENBQUM7Q0FDdEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBY2hDOzs7OztHQUtHO0FBQ0ksTUFBTSw2QkFBNkIsR0FBRyxDQUM1QyxLQUE2QixFQUM1QixFQUFFO0lBQ0gsTUFBTSxjQUFjLEdBQUcsK0JBQXVCLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0IsT0FBTztZQUNOLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTztZQUMvQixPQUFPLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNO1NBQ2YsQ0FBQztJQUN4QixDQUFDO0lBRUQsT0FBTztRQUNOLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTztLQUNWLENBQUM7QUFDeEIsQ0FBQyxDQUFDO0FBZFcsUUFBQSw2QkFBNkIsaUNBY3hDO0FBRUYsTUFBYSwwQkFBMkIsU0FBUSxzQkFBUztJQUd4RDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sY0FBYyxHQUFHLElBQUEscUNBQTZCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELElBQUksa0JBQWtCLEdBQUcsd0JBQWEsQ0FBQyxTQUFTLENBQUM7UUFDakQsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxzQkFBYyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3hELGtCQUFrQixHQUFHLHdCQUFhLENBQUMsWUFBWSxDQUFDO1FBQ2pELENBQUM7UUFFRCxNQUFNLFlBQVksR0FBRyxnQkFBZ0IsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXJELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsWUFBWTtZQUNaLFNBQVMsRUFBRSxrQkFBa0I7WUFDN0IsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhLElBQUksMkJBQWEsQ0FBQyxNQUFNO1NBQzFELENBQUMsQ0FBQztRQUVILElBQUkseUNBQTBCLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMvQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDeEIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxZQUFZLEVBQUUsWUFBWTtTQUMxQixDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0Q7QUE3Q0QsZ0VBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVtb3ZhbFBvbGljeSB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgTG9nR3JvdXAsIFJldGVudGlvbkRheXMgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxvZ3NcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSBcImRvdGVudlwiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7XG5cdEN1c3RvbVJlc291cmNlVGFnQ29uc3RydWN0LFxuXHRDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYSxcbn0gZnJvbSBcIi4vcmVzb3VyY2UtdGFnXCI7XG5pbXBvcnQgeyBBd3NFbnZpcm9ubWVudCwgdHlwZSBDdXN0b21ab2RSZXNwb25zZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuLyoqXG4gKiBDdXN0b21BcGlMb2dHcm91cFNjaGVtYVxuICpcbiAqIFByb3BlcnRpZXMgZm9yIGEgY3VzdG9taXNlZCBMb2dHcm91cCBcXFxuICogcmVtb3ZhbFBvbGljeSB3aXRoIGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5SRVRBSU5cbiAqXG4gKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQge0BsaW5rIEF3c0Vudmlyb25tZW50fVxuICogQHBhcmFtIHJlc291cmNlT3duZXIge0BsaW5rIFB1bHNpZmlUZWFtfVxuICogQHBhcmFtIGFwaU5hbWVcbiAqIEBwYXJhbSByZW1vdmFsUG9saWN5IHtAbGluayBSZW1vdmFsUG9saWN5fVxuICovXG5leHBvcnQgY29uc3QgQ3VzdG9tQXBpTG9nR3JvdXBTY2hlbWEgPSBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYS5leHRlbmQoe1xuXHRhcGlOYW1lOiB6LnN0cmluZygpLm1pbigxKS5tYXgoNDk5KSxcblx0cmVtb3ZhbFBvbGljeTogei5vcHRpb25hbCh6Lm5hdGl2ZUVudW0oUmVtb3ZhbFBvbGljeSkpLFxufSkub21pdCh7IHJlc291cmNlTmFtZTogdHJ1ZSB9KTtcblxuLyoqXG4gKiBDdXN0b21BcGlMb2dHcm91cFByb3BzXG4gKlxuICogUHJvcGVydGllcyBmb3IgYSBjdXN0b21pc2VkIExvZ0dyb3VwXG4gKlxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqIEBwYXJhbSBhcGlOYW1lXG4gKiBAcGFyYW0gcmVtb3ZhbFBvbGljeSB7QGxpbmsgUmVtb3ZhbFBvbGljeX1cbiAqL1xuZXhwb3J0IHR5cGUgQ3VzdG9tQXBpTG9nR3JvdXBQcm9wcyA9IHouaW5mZXI8dHlwZW9mIEN1c3RvbUFwaUxvZ0dyb3VwU2NoZW1hPjtcblxuLyoqXG4gKiB2ZXJpZnlDdXN0b21BcGlMb2dHcm91cFNjaGVtYVxuICpcbiAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tQXBpTG9nR3JvdXBQcm9wc31cbiAqIEByZXR1cm5zIG91dHB1dCB7QGxpbmsgQ3VzdG9tWm9kUmVzcG9uc2V9XG4gKi9cbmV4cG9ydCBjb25zdCB2ZXJpZnlDdXN0b21BcGlMb2dHcm91cFNjaGVtYSA9IChcblx0cHJvcHM6IEN1c3RvbUFwaUxvZ0dyb3VwUHJvcHMsXG4pID0+IHtcblx0Y29uc3Qgem9kQ2hlY2tPdXRwdXQgPSBDdXN0b21BcGlMb2dHcm91cFNjaGVtYS5zYWZlUGFyc2UocHJvcHMpO1xuXHRpZiAoIXpvZENoZWNrT3V0cHV0LnN1Y2Nlc3MpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2Vzczogem9kQ2hlY2tPdXRwdXQuc3VjY2Vzcyxcblx0XHRcdG1lc3NhZ2U6IHpvZENoZWNrT3V0cHV0LmVycm9yLmlzc3Vlcyxcblx0XHR9IGFzIEN1c3RvbVpvZFJlc3BvbnNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzdWNjZXNzOiB6b2RDaGVja091dHB1dC5zdWNjZXNzLFxuXHR9IGFzIEN1c3RvbVpvZFJlc3BvbnNlO1xufTtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbUFwaUxvZ0dyb3VwQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcblx0cHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwOiBMb2dHcm91cDtcblxuXHQvKipcblx0ICogQ3VzdG9tQXBpTG9nR3JvdXBDb25zdHJ1Y3QgXFxcblx0ICpcblx0ICogQ0FVVElPTiEhISBcXFxuXHQgKiBQbGVhc2UgY2hvb3NlIHRoZSBMb2cgR3JvdXAgcmVtb3ZhbFBvbGljeSB3aXNlbHkuIFxcXG5cdCAqIFJFVEFJTiA9IGxvZyBncm91cCB3aWxsIHJlbWFpbiBpZiBjZGsgZGVzdHJveSwgQ2hhbmdlIGFwaU5hbWUgZm9yIG5leHQgZGVwbG95IHRvIGF2b2lkIHN0YWNrcm9sbGJhY2sgXFxcblx0ICogREVTVFJPWSA9IGxvZyBncm91cCB3aWxsIGRlbGV0ZSBvbmNlIGNkayBkZXN0cm95XG5cdCAqXG5cdCAqIEByZWFkb25seSBsb2dHcm91cFxuXHQgKlxuXHQgKiBAcGFyYW0gc2NvcGUge0BsaW5rIENvbnN0cnVjdH1cblx0ICogQHBhcmFtIGlkXG5cdCAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tQXBpTG9nR3JvdXBQcm9wc31cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21BcGlMb2dHcm91cFByb3BzKSB7XG5cdFx0c3VwZXIoc2NvcGUsIGlkKTtcblxuXHRcdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gdmVyaWZ5Q3VzdG9tQXBpTG9nR3JvdXBTY2hlbWEocHJvcHMpO1xuXHRcdGlmICghem9kQ2hlY2tPdXRwdXQuc3VjY2Vzcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KHpvZENoZWNrT3V0cHV0Lm1lc3NhZ2UpKTtcblx0XHR9XG5cblx0XHRsZXQgY3VzdG9tTG9nUmV0ZW50aW9uID0gUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEg7XG5cdFx0aWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBBd3NFbnZpcm9ubWVudC5QUk9EVUNUSU9OKSB7XG5cdFx0XHRjdXN0b21Mb2dSZXRlbnRpb24gPSBSZXRlbnRpb25EYXlzLlRIUkVFX01PTlRIUztcblx0XHR9XG5cblx0XHRjb25zdCBsb2dHcm91cE5hbWUgPSBgL2Vjcy9zZXJ2aWNlLyR7cHJvcHMuYXBpTmFtZX1gO1xuXG5cdFx0dGhpcy5sb2dHcm91cCA9IG5ldyBMb2dHcm91cCh0aGlzLCBcIkxvZ0dyb3VwXCIsIHtcblx0XHRcdGxvZ0dyb3VwTmFtZSxcblx0XHRcdHJldGVudGlvbjogY3VzdG9tTG9nUmV0ZW50aW9uLFxuXHRcdFx0cmVtb3ZhbFBvbGljeTogcHJvcHMucmVtb3ZhbFBvbGljeSA/PyBSZW1vdmFsUG9saWN5LlJFVEFJTixcblx0XHR9KTtcblxuXHRcdG5ldyBDdXN0b21SZXNvdXJjZVRhZ0NvbnN0cnVjdCh0aGlzLCBcIlRhZ2dpbmdcIiwge1xuXHRcdFx0Y29uc3RydWN0OiB0aGlzLmxvZ0dyb3VwLFxuXHRcdFx0YXdzRW52aXJvbm1lbnQ6IHByb3BzLmF3c0Vudmlyb25tZW50LFxuXHRcdFx0cmVzb3VyY2VPd25lcjogcHJvcHMucmVzb3VyY2VPd25lcixcblx0XHRcdHJlc291cmNlTmFtZTogbG9nR3JvdXBOYW1lLFxuXHRcdH0pO1xuXHR9XG59XG4iXX0=