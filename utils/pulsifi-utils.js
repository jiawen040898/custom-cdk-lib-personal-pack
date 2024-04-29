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
        /**
         * getAwsRegionEnumValues
         * @param awsRegion
         * @returns enum reference ${@link AwsRegion}
         */
        this.getAwsRegionEnumValues = (awsRegion) => {
            const filteredResults = Object.values(pulsifi_enum_1.AwsRegion).filter((item) => {
                if (item === awsRegion) {
                    return item;
                }
                return null;
            });
            return filteredResults[0];
        };
        /**
         * verifyCustomSchema
         *
         * verifies Zod custom schemas such as CustomLambdaErrorAlarmSchema
         *
         * @param schema {@link z.Schema}
         * @param props
         * @returns
         */
        this.verifyCustomSchema = (schema, props) => {
            const zodCheckOutput = schema.safeParse(props);
            if (!zodCheckOutput.success) {
                return {
                    success: zodCheckOutput.success,
                    message: zodCheckOutput.error.issues,
                };
            }
            return {
                success: zodCheckOutput.success,
            };
        };
    }
}
exports.PulsifiUtils = PulsifiUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVsc2lmaS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi91dGlscy9wdWxzaWZpLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUEyRDtBQWEzRCxNQUFhLFlBQVk7SUFBekI7UUFDQzs7Ozs7O1dBTUc7UUFDSSxzQkFBaUIsR0FBRyxDQUFDLGNBQXNCLEVBQWtCLEVBQUU7WUFDckUsSUFBSSxjQUFjLEtBQUssNkJBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEQsT0FBTyw2QkFBYyxDQUFDLFVBQVUsQ0FBQztZQUNsQyxDQUFDO1lBRUQsSUFBSSxjQUFjLEtBQUssNkJBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDL0MsT0FBTyw2QkFBYyxDQUFDLE9BQU8sQ0FBQztZQUMvQixDQUFDO1lBRUQsT0FBTyw2QkFBYyxDQUFDLE9BQU8sQ0FBQztRQUMvQixDQUFDLENBQUM7UUFFRjs7OztXQUlHO1FBQ0ksMkJBQXNCLEdBQUcsQ0FBQyxTQUFpQixFQUFVLEVBQUU7WUFDN0QsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyx3QkFBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2hFLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO29CQUN4QixPQUFPLElBQUksQ0FBQztnQkFDYixDQUFDO2dCQUNELE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUM7UUFFRjs7Ozs7Ozs7V0FRRztRQUNJLHVCQUFrQixHQUFHLENBQzNCLE1BQWUsRUFDZixLQUFhLEVBQ08sRUFBRTtZQUN0QixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzdCLE9BQU87b0JBQ04sT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPO29CQUMvQixPQUFPLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNO2lCQUNmLENBQUM7WUFDeEIsQ0FBQztZQUVELE9BQU87Z0JBQ04sT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPO2FBQ1YsQ0FBQztRQUN4QixDQUFDLENBQUM7SUFDSCxDQUFDO0NBQUE7QUE3REQsb0NBNkRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyB6IH0gZnJvbSBcInpvZFwiO1xuaW1wb3J0IHsgQXdzRW52aXJvbm1lbnQsIEF3c1JlZ2lvbiB9IGZyb20gXCIuL3B1bHNpZmkuZW51bVwiO1xuXG4vKipcbiAqIEN1c3RvbVpvZFJlc3BvbnNlXG4gKlxuICogQHBhcmFtIHN1Y2Nlc3NcbiAqIEBwYXJhbSBtZXNzYWdlXG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbVpvZFJlc3BvbnNlID0ge1xuXHRzdWNjZXNzOiBib29sZWFuO1xuXHRtZXNzYWdlPzogei5ab2RJc3N1ZVtdO1xufTtcblxuZXhwb3J0IGNsYXNzIFB1bHNpZmlVdGlscyB7XG5cdC8qKlxuXHQgKiBnZXRBd3NFbnZpcm9ubWVudFxuXHQgKlxuXHQgKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQgZGVmYXVsdCBBd3NFbnZpcm9ubWVudC5TQU5EQk9YXG5cdCAqXG5cdCAqIEByZXR1cm5zIG91dHB1dCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG5cdCAqL1xuXHRwdWJsaWMgZ2V0QXdzRW52aXJvbm1lbnQgPSAoYXdzRW52aXJvbm1lbnQ6IHN0cmluZyk6IEF3c0Vudmlyb25tZW50ID0+IHtcblx0XHRpZiAoYXdzRW52aXJvbm1lbnQgPT09IEF3c0Vudmlyb25tZW50LlBST0RVQ1RJT04pIHtcblx0XHRcdHJldHVybiBBd3NFbnZpcm9ubWVudC5QUk9EVUNUSU9OO1xuXHRcdH1cblxuXHRcdGlmIChhd3NFbnZpcm9ubWVudCA9PT0gQXdzRW52aXJvbm1lbnQuU1RBR0lORykge1xuXHRcdFx0cmV0dXJuIEF3c0Vudmlyb25tZW50LlNUQUdJTkc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIEF3c0Vudmlyb25tZW50LlNBTkRCT1g7XG5cdH07XG5cblx0LyoqXG5cdCAqIGdldEF3c1JlZ2lvbkVudW1WYWx1ZXNcblx0ICogQHBhcmFtIGF3c1JlZ2lvblxuXHQgKiBAcmV0dXJucyBlbnVtIHJlZmVyZW5jZSAke0BsaW5rIEF3c1JlZ2lvbn1cblx0ICovXG5cdHB1YmxpYyBnZXRBd3NSZWdpb25FbnVtVmFsdWVzID0gKGF3c1JlZ2lvbjogc3RyaW5nKTogc3RyaW5nID0+IHtcblx0XHRjb25zdCBmaWx0ZXJlZFJlc3VsdHMgPSBPYmplY3QudmFsdWVzKEF3c1JlZ2lvbikuZmlsdGVyKChpdGVtKSA9PiB7XG5cdFx0XHRpZiAoaXRlbSA9PT0gYXdzUmVnaW9uKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gZmlsdGVyZWRSZXN1bHRzWzBdO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiB2ZXJpZnlDdXN0b21TY2hlbWFcblx0ICpcblx0ICogdmVyaWZpZXMgWm9kIGN1c3RvbSBzY2hlbWFzIHN1Y2ggYXMgQ3VzdG9tTGFtYmRhRXJyb3JBbGFybVNjaGVtYVxuXHQgKlxuXHQgKiBAcGFyYW0gc2NoZW1hIHtAbGluayB6LlNjaGVtYX1cblx0ICogQHBhcmFtIHByb3BzXG5cdCAqIEByZXR1cm5zXG5cdCAqL1xuXHRwdWJsaWMgdmVyaWZ5Q3VzdG9tU2NoZW1hID0gPFRTY2hlbWEgZXh0ZW5kcyB6LlNjaGVtYSwgVFByb3BzPihcblx0XHRzY2hlbWE6IFRTY2hlbWEsXG5cdFx0cHJvcHM6IFRQcm9wcyxcblx0KTogQ3VzdG9tWm9kUmVzcG9uc2UgPT4ge1xuXHRcdGNvbnN0IHpvZENoZWNrT3V0cHV0ID0gc2NoZW1hLnNhZmVQYXJzZShwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiB6b2RDaGVja091dHB1dC5zdWNjZXNzLFxuXHRcdFx0XHRtZXNzYWdlOiB6b2RDaGVja091dHB1dC5lcnJvci5pc3N1ZXMsXG5cdFx0XHR9IGFzIEN1c3RvbVpvZFJlc3BvbnNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB6b2RDaGVja091dHB1dC5zdWNjZXNzLFxuXHRcdH0gYXMgQ3VzdG9tWm9kUmVzcG9uc2U7XG5cdH07XG59XG4iXX0=