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
    getAwsRegionAbbrv: (awsRegion: string) => string;
    getAwsRegionEnumValues: (awsRegion: string) => string;
}
