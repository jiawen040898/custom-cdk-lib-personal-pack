"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsProperties = exports.PulsifiCustomCdkError = exports.PulsifiTeam = exports.AwsRegion = exports.AwsEnvironment = void 0;
/**
 * AwsEnvironment
 *
 * Keys: SANDBOX, STAGING, PRODUCTION
 */
var AwsEnvironment;
(function (AwsEnvironment) {
    AwsEnvironment["SANDBOX"] = "sandbox";
    AwsEnvironment["STAGING"] = "staging";
    AwsEnvironment["PRODUCTION"] = "production";
})(AwsEnvironment || (exports.AwsEnvironment = AwsEnvironment = {}));
/**
 * AwsRegion
 *
 * Keys: GLOBAL_REGION, PRIMARY_REGION, DE, ID
 */
var AwsRegion;
(function (AwsRegion) {
    AwsRegion["GLOBAL_REGION"] = "us-east-1";
    AwsRegion["PRIMARY_REGION"] = "ap-southeast-1";
    AwsRegion["DE"] = "eu-central-1";
    AwsRegion["ID"] = "ap-southeast-3";
})(AwsRegion || (exports.AwsRegion = AwsRegion = {}));
/**
 * PulsifiTeam
 *
 * Keys: DEVOPS, ENGINEERING, DE, DS
 */
var PulsifiTeam;
(function (PulsifiTeam) {
    PulsifiTeam["DEVOPS"] = "devops@pulsifi.me";
    PulsifiTeam["ENGINEERING"] = "dev-team@pulsifi.me";
    PulsifiTeam["DE"] = "de-team@pulsifi.me";
    PulsifiTeam["DS"] = "ds-team@pulsifi.me";
})(PulsifiTeam || (exports.PulsifiTeam = PulsifiTeam = {}));
/**
 * PulsifiCdkError
 *
 * Keys: \
 * - NON_KEBAB_CASE \
 * - INVALID_AWS_REGION
 */
var PulsifiCustomCdkError;
(function (PulsifiCustomCdkError) {
    PulsifiCustomCdkError["NON_KEBAB_CASE"] = "resourceName: kebab-case format";
    PulsifiCustomCdkError["INVALID_AWS_REGION"] = "Invalid aws region";
    PulsifiCustomCdkError["IAM_POLICY_INVALID_ROLES"] = "Please include role(s)";
    PulsifiCustomCdkError["IAM_POLICY_INVALID_STATEMENTS"] = "Please include iam policy statement(s)";
})(PulsifiCustomCdkError || (exports.PulsifiCustomCdkError = PulsifiCustomCdkError = {}));
exports.EcsProperties = {
    period: 60,
    evaluationPeriods: 5,
    dlqEvaluationPeriods: 1,
    datapointsToAlarm: 3,
    dlqDatapointsToAlarm: 1,
    highMemoryThreshold: 85,
    lowMemoryThreshold: 58.5,
    highVcpuThreshold: 70,
    lowVcpuThreshold: 50,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsc2lmaS5lbnVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3B1bHNpZmkuZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3pCLHFDQUFtQixDQUFBO0lBQ25CLHFDQUFtQixDQUFBO0lBQ25CLDJDQUF5QixDQUFBO0FBQzFCLENBQUMsRUFKVyxjQUFjLDhCQUFkLGNBQWMsUUFJekI7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxTQUtYO0FBTEQsV0FBWSxTQUFTO0lBQ3BCLHdDQUEyQixDQUFBO0lBQzNCLDhDQUFpQyxDQUFBO0lBQ2pDLGdDQUFtQixDQUFBO0lBQ25CLGtDQUFxQixDQUFBO0FBQ3RCLENBQUMsRUFMVyxTQUFTLHlCQUFULFNBQVMsUUFLcEI7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3RCLDJDQUE0QixDQUFBO0lBQzVCLGtEQUFtQyxDQUFBO0lBQ25DLHdDQUF5QixDQUFBO0lBQ3pCLHdDQUF5QixDQUFBO0FBQzFCLENBQUMsRUFMVyxXQUFXLDJCQUFYLFdBQVcsUUFLdEI7QUFFRDs7Ozs7O0dBTUc7QUFDSCxJQUFZLHFCQUtYO0FBTEQsV0FBWSxxQkFBcUI7SUFDaEMsMkVBQWtELENBQUE7SUFDbEQsa0VBQXlDLENBQUE7SUFDekMsNEVBQW1ELENBQUE7SUFDbkQsaUdBQXdFLENBQUE7QUFDekUsQ0FBQyxFQUxXLHFCQUFxQixxQ0FBckIscUJBQXFCLFFBS2hDO0FBYVksUUFBQSxhQUFhLEdBQXNDO0lBQy9ELE1BQU0sRUFBRSxFQUFFO0lBQ1YsaUJBQWlCLEVBQUUsQ0FBQztJQUNwQixvQkFBb0IsRUFBRSxDQUFDO0lBQ3ZCLGlCQUFpQixFQUFFLENBQUM7SUFDcEIsb0JBQW9CLEVBQUUsQ0FBQztJQUN2QixtQkFBbUIsRUFBRSxFQUFFO0lBQ3ZCLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsaUJBQWlCLEVBQUUsRUFBRTtJQUNyQixnQkFBZ0IsRUFBRSxFQUFFO0NBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEF3c0Vudmlyb25tZW50XG4gKlxuICogS2V5czogU0FOREJPWCwgU1RBR0lORywgUFJPRFVDVElPTlxuICovXG5leHBvcnQgZW51bSBBd3NFbnZpcm9ubWVudCB7XG5cdFNBTkRCT1ggPSBcInNhbmRib3hcIixcblx0U1RBR0lORyA9IFwic3RhZ2luZ1wiLFxuXHRQUk9EVUNUSU9OID0gXCJwcm9kdWN0aW9uXCIsXG59XG5cbi8qKlxuICogQXdzUmVnaW9uXG4gKlxuICogS2V5czogR0xPQkFMX1JFR0lPTiwgUFJJTUFSWV9SRUdJT04sIERFLCBJRFxuICovXG5leHBvcnQgZW51bSBBd3NSZWdpb24ge1xuXHRHTE9CQUxfUkVHSU9OID0gXCJ1cy1lYXN0LTFcIixcblx0UFJJTUFSWV9SRUdJT04gPSBcImFwLXNvdXRoZWFzdC0xXCIsXG5cdERFID0gXCJldS1jZW50cmFsLTFcIixcblx0SUQgPSBcImFwLXNvdXRoZWFzdC0zXCIsXG59XG5cbi8qKlxuICogUHVsc2lmaVRlYW1cbiAqXG4gKiBLZXlzOiBERVZPUFMsIEVOR0lORUVSSU5HLCBERSwgRFNcbiAqL1xuZXhwb3J0IGVudW0gUHVsc2lmaVRlYW0ge1xuXHRERVZPUFMgPSBcImRldm9wc0BwdWxzaWZpLm1lXCIsXG5cdEVOR0lORUVSSU5HID0gXCJkZXYtdGVhbUBwdWxzaWZpLm1lXCIsXG5cdERFID0gXCJkZS10ZWFtQHB1bHNpZmkubWVcIixcblx0RFMgPSBcImRzLXRlYW1AcHVsc2lmaS5tZVwiLFxufVxuXG4vKipcbiAqIFB1bHNpZmlDZGtFcnJvclxuICpcbiAqIEtleXM6IFxcXG4gKiAtIE5PTl9LRUJBQl9DQVNFIFxcXG4gKiAtIElOVkFMSURfQVdTX1JFR0lPTlxuICovXG5leHBvcnQgZW51bSBQdWxzaWZpQ3VzdG9tQ2RrRXJyb3Ige1xuXHROT05fS0VCQUJfQ0FTRSA9IFwicmVzb3VyY2VOYW1lOiBrZWJhYi1jYXNlIGZvcm1hdFwiLFxuXHRJTlZBTElEX0FXU19SRUdJT04gPSBcIkludmFsaWQgYXdzIHJlZ2lvblwiLFxuXHRJQU1fUE9MSUNZX0lOVkFMSURfUk9MRVMgPSBcIlBsZWFzZSBpbmNsdWRlIHJvbGUocylcIixcblx0SUFNX1BPTElDWV9JTlZBTElEX1NUQVRFTUVOVFMgPSBcIlBsZWFzZSBpbmNsdWRlIGlhbSBwb2xpY3kgc3RhdGVtZW50KHMpXCIsXG59XG5cbmV4cG9ydCB0eXBlIEVjc1Byb3BlcnR5RmllbGRzID1cblx0fCBcInBlcmlvZFwiXG5cdHwgXCJldmFsdWF0aW9uUGVyaW9kc1wiXG5cdHwgXCJkbHFFdmFsdWF0aW9uUGVyaW9kc1wiXG5cdHwgXCJkYXRhcG9pbnRzVG9BbGFybVwiXG5cdHwgXCJkbHFEYXRhcG9pbnRzVG9BbGFybVwiXG5cdHwgXCJoaWdoTWVtb3J5VGhyZXNob2xkXCJcblx0fCBcImxvd01lbW9yeVRocmVzaG9sZFwiXG5cdHwgXCJoaWdoVmNwdVRocmVzaG9sZFwiXG5cdHwgXCJsb3dWY3B1VGhyZXNob2xkXCI7XG5cbmV4cG9ydCBjb25zdCBFY3NQcm9wZXJ0aWVzOiBSZWNvcmQ8RWNzUHJvcGVydHlGaWVsZHMsIG51bWJlcj4gPSB7XG5cdHBlcmlvZDogNjAsXG5cdGV2YWx1YXRpb25QZXJpb2RzOiA1LFxuXHRkbHFFdmFsdWF0aW9uUGVyaW9kczogMSxcblx0ZGF0YXBvaW50c1RvQWxhcm06IDMsXG5cdGRscURhdGFwb2ludHNUb0FsYXJtOiAxLFxuXHRoaWdoTWVtb3J5VGhyZXNob2xkOiA4NSxcblx0bG93TWVtb3J5VGhyZXNob2xkOiA1OC41LFxuXHRoaWdoVmNwdVRocmVzaG9sZDogNzAsXG5cdGxvd1ZjcHVUaHJlc2hvbGQ6IDUwLFxufTtcbiJdfQ==