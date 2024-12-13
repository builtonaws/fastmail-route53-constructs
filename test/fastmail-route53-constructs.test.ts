import { describe } from "node:test";
import { test } from "@jest/globals";
import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import { FastmailDomainVerification } from "../lib";

describe("Route53 DNS records for FastMail domain verification", () => {
  test("default properties", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const hostedZone = new PublicHostedZone(stack, "HostedZone", {
      zoneName: "example.com",
    });

    new FastmailDomainVerification(stack, "FastmailDomainVerification", {
      domain: "example.com",
      hostedZone,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "MX",
      Name: "example.com.",
      ResourceRecords: [
        "10 in1-smtp.messagingengine.com",
        "20 in2-smtp.messagingengine.com",
      ],
    });
    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "MX",
      Name: "*.example.com.",
      ResourceRecords: [
        "10 in1-smtp.messagingengine.com",
        "20 in2-smtp.messagingengine.com",
      ],
    });

    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "CNAME",
      Name: "fm1._domainkey.example.com.",
      ResourceRecords: ["fm1.example.com.dkim.fmhosted.com"],
    });
    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "CNAME",
      Name: "fm2._domainkey.example.com.",
      ResourceRecords: ["fm2.example.com.dkim.fmhosted.com"],
    });
    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "CNAME",
      Name: "fm3._domainkey.example.com.",
      ResourceRecords: ["fm3.example.com.dkim.fmhosted.com"],
    });

    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "TXT",
      Name: "example.com.",
      ResourceRecords: [`"v=spf1 include:spf.messagingengine.com ?all"`],
    });
  });

  test("includeSubdomains explicitly enabled", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const hostedZone = new PublicHostedZone(stack, "HostedZone", {
      zoneName: "example.com",
    });

    new FastmailDomainVerification(stack, "FastmailDomainVerification", {
      domain: "example.com",
      hostedZone,
      includeSubdomains: true,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "MX",
      Name: "*.example.com.",
      ResourceRecords: [
        "10 in1-smtp.messagingengine.com",
        "20 in2-smtp.messagingengine.com",
      ],
    });
  });

  test.failing("includeSubdomains explicitly disabled", () => {
    const app = new App();
    const stack = new Stack(app, "TestStack");
    const hostedZone = new PublicHostedZone(stack, "HostedZone", {
      zoneName: "example.com",
    });

    new FastmailDomainVerification(stack, "FastmailDomainVerification", {
      domain: "example.com",
      hostedZone,
      includeSubdomains: false,
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties("AWS::Route53::RecordSet", {
      Type: "MX",
      Name: "*.example.com.",
      ResourceRecords: [
        "10 in1-smtp.messagingengine.com",
        "20 in2-smtp.messagingengine.com",
      ],
    });
  });
});
