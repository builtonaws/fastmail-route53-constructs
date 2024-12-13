import {
  CnameRecord,
  type IHostedZone,
  MxRecord,
  TxtRecord,
} from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export interface FastmailDomainVerificationProps {
  readonly domain: string;
  readonly hostedZone: IHostedZone;
  readonly includeSubdomains?: boolean;
}

export class FastmailDomainVerification extends Construct {
  readonly domain: string;
  readonly hostedZone: IHostedZone;
  readonly includeSubdomains: boolean;

  constructor(
    scope: Construct,
    id: string,
    props: FastmailDomainVerificationProps,
  ) {
    super(scope, id);

    this.domain = props.domain;
    this.hostedZone = props.hostedZone;
    this.includeSubdomains = props.includeSubdomains ?? true;

    new MxRecord(this, "MxRecord", {
      zone: this.hostedZone,
      recordName: `${this.domain}.`,
      values: [
        {
          priority: 10,
          hostName: "in1-smtp.messagingengine.com",
        },
        {
          priority: 20,
          hostName: "in2-smtp.messagingengine.com",
        },
      ],
    });

    if (this.includeSubdomains) {
      new MxRecord(this, "SubdomainMxRecord", {
        zone: this.hostedZone,
        recordName: `*.${this.domain}.`,
        values: [
          {
            priority: 10,
            hostName: "in1-smtp.messagingengine.com",
          },
          {
            priority: 20,
            hostName: "in2-smtp.messagingengine.com",
          },
        ],
      });
    }

    new CnameRecord(this, "DkimCnameRecord1", {
      zone: this.hostedZone,
      recordName: `fm1._domainkey.${this.domain}.`,
      domainName: `fm1.${this.domain}.dkim.fmhosted.com`,
    });
    new CnameRecord(this, "DkimCnameRecord2", {
      zone: this.hostedZone,
      recordName: `fm2._domainkey.${this.domain}.`,
      domainName: `fm2.${this.domain}.dkim.fmhosted.com`,
    });
    new CnameRecord(this, "DkimCnameRecord3", {
      zone: this.hostedZone,
      recordName: `fm3._domainkey.${this.domain}.`,
      domainName: `fm3.${this.domain}.dkim.fmhosted.com`,
    });

    new TxtRecord(this, "SpfRecord", {
      zone: this.hostedZone,
      recordName: `${this.domain}.`,
      values: ["v=spf1 include:spf.messagingengine.com ?all"],
    });
  }
}
