import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { z } from "zod";
import { AwsEnvironment } from "./utils";
/**
 * CustomStateMachineLogGroupSchema
 *
 * Properties for a customised LogGroup \
 * removalPolicy with default RemovalPolicy.RETAIN
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param stateMachineName
 * @param removalPolicy {@link RemovalPolicy}
 */
export declare const CustomStateMachineLogGroupSchema: z.ZodObject<Omit<z.objectUtil.extendShape<{
    resourceName: z.ZodString;
    awsEnvironment: z.ZodNativeEnum<typeof AwsEnvironment>;
    resourceOwner: z.ZodNativeEnum<typeof import("./utils").PulsifiTeam>;
}, {
    stateMachineName: z.ZodString;
    removalPolicy: z.ZodOptional<z.ZodNativeEnum<typeof RemovalPolicy>>;
}>, "resourceName">, "strip", z.ZodTypeAny, {
    awsEnvironment: AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
    stateMachineName: string;
    removalPolicy?: RemovalPolicy | undefined;
}, {
    awsEnvironment: AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
    stateMachineName: string;
    removalPolicy?: RemovalPolicy | undefined;
}>;
/**
 * CustomStateMachineLogGroupProps
 *
 * Properties for a customised LogGroup
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param stateMachineName
 * @param removalPolicy {@link RemovalPolicy}
 */
export type CustomStateMachineLogGroupProps = z.infer<typeof CustomStateMachineLogGroupSchema>;
export declare class CustomStateMachineLogGroupConstruct extends Construct {
    readonly logGroup: LogGroup;
    /**
     * CustomStateMachineLogGroupConstruct \
     *
     * CAUTION!!! \
     * Please choose the Log Group removalPolicy wisely. \
     * RETAIN = log group will remain if cdk destroy, Change stateMachineName for next deploy to avoid stackrollback \
     * DESTROY = log group will delete once cdk destroy
     *
     * @readonly logGroup
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomApiLogGroupProps}
     */
    constructor(scope: Construct, id: string, props: CustomStateMachineLogGroupProps);
}
