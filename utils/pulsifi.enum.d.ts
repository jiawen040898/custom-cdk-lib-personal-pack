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
 * - NON_KEBAB_CASE \
 * - INVALID_AWS_REGION
 */
export declare enum PulsifiCustomCdkError {
    NON_KEBAB_CASE = "resourceName: kebab-case format",
    INVALID_AWS_REGION = "Invalid aws region",
    IAM_POLICY_INVALID_ROLES = "Please include role(s)",
    IAM_POLICY_INVALID_STATEMENTS = "Please include iam policy statement(s)"
}
