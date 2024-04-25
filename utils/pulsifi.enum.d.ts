/**
 * AwsEnvironment
 *
 * Keys: SANDBOX, STAGING, PRODUCTION
 */
export declare enum AwsEnvironment {
    SANDBOX = "sandbox",
    STAGING = "staging",
    PRODUCTION = "production"
}
/**
 * AwsRegion
 *
 * Keys: GLOBAL_REGION, PRIMARY_REGION, SECONDARY_REGION
 */
export declare enum AwsRegion {
    GLOBAL_REGION = "us-east-1",
    PRIMARY_REGION = "ap-southeast-1",
    SECONDARY_REGION = "eu-central-1"
}
/**
 * PulsifiTeam
 *
 * Keys: DEVOPS, ENGINEERING, DE, DS
 */
export declare enum PulsifiTeam {
    DEVOPS = "devops@pulsifi.me",
    ENGINEERING = "dev-team@pulsifi.me",
    DE = "de-team@pulsifi.me",
    DS = "ds-team@pulsifi.me"
}
/**
 * PulsifiCdkError
 *
 * Keys: \
 * - INVALID_REGION_ABBRV_ERROR, \
 * - NON_KEBAB_CASE \
 * - INVALID_AWS_REGION
 */
export declare enum PulsifiCustomCdkError {
    INVALID_REGION_ABBRV = "Invalid AwsRegion provided",
    NON_KEBAB_CASE = "resourceName: kebab-case format",
    INVALID_AWS_REGION = "Invalid aws region"
}
