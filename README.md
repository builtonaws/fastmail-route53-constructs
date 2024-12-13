# @builtonaws/fastmail-route53-constructs

CDK constructs for adding Fastmail domain verification DNS records to your Route53-managed domain.

## Usage

<details>
<summary>TypeScript</summary>

Install package:

```sh
npm install @builtonaws/fastmail-route53-constructs
```

Use FastmailDomainVerification construct:

```typescript
import { FastmailDomainVerification } from "@builtonaws/fastmail-route53-constructs";
import * as cdk from "aws-cdk-lib";
import * as r53 from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";

export class ExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = new r53.PublicHostedZone(this, "PublicHostedZone", {
      zoneName: "example.com",
    });

    new FastmailDomainVerification(this, "FastmailDomainVerification", {
      domain: "example.com",
      hostedZone,
    });
  }
}
```
</details>
