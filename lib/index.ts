import {
  CnameRecord,
  type IHostedZone,
  MxRecord,
  TxtRecord,
} from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

/**
 * Properties to verify Fastmail domain.
 */
export interface FastmailDomainVerificationProps {
  /**
   * Domain name to verify.
   */
  readonly domain: string;
  /**
   * Hosted zone to add records to.
   */
  readonly hostedZone: IHostedZone;
  /**
   * Include subdomains in verification.
   * @default true
   */
  readonly includeSubdomains?: boolean;
}

/**
 * Verifies a domain for use with Fastmail.
 *
 * @example
 * new FastmailDomainVerification(stack, "Verification", {
 *   domain: "example.com",
 *   hostedZone: hostedZone,
 * });
 */
export class FastmailDomainVerification extends Construct {
  /**
   * Verified domain name.
   */
  readonly domain: string;
  /**
   * Hosted zone records are added to.
   */
  readonly hostedZone: IHostedZone;
  /**
   * Whether subdomains are included in verification.
   */
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
