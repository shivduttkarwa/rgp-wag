import "./LegalPage.css";

export default function CookiesPage() {
  return (
    <main className="legal-page">
      <div className="legal-hero">
        <div className="legal-hero__inner">
          <span className="legal-hero__eyebrow">Real Gold Properties</span>
          <h1 className="legal-hero__title">Cookie Policy</h1>
          <p className="legal-hero__meta">Last updated: February 2026</p>
        </div>
      </div>

      <div className="legal-content">
        <div className="legal-content__inner">

          <div className="legal-section">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They
              are widely used to make websites function efficiently, to remember your preferences,
              and to provide information to website owners about how their site is used.
            </p>
            <p>
              Cookies cannot carry viruses or install malware on your device. The information
              a cookie contains is either created by the website you visit or comes from
              third-party services that the website uses.
            </p>
          </div>

          <div className="legal-section">
            <h2>How We Use Cookies</h2>
            <p>
              Real Gold Properties uses cookies to enhance your experience on our website,
              to understand how visitors engage with our content, and to improve our services.
              We do not use cookies to collect personally identifiable information beyond what
              you voluntarily provide through our contact forms.
            </p>
          </div>

          <div className="legal-section">
            <h2>Types of Cookies We Use</h2>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Strictly Necessary</strong></td>
                  <td>Enable core website functionality such as page navigation and form submissions. The website cannot function properly without these.</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td><strong>Performance</strong></td>
                  <td>Collect anonymous data about how visitors use our website (pages visited, time spent, errors). Used to improve site performance.</td>
                  <td>Up to 2 years</td>
                </tr>
                <tr>
                  <td><strong>Functional</strong></td>
                  <td>Remember your preferences (such as language or region) to provide a more personalised experience on return visits.</td>
                  <td>Up to 1 year</td>
                </tr>
                <tr>
                  <td><strong>Analytics</strong></td>
                  <td>Help us understand visitor behaviour via tools such as Google Analytics. Data is aggregated and anonymised.</td>
                  <td>Up to 2 years</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>Third-Party Cookies</h2>
            <p>
              Some cookies on our website are set by third-party services. We use the following:
            </p>
            <ul>
              <li>
                <strong>Google Analytics</strong> — to analyse website traffic and usage patterns.
                Google's privacy policy is available at{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  policies.google.com/privacy
                </a>.
              </li>
              <li>
                <strong>Google Maps</strong> — to display interactive property location maps.
                Embedded maps may set cookies when loaded.
              </li>
              <li>
                <strong>Social Media Platforms</strong> — if you interact with social share buttons
                or embedded content, those platforms (Instagram, Facebook, LinkedIn) may set their
                own cookies governed by their respective privacy policies.
              </li>
            </ul>
            <p>
              We do not control third-party cookies. Please refer to the respective third-party
              privacy and cookie policies for information about how they use your data.
            </p>
          </div>

          <div className="legal-section">
            <h2>Managing Your Cookie Preferences</h2>
            <p>
              You can control and manage cookies in a number of ways:
            </p>
            <ul>
              <li>
                <strong>Browser settings</strong> — most browsers allow you to refuse or delete
                cookies through their settings menu. Note that disabling cookies may affect the
                functionality of this and other websites.
              </li>
              <li>
                <strong>Google Analytics opt-out</strong> — you can prevent Google Analytics from
                collecting your data by installing the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </li>
              <li>
                <strong>Your Online Choices</strong> — visit{" "}
                <a href="https://www.youronlinechoices.com.au" target="_blank" rel="noopener noreferrer">
                  youronlinechoices.com.au
                </a>{" "}
                to manage interest-based advertising cookies from participating companies.
              </li>
            </ul>
            <p>
              Please note that strictly necessary cookies cannot be disabled as they are essential
              for the website to function.
            </p>
          </div>

          <div className="legal-section">
            <h2>Cookie Retention</h2>
            <p>
              Cookies are retained for the duration indicated in the table above. Session cookies
              expire when you close your browser. Persistent cookies remain on your device until
              they expire or are deleted manually.
            </p>
          </div>

          <div className="legal-section">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in the
              technologies we use or for other operational, legal, or regulatory reasons.
              Any updates will be posted on this page with a revised date.
            </p>
          </div>

          <div className="legal-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="legal-contact-block">
              <p>Real Gold Properties Pty Ltd</p>
              <p>PO Box 4024, Forest Lake QLD 4078, Australia</p>
              <p>
                Email:{" "}
                <a href="mailto:admin@realgoldproperties.com.au">
                  admin@realgoldproperties.com.au
                </a>
              </p>
              <p>
                Phone: <a href="tel:+61450009291">0450 009 291</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
