"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEcrConstruct = exports.CustomEcrSchema = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_ecr_1 = require("aws-cdk-lib/aws-ecr");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
const dotenv = require("dotenv");
const zod_1 = require("zod");
const resource_tag_1 = require("./resource-tag");
const utils_1 = require("./utils");
dotenv.config();
const utils = new utils_1.PulsifiUtils();
/**
 * CustomEcrSchema
 *
 * @param awsEnvironment {@link AwsEnvironment}
 * @param resourceOwner {@link PulsifiTeam}
 * @param repositoryName
 */
exports.CustomEcrSchema = resource_tag_1.CustomResourceTagSchema.extend({
    repositoryName: zod_1.z.string().min(1).max(256),
}).omit({ resourceName: true });
class CustomEcrConstruct extends constructs_1.Construct {
    /**
     * CustomEcrConstruct
     *
     * @param scope {@link Construct}
     * @param id
     * @param props {@link CustomEcrPropss}
     */
    constructor(scope, id, props) {
        super(scope, id);
        const zodCheckOutput = utils.verifyCustomSchema(exports.CustomEcrSchema, props);
        if (!zodCheckOutput.success) {
            throw new Error(JSON.stringify(zodCheckOutput.message));
        }
        this.ecrRepository = new aws_ecr_1.Repository(this, "EcrRepo", {
            repositoryName: props.repositoryName,
            imageScanOnPush: true,
            imageTagMutability: aws_ecr_1.TagMutability.IMMUTABLE,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            emptyOnDelete: true,
        });
        this.ecrRepository.addLifecycleRule({
            rulePriority: 2,
            description: "Keep only the latest 10 docker images",
            maxImageCount: 10,
            tagStatus: aws_ecr_1.TagStatus.ANY,
        });
        this.ecrRepository.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            actions: ["ecr:*"],
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new aws_iam_1.AnyPrincipal()],
        }));
        if (props.iamRole) {
            this.ecrRepository.grantPullPush(props.iamRole);
        }
        aws_cdk_lib_1.Tags.of(this.ecrRepository).add("Owner", props.resourceOwner);
        aws_cdk_lib_1.Tags.of(this.ecrRepository).add("Environment", props.awsEnvironment);
        aws_cdk_lib_1.Tags.of(this.ecrRepository).add("Name", props.repositoryName);
    }
}
exports.CustomEcrConstruct = CustomEcrConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL2Vjci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBa0Q7QUFDbEQsaURBSzZCO0FBQzdCLGlEQUs2QjtBQUM3QiwyQ0FBdUM7QUFDdkMsaUNBQWlDO0FBQ2pDLDZCQUF3QjtBQUN4QixpREFBeUQ7QUFDekQsbUNBQXVDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQixNQUFNLEtBQUssR0FBRyxJQUFJLG9CQUFZLEVBQUUsQ0FBQztBQUVqQzs7Ozs7O0dBTUc7QUFDVSxRQUFBLGVBQWUsR0FBRyxzQ0FBdUIsQ0FBQyxNQUFNLENBQUM7SUFDN0QsY0FBYyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztDQUMxQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFjaEMsTUFBYSxrQkFBbUIsU0FBUSxzQkFBUztJQUdoRDs7Ozs7O09BTUc7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXFCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUc3Qyx1QkFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksb0JBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3BELGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxlQUFlLEVBQUUsSUFBSTtZQUNyQixrQkFBa0IsRUFBRSx1QkFBYSxDQUFDLFNBQVM7WUFDM0MsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxhQUFhLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDO1lBQ25DLFlBQVksRUFBRSxDQUFDO1lBQ2YsV0FBVyxFQUFFLHVDQUF1QztZQUNwRCxhQUFhLEVBQUUsRUFBRTtZQUNqQixTQUFTLEVBQUUsbUJBQVMsQ0FBQyxHQUFHO1NBQ1AsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQ3JDLElBQUkseUJBQWUsQ0FBQztZQUNuQixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixVQUFVLEVBQUUsQ0FBQyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztTQUNoQyxDQUFDLENBQ0YsQ0FBQztRQUNGLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsa0JBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELGtCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyRSxrQkFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUNEO0FBakRELGdEQWlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFRhZ3MgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7XG5cdHR5cGUgTGlmZWN5Y2xlUnVsZSxcblx0UmVwb3NpdG9yeSxcblx0VGFnTXV0YWJpbGl0eSxcblx0VGFnU3RhdHVzLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWVjclwiO1xuaW1wb3J0IHtcblx0QW55UHJpbmNpcGFsLFxuXHRFZmZlY3QsXG5cdFBvbGljeVN0YXRlbWVudCxcblx0dHlwZSBSb2xlLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XG5pbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2VUYWdTY2hlbWEgfSBmcm9tIFwiLi9yZXNvdXJjZS10YWdcIjtcbmltcG9ydCB7IFB1bHNpZmlVdGlscyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmRvdGVudi5jb25maWcoKTtcblxuY29uc3QgdXRpbHMgPSBuZXcgUHVsc2lmaVV0aWxzKCk7XG5cbi8qKlxuICogQ3VzdG9tRWNyU2NoZW1hXG4gKlxuICogQHBhcmFtIGF3c0Vudmlyb25tZW50IHtAbGluayBBd3NFbnZpcm9ubWVudH1cbiAqIEBwYXJhbSByZXNvdXJjZU93bmVyIHtAbGluayBQdWxzaWZpVGVhbX1cbiAqIEBwYXJhbSByZXBvc2l0b3J5TmFtZVxuICovXG5leHBvcnQgY29uc3QgQ3VzdG9tRWNyU2NoZW1hID0gQ3VzdG9tUmVzb3VyY2VUYWdTY2hlbWEuZXh0ZW5kKHtcblx0cmVwb3NpdG9yeU5hbWU6IHouc3RyaW5nKCkubWluKDEpLm1heCgyNTYpLFxufSkub21pdCh7IHJlc291cmNlTmFtZTogdHJ1ZSB9KTtcblxuLyoqXG4gKiBDdXN0b21FY3JQcm9wc1xuICpcbiAqIEBwYXJhbSBhd3NFbnZpcm9ubWVudCB7QGxpbmsgQXdzRW52aXJvbm1lbnR9XG4gKiBAcGFyYW0gcmVzb3VyY2VPd25lciB7QGxpbmsgUHVsc2lmaVRlYW19XG4gKiBAcGFyYW0gcmVwb3NpdG9yeU5hbWVcbiAqIEBvcHRpb25hbCBpYW1Sb2xlIHtAbGluayBSb2xlfVxuICovXG5leHBvcnQgdHlwZSBDdXN0b21FY3JQcm9wcyA9IHouaW5mZXI8dHlwZW9mIEN1c3RvbUVjclNjaGVtYT4gJiB7XG5cdGlhbVJvbGU/OiBSb2xlO1xufTtcblxuZXhwb3J0IGNsYXNzIEN1c3RvbUVjckNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG5cdHB1YmxpYyByZWFkb25seSBlY3JSZXBvc2l0b3J5OiBSZXBvc2l0b3J5O1xuXG5cdC8qKlxuXHQgKiBDdXN0b21FY3JDb25zdHJ1Y3Rcblx0ICpcblx0ICogQHBhcmFtIHNjb3BlIHtAbGluayBDb25zdHJ1Y3R9XG5cdCAqIEBwYXJhbSBpZFxuXHQgKiBAcGFyYW0gcHJvcHMge0BsaW5rIEN1c3RvbUVjclByb3Bzc31cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21FY3JQcm9wcykge1xuXHRcdHN1cGVyKHNjb3BlLCBpZCk7XG5cblx0XHRjb25zdCB6b2RDaGVja091dHB1dCA9IHV0aWxzLnZlcmlmeUN1c3RvbVNjaGVtYTxcblx0XHRcdHR5cGVvZiBDdXN0b21FY3JTY2hlbWEsXG5cdFx0XHRDdXN0b21FY3JQcm9wc1xuXHRcdD4oQ3VzdG9tRWNyU2NoZW1hLCBwcm9wcyk7XG5cdFx0aWYgKCF6b2RDaGVja091dHB1dC5zdWNjZXNzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoem9kQ2hlY2tPdXRwdXQubWVzc2FnZSkpO1xuXHRcdH1cblxuXHRcdHRoaXMuZWNyUmVwb3NpdG9yeSA9IG5ldyBSZXBvc2l0b3J5KHRoaXMsIFwiRWNyUmVwb1wiLCB7XG5cdFx0XHRyZXBvc2l0b3J5TmFtZTogcHJvcHMucmVwb3NpdG9yeU5hbWUsXG5cdFx0XHRpbWFnZVNjYW5PblB1c2g6IHRydWUsXG5cdFx0XHRpbWFnZVRhZ011dGFiaWxpdHk6IFRhZ011dGFiaWxpdHkuSU1NVVRBQkxFLFxuXHRcdFx0cmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuXHRcdFx0ZW1wdHlPbkRlbGV0ZTogdHJ1ZSxcblx0XHR9KTtcblx0XHR0aGlzLmVjclJlcG9zaXRvcnkuYWRkTGlmZWN5Y2xlUnVsZSh7XG5cdFx0XHRydWxlUHJpb3JpdHk6IDIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJLZWVwIG9ubHkgdGhlIGxhdGVzdCAxMCBkb2NrZXIgaW1hZ2VzXCIsXG5cdFx0XHRtYXhJbWFnZUNvdW50OiAxMCxcblx0XHRcdHRhZ1N0YXR1czogVGFnU3RhdHVzLkFOWSxcblx0XHR9IGFzIExpZmVjeWNsZVJ1bGUpO1xuXHRcdHRoaXMuZWNyUmVwb3NpdG9yeS5hZGRUb1Jlc291cmNlUG9saWN5KFxuXHRcdFx0bmV3IFBvbGljeVN0YXRlbWVudCh7XG5cdFx0XHRcdGFjdGlvbnM6IFtcImVjcjoqXCJdLFxuXHRcdFx0XHRlZmZlY3Q6IEVmZmVjdC5BTExPVyxcblx0XHRcdFx0cHJpbmNpcGFsczogW25ldyBBbnlQcmluY2lwYWwoKV0sXG5cdFx0XHR9KSxcblx0XHQpO1xuXHRcdGlmIChwcm9wcy5pYW1Sb2xlKSB7XG5cdFx0XHR0aGlzLmVjclJlcG9zaXRvcnkuZ3JhbnRQdWxsUHVzaChwcm9wcy5pYW1Sb2xlKTtcblx0XHR9XG5cblx0XHRUYWdzLm9mKHRoaXMuZWNyUmVwb3NpdG9yeSkuYWRkKFwiT3duZXJcIiwgcHJvcHMucmVzb3VyY2VPd25lcik7XG5cdFx0VGFncy5vZih0aGlzLmVjclJlcG9zaXRvcnkpLmFkZChcIkVudmlyb25tZW50XCIsIHByb3BzLmF3c0Vudmlyb25tZW50KTtcblx0XHRUYWdzLm9mKHRoaXMuZWNyUmVwb3NpdG9yeSkuYWRkKFwiTmFtZVwiLCBwcm9wcy5yZXBvc2l0b3J5TmFtZSk7XG5cdH1cbn1cbiJdfQ==