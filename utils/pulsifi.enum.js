"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulsifiCustomCdkError = exports.PulsifiTeam = exports.AwsRegion = exports.AwsEnvironment = void 0;
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
 * Keys: GLOBAL_REGION, PRIMARY_REGION, SECONDARY_REGION
 */
var AwsRegion;
(function (AwsRegion) {
    AwsRegion["GLOBAL_REGION"] = "us-east-1";
    AwsRegion["PRIMARY_REGION"] = "ap-southeast-1";
    AwsRegion["SECONDARY_REGION"] = "eu-central-1";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsc2lmaS5lbnVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3B1bHNpZmkuZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3pCLHFDQUFtQixDQUFBO0lBQ25CLHFDQUFtQixDQUFBO0lBQ25CLDJDQUF5QixDQUFBO0FBQzFCLENBQUMsRUFKVyxjQUFjLDhCQUFkLGNBQWMsUUFJekI7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxTQUlYO0FBSkQsV0FBWSxTQUFTO0lBQ3BCLHdDQUEyQixDQUFBO0lBQzNCLDhDQUFpQyxDQUFBO0lBQ2pDLDhDQUFpQyxDQUFBO0FBQ2xDLENBQUMsRUFKVyxTQUFTLHlCQUFULFNBQVMsUUFJcEI7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3RCLDJDQUE0QixDQUFBO0lBQzVCLGtEQUFtQyxDQUFBO0lBQ25DLHdDQUF5QixDQUFBO0lBQ3pCLHdDQUF5QixDQUFBO0FBQzFCLENBQUMsRUFMVyxXQUFXLDJCQUFYLFdBQVcsUUFLdEI7QUFFRDs7Ozs7O0dBTUc7QUFDSCxJQUFZLHFCQUtYO0FBTEQsV0FBWSxxQkFBcUI7SUFDaEMsMkVBQWtELENBQUE7SUFDbEQsa0VBQXlDLENBQUE7SUFDekMsNEVBQW1ELENBQUE7SUFDbkQsaUdBQXdFLENBQUE7QUFDekUsQ0FBQyxFQUxXLHFCQUFxQixxQ0FBckIscUJBQXFCLFFBS2hDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBd3NFbnZpcm9ubWVudFxuICpcbiAqIEtleXM6IFNBTkRCT1gsIFNUQUdJTkcsIFBST0RVQ1RJT05cbiAqL1xuZXhwb3J0IGVudW0gQXdzRW52aXJvbm1lbnQge1xuXHRTQU5EQk9YID0gXCJzYW5kYm94XCIsXG5cdFNUQUdJTkcgPSBcInN0YWdpbmdcIixcblx0UFJPRFVDVElPTiA9IFwicHJvZHVjdGlvblwiLFxufVxuXG4vKipcbiAqIEF3c1JlZ2lvblxuICpcbiAqIEtleXM6IEdMT0JBTF9SRUdJT04sIFBSSU1BUllfUkVHSU9OLCBTRUNPTkRBUllfUkVHSU9OXG4gKi9cbmV4cG9ydCBlbnVtIEF3c1JlZ2lvbiB7XG5cdEdMT0JBTF9SRUdJT04gPSBcInVzLWVhc3QtMVwiLFxuXHRQUklNQVJZX1JFR0lPTiA9IFwiYXAtc291dGhlYXN0LTFcIixcblx0U0VDT05EQVJZX1JFR0lPTiA9IFwiZXUtY2VudHJhbC0xXCIsXG59XG5cbi8qKlxuICogUHVsc2lmaVRlYW1cbiAqXG4gKiBLZXlzOiBERVZPUFMsIEVOR0lORUVSSU5HLCBERSwgRFNcbiAqL1xuZXhwb3J0IGVudW0gUHVsc2lmaVRlYW0ge1xuXHRERVZPUFMgPSBcImRldm9wc0BwdWxzaWZpLm1lXCIsXG5cdEVOR0lORUVSSU5HID0gXCJkZXYtdGVhbUBwdWxzaWZpLm1lXCIsXG5cdERFID0gXCJkZS10ZWFtQHB1bHNpZmkubWVcIixcblx0RFMgPSBcImRzLXRlYW1AcHVsc2lmaS5tZVwiLFxufVxuXG4vKipcbiAqIFB1bHNpZmlDZGtFcnJvclxuICpcbiAqIEtleXM6IFxcXG4gKiAtIE5PTl9LRUJBQl9DQVNFIFxcXG4gKiAtIElOVkFMSURfQVdTX1JFR0lPTlxuICovXG5leHBvcnQgZW51bSBQdWxzaWZpQ3VzdG9tQ2RrRXJyb3Ige1xuXHROT05fS0VCQUJfQ0FTRSA9IFwicmVzb3VyY2VOYW1lOiBrZWJhYi1jYXNlIGZvcm1hdFwiLFxuXHRJTlZBTElEX0FXU19SRUdJT04gPSBcIkludmFsaWQgYXdzIHJlZ2lvblwiLFxuXHRJQU1fUE9MSUNZX0lOVkFMSURfUk9MRVMgPSBcIlBsZWFzZSBpbmNsdWRlIHJvbGUocylcIixcblx0SUFNX1BPTElDWV9JTlZBTElEX1NUQVRFTUVOVFMgPSBcIlBsZWFzZSBpbmNsdWRlIGlhbSBwb2xpY3kgc3RhdGVtZW50KHMpXCIsXG59XG4iXX0=