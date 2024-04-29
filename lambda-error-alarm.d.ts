import type { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import type { z } from "zod";
/**
 * CustomLambdaErrorAlarmSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 */
export declare const CustomLambdaErrorAlarmSchema: z.ZodObject<Omit<{
    resourceName: z.ZodString;
    awsEnvironment: z.ZodNativeEnum<typeof import("./utils").AwsEnvironment>;
    resourceOwner: z.ZodNativeEnum<typeof import("./utils").PulsifiTeam>;
}, "resourceName">, "strip", z.ZodTypeAny, {
    awsEnvironment: import("./utils").AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
}, {
    awsEnvironment: import("./utils").AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
}>;
/**
 * CustomErrorAlarmProps
 *
 * Error alarm to be used by the following lambda
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param lambda {@link NodejsFunction}
 */
export type CustomLambdaErrorAlarmProps = z.infer<typeof CustomLambdaErrorAlarmSchema> & {
    lambda: NodejsFunction;
};
export declare class CustomLambdaErrorAlarmConstruct extends Construct {
    /**
     * CustomLambdaErrorAlarmConstruct
     *
     * For AWS region, it will read from environment variable CDK_DEPLOY_REGION or CDK_DEFAULT_REGION.
     * For AWS account ID, it will read from environment variable CDK_DEPLOY_ACCOUNT or CDK_DEFAULT_ACCOUNT
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomLambdaErrorAlarmProps}
     */
    constructor(scope: Construct, id: string, props: CustomLambdaErrorAlarmProps);
}
