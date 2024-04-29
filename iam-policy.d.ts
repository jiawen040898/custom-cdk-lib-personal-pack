import { type IRole, ManagedPolicy, type PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { z } from "zod";
/**
 * CustomIamPolicySchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @prop resourceName
 */
export declare const CustomIamPolicySchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    resourceName: z.ZodString;
    awsEnvironment: z.ZodNativeEnum<typeof import("./utils").AwsEnvironment>;
    resourceOwner: z.ZodNativeEnum<typeof import("./utils").PulsifiTeam>;
}, "resourceName">, {
    resourceName: z.ZodEffects<z.ZodString, string, string>;
}>, "strip", z.ZodTypeAny, {
    resourceName: string;
    awsEnvironment: import("./utils").AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
}, {
    resourceName: string;
    awsEnvironment: import("./utils").AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
}>;
/**
 * CustomIamPolicyProps
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @prop resourceName
 */
export type CustomIamPolicyProps = z.infer<typeof CustomIamPolicySchema> & {
    roles: IRole[];
    statements: PolicyStatement[];
};
/**
 * generateIamPolicyName
 *
 * @param props {@link CustomIamPolicyProps}
 * @returns output: (example: demo-api-policy)
 */
export declare const generateIamPolicyName: (props: CustomIamPolicyProps) => string;
/**
 * verifyRoleCount
 *
 * Checks role field is not empty
 *
 * @param props {@link CustomIamPolicyProps}
 */
export declare const verifyRoleCount: (props: CustomIamPolicyProps) => void;
/**
 * verifyStatementCount
 *
 * Checks policy field is not empty
 *
 * @param props {@link CustomIamPolicyProps}
 */
export declare const verifyStatementCount: (props: CustomIamPolicyProps) => void;
export declare class CustomIamPolicyConstruct extends Construct {
    readonly iamPolicy: ManagedPolicy;
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
    constructor(scope: Construct, id: string, props: CustomIamPolicyProps);
}
