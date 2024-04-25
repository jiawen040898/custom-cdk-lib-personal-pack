import { z } from "zod";
import { type CustomZodResponse } from "./utils";
/**
 * CustomIamPolicySchema
 *
 * @prop resourceName
 * @prop awsRegion please use valid values from {@link AwsRegion}
 */
export declare const CustomIamPolicySchema: z.ZodObject<{
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
 * CustomIamPolicyProps
 *
 * @prop resourceName
 * @prop awsRegion please use valid values from {@link AwsRegion}
 */
export type CustomIamPolicyProps = z.infer<typeof CustomIamPolicySchema>;
/**
 * verifyCustomIamPolicySchema
 *
 * @param props {@link CustomIamPolicyProps}
 * @returns output {@link CustomZodResponse}
 */
export declare const verifyCustomIamPolicySchema: (props: CustomIamPolicyProps) => CustomZodResponse;
/**
 * generateIamPolicyName
 *
 * @param props {@link CustomIamPolicyProps}
 * @returns output: (example: demo-api-policy-de)
 */
export declare const generateIamPolicyName: (props: CustomIamPolicyProps) => string;
