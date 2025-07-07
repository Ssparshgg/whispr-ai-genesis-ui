import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
							onClick={() => navigate("/waitlist")}
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
						<h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
						<p className="text-lg text-muted-foreground">
							Last updated: July 2025
						</p>
					</div>

					<div className="bg-card/50 backdrop-blur border border-border/20 rounded-xl p-8 space-y-6">
						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								1. Acceptance of Terms
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								By accessing and using Seducely AI, you accept and agree to be
								bound by the terms and provision of this agreement. If you do
								not agree to abide by the above, please do not use this service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								2. Service Description
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								Seducely AI provides AI-powered voice generation services that
								allow users to create synthetic voice content from text input.
								All voices are artificially generated and do not represent real
								individuals.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								3. User Responsibilities
							</h2>
							<div className="space-y-3">
								<p className="text-muted-foreground leading-relaxed">
									Users are responsible for:
								</p>
								<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
									<li>
										Using the service in compliance with all applicable laws
									</li>
									<li>
										Not creating content that violates intellectual property
										rights
									</li>
									<li>
										Not using the service for harmful, illegal, or unethical
										purposes
									</li>
									<li>
										Maintaining the confidentiality of account credentials
									</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								4. Content and Usage Rights
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								You retain ownership of the text content you input. The
								generated voice files are provided to you for your commercial
								and personal use. We do not claim ownership of your generated
								content.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								5. Privacy and Data
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								Your privacy is important to us. We collect and process data in
								accordance with our Privacy Policy. We do not use your content
								to train our AI models or share your data with third parties.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								6. Billing and Refunds
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								Subscriptions are billed monthly or annually as selected.
								Credits are non-refundable once used. Unused credits expire at
								the end of each billing cycle for monthly plans.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								7. Service Availability
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								We strive to maintain service availability but do not guarantee
								uninterrupted access. We reserve the right to modify, suspend,
								or discontinue the service with notice.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								8. Limitation of Liability
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								Seducely AI shall not be liable for any indirect, incidental,
								special, or consequential damages arising from the use of our
								service. Our total liability is limited to the amount paid for
								the service.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-bold mb-4 text-primary">
								9. Contact Information
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								For questions about these Terms of Service, please contact us at{" "}
								<a
									href="mailto:support@seducely.ai"
									className="text-primary hover:underline"
								>
									support@seducely.ai
								</a>
							</p>
						</section>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Terms;
