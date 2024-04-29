"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomIamRoleConstruct = exports.generateIamRoleName = exports.CustomIamRoleSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_ssm_1 = require("aws-cdk-lib/aws-ssm");
const constructs_1 = require("constructs");
const lodash_1 = require("lodash");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
/**
 * CustomIamRoleSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @prop resourceName
 */
exports.CustomIamRoleSchema = resource_tag_1.CustomResourceTagSchema.omit({
    resourceName: true,
}).extend({
    resourceName: zod_1.z
        .string()
        .min(1)
        .max(56)
        .refine((value) => {
        if (value.length > 0) {
            return (0, lodash_1.kebabCase)(value);
        }
        return "";
    }, utils_1.PulsifiCustomCdkError.NON_KEBAB_CASE),
});
/**
 * generateIamRoleName
 *
 * This formats the input resourceName into the default kebab-case format role name.
 *
 * This does not include the Aws region suffix at the end of the role name.
 *
 * @param props {@link CustomIamRoleProps}
 * @param
 * @returns output: (example: demo-api-role)
 */
const generateIamRoleName = (props) => {
    const formattedKebabCaseName = (0, lodash_1.kebabCase)(props.resourceName);
    return `${formattedKebabCaseName}-role`;
};
exports.generateIamRoleName = generateIamRoleName;
class CustomIamRoleConstruct extends constructs_1.Construct {
    /**
     * CustomIamRoleConstruct
     *
     * Generates a standard IAM Role, please create separately if you have a custom usecase.
     *
     * Aws region abbreviation will be read from AWS account's "/configs/AWS_REGION_ABBR"
     * parameter store
     *
     * @readonly iamRole
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomIamRoleProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const utils = new utils_1.PulsifiUtils();
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomIamRoleSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        const awsRegionAbbr = aws_ssm_1.StringParameter.valueForStringParameter(this, "/configs/AWS_REGION_ABBR");
        const roleName = `${(0, exports.generateIamRoleName)(props)}-${awsRegionAbbr}`;
        this.iamRole = new aws_iam_1.Role(this, "CustomIamRole", {
            roleName,
            assumedBy: props.assumedBy,
        });
        aws_cdk_lib_1.Tags.of(this).add("Name", roleName);
        aws_cdk_lib_1.Tags.of(this).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this).add("Environment", props.awsEnvironment);
    }
}
exports.CustomIamRoleConstruct = CustomIamRoleConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXJvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaWFtLXJvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQW1DO0FBQ25DLGlEQUFvRTtBQUNwRSxpREFBc0Q7QUFDdEQsMkNBQXVDO0FBQ3ZDLG1DQUFtQztBQUNuQyw2QkFBd0I7QUFDeEIsaURBQXlEO0FBQ3pELG1DQUE4RDtBQUU5RDs7Ozs7O0dBTUc7QUFDVSxRQUFBLG1CQUFtQixHQUFHLHNDQUF1QixDQUFDLElBQUksQ0FBQztJQUMvRCxZQUFZLEVBQUUsSUFBSTtDQUNsQixDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ1QsWUFBWSxFQUFFLE9BQUM7U0FDYixNQUFNLEVBQUU7U0FDUixHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ04sR0FBRyxDQUFDLEVBQUUsQ0FBQztTQUNQLE1BQU0sQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFO1FBQ3pCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0QixPQUFPLElBQUEsa0JBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDLEVBQUUsNkJBQXFCLENBQUMsY0FBYyxDQUFDO0NBQ3pDLENBQUMsQ0FBQztBQWFIOzs7Ozs7Ozs7O0dBVUc7QUFDSSxNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBeUIsRUFBVSxFQUFFO0lBQ3hFLE1BQU0sc0JBQXNCLEdBQUcsSUFBQSxrQkFBUyxFQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUU3RCxPQUFPLEdBQUcsc0JBQXNCLE9BQU8sQ0FBQztBQUN6QyxDQUFDLENBQUM7QUFKVyxRQUFBLG1CQUFtQix1QkFJOUI7QUFFRixNQUFhLHNCQUF1QixTQUFRLHNCQUFTO0lBR3BEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7UUFFakMsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUc3QywyQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsTUFBTSxhQUFhLEdBQUcseUJBQWUsQ0FBQyx1QkFBdUIsQ0FDNUQsSUFBSSxFQUNKLDBCQUEwQixDQUMxQixDQUFDO1FBRUYsTUFBTSxRQUFRLEdBQUcsR0FBRyxJQUFBLDJCQUFtQixFQUFDLEtBQUssQ0FBQyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBRWxFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUM5QyxRQUFRO1lBQ1IsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzFCLENBQUMsQ0FBQztRQUVILGtCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEQsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNEO0FBOUNELHdEQThDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRhZ3MgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IHR5cGUgQ29tcG9zaXRlUHJpbmNpcGFsLCBSb2xlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcbmltcG9ydCB7IFN0cmluZ1BhcmFtZXRlciB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3NtXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0IHsga2ViYWJDYXNlIH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlVGFnU2NoZW1hIH0gZnJvbSBcIi4vcmVzb3VyY2UtdGFnXCI7XG5pbXBvcnQgeyBQdWxzaWZpQ3VzdG9tQ2RrRXJyb3IsIFB1bHNpZmlVdGlscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8qKlxuICogQ3VzdG9tSWFtUm9sZVNjaGVtYVxuICpcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKiBAcHJvcCByZXNvdXJjZU5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IEN1c3RvbUlhbVJvbGVTY2hlbWEgPSBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYS5vbWl0KHtcblx0cmVzb3VyY2VOYW1lOiB0cnVlLFxufSkuZXh0ZW5kKHtcblx0cmVzb3VyY2VOYW1lOiB6XG5cdFx0LnN0cmluZygpXG5cdFx0Lm1pbigxKVxuXHRcdC5tYXgoNTYpXG5cdFx0LnJlZmluZSgodmFsdWU6IHN0cmluZykgPT4ge1xuXHRcdFx0aWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0cmV0dXJuIGtlYmFiQ2FzZSh2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9LCBQdWxzaWZpQ3VzdG9tQ2RrRXJyb3IuTk9OX0tFQkFCX0NBU0UpLFxufSk7XG5cbi8qKlxuICogQ3VzdG9tSWFtUm9sZVByb3BzXG4gKlxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqIEBwcm9wIHJlc291cmNlTmFtZVxuICovXG5leHBvcnQgdHlwZSBDdXN0b21JYW1Sb2xlUHJvcHMgPSB6LmluZmVyPHR5cGVvZiBDdXN0b21JYW1Sb2xlU2NoZW1hPiAmIHtcblx0YXNzdW1lZEJ5OiBDb21wb3NpdGVQcmluY2lwYWw7XG59O1xuXG4vKipcbiAqIGdlbmVyYXRlSWFtUm9sZU5hbWVcbiAqXG4gKiBUaGlzIGZvcm1hdHMgdGhlIGlucHV0IHJlc291cmNlTmFtZSBpbnRvIHRoZSBkZWZhdWx0IGtlYmFiLWNhc2UgZm9ybWF0IHJvbGUgbmFtZS5cbiAqXG4gKiBUaGlzIGRvZXMgbm90IGluY2x1ZGUgdGhlIEF3cyByZWdpb24gc3VmZml4IGF0IHRoZSBlbmQgb2YgdGhlIHJvbGUgbmFtZS5cbiAqXG4gKiBAcGFyYW0gcHJvcHMge0BsaW5rIEN1c3RvbUlhbVJvbGVQcm9wc31cbiAqIEBwYXJhbVxuICogQHJldHVybnMgb3V0cHV0OiAoZXhhbXBsZTogZGVtby1hcGktcm9sZSlcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlSWFtUm9sZU5hbWUgPSAocHJvcHM6IEN1c3RvbUlhbVJvbGVQcm9wcyk6IHN0cmluZyA9PiB7XG5cdGNvbnN0IGZvcm1hdHRlZEtlYmFiQ2FzZU5hbWUgPSBrZWJhYkNhc2UocHJvcHMucmVzb3VyY2VOYW1lKTtcblxuXHRyZXR1cm4gYCR7Zm9ybWF0dGVkS2ViYWJDYXNlTmFtZX0tcm9sZWA7XG59O1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tSWFtUm9sZUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG5cdHB1YmxpYyByZWFkb25seSBpYW1Sb2xlOiBSb2xlO1xuXG5cdC8qKlxuXHQgKiBDdXN0b21JYW1Sb2xlQ29uc3RydWN0XG5cdCAqXG5cdCAqIEdlbmVyYXRlcyBhIHN0YW5kYXJkIElBTSBSb2xlLCBwbGVhc2UgY3JlYXRlIHNlcGFyYXRlbHkgaWYgeW91IGhhdmUgYSBjdXN0b20gdXNlY2FzZS5cblx0ICpcblx0ICogQXdzIHJlZ2lvbiBhYmJyZXZpYXRpb24gd2lsbCBiZSByZWFkIGZyb20gQVdTIGFjY291bnQncyBcIi9jb25maWdzL0FXU19SRUdJT05fQUJCUlwiXG5cdCAqIHBhcmFtZXRlciBzdG9yZVxuXHQgKlxuXHQgKiBAcmVhZG9ubHkgaWFtUm9sZVxuXHQgKlxuXHQgKiBAcGFyYW0gc2NvcGUge0BsaW5rIENvbnN0cnVjdH1cblx0ICogQHBhcmFtIGlkXG5cdCAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tSWFtUm9sZVByb3BzfVxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEN1c3RvbUlhbVJvbGVQcm9wcykge1xuXHRcdHN1cGVyKHNjb3BlLCBpZCk7XG5cblx0XHRjb25zdCB1dGlscyA9IG5ldyBQdWxzaWZpVXRpbHMoKTtcblxuXHRcdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gdXRpbHMudmVyaWZ5Q3VzdG9tU2NoZW1hPFxuXHRcdFx0dHlwZW9mIEN1c3RvbUlhbVJvbGVTY2hlbWEsXG5cdFx0XHRDdXN0b21JYW1Sb2xlUHJvcHNcblx0XHQ+KEN1c3RvbUlhbVJvbGVTY2hlbWEsIHByb3BzKTtcblx0XHRpZiAoIXpvZENoZWNrT3V0cHV0LnN1Y2Nlc3MpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeSh6b2RDaGVja091dHB1dC5tZXNzYWdlKSk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgYXdzUmVnaW9uQWJiciA9IFN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcblx0XHRcdHRoaXMsXG5cdFx0XHRcIi9jb25maWdzL0FXU19SRUdJT05fQUJCUlwiLFxuXHRcdCk7XG5cblx0XHRjb25zdCByb2xlTmFtZSA9IGAke2dlbmVyYXRlSWFtUm9sZU5hbWUocHJvcHMpfS0ke2F3c1JlZ2lvbkFiYnJ9YDtcblxuXHRcdHRoaXMuaWFtUm9sZSA9IG5ldyBSb2xlKHRoaXMsIFwiQ3VzdG9tSWFtUm9sZVwiLCB7XG5cdFx0XHRyb2xlTmFtZSxcblx0XHRcdGFzc3VtZWRCeTogcHJvcHMuYXNzdW1lZEJ5LFxuXHRcdH0pO1xuXG5cdFx0VGFncy5vZih0aGlzKS5hZGQoXCJOYW1lXCIsIHJvbGVOYW1lKTtcblx0XHRUYWdzLm9mKHRoaXMpLmFkZChcIk93bmVyXCIsIHByb3BzLnJlc291cmNlT3duZXIpO1xuXHRcdFRhZ3Mub2YodGhpcykuYWRkKFwiRW52aXJvbm1lbnRcIiwgcHJvcHMuYXdzRW52aXJvbm1lbnQpO1xuXHR9XG59XG4iXX0=