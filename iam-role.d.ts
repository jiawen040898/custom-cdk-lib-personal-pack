import { z } from "zod";
import { type CustomZodResponse } from "./utils";
/**
 * CustomIamRoleSchema
 *
 * @prop resourceName
 * @prop awsRegion: please use valid values from {@link AwsRegion}
 */
export declare const CustomIamRoleSchema: z.ZodObject<{
    resourceName: z.ZodEffects<z.ZodString, string, string>;
    awsRegion: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    resourceName: string;
    awsRegion: string;
}, {
    resourceName: string;
    awsRegion: string;
}>;
/**
 * CustomIamRoleProps
 *
 * @prop resourceName
 * @prop awsRegion please use valid values from {@link AwsRegion}
 */
export type CustomIamRoleProps = z.infer<typeof CustomIamRoleSchema>;
/**
 * verifyCustomIamRoleSchema
 *
 * @param props {@link CustomIamRoleProps}
 * @returns output {@link CustomZodResponse}
 */
export declare const verifyCustomIamRoleSchema: (props: CustomIamRoleProps) => CustomZodResponse;
/**
 * generateIamRoleName
 *
 * @param props {@link CustomIamRoleProps}
 * @returns output: (example: demo-api-role-de)
 */
export declare const generateIamRoleName: (props: CustomIamRoleProps) => string;
