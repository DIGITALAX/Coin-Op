import { FunctionComponent } from "react";

const Privacy: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-start overflow-x-hidden text-slate-200 bg-black">
      # Privacy Policy for Coin Op
      <br />
      _Last Updated: September 5, 2023_
      <br />
      ## Introduction
      <br />
      This Privacy Policy outlines how Coin Op collects, uses, and safeguards
      your information when you interact with our Services. By using our
      Services, you agree to the terms herein. Importantly, we prioritize your
      privacy rights and employ advanced security measures to protect your data.
      <br /> <br />
      ## Emphasis on Privacy Rights and Minimal Data Storage
      <br />
      We are committed to upholding your privacy rights. We do not store any
      personal identifying information unless required by applicable law. All
      such data is stored in private, encrypted peer-to-peer (P2P) formats.
      Access to this data is strictly limited to those necessary for the
      fulfillment of orders, namely buyers and fulfillers.
      <br /> <br />
      ## Information We Collect
      <br />
      ### Minimal Personal Information
      <br />
      Aligned with our commitment to privacy, we collect only the minimum amount
      of personal information required by law:
      <br />
      - Name
      <br />
      - Payment information (processed through Stripe)
      <br /> <br />
      ### Non-Personal Information
      <br />
      Non-personal information ("Non-Personal Information") may also be
      collected, including:
      <br />
      - Browser and device data
      <br />
      - Activity on our Services
      <br /> <br />
      ### Information from Third Parties
      <br />
      We may obtain necessary information from third parties, such as Stripe, in
      compliance with legal requirements.
      <br /> <br />
      ### AI-Generated Information
      <br />
      Data related to your anonymized interactions and preferences may be
      collected when using our AI diffusion models. This data is solely for
      improving our Services and is not stored for other purposes.
      <br /> <br />
      ## Use of Information
      <br />
      The collected information serves specific purposes:
      <br />
      - To process transactions and fulfill orders
      <br />
      - To comply with legal requirements
      <br /> <br />
      ## Sharing of Information
      <br />
      Your information may be shared only under these conditions:
      <br />
      - With third-party vendors and service providers for legal compliance and
      operational necessities
      <br />
      - For legal enforcement
      <br />
      - To protect your rights, our rights, and those of others
      <br />
      We do not sell your Personal Information.
      <br /> <br />
      ## Security Measures
      <br /> <br />
      ### Use of Programmable Key Pairs (PKP)
      <br />
      Coin Op employs Programmable Key Pairs (PKP) for enhanced cryptographic
      security, safeguarding your data.
      <br />
      ### Lit Actions for Decentralized Encryption
      <br />
      We use Lit Actions, an open-source decentralized encryption technology
      from Lit Protocol, further ensuring that only buyers and fulfillers can
      access encrypted transaction and fulfillment data.
      <br /> <br />
      ## GDPR Compliance
      <br />
      We are committed to complying with the General Data Protection Regulation
      (GDPR) for our users in the European Economic Area. This includes the
      right to access, correct, or delete your personal data upon request.
      <br /> <br />
      ## CCPA and CPRA Compliance
      <br />
      In accordance with the California Consumer Privacy Act (CCPA) and the
      California Privacy Rights Act (CPRA), we provide California residents with
      the additional rights to request access to and deletion of their data, and
      to opt out of the sale of their personal information. We do not sell
      personal information.
      <br /> <br />
      ## No Cookies or Tracking Technologies
      <br />
      We do not use cookies or tracking technologies, reinforcing our commitment
      to your privacy.
      <br /> <br />
      ## Children&apos;s Privacy
      <br />
      Our Services are intended for individuals who are at least 13 years of
      age. We do not knowingly collect Personal Information from children under
      13. If we become aware that a child under 13 has provided us with Personal
      Information, we will take steps to remove such information and terminate
      the child&apos;s account.
      <br /> <br />
      ## Changes to This Policy
      <br />
      We reserve the right to update this Privacy Policy at any time. Changes
      will be prominently posted here, with the most recent revision date
      indicated.
      <br /> <br />
      ## Contact Us
      <br />
      For any inquiries about this Privacy Policy, please contact us at
      support@themanufactory.xyz.`
    </div>
  );
};

export default Privacy;
