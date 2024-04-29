import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { z } from "zod";
/**
 * CustomSecurityGroupSchema
 *
 * @param resourceName
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 */
export declare const CustomSecurityGroupSchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    resourceName: z.ZodString;
    awsEnvironment: z.ZodNativeEnum<typeof import("./utils").AwsEnvironment>;
    resourceOwner: z.ZodNativeEnum<typeof import("./utils").PulsifiTeam>;
}, "resourceName">, {
    resourceName: z.ZodString;
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
 * CustomSecurityGroupProps
 *
 * @param resourceName
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 */
export type CustomSecurityGroupProps = z.infer<typeof CustomSecurityGroupSchema>;
export declare class CustomSecurityGroupConstruct extends Construct {
    readonly securityGroupName: string;
    readonly securityGroup: SecurityGroup;
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
    constructor(scope: Construct, id: string, props: CustomSecurityGroupProps);
}
