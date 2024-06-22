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
 * Keys: GLOBAL_REGION, PRIMARY_REGION, DE, ID
 */
export declare enum AwsRegion {
    GLOBAL_REGION = "us-east-1",
    PRIMARY_REGION = "ap-southeast-1",
    DE = "eu-central-1",
    ID = "ap-southeast-3"
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
export type EcsPropertyFields = "period" | "evaluationPeriods" | "dlqEvaluationPeriods" | "datapointsToAlarm" | "dlqDatapointsToAlarm" | "highMemoryThreshold" | "lowMemoryThreshold" | "highVcpuThreshold" | "lowVcpuThreshold";
export declare const EcsProperties: Record<EcsPropertyFields, number>;
