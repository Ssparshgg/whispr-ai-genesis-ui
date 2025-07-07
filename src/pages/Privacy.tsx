
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Seducely AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold">Seducely AI</span>
            </div>
            <Button
              variant="whispr-outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: December 2024
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur border border-border/20 rounded-xl p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">1. Information We Collect</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us, such as:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Account information (email, username)</li>
                  <li>Text content you submit for voice generation</li>
                  <li>Payment information (processed by secure third-party providers)</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">2. How We Use Your Information</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide and improve our voice generation services</li>
                  <li>Process payments and manage your account</li>
                  <li>Send important service updates and notifications</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data transmission is encrypted using industry-standard protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only as long as necessary to provide our services and fulfill legal obligations. Generated voice files are stored temporarily for download and then automatically deleted from our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services for payment processing, analytics, and infrastructure. These providers are contractually bound to protect your data and use it only for the specified purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">6. Your Rights</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">7. AI Training and Content Usage</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not use your text inputs or generated voice content to train our AI models. Your content remains private and is used solely to provide the requested voice generation service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized content. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@seducely.ai" className="text-primary hover:underline">
                  privacy@seducely.ai
                </a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
