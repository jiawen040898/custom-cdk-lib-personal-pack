import { Construct, type IConstruct } from "constructs";
import { z } from "zod";
import { AwsEnvironment, PulsifiTeam } from "./utils";
/**
 * CustomResourceTagSchema
 *
 * @param resourceName
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 */
export declare const CustomResourceTagSchema: z.ZodObject<{
    resourceName: z.ZodString;
    awsEnvironment: z.ZodNativeEnum<typeof AwsEnvironment>;
    resourceOwner: z.ZodNativeEnum<typeof PulsifiTeam>;
}, "strip", z.ZodTypeAny, {
    resourceName: string;
    awsEnvironment: AwsEnvironment;
    resourceOwner: PulsifiTeam;
}, {
    resourceName: string;
    awsEnvironment: AwsEnvironment;
    resourceOwner: PulsifiTeam;
}>;
/**
 * CustomResourceTagProps
 *
 * @param resourceName
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param construct
 */
export type CustomResourceTagProps = z.infer<typeof CustomResourceTagSchema> & {
    construct: IConstruct;
};
export declare class CustomResourceTagConstruct extends Construct {
    /**
     * CustomResourceTagConstruct
     *
     * @param scope
     * @param id
     * @param props {@link CustomResourceTagProps}
     */
    constructor(scope: Construct, id: string, props: CustomResourceTagProps);
}
