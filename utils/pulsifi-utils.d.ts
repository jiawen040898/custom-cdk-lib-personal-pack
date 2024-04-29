import type { z } from "zod";
import { AwsEnvironment } from "./pulsifi.enum";
/**
 * CustomZodResponse
 *
 * @param success
 * @param message
 */
export type CustomZodResponse = {
    success: boolean;
    message?: z.ZodIssue[];
};
export declare class PulsifiUtils {
    /**
     * getAwsEnvironment
     *
     * @param awsEnvironment default AwsEnvironment.SANDBOX
     *
     * @returns output {@link AwsEnvironment}
     */
    getAwsEnvironment: (awsEnvironment: string) => AwsEnvironment;
    /**
     * getAwsRegionEnumValues
     * @param awsRegion
     * @returns enum reference ${@link AwsRegion}
     */
    getAwsRegionEnumValues: (awsRegion: string) => string;
    /**
     * verifyCustomSchema
     *
     * verifies Zod custom schemas such as CustomLambdaErrorAlarmSchema
     *
     * @param schema {@link z.Schema}
     * @param props
     * @returns
     */
    verifyCustomSchema: <TSchema extends z.ZodType<any, z.ZodTypeDef, any>, TProps>(schema: TSchema, props: TProps) => CustomZodResponse;
}
