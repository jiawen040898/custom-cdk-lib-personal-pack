"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIamRoleName = exports.verifyCustomIamRoleSchema = exports.CustomIamRoleSchema = void 0;
const lodash_1 = require("lodash");
const zod_1 = require("zod");
const utils_1 = require("./utils");
const utils = new utils_1.PulsifiUtils();
/**
 * CustomIamRoleSchema
 *
 * @prop resourceName
 * @prop awsRegion: please use valid values from {@link AwsRegion}
 */
exports.CustomIamRoleSchema = zod_1.z.object({
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
    awsRegion: zod_1.z
        .string()
        .min(1)
        .max(50)
        .refine((value) => {
        return utils.getAwsRegionEnumValues(value);
    }, utils_1.PulsifiCustomCdkError.INVALID_AWS_REGION),
});
/**
 * verifyCustomIamRoleSchema
 *
 * @param props {@link CustomIamRoleProps}
 * @returns output {@link CustomZodResponse}
 */
const verifyCustomIamRoleSchema = (props) => {
    const zodCheckOutput = exports.CustomIamRoleSchema.safeParse(props);
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
exports.verifyCustomIamRoleSchema = verifyCustomIamRoleSchema;
/**
 * generateIamRoleName
 *
 * @param props {@link CustomIamRoleProps}
 * @returns output: (example: demo-api-role-de)
 */
const generateIamRoleName = (props) => {
    const zodCheckOutput = (0, exports.verifyCustomIamRoleSchema)(props);
    if (!zodCheckOutput.success) {
        throw new Error(JSON.stringify(zodCheckOutput.message));
    }
    const formattedKebabCaseName = (0, lodash_1.kebabCase)(props.resourceName);
    const regionAbbrv = utils.getAwsRegionAbbrv(props.awsRegion);
    return `${formattedKebabCaseName}-role-${regionAbbrv}`;
};
exports.generateIamRoleName = generateIamRoleName;
function getAwsRegionEnum(value) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXJvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaWFtLXJvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLDZCQUF3QjtBQUN4QixtQ0FLaUI7QUFFakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxvQkFBWSxFQUFFLENBQUM7QUFFakM7Ozs7O0dBS0c7QUFDVSxRQUFBLG1CQUFtQixHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDM0MsWUFBWSxFQUFFLE9BQUM7U0FDYixNQUFNLEVBQUU7U0FDUixHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ04sR0FBRyxDQUFDLEVBQUUsQ0FBQztTQUNQLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQ2pCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUN0QixPQUFPLElBQUEsa0JBQVMsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWCxDQUFDLEVBQUUsNkJBQXFCLENBQUMsY0FBYyxDQUFDO0lBQ3pDLFNBQVMsRUFBRSxPQUFDO1NBQ1YsTUFBTSxFQUFFO1NBQ1IsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNOLEdBQUcsQ0FBQyxFQUFFLENBQUM7U0FDUCxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUNqQixPQUFPLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxDQUFDLEVBQUUsNkJBQXFCLENBQUMsa0JBQWtCLENBQUM7Q0FDN0MsQ0FBQyxDQUFDO0FBVUg7Ozs7O0dBS0c7QUFDSSxNQUFNLHlCQUF5QixHQUFHLENBQUMsS0FBeUIsRUFBRSxFQUFFO0lBQ3RFLE1BQU0sY0FBYyxHQUFHLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdCLE9BQU87WUFDTixPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU87WUFDL0IsT0FBTyxFQUFFLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTTtTQUNmLENBQUM7SUFDeEIsQ0FBQztJQUVELE9BQU87UUFDTixPQUFPLEVBQUUsY0FBYyxDQUFDLE9BQU87S0FDVixDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQVpXLFFBQUEseUJBQXlCLDZCQVlwQztBQUVGOzs7OztHQUtHO0FBQ0ksTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEtBQXlCLEVBQVUsRUFBRTtJQUN4RSxNQUFNLGNBQWMsR0FBRyxJQUFBLGlDQUF5QixFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxNQUFNLHNCQUFzQixHQUFHLElBQUEsa0JBQVMsRUFBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDN0QsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUU3RCxPQUFPLEdBQUcsc0JBQXNCLFNBQVMsV0FBVyxFQUFFLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBVlcsUUFBQSxtQkFBbUIsdUJBVTlCO0FBQ0YsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFhO0lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsga2ViYWJDYXNlIH0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7XG5cdEF3c1JlZ2lvbixcblx0dHlwZSBDdXN0b21ab2RSZXNwb25zZSxcblx0UHVsc2lmaVV0aWxzLFxuXHRQdWxzaWZpQ3VzdG9tQ2RrRXJyb3IsXG59IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IHV0aWxzID0gbmV3IFB1bHNpZmlVdGlscygpO1xuXG4vKipcbiAqIEN1c3RvbUlhbVJvbGVTY2hlbWFcbiAqXG4gKiBAcHJvcCByZXNvdXJjZU5hbWVcbiAqIEBwcm9wIGF3c1JlZ2lvbjogcGxlYXNlIHVzZSB2YWxpZCB2YWx1ZXMgZnJvbSB7QGxpbmsgQXdzUmVnaW9ufVxuICovXG5leHBvcnQgY29uc3QgQ3VzdG9tSWFtUm9sZVNjaGVtYSA9IHoub2JqZWN0KHtcblx0cmVzb3VyY2VOYW1lOiB6XG5cdFx0LnN0cmluZygpXG5cdFx0Lm1pbigxKVxuXHRcdC5tYXgoNTYpXG5cdFx0LnJlZmluZSgodmFsdWUpID0+IHtcblx0XHRcdGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJldHVybiBrZWJhYkNhc2UodmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fSwgUHVsc2lmaUN1c3RvbUNka0Vycm9yLk5PTl9LRUJBQl9DQVNFKSxcblx0YXdzUmVnaW9uOiB6XG5cdFx0LnN0cmluZygpXG5cdFx0Lm1pbigxKVxuXHRcdC5tYXgoNTApXG5cdFx0LnJlZmluZSgodmFsdWUpID0+IHtcblx0XHRcdHJldHVybiB1dGlscy5nZXRBd3NSZWdpb25FbnVtVmFsdWVzKHZhbHVlKTtcblx0XHR9LCBQdWxzaWZpQ3VzdG9tQ2RrRXJyb3IuSU5WQUxJRF9BV1NfUkVHSU9OKSxcbn0pO1xuXG4vKipcbiAqIEN1c3RvbUlhbVJvbGVQcm9wc1xuICpcbiAqIEBwcm9wIHJlc291cmNlTmFtZVxuICogQHByb3AgYXdzUmVnaW9uIHBsZWFzZSB1c2UgdmFsaWQgdmFsdWVzIGZyb20ge0BsaW5rIEF3c1JlZ2lvbn1cbiAqL1xuZXhwb3J0IHR5cGUgQ3VzdG9tSWFtUm9sZVByb3BzID0gei5pbmZlcjx0eXBlb2YgQ3VzdG9tSWFtUm9sZVNjaGVtYT47XG5cbi8qKlxuICogdmVyaWZ5Q3VzdG9tSWFtUm9sZVNjaGVtYVxuICpcbiAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tSWFtUm9sZVByb3BzfVxuICogQHJldHVybnMgb3V0cHV0IHtAbGluayBDdXN0b21ab2RSZXNwb25zZX1cbiAqL1xuZXhwb3J0IGNvbnN0IHZlcmlmeUN1c3RvbUlhbVJvbGVTY2hlbWEgPSAocHJvcHM6IEN1c3RvbUlhbVJvbGVQcm9wcykgPT4ge1xuXHRjb25zdCB6b2RDaGVja091dHB1dCA9IEN1c3RvbUlhbVJvbGVTY2hlbWEuc2FmZVBhcnNlKHByb3BzKTtcblx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHpvZENoZWNrT3V0cHV0LnN1Y2Nlc3MsXG5cdFx0XHRtZXNzYWdlOiB6b2RDaGVja091dHB1dC5lcnJvci5pc3N1ZXMsXG5cdFx0fSBhcyBDdXN0b21ab2RSZXNwb25zZTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0c3VjY2Vzczogem9kQ2hlY2tPdXRwdXQuc3VjY2Vzcyxcblx0fSBhcyBDdXN0b21ab2RSZXNwb25zZTtcbn07XG5cbi8qKlxuICogZ2VuZXJhdGVJYW1Sb2xlTmFtZVxuICpcbiAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tSWFtUm9sZVByb3BzfVxuICogQHJldHVybnMgb3V0cHV0OiAoZXhhbXBsZTogZGVtby1hcGktcm9sZS1kZSlcbiAqL1xuZXhwb3J0IGNvbnN0IGdlbmVyYXRlSWFtUm9sZU5hbWUgPSAocHJvcHM6IEN1c3RvbUlhbVJvbGVQcm9wcyk6IHN0cmluZyA9PiB7XG5cdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gdmVyaWZ5Q3VzdG9tSWFtUm9sZVNjaGVtYShwcm9wcyk7XG5cdGlmICghem9kQ2hlY2tPdXRwdXQuc3VjY2Vzcykge1xuXHRcdHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeSh6b2RDaGVja091dHB1dC5tZXNzYWdlKSk7XG5cdH1cblxuXHRjb25zdCBmb3JtYXR0ZWRLZWJhYkNhc2VOYW1lID0ga2ViYWJDYXNlKHByb3BzLnJlc291cmNlTmFtZSk7XG5cdGNvbnN0IHJlZ2lvbkFiYnJ2ID0gdXRpbHMuZ2V0QXdzUmVnaW9uQWJicnYocHJvcHMuYXdzUmVnaW9uKTtcblxuXHRyZXR1cm4gYCR7Zm9ybWF0dGVkS2ViYWJDYXNlTmFtZX0tcm9sZS0ke3JlZ2lvbkFiYnJ2fWA7XG59O1xuZnVuY3Rpb24gZ2V0QXdzUmVnaW9uRW51bSh2YWx1ZTogc3RyaW5nKTogdW5rbm93biB7XG5cdHRocm93IG5ldyBFcnJvcihcIkZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZC5cIik7XG59XG4iXX0=