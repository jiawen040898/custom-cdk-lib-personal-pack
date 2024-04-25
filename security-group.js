"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSecurityGroupConstruct = exports.verifyCustomSecurityGroupSchema = exports.CustomSecurityGroupSchema = void 0;
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_ssm_1 = require("aws-cdk-lib/aws-ssm");
const constructs_1 = require("constructs");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
/**
 * CustomSecurityGroupSchema
 *
 * @param resourceName
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 */
exports.CustomSecurityGroupSchema = resource_tag_1.CustomResourceTagSchema.omit({
    resourceName: true,
}).extend({
    resourceName: zod_1.z.string().min(1).max(252),
});
/**
 * verifyCustomSecurityGroupSchema
 *
 * @param props {@link CustomSecurityGroupProps}
 * @returns output {@link CustomZodResponse}
 */
const verifyCustomSecurityGroupSchema = (props) => {
    const zodCheckOutput = exports.CustomSecurityGroupSchema.safeParse(props);
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
exports.verifyCustomSecurityGroupSchema = verifyCustomSecurityGroupSchema;
class CustomSecurityGroupConstruct extends constructs_1.Construct {
    /**
     * CustomSecurityGroupConstruct
     *
     * @readonly securityGroupName
     * @readonly securityGroup
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomSecurityGroupProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const zodCheckOutput = (0, exports.verifyCustomSecurityGroupSchema)(props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        const region = process.env.CDK_DEPLOY_REGION ?? process.env.CDK_DEFAULT_REGION;
        const vpcId = aws_ssm_1.StringParameter.valueFromLookup(this, "/configs/VPCID");
        const vpc = aws_ec2_1.Vpc.fromLookup(this, "VPC", {
            vpcId,
            region,
        });
        const securityGroupProps = {
            securityGroupName: `${props.resourceName}-sg`,
            description: `${props.resourceName}-sg`,
            vpc,
            allowAllOutbound: true,
            disableInlineRules: true,
        };
        this.securityGroupName = `${securityGroupProps.securityGroupName}`;
        this.securityGroup = new aws_ec2_1.SecurityGroup(this, "SecurityGroup", securityGroupProps);
        new resource_tag_1.CustomResourceTagConstruct(this, "Tagging", {
            construct: this,
            awsEnvironment: props.awsEnvironment,
            resourceOwner: props.resourceOwner,
            resourceName: `${securityGroupProps.securityGroupName}`,
        });
    }
}
exports.CustomSecurityGroupConstruct = CustomSecurityGroupConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHktZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc2VjdXJpdHktZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBSTZCO0FBQzdCLGlEQUFzRDtBQUN0RCwyQ0FBdUM7QUFDdkMsNkJBQXdCO0FBQ3hCLGlEQUd3QjtBQUd4Qjs7Ozs7O0dBTUc7QUFDVSxRQUFBLHlCQUF5QixHQUFHLHNDQUF1QixDQUFDLElBQUksQ0FBQztJQUNyRSxZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ1QsWUFBWSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztDQUN4QyxDQUFDLENBQUM7QUFhSDs7Ozs7R0FLRztBQUNJLE1BQU0sK0JBQStCLEdBQUcsQ0FDOUMsS0FBK0IsRUFDOUIsRUFBRTtJQUNILE1BQU0sY0FBYyxHQUFHLGlDQUF5QixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsRSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdCLE9BQU87WUFDTixPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU87WUFDL0IsT0FBTyxFQUFFLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTTtTQUNmLENBQUM7SUFDeEIsQ0FBQztJQUVELE9BQU87UUFDTixPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU87S0FDVixDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQWRXLFFBQUEsK0JBQStCLG1DQWMxQztBQUVGLE1BQWEsNEJBQTZCLFNBQVEsc0JBQVM7SUFJMUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUErQjtRQUN4RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sY0FBYyxHQUFHLElBQUEsdUNBQStCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztRQUVqRSxNQUFNLEtBQUssR0FBRyx5QkFBZSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxNQUFNLEdBQUcsR0FBRyxhQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDdkMsS0FBSztZQUNMLE1BQU07U0FDTixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUF1QjtZQUM5QyxpQkFBaUIsRUFBRSxHQUFHLEtBQUssQ0FBQyxZQUFZLEtBQUs7WUFDN0MsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLFlBQVksS0FBSztZQUN2QyxHQUFHO1lBQ0gsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixrQkFBa0IsRUFBRSxJQUFJO1NBQ3hCLENBQUM7UUFDRixJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ25FLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSx1QkFBYSxDQUNyQyxJQUFJLEVBQ0osZUFBZSxFQUNmLGtCQUFrQixDQUNsQixDQUFDO1FBRUYsSUFBSSx5Q0FBMEIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQy9DLFNBQVMsRUFBRSxJQUFJO1lBQ2YsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxZQUFZLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRTtTQUN2RCxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0Q7QUFwREQsb0VBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0U2VjdXJpdHlHcm91cCxcblx0dHlwZSBTZWN1cml0eUdyb3VwUHJvcHMsXG5cdFZwYyxcbn0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lYzJcIjtcbmltcG9ydCB7IFN0cmluZ1BhcmFtZXRlciB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3NtXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7XG5cdEN1c3RvbVJlc291cmNlVGFnQ29uc3RydWN0LFxuXHRDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYSxcbn0gZnJvbSBcIi4vcmVzb3VyY2UtdGFnXCI7XG5pbXBvcnQgdHlwZSB7IEN1c3RvbVpvZFJlc3BvbnNlIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLyoqXG4gKiBDdXN0b21TZWN1cml0eUdyb3VwU2NoZW1hXG4gKlxuICogQHBhcmFtIHJlc291cmNlTmFtZVxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqL1xuZXhwb3J0IGNvbnN0IEN1c3RvbVNlY3VyaXR5R3JvdXBTY2hlbWEgPSBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYS5vbWl0KHtcblx0cmVzb3VyY2VOYW1lOiB0cnVlLFxufSkuZXh0ZW5kKHtcblx0cmVzb3VyY2VOYW1lOiB6LnN0cmluZygpLm1pbigxKS5tYXgoMjUyKSxcbn0pO1xuXG4vKipcbiAqIEN1c3RvbVNlY3VyaXR5R3JvdXBQcm9wc1xuICpcbiAqIEBwYXJhbSByZXNvdXJjZU5hbWVcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbVNlY3VyaXR5R3JvdXBQcm9wcyA9IHouaW5mZXI8XG5cdHR5cGVvZiBDdXN0b21TZWN1cml0eUdyb3VwU2NoZW1hXG4+O1xuXG4vKipcbiAqIHZlcmlmeUN1c3RvbVNlY3VyaXR5R3JvdXBTY2hlbWFcbiAqXG4gKiBAcGFyYW0gcHJvcHMge0BsaW5rIEN1c3RvbVNlY3VyaXR5R3JvdXBQcm9wc31cbiAqIEByZXR1cm5zIG91dHB1dCB7QGxpbmsgQ3VzdG9tWm9kUmVzcG9uc2V9XG4gKi9cbmV4cG9ydCBjb25zdCB2ZXJpZnlDdXN0b21TZWN1cml0eUdyb3VwU2NoZW1hID0gKFxuXHRwcm9wczogQ3VzdG9tU2VjdXJpdHlHcm91cFByb3BzLFxuKSA9PiB7XG5cdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gQ3VzdG9tU2VjdXJpdHlHcm91cFNjaGVtYS5zYWZlUGFyc2UocHJvcHMpO1xuXHRpZiAoIXpvZENoZWNrT3V0cHV0LnN1Y2Nlc3MpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2Vzczogem9kQ2hlY2tPdXRwdXQuc3VjY2Vzcyxcblx0XHRcdG1lc3NhZ2U6IHpvZENoZWNrT3V0cHV0LmVycm9yLmlzc3Vlcyxcblx0XHR9IGFzIEN1c3RvbVpvZFJlc3BvbnNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRzdWNjZXNzOiB6b2RDaGVja091dHB1dC5zdWNjZXNzLFxuXHR9IGFzIEN1c3RvbVpvZFJlc3BvbnNlO1xufTtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbVNlY3VyaXR5R3JvdXBDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXHRwdWJsaWMgcmVhZG9ubHkgc2VjdXJpdHlHcm91cE5hbWU6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA6IFNlY3VyaXR5R3JvdXA7XG5cblx0LyoqXG5cdCAqIEN1c3RvbVNlY3VyaXR5R3JvdXBDb25zdHJ1Y3Rcblx0ICpcblx0ICogQHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBOYW1lXG5cdCAqIEByZWFkb25seSBzZWN1cml0eUdyb3VwXG5cdCAqXG5cdCAqIEBwYXJhbSBzY29wZSB7QGxpbmsgQ29uc3RydWN0fVxuXHQgKiBAcGFyYW0gaWRcblx0ICogQHBhcmFtIHByb3BzIHtAbGluayBDdXN0b21TZWN1cml0eUdyb3VwUHJvcHN9XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3VzdG9tU2VjdXJpdHlHcm91cFByb3BzKSB7XG5cdFx0c3VwZXIoc2NvcGUsIGlkKTtcblxuXHRcdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gdmVyaWZ5Q3VzdG9tU2VjdXJpdHlHcm91cFNjaGVtYShwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoem9kQ2hlY2tPdXRwdXQubWVzc2FnZSkpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlZ2lvbiA9XG5cdFx0XHRwcm9jZXNzLmVudi5DREtfREVQTE9ZX1JFR0lPTiA/PyBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT047XG5cblx0XHRjb25zdCB2cGNJZCA9IFN0cmluZ1BhcmFtZXRlci52YWx1ZUZyb21Mb29rdXAodGhpcywgXCIvY29uZmlncy9WUENJRFwiKTtcblx0XHRjb25zdCB2cGMgPSBWcGMuZnJvbUxvb2t1cCh0aGlzLCBcIlZQQ1wiLCB7XG5cdFx0XHR2cGNJZCxcblx0XHRcdHJlZ2lvbixcblx0XHR9KTtcblxuXHRcdGNvbnN0IHNlY3VyaXR5R3JvdXBQcm9wczogU2VjdXJpdHlHcm91cFByb3BzID0ge1xuXHRcdFx0c2VjdXJpdHlHcm91cE5hbWU6IGAke3Byb3BzLnJlc291cmNlTmFtZX0tc2dgLFxuXHRcdFx0ZGVzY3JpcHRpb246IGAke3Byb3BzLnJlc291cmNlTmFtZX0tc2dgLFxuXHRcdFx0dnBjLFxuXHRcdFx0YWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcblx0XHRcdGRpc2FibGVJbmxpbmVSdWxlczogdHJ1ZSxcblx0XHR9O1xuXHRcdHRoaXMuc2VjdXJpdHlHcm91cE5hbWUgPSBgJHtzZWN1cml0eUdyb3VwUHJvcHMuc2VjdXJpdHlHcm91cE5hbWV9YDtcblx0XHR0aGlzLnNlY3VyaXR5R3JvdXAgPSBuZXcgU2VjdXJpdHlHcm91cChcblx0XHRcdHRoaXMsXG5cdFx0XHRcIlNlY3VyaXR5R3JvdXBcIixcblx0XHRcdHNlY3VyaXR5R3JvdXBQcm9wcyxcblx0XHQpO1xuXG5cdFx0bmV3IEN1c3RvbVJlc291cmNlVGFnQ29uc3RydWN0KHRoaXMsIFwiVGFnZ2luZ1wiLCB7XG5cdFx0XHRjb25zdHJ1Y3Q6IHRoaXMsXG5cdFx0XHRhd3NFbnZpcm9ubWVudDogcHJvcHMuYXdzRW52aXJvbm1lbnQsXG5cdFx0XHRyZXNvdXJjZU93bmVyOiBwcm9wcy5yZXNvdXJjZU93bmVyLFxuXHRcdFx0cmVzb3VyY2VOYW1lOiBgJHtzZWN1cml0eUdyb3VwUHJvcHMuc2VjdXJpdHlHcm91cE5hbWV9YCxcblx0XHR9KTtcblx0fVxufVxuIl19