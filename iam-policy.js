"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomIamPolicyConstruct = exports.verifyStatementCount = exports.verifyRoleCount = exports.generateIamPolicyName = exports.CustomIamPolicySchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_ssm_1 = require("aws-cdk-lib/aws-ssm");
const constructs_1 = require("constructs");
const lodash_1 = require("lodash");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
/**
 * CustomIamPolicySchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @prop resourceName
 */
exports.CustomIamPolicySchema = resource_tag_1.CustomResourceTagSchema.omit({
    resourceName: true,
}).extend({
    resourceName: zod_1.z
        .string()
        .min(1)
        .max(118)
        .refine((value) => {
        if (value.length > 0) {
            return (0, lodash_1.kebabCase)(value);
        }
        return "";
    }, utils_1.PulsifiCustomCdkError.NON_KEBAB_CASE),
});
/**
 * generateIamPolicyName
 *
 * @param props {@link CustomIamPolicyProps}
 * @returns output: (example: demo-api-policy)
 */
const generateIamPolicyName = (props) => {
    const formattedKebabCaseName = (0, lodash_1.kebabCase)(props.resourceName);
    return `${formattedKebabCaseName}-policy`;
};
exports.generateIamPolicyName = generateIamPolicyName;
/**
 * verifyRoleCount
 *
 * Checks role field is not empty
 *
 * @param props {@link CustomIamPolicyProps}
 */
const verifyRoleCount = (props) => {
    if (props?.roles && props.roles.length < 1) {
        throw new Error(utils_1.PulsifiCustomCdkError.IAM_POLICY_INVALID_ROLES);
    }
};
exports.verifyRoleCount = verifyRoleCount;
/**
 * verifyStatementCount
 *
 * Checks policy field is not empty
 *
 * @param props {@link CustomIamPolicyProps}
 */
const verifyStatementCount = (props) => {
    if (props?.statements && props.statements.length < 1) {
        throw new Error(utils_1.PulsifiCustomCdkError.IAM_POLICY_INVALID_STATEMENTS);
    }
};
exports.verifyStatementCount = verifyStatementCount;
class CustomIamPolicyConstruct extends constructs_1.Construct {
    /**
     * CustomIamPolicyConstruct
     *
     * Generates a standard IAM policy, please create separately if you have a custom usecase.
     *
     * Aws region abbreviation will be read from AWS account's "/configs/AWS_REGION_ABBR"
     * parameter store
     *
     * @readonly iamPolicy
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomIamPolicyProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const utils = new utils_1.PulsifiUtils();
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomIamPolicySchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        (0, exports.verifyRoleCount)(props);
        (0, exports.verifyStatementCount)(props);
        const awsRegionAbbr = aws_ssm_1.StringParameter.valueForStringParameter(this, "/configs/AWS_REGION_ABBR");
        const managedPolicyName = `${(0, exports.generateIamPolicyName)(props)}-${awsRegionAbbr}`;
        this.iamPolicy = new aws_iam_1.ManagedPolicy(this, "CustomIamPolicy", {
            managedPolicyName,
            statements: props.statements,
            roles: props.roles,
        });
        aws_cdk_lib_1.Tags.of(this).add("Name", managedPolicyName);
        aws_cdk_lib_1.Tags.of(this).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this).add("Environment", props.awsEnvironment);
    }
}
exports.CustomIamPolicyConstruct = CustomIamPolicyConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9pYW0tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFtQztBQUNuQyxpREFJNkI7QUFDN0IsaURBQXNEO0FBQ3RELDJDQUF1QztBQUN2QyxtQ0FBbUM7QUFDbkMsNkJBQXdCO0FBQ3hCLGlEQUF5RDtBQUN6RCxtQ0FBOEQ7QUFFOUQ7Ozs7OztHQU1HO0FBQ1UsUUFBQSxxQkFBcUIsR0FBRyxzQ0FBdUIsQ0FBQyxJQUFJLENBQUM7SUFDakUsWUFBWSxFQUFFLElBQUk7Q0FDbEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNULFlBQVksRUFBRSxPQUFDO1NBQ2IsTUFBTSxFQUFFO1NBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNOLEdBQUcsQ0FBQyxHQUFHLENBQUM7U0FDUixNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUNqQixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdEIsT0FBTyxJQUFBLGtCQUFTLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQyxFQUFFLDZCQUFxQixDQUFDLGNBQWMsQ0FBQztDQUN6QyxDQUFDLENBQUM7QUFjSDs7Ozs7R0FLRztBQUNJLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxLQUEyQixFQUFVLEVBQUU7SUFDNUUsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLGtCQUFTLEVBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTdELE9BQU8sR0FBRyxzQkFBc0IsU0FBUyxDQUFDO0FBQzNDLENBQUMsQ0FBQztBQUpXLFFBQUEscUJBQXFCLHlCQUloQztBQUVGOzs7Ozs7R0FNRztBQUNJLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBMkIsRUFBUSxFQUFFO0lBQ3BFLElBQUksS0FBSyxFQUFFLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUFxQixDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDakUsQ0FBQztBQUNGLENBQUMsQ0FBQztBQUpXLFFBQUEsZUFBZSxtQkFJMUI7QUFFRjs7Ozs7O0dBTUc7QUFDSSxNQUFNLG9CQUFvQixHQUFHLENBQUMsS0FBMkIsRUFBUSxFQUFFO0lBQ3pFLElBQUksS0FBSyxFQUFFLFVBQVUsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN0RCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUFxQixDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDdEUsQ0FBQztBQUNGLENBQUMsQ0FBQztBQUpXLFFBQUEsb0JBQW9CLHdCQUkvQjtBQUVGLE1BQWEsd0JBQXlCLFNBQVEsc0JBQVM7SUFHdEQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMkI7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLEtBQUssR0FBRyxJQUFJLG9CQUFZLEVBQUUsQ0FBQztRQUVqQyxNQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBRzdDLDZCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxJQUFBLHVCQUFlLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsSUFBQSw0QkFBb0IsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUU1QixNQUFNLGFBQWEsR0FBRyx5QkFBZSxDQUFDLHVCQUF1QixDQUM1RCxJQUFJLEVBQ0osMEJBQTBCLENBQzFCLENBQUM7UUFFRixNQUFNLGlCQUFpQixHQUFHLEdBQUcsSUFBQSw2QkFBcUIsRUFDakQsS0FBSyxDQUNMLElBQUksYUFBYSxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHVCQUFhLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzNELGlCQUFpQjtZQUNqQixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1NBQ2xCLENBQUMsQ0FBQztRQUVILGtCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM3QyxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRCxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0Q7QUFwREQsNERBb0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGFncyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHtcblx0dHlwZSBJUm9sZSxcblx0TWFuYWdlZFBvbGljeSxcblx0dHlwZSBQb2xpY3lTdGF0ZW1lbnQsXG59IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBTdHJpbmdQYXJhbWV0ZXIgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXNzbVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IGtlYmFiQ2FzZSB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZVRhZ1NjaGVtYSB9IGZyb20gXCIuL3Jlc291cmNlLXRhZ1wiO1xuaW1wb3J0IHsgUHVsc2lmaUN1c3RvbUNka0Vycm9yLCBQdWxzaWZpVXRpbHMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vKipcbiAqIEN1c3RvbUlhbVBvbGljeVNjaGVtYVxuICpcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKiBAcHJvcCByZXNvdXJjZU5hbWVcbiAqL1xuZXhwb3J0IGNvbnN0IEN1c3RvbUlhbVBvbGljeVNjaGVtYSA9IEN1c3RvbVJlc291cmNlVGFnU2NoZW1hLm9taXQoe1xuXHRyZXNvdXJjZU5hbWU6IHRydWUsXG59KS5leHRlbmQoe1xuXHRyZXNvdXJjZU5hbWU6IHpcblx0XHQuc3RyaW5nKClcblx0XHQubWluKDEpXG5cdFx0Lm1heCgxMTgpXG5cdFx0LnJlZmluZSgodmFsdWUpID0+IHtcblx0XHRcdGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJldHVybiBrZWJhYkNhc2UodmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fSwgUHVsc2lmaUN1c3RvbUNka0Vycm9yLk5PTl9LRUJBQl9DQVNFKSxcbn0pO1xuXG4vKipcbiAqIEN1c3RvbUlhbVBvbGljeVByb3BzXG4gKlxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqIEBwcm9wIHJlc291cmNlTmFtZVxuICovXG5leHBvcnQgdHlwZSBDdXN0b21JYW1Qb2xpY3lQcm9wcyA9IHouaW5mZXI8dHlwZW9mIEN1c3RvbUlhbVBvbGljeVNjaGVtYT4gJiB7XG5cdHJvbGVzOiBJUm9sZVtdO1xuXHRzdGF0ZW1lbnRzOiBQb2xpY3lTdGF0ZW1lbnRbXTtcbn07XG5cbi8qKlxuICogZ2VuZXJhdGVJYW1Qb2xpY3lOYW1lXG4gKlxuICogQHBhcmFtIHByb3BzIHtAbGluayBDdXN0b21JYW1Qb2xpY3lQcm9wc31cbiAqIEByZXR1cm5zIG91dHB1dDogKGV4YW1wbGU6IGRlbW8tYXBpLXBvbGljeSlcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlSWFtUG9saWN5TmFtZSA9IChwcm9wczogQ3VzdG9tSWFtUG9saWN5UHJvcHMpOiBzdHJpbmcgPT4ge1xuXHRjb25zdCBmb3JtYXR0ZWRLZWJhYkNhc2VOYW1lID0ga2ViYWJDYXNlKHByb3BzLnJlc291cmNlTmFtZSk7XG5cblx0cmV0dXJuIGAke2Zvcm1hdHRlZEtlYmFiQ2FzZU5hbWV9LXBvbGljeWA7XG59O1xuXG4vKipcbiAqIHZlcmlmeVJvbGVDb3VudFxuICpcbiAqIENoZWNrcyByb2xlIGZpZWxkIGlzIG5vdCBlbXB0eVxuICpcbiAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tSWFtUG9saWN5UHJvcHN9XG4gKi9cbmV4cG9ydCBjb25zdCB2ZXJpZnlSb2xlQ291bnQgPSAocHJvcHM6IEN1c3RvbUlhbVBvbGljeVByb3BzKTogdm9pZCA9PiB7XG5cdGlmIChwcm9wcz8ucm9sZXMgJiYgcHJvcHMucm9sZXMubGVuZ3RoIDwgMSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihQdWxzaWZpQ3VzdG9tQ2RrRXJyb3IuSUFNX1BPTElDWV9JTlZBTElEX1JPTEVTKTtcblx0fVxufTtcblxuLyoqXG4gKiB2ZXJpZnlTdGF0ZW1lbnRDb3VudFxuICpcbiAqIENoZWNrcyBwb2xpY3kgZmllbGQgaXMgbm90IGVtcHR5XG4gKlxuICogQHBhcmFtIHByb3BzIHtAbGluayBDdXN0b21JYW1Qb2xpY3lQcm9wc31cbiAqL1xuZXhwb3J0IGNvbnN0IHZlcmlmeVN0YXRlbWVudENvdW50ID0gKHByb3BzOiBDdXN0b21JYW1Qb2xpY3lQcm9wcyk6IHZvaWQgPT4ge1xuXHRpZiAocHJvcHM/LnN0YXRlbWVudHMgJiYgcHJvcHMuc3RhdGVtZW50cy5sZW5ndGggPCAxKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFB1bHNpZmlDdXN0b21DZGtFcnJvci5JQU1fUE9MSUNZX0lOVkFMSURfU1RBVEVNRU5UUyk7XG5cdH1cbn07XG5cbmV4cG9ydCBjbGFzcyBDdXN0b21JYW1Qb2xpY3lDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXHRwdWJsaWMgcmVhZG9ubHkgaWFtUG9saWN5OiBNYW5hZ2VkUG9saWN5O1xuXG5cdC8qKlxuXHQgKiBDdXN0b21JYW1Qb2xpY3lDb25zdHJ1Y3Rcblx0ICpcblx0ICogR2VuZXJhdGVzIGEgc3RhbmRhcmQgSUFNIHBvbGljeSwgcGxlYXNlIGNyZWF0ZSBzZXBhcmF0ZWx5IGlmIHlvdSBoYXZlIGEgY3VzdG9tIHVzZWNhc2UuXG5cdCAqXG5cdCAqIEF3cyByZWdpb24gYWJicmV2aWF0aW9uIHdpbGwgYmUgcmVhZCBmcm9tIEFXUyBhY2NvdW50J3MgXCIvY29uZmlncy9BV1NfUkVHSU9OX0FCQlJcIlxuXHQgKiBwYXJhbWV0ZXIgc3RvcmVcblx0ICpcblx0ICogQHJlYWRvbmx5IGlhbVBvbGljeVxuXHQgKlxuXHQgKiBAcGFyYW0gc2NvcGUge0BsaW5rIENvbnN0cnVjdH1cblx0ICogQHBhcmFtIGlkXG5cdCAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tSWFtUG9saWN5UHJvcHN9XG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3VzdG9tSWFtUG9saWN5UHJvcHMpIHtcblx0XHRzdXBlcihzY29wZSwgaWQpO1xuXG5cdFx0Y29uc3QgdXRpbHMgPSBuZXcgUHVsc2lmaVV0aWxzKCk7XG5cblx0XHRjb25zdCB6b2RDaGVja091dHB1dCA9IHV0aWxzLnZlcmlmeUN1c3RvbVNjaGVtYTxcblx0XHRcdHR5cGVvZiBDdXN0b21JYW1Qb2xpY3lTY2hlbWEsXG5cdFx0XHRDdXN0b21JYW1Qb2xpY3lQcm9wc1xuXHRcdD4oQ3VzdG9tSWFtUG9saWN5U2NoZW1hLCBwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoem9kQ2hlY2tPdXRwdXQubWVzc2FnZSkpO1xuXHRcdH1cblxuXHRcdHZlcmlmeVJvbGVDb3VudChwcm9wcyk7XG5cdFx0dmVyaWZ5U3RhdGVtZW50Q291bnQocHJvcHMpO1xuXG5cdFx0Y29uc3QgYXdzUmVnaW9uQWJiciA9IFN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihcblx0XHRcdHRoaXMsXG5cdFx0XHRcIi9jb25maWdzL0FXU19SRUdJT05fQUJCUlwiLFxuXHRcdCk7XG5cblx0XHRjb25zdCBtYW5hZ2VkUG9saWN5TmFtZSA9IGAke2dlbmVyYXRlSWFtUG9saWN5TmFtZShcblx0XHRcdHByb3BzLFxuXHRcdCl9LSR7YXdzUmVnaW9uQWJicn1gO1xuXG5cdFx0dGhpcy5pYW1Qb2xpY3kgPSBuZXcgTWFuYWdlZFBvbGljeSh0aGlzLCBcIkN1c3RvbUlhbVBvbGljeVwiLCB7XG5cdFx0XHRtYW5hZ2VkUG9saWN5TmFtZSxcblx0XHRcdHN0YXRlbWVudHM6IHByb3BzLnN0YXRlbWVudHMsXG5cdFx0XHRyb2xlczogcHJvcHMucm9sZXMsXG5cdFx0fSk7XG5cblx0XHRUYWdzLm9mKHRoaXMpLmFkZChcIk5hbWVcIiwgbWFuYWdlZFBvbGljeU5hbWUpO1xuXHRcdFRhZ3Mub2YodGhpcykuYWRkKFwiT3duZXJcIiwgcHJvcHMucmVzb3VyY2VPd25lcik7XG5cdFx0VGFncy5vZih0aGlzKS5hZGQoXCJFbnZpcm9ubWVudFwiLCBwcm9wcy5hd3NFbnZpcm9ubWVudCk7XG5cdH1cbn1cbiJdfQ==