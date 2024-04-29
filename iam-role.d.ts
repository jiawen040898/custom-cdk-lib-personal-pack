import { type CompositePrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { z } from "zod";
/**
 * CustomIamRoleSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @prop resourceName
 */
export declare const CustomIamRoleSchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
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
 * CustomIamRoleProps
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @prop resourceName
 */
export type CustomIamRoleProps = z.infer<typeof CustomIamRoleSchema> & {
    assumedBy: CompositePrincipal;
};
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
export declare const generateIamRoleName: (props: CustomIamRoleProps) => string;
export declare class CustomIamRoleConstruct extends Construct {
    readonly iamRole: Role;
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
    constructor(scope: Construct, id: string, props: CustomIamRoleProps);
}
