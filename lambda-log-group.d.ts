import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { z } from "zod";
import { AwsEnvironment, type CustomZodResponse } from "./utils";
/**
 * CustomLambdaLogGroupSchema
 *
 * Properties for a customised LogGroup
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param lambdaName
 * @param removalPolicy {@link RemovalPolicy}
 */
export declare const CustomLambdaLogGroupSchema: z.ZodObject<Omit<z.objectUtil.extendShape<{
    resourceName: z.ZodString;
    awsEnvironment: z.ZodNativeEnum<typeof AwsEnvironment>;
    resourceOwner: z.ZodNativeEnum<typeof import("./utils").PulsifiTeam>;
}, {
    lambdaName: z.ZodString;
    removalPolicy: z.ZodOptional<z.ZodNativeEnum<typeof RemovalPolicy>>;
}>, "resourceName">, "strip", z.ZodTypeAny, {
    awsEnvironment: AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
    lambdaName: string;
    removalPolicy?: RemovalPolicy | undefined;
}, {
    awsEnvironment: AwsEnvironment;
    resourceOwner: import("./utils").PulsifiTeam;
    lambdaName: string;
    removalPolicy?: RemovalPolicy | undefined;
}>;
/**
 * CustomLambdaLogGroupProps
 *
 * Properties for a customised LogGroup
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param lambdaName
 * @param removalPolicy {@link RemovalPolicy}
 */
export type CustomLambdaLogGroupProps = z.infer<typeof CustomLambdaLogGroupSchema>;
/**
 * verifyCustomLambdaLogGroupSchema
 *
 * @param props {@link CustomLambdaLogGroupProps}
 * @returns output {@link CustomZodResponse}
 */
export declare const verifyCustomLambdaLogGroupSchema: (props: CustomLambdaLogGroupProps) => CustomZodResponse;
export declare class CustomLambdaLogGroupConstruct extends Construct {
    readonly logGroup: LogGroup;
    /**
     * CustomLambdaLogGroupConstruct \
     *
     * CAUTION!!! \
     * Please choose the Log Group removalPolicy wisely. \
     * RETAIN = log group will remain if cdk destroy, Change lambdaName for next deploy to avoid stackrollback \
     * DESTROY = log group will delete once cdk destroy
     *
     * @readonly logGroup
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomLambdaLogGroupProps}
     */
    constructor(scope: Construct, id: string, props: CustomLambdaLogGroupProps);
}
