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
 * - INVALID_REGION_ABBRV_ERROR, \
 * - NON_KEBAB_CASE \
 * - INVALID_AWS_REGION
 */
var PulsifiCustomCdkError;
(function (PulsifiCustomCdkError) {
    PulsifiCustomCdkError["INVALID_REGION_ABBRV"] = "Invalid AwsRegion provided";
    PulsifiCustomCdkError["NON_KEBAB_CASE"] = "resourceName: kebab-case format";
    PulsifiCustomCdkError["INVALID_AWS_REGION"] = "Invalid aws region";
})(PulsifiCustomCdkError || (exports.PulsifiCustomCdkError = PulsifiCustomCdkError = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsc2lmaS5lbnVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL3V0aWxzL3B1bHNpZmkuZW51bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3pCLHFDQUFtQixDQUFBO0lBQ25CLHFDQUFtQixDQUFBO0lBQ25CLDJDQUF5QixDQUFBO0FBQzFCLENBQUMsRUFKVyxjQUFjLDhCQUFkLGNBQWMsUUFJekI7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxTQUlYO0FBSkQsV0FBWSxTQUFTO0lBQ3BCLHdDQUEyQixDQUFBO0lBQzNCLDhDQUFpQyxDQUFBO0lBQ2pDLDhDQUFpQyxDQUFBO0FBQ2xDLENBQUMsRUFKVyxTQUFTLHlCQUFULFNBQVMsUUFJcEI7QUFFRDs7OztHQUlHO0FBQ0gsSUFBWSxXQUtYO0FBTEQsV0FBWSxXQUFXO0lBQ3RCLDJDQUE0QixDQUFBO0lBQzVCLGtEQUFtQyxDQUFBO0lBQ25DLHdDQUF5QixDQUFBO0lBQ3pCLHdDQUF5QixDQUFBO0FBQzFCLENBQUMsRUFMVyxXQUFXLDJCQUFYLFdBQVcsUUFLdEI7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsSUFBWSxxQkFJWDtBQUpELFdBQVkscUJBQXFCO0lBQ2hDLDRFQUFtRCxDQUFBO0lBQ25ELDJFQUFrRCxDQUFBO0lBQ2xELGtFQUF5QyxDQUFBO0FBQzFDLENBQUMsRUFKVyxxQkFBcUIscUNBQXJCLHFCQUFxQixRQUloQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQXdzRW52aXJvbm1lbnRcbiAqXG4gKiBLZXlzOiBTQU5EQk9YLCBTVEFHSU5HLCBQUk9EVUNUSU9OXG4gKi9cbmV4cG9ydCBlbnVtIEF3c0Vudmlyb25tZW50IHtcblx0U0FOREJPWCA9IFwic2FuZGJveFwiLFxuXHRTVEFHSU5HID0gXCJzdGFnaW5nXCIsXG5cdFBST0RVQ1RJT04gPSBcInByb2R1Y3Rpb25cIixcbn1cblxuLyoqXG4gKiBBd3NSZWdpb25cbiAqXG4gKiBLZXlzOiBHTE9CQUxfUkVHSU9OLCBQUklNQVJZX1JFR0lPTiwgU0VDT05EQVJZX1JFR0lPTlxuICovXG5leHBvcnQgZW51bSBBd3NSZWdpb24ge1xuXHRHTE9CQUxfUkVHSU9OID0gXCJ1cy1lYXN0LTFcIixcblx0UFJJTUFSWV9SRUdJT04gPSBcImFwLXNvdXRoZWFzdC0xXCIsXG5cdFNFQ09OREFSWV9SRUdJT04gPSBcImV1LWNlbnRyYWwtMVwiLFxufVxuXG4vKipcbiAqIFB1bHNpZmlUZWFtXG4gKlxuICogS2V5czogREVWT1BTLCBFTkdJTkVFUklORywgREUsIERTXG4gKi9cbmV4cG9ydCBlbnVtIFB1bHNpZmlUZWFtIHtcblx0REVWT1BTID0gXCJkZXZvcHNAcHVsc2lmaS5tZVwiLFxuXHRFTkdJTkVFUklORyA9IFwiZGV2LXRlYW1AcHVsc2lmaS5tZVwiLFxuXHRERSA9IFwiZGUtdGVhbUBwdWxzaWZpLm1lXCIsXG5cdERTID0gXCJkcy10ZWFtQHB1bHNpZmkubWVcIixcbn1cblxuLyoqXG4gKiBQdWxzaWZpQ2RrRXJyb3JcbiAqXG4gKiBLZXlzOiBcXFxuICogLSBJTlZBTElEX1JFR0lPTl9BQkJSVl9FUlJPUiwgXFxcbiAqIC0gTk9OX0tFQkFCX0NBU0UgXFxcbiAqIC0gSU5WQUxJRF9BV1NfUkVHSU9OXG4gKi9cbmV4cG9ydCBlbnVtIFB1bHNpZmlDdXN0b21DZGtFcnJvciB7XG5cdElOVkFMSURfUkVHSU9OX0FCQlJWID0gXCJJbnZhbGlkIEF3c1JlZ2lvbiBwcm92aWRlZFwiLFxuXHROT05fS0VCQUJfQ0FTRSA9IFwicmVzb3VyY2VOYW1lOiBrZWJhYi1jYXNlIGZvcm1hdFwiLFxuXHRJTlZBTElEX0FXU19SRUdJT04gPSBcIkludmFsaWQgYXdzIHJlZ2lvblwiLFxufVxuIl19