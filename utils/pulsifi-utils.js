"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulsifiUtils = void 0;
const pulsifi_enum_1 = require("./pulsifi.enum");
class PulsifiUtils {
    constructor() {
        /**
         * getAwsEnvironment
         *
         * @param awsEnvironment default AwsEnvironment.SANDBOX
         *
         * @returns output {@link AwsEnvironment}
         */
        this.getAwsEnvironment = (awsEnvironment) => {
            if (awsEnvironment === pulsifi_enum_1.AwsEnvironment.PRODUCTION) {
                return pulsifi_enum_1.AwsEnvironment.PRODUCTION;
            }
            if (awsEnvironment === pulsifi_enum_1.AwsEnvironment.STAGING) {
                return pulsifi_enum_1.AwsEnvironment.STAGING;
            }
            return pulsifi_enum_1.AwsEnvironment.SANDBOX;
        };
        this.getAwsRegionAbbrv = (awsRegion) => {
            if (awsRegion === pulsifi_enum_1.AwsRegion.PRIMARY_REGION) {
                return "sg";
            }
            if (awsRegion === pulsifi_enum_1.AwsRegion.SECONDARY_REGION) {
                return "de";
            }
            throw new Error(pulsifi_enum_1.PulsifiCustomCdkError.INVALID_REGION_ABBRV);
        };
        this.getAwsRegionEnumValues = (awsRegion) => {
            const filteredResults = Object.values(pulsifi_enum_1.AwsRegion).filter((item) => {
                if (item === awsRegion) {
                    return item;
                }
                return null;
            });
            return filteredResults[0];
        };
    }
}
exports.PulsifiUtils = PulsifiUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsc2lmaS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9wdWxzaWZpLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUl3QjtBQWF4QixNQUFhLFlBQVk7SUFBekI7UUFDQzs7Ozs7O1dBTUc7UUFDSSxzQkFBaUIsR0FBRyxDQUFDLGNBQXNCLEVBQWtCLEVBQUU7WUFDckUsSUFBSSxjQUFjLEtBQUssNkJBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEQsT0FBTyw2QkFBYyxDQUFDLFVBQVUsQ0FBQztZQUNsQyxDQUFDO1lBRUQsSUFBSSxjQUFjLEtBQUssNkJBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDL0MsT0FBTyw2QkFBYyxDQUFDLE9BQU8sQ0FBQztZQUMvQixDQUFDO1lBRUQsT0FBTyw2QkFBYyxDQUFDLE9BQU8sQ0FBQztRQUMvQixDQUFDLENBQUM7UUFFSyxzQkFBaUIsR0FBRyxDQUFDLFNBQWlCLEVBQVUsRUFBRTtZQUN4RCxJQUFJLFNBQVMsS0FBSyx3QkFBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUM1QyxPQUFPLElBQUksQ0FBQztZQUNiLENBQUM7WUFFRCxJQUFJLFNBQVMsS0FBSyx3QkFBUyxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQzlDLE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQztZQUVELE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQXFCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUM7UUFFSywyQkFBc0IsR0FBRyxDQUFDLFNBQWlCLEVBQVUsRUFBRTtZQUM3RCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLHdCQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDaEUsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ3hCLE9BQU8sSUFBSSxDQUFDO2dCQUNiLENBQUM7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQztJQUNILENBQUM7Q0FBQTtBQTFDRCxvQ0EwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IHogfSBmcm9tIFwiem9kXCI7XG5pbXBvcnQge1xuXHRBd3NFbnZpcm9ubWVudCxcblx0QXdzUmVnaW9uLFxuXHRQdWxzaWZpQ3VzdG9tQ2RrRXJyb3IsXG59IGZyb20gXCIuL3B1bHNpZmkuZW51bVwiO1xuXG4vKipcbiAqIEN1c3RvbVpvZFJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHN1Y2Nlc3NcbiAqIEBwYXJhbSBtZXNzYWdlXG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbVpvZFJlc3BvbnNlID0ge1xuXHRzdWNjZXNzOiBib29sZWFuO1xuXHRtZXNzYWdlPzogei5ab2RJc3N1ZVtdO1xufTtcblxuZXhwb3J0IGNsYXNzIFB1bHNpZmlVdGlscyB7XG5cdC8qKlxuXHQgKiBnZXRBd3NFbnZpcm9ubWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQgZGVmYXVsdCBBd3NFbnZpcm9ubWVudC5TQU5EQk9YXG5cdCAqXG5cdCAqIEByZXR1cm5zIG91dHB1dCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG5cdCAqL1xuXHRwdWJsaWMgZ2V0QXdzRW52aXJvbm1lbnQgPSAoYXdzRW52aXJvbm1lbnQ6IHN0cmluZyk6IEF3c0Vudmlyb25tZW50ID0+IHtcblx0XHRpZiAoYXdzRW52aXJvbm1lbnQgPT09IEF3c0Vudmlyb25tZW50LlBST0RVQ1RJT04pIHtcblx0XHRcdHJldHVybiBBd3NFbnZpcm9ubWVudC5QUk9EVUNUSU9OO1xuXHRcdH1cblxuXHRcdGlmIChhd3NFbnZpcm9ubWVudCA9PT0gQXdzRW52aXJvbm1lbnQuU1RBR0lORykge1xuXHRcdFx0cmV0dXJuIEF3c0Vudmlyb25tZW50LlNUQUdJTkc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIEF3c0Vudmlyb25tZW50LlNBTkRCT1g7XG5cdH07XG5cblx0cHVibGljIGdldEF3c1JlZ2lvbkFiYnJ2ID0gKGF3c1JlZ2lvbjogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0XHRpZiAoYXdzUmVnaW9uID09PSBBd3NSZWdpb24uUFJJTUFSWV9SRUdJT04pIHtcblx0XHRcdHJldHVybiBcInNnXCI7XG5cdFx0fVxuXG5cdFx0aWYgKGF3c1JlZ2lvbiA9PT0gQXdzUmVnaW9uLlNFQ09OREFSWV9SRUdJT04pIHtcblx0XHRcdHJldHVybiBcImRlXCI7XG5cdFx0fVxuXG5cdFx0dGhyb3cgbmV3IEVycm9yKFB1bHNpZmlDdXN0b21DZGtFcnJvci5JTlZBTElEX1JFR0lPTl9BQkJSVik7XG5cdH07XG5cblx0cHVibGljIGdldEF3c1JlZ2lvbkVudW1WYWx1ZXMgPSAoYXdzUmVnaW9uOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuXHRcdGNvbnN0IGZpbHRlcmVkUmVzdWx0cyA9IE9iamVjdC52YWx1ZXMoQXdzUmVnaW9uKS5maWx0ZXIoKGl0ZW0pID0+IHtcblx0XHRcdGlmIChpdGVtID09PSBhd3NSZWdpb24pIHtcblx0XHRcdFx0cmV0dXJuIGl0ZW07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9KTtcblxuXHRcdHJldHVybiBmaWx0ZXJlZFJlc3VsdHNbMF07XG5cdH07XG59XG4iXX0=