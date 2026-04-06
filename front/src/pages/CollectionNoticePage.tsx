import "./LegalPage.css";

export default function CollectionNoticePage() {
  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero__inner">
          <span className="legal-hero__eyebrow">Real Gold Properties</span>
          <h1 className="legal-hero__title">Collection Notice for Privacy Purposes and Consent</h1>
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-content__inner">

          <div className="legal-section">
            <h2>Who Are We?</h2>
            <p>This information is being collected by Real Gold Properties.</p>
            <div className="legal-contact-block">
              <p>Address: PO Box 4024, Forest Lakes QLD 4078</p>
              <p>
                Email:{" "}
                <a href="mailto:admin@realgoldproperties.com.au">
                  admin@realgoldproperties.com.au
                </a>
              </p>
            </div>
            <p>
              Our full Privacy Policy is available on our website. If you require further information about
              our privacy practices, please contact us using the details above.
            </p>
            <p>
              By providing your personal information to us, you consent to its collection, use, storage, and
              disclosure in accordance with this Collection Notice and our Privacy Policy.
            </p>
          </div>

          <div className="legal-section">
            <h2>Purpose of Collection</h2>
            <p>We collect, hold, use, and disclose your personal information for purposes including:</p>
            <ul>
              <li>Providing real estate products and services to you</li>
              <li>Responding to your enquiries and requests</li>
              <li>Supplying information or advice regarding our current and future services</li>
              <li>Managing business operations and administrative processes</li>
              <li>Engaging service providers, contractors, and related entities to assist in delivering our services</li>
              <li>Maintaining accurate and up-to-date records</li>
              <li>Processing and responding to complaints or feedback</li>
              <li>Any other purposes outlined in our Privacy Policy</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Disclosure of Personal Information</h2>
            <p>
              Your personal information may be collected by or on behalf of us and may be disclosed to
              third parties who assist us in operating our business, including:
            </p>
            <ul>
              <li>Our employees, contractors, and related entities</li>
              <li>Service providers and suppliers with whom we have commercial relationships (including IT, marketing, and administrative providers)</li>
              <li>Professional advisors such as accountants, solicitors, and consultants</li>
              <li>Any other organisation where you have provided your consent</li>
              <li>Government authorities or regulators where required by law</li>
            </ul>
            <p>
              We take reasonable steps to ensure that any third parties handling your information do so in
              accordance with applicable privacy laws.
            </p>
          </div>

          <div className="legal-section">
            <h2>What Happens if We Cannot Collect Your Information?</h2>
            <p>If you do not provide the requested personal information, we may be unable to:</p>
            <ul>
              <li>Provide our services to you</li>
              <li>Respond effectively to your enquiries</li>
              <li>Deliver services to the expected standard</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Access, Correction, and Complaints</h2>
            <p>Our Privacy Policy outlines how you can:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request corrections to your personal information</li>
              <li>Lodge a complaint regarding the handling of your personal information</li>
            </ul>
            <p>We are committed to resolving any privacy concerns in a fair and timely manner.</p>
          </div>

          <div className="legal-section">
            <h2>Overseas Disclosure</h2>
            <p>
              We may disclose your personal information to third-party service providers located overseas,
              including cloud-based or IT service providers.
            </p>
            <p>
              Where such disclosures occur, your information may not be subject to the same level of
              protection as under Australian privacy laws. By using our services, you consent to the
              disclosure of your information in this manner.
            </p>
            <p>
              We will take reasonable steps to ensure that overseas recipients handle your personal
              information securely and responsibly.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
