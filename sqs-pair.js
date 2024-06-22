"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSqsPairConstruct = exports.CustomSqsPairSchema = void 0;
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const sqs_1 = require("./sqs");
const utils_1 = require("./utils");
dotenv.config();
const utils = new utils_1.PulsifiUtils();
/**
 * CustomSqsPairSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param sqsName
 * @param fifo
 * @param visibilityTimeoutInSeconds (optional)
 * @param deliveryDelayInSeconds (optional)
 * @param enforceSSL (optional) - default: false, this will be used for both SQS
 * @param highTroughput (optional) - default: false, requires fifo to be enabled
 * @param enablePulsifiKms (optional) - default: true, true = (SSE-KMS), false = (SSE-SQS)
 */
exports.CustomSqsPairSchema = sqs_1.CustomSqsSchema.omit({
    isDlq: true,
});
class CustomSqsPairConstruct extends constructs_1.Construct {
    /**
     * CustomSqsPairConstruct
     *
     * @public mainSqs {@link Queue}
     * @public dlqSqs {@link Queue}
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomSqsPairProps}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomSqsPairSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        this.dlqSqs = new sqs_1.CustomSqsConstruct(this, "DeadLetterQueue", {
            awsEnvironment: props.awsEnvironment,
            resourceOwner: props.resourceOwner,
            sqsName: props.sqsName,
            fifo: props.fifo,
            isDlq: true,
            deliveryDelayInSeconds: props.deliveryDelayInSeconds,
            visibilityTimeoutInSeconds: props.visibilityTimeoutInSeconds,
            enforceSSL: props.enforceSSL,
            highTroughput: props.highTroughput,
            enablePulsifiKms: props.enablePulsifiKms ?? true,
        }).sqs;
        this.mainSqs = new sqs_1.CustomSqsConstruct(this, "MainQueue", {
            awsEnvironment: props.awsEnvironment,
            resourceOwner: props.resourceOwner,
            sqsName: props.sqsName,
            fifo: props.fifo,
            isDlq: false,
            deliveryDelayInSeconds: props.deliveryDelayInSeconds,
            visibilityTimeoutInSeconds: props.visibilityTimeoutInSeconds,
            enforceSSL: props.enforceSSL,
            highTroughput: props.highTroughput,
            enablePulsifiKms: props.enablePulsifiKms ?? true,
            deadLetterQueue: {
                maxReceiveCount: 3,
                queue: this.dlqSqs,
            },
        }).sqs;
    }
}
exports.CustomSqsPairConstruct = CustomSqsPairConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FzLXBhaXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc3FzLXBhaXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXVDO0FBQ3ZDLGlDQUFpQztBQUVqQywrQkFBNEQ7QUFDNUQsbUNBQXVDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQixNQUFNLEtBQUssR0FBRyxJQUFJLG9CQUFZLEVBQUUsQ0FBQztBQUVqQzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDVSxRQUFBLG1CQUFtQixHQUFHLHFCQUFlLENBQUMsSUFBSSxDQUFDO0lBQ3ZELEtBQUssRUFBRSxJQUFJO0NBQ1gsQ0FBQyxDQUFDO0FBaUJILE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFJcEQ7Ozs7Ozs7OztPQVNHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5QjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FHN0MsMkJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx3QkFBa0IsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDN0QsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLEtBQUssRUFBRSxJQUFJO1lBQ1gsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLHNCQUFzQjtZQUNwRCwwQkFBMEIsRUFBRSxLQUFLLENBQUMsMEJBQTBCO1lBQzVELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixJQUFJLElBQUk7U0FDaEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUVQLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSx3QkFBa0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3hELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixLQUFLLEVBQUUsS0FBSztZQUNaLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxzQkFBc0I7WUFDcEQsMEJBQTBCLEVBQUUsS0FBSyxDQUFDLDBCQUEwQjtZQUM1RCxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJO1lBQ2hELGVBQWUsRUFBRTtnQkFDaEIsZUFBZSxFQUFFLENBQUM7Z0JBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTthQUNsQjtTQUNELENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDUixDQUFDO0NBQ0Q7QUF2REQsd0RBdURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBRdWV1ZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtc3FzXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCB0eXBlIHsgeiB9IGZyb20gXCJ6b2RcIjtcbmltcG9ydCB7IEN1c3RvbVNxc0NvbnN0cnVjdCwgQ3VzdG9tU3FzU2NoZW1hIH0gZnJvbSBcIi4vc3FzXCI7XG5pbXBvcnQgeyBQdWxzaWZpVXRpbHMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5cbmNvbnN0IHV0aWxzID0gbmV3IFB1bHNpZmlVdGlscygpO1xuXG4vKipcbiAqIEN1c3RvbVNxc1BhaXJTY2hlbWFcbiAqXG4gKiBAcGFyYW0gYXdzRW52aXJvbm1lbnQge0BsaW5rIEF3c0Vudmlyb25tZW50fVxuICogQHBhcmFtIHJlc291cmNlT3duZXIge0BsaW5rIFB1bHNpZmlUZWFtfVxuICogQHBhcmFtIHNxc05hbWVcbiAqIEBwYXJhbSBmaWZvXG4gKiBAcGFyYW0gdmlzaWJpbGl0eVRpbWVvdXRJblNlY29uZHMgKG9wdGlvbmFsKVxuICogQHBhcmFtIGRlbGl2ZXJ5RGVsYXlJblNlY29uZHMgKG9wdGlvbmFsKVxuICogQHBhcmFtIGVuZm9yY2VTU0wgKG9wdGlvbmFsKSAtIGRlZmF1bHQ6IGZhbHNlLCB0aGlzIHdpbGwgYmUgdXNlZCBmb3IgYm90aCBTUVNcbiAqIEBwYXJhbSBoaWdoVHJvdWdocHV0IChvcHRpb25hbCkgLSBkZWZhdWx0OiBmYWxzZSwgcmVxdWlyZXMgZmlmbyB0byBiZSBlbmFibGVkXG4gKiBAcGFyYW0gZW5hYmxlUHVsc2lmaUttcyAob3B0aW9uYWwpIC0gZGVmYXVsdDogdHJ1ZSwgdHJ1ZSA9IChTU0UtS01TKSwgZmFsc2UgPSAoU1NFLVNRUylcbiAqL1xuZXhwb3J0IGNvbnN0IEN1c3RvbVNxc1BhaXJTY2hlbWEgPSBDdXN0b21TcXNTY2hlbWEub21pdCh7XG5cdGlzRGxxOiB0cnVlLFxufSk7XG5cbi8qKlxuICogQ3VzdG9tU3FzUGFpclByb3BzXG4gKlxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqIEBwYXJhbSBzcXNOYW1lXG4gKiBAcGFyYW0gZmlmb1xuICogQHBhcmFtIHZpc2liaWxpdHlUaW1lb3V0SW5TZWNvbmRzIChvcHRpb25hbClcbiAqIEBwYXJhbSBkZWxpdmVyeURlbGF5SW5TZWNvbmRzIChvcHRpb25hbClcbiAqIEBwYXJhbSBlbmZvcmNlU1NMIChvcHRpb25hbCkgLSBkZWZhdWx0OiBmYWxzZSwgdGhpcyB3aWxsIGJlIHVzZWQgZm9yIGJvdGggU1FTXG4gKiBAcGFyYW0gaGlnaFRyb3VnaHB1dCAob3B0aW9uYWwpIC0gZGVmYXVsdDogZmFsc2UsIHJlcXVpcmVzIGZpZm8gdG8gYmUgZW5hYmxlZFxuICogQHBhcmFtIGVuYWJsZVB1bHNpZmlLbXMgKG9wdGlvbmFsKSAtIGRlZmF1bHQ6IHRydWUsIHRydWUgPSAoU1NFLUtNUyksIGZhbHNlID0gKFNTRS1TUVMpXG4gKi9cbmV4cG9ydCB0eXBlIEN1c3RvbVNxc1BhaXJQcm9wcyA9IHouaW5mZXI8dHlwZW9mIEN1c3RvbVNxc1BhaXJTY2hlbWE+O1xuXG5leHBvcnQgY2xhc3MgQ3VzdG9tU3FzUGFpckNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG5cdHB1YmxpYyByZWFkb25seSBtYWluU3FzOiBRdWV1ZTtcblx0cHVibGljIHJlYWRvbmx5IGRscVNxczogUXVldWU7XG5cblx0LyoqXG5cdCAqIEN1c3RvbVNxc1BhaXJDb25zdHJ1Y3Rcblx0ICpcblx0ICogQHB1YmxpYyBtYWluU3FzIHtAbGluayBRdWV1ZX1cblx0ICogQHB1YmxpYyBkbHFTcXMge0BsaW5rIFF1ZXVlfVxuXHQgKlxuXHQgKiBAcGFyYW0gc2NvcGUge0BsaW5rIENvbnN0cnVjdH1cblx0ICogQHBhcmFtIGlkXG5cdCAqIEBwYXJhbSBwcm9wcyB7QGxpbmsgQ3VzdG9tU3FzUGFpclByb3BzfVxuXHQgKi9cblx0Y29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEN1c3RvbVNxc1BhaXJQcm9wcykge1xuXHRcdHN1cGVyKHNjb3BlLCBpZCk7XG5cblx0XHRjb25zdCB6b2RDaGVja091dHB1dCA9IHV0aWxzLnZlcmlmeUN1c3RvbVNjaGVtYTxcblx0XHRcdHR5cGVvZiBDdXN0b21TcXNQYWlyU2NoZW1hLFxuXHRcdFx0Q3VzdG9tU3FzUGFpclByb3BzXG5cdFx0PihDdXN0b21TcXNQYWlyU2NoZW1hLCBwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoem9kQ2hlY2tPdXRwdXQubWVzc2FnZSkpO1xuXHRcdH1cblxuXHRcdHRoaXMuZGxxU3FzID0gbmV3IEN1c3RvbVNxc0NvbnN0cnVjdCh0aGlzLCBcIkRlYWRMZXR0ZXJRdWV1ZVwiLCB7XG5cdFx0XHRhd3NFbnZpcm9ubWVudDogcHJvcHMuYXdzRW52aXJvbm1lbnQsXG5cdFx0XHRyZXNvdXJjZU93bmVyOiBwcm9wcy5yZXNvdXJjZU93bmVyLFxuXHRcdFx0c3FzTmFtZTogcHJvcHMuc3FzTmFtZSxcblx0XHRcdGZpZm86IHByb3BzLmZpZm8sXG5cdFx0XHRpc0RscTogdHJ1ZSxcblx0XHRcdGRlbGl2ZXJ5RGVsYXlJblNlY29uZHM6IHByb3BzLmRlbGl2ZXJ5RGVsYXlJblNlY29uZHMsXG5cdFx0XHR2aXNpYmlsaXR5VGltZW91dEluU2Vjb25kczogcHJvcHMudmlzaWJpbGl0eVRpbWVvdXRJblNlY29uZHMsXG5cdFx0XHRlbmZvcmNlU1NMOiBwcm9wcy5lbmZvcmNlU1NMLFxuXHRcdFx0aGlnaFRyb3VnaHB1dDogcHJvcHMuaGlnaFRyb3VnaHB1dCxcblx0XHRcdGVuYWJsZVB1bHNpZmlLbXM6IHByb3BzLmVuYWJsZVB1bHNpZmlLbXMgPz8gdHJ1ZSxcblx0XHR9KS5zcXM7XG5cblx0XHR0aGlzLm1haW5TcXMgPSBuZXcgQ3VzdG9tU3FzQ29uc3RydWN0KHRoaXMsIFwiTWFpblF1ZXVlXCIsIHtcblx0XHRcdGF3c0Vudmlyb25tZW50OiBwcm9wcy5hd3NFbnZpcm9ubWVudCxcblx0XHRcdHJlc291cmNlT3duZXI6IHByb3BzLnJlc291cmNlT3duZXIsXG5cdFx0XHRzcXNOYW1lOiBwcm9wcy5zcXNOYW1lLFxuXHRcdFx0ZmlmbzogcHJvcHMuZmlmbyxcblx0XHRcdGlzRGxxOiBmYWxzZSxcblx0XHRcdGRlbGl2ZXJ5RGVsYXlJblNlY29uZHM6IHByb3BzLmRlbGl2ZXJ5RGVsYXlJblNlY29uZHMsXG5cdFx0XHR2aXNpYmlsaXR5VGltZW91dEluU2Vjb25kczogcHJvcHMudmlzaWJpbGl0eVRpbWVvdXRJblNlY29uZHMsXG5cdFx0XHRlbmZvcmNlU1NMOiBwcm9wcy5lbmZvcmNlU1NMLFxuXHRcdFx0aGlnaFRyb3VnaHB1dDogcHJvcHMuaGlnaFRyb3VnaHB1dCxcblx0XHRcdGVuYWJsZVB1bHNpZmlLbXM6IHByb3BzLmVuYWJsZVB1bHNpZmlLbXMgPz8gdHJ1ZSxcblx0XHRcdGRlYWRMZXR0ZXJRdWV1ZToge1xuXHRcdFx0XHRtYXhSZWNlaXZlQ291bnQ6IDMsXG5cdFx0XHRcdHF1ZXVlOiB0aGlzLmRscVNxcyxcblx0XHRcdH0sXG5cdFx0fSkuc3FzO1xuXHR9XG59XG4iXX0=