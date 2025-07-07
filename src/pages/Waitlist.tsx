
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.joinWaitlist(email);
      
      if (response.success) {
        setIsSubmitted(true);
        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you when we launch. Get ready for something amazing!",
        });
      } else {
        toast({
          title: "Oops!",
          description: response.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-whispr-purple/10 via-transparent to-whispr-purple-dark/10" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -10, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-4 mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Join the{" "}
                  <motion.span
                    className="text-primary relative"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                        "0 0 40px rgba(139, 92, 246, 0.8)",
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Seducely AI
                  </motion.span>{" "}
                  Revolution
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                Be among the first to experience ultra-realistic AI voice generation with stunning visual personalities. 
                Early access members get exclusive features and lifetime benefits.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">What you'll get:</h3>
                <ul className="space-y-3">
                  {[
                    "🎯 Priority early access to all features",
                    "🎁 50% discount on first subscription",
                    "💎 Exclusive voice models only for early members",
                    "🔥 Beta testing of new AI personalities",
                    "📱 Direct feedback channel with our team"
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center text-muted-foreground"
                    >
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Discord CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="pt-6 border-t border-border/20"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Join our Discord community for exclusive updates and sneak peeks
                </p>
                <Button
                  variant="whispr-outline"
                  asChild
                  className="group w-full sm:w-auto"
                >
                  <a
                    href="https://discord.gg/VkeyBCjE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5 text-primary group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    Join Discord Community
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {!isSubmitted ? (
                <>
                  <CardHeader className="relative z-10 text-center">
                    <motion.div
                      className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Mail className="h-8 w-8 text-primary" />
                    </motion.div>
                    <CardTitle className="text-2xl">Reserve Your Spot</CardTitle>
                    <p className="text-muted-foreground">
                      Join <span className="text-primary font-bold">15,000+</span> creators waiting for launch
                    </p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-input/50 border-border/50 focus:border-primary/50 h-12 text-lg"
                        />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="whispr-primary"
                          className="w-full h-12 text-lg relative overflow-hidden group"
                          disabled={isLoading}
                        >
                          <motion.div
                            animate={{ x: [-200, 200] }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          />
                          <span className="relative z-10">
                            {isLoading ? "Joining..." : "Secure My Early Access"}
                          </span>
                        </Button>
                      </motion.div>
                      <p className="text-xs text-center text-muted-foreground">
                        🔒 We respect your privacy. No spam, unsubscribe anytime.
                      </p>
                    </form>
                  </CardContent>
                </>
              ) : (
                <CardContent className="relative z-10 text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold mb-4">You're In! 🎉</h3>
                    <p className="text-muted-foreground mb-6">
                      Welcome to the Seducely AI family! You'll be among the first to know when we launch. 
                      Get ready for something extraordinary.
                    </p>
                    <Button
                      variant="whispr-outline"
                      onClick={() => navigate("/")}
                      className="w-full"
                    >
                      Explore More Features
                    </Button>
                  </motion.div>
                </CardContent>
              )}
            </Card>

            {/* Voice Model Preview Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              <div className="relative group">
                <img
                  src="/lovable-uploads/14409e85-31c6-4734-9111-93f71150b711.png"
                  alt="Linh - Sweet AI Voice"
                  className="w-full aspect-square rounded-xl object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-medium">Linh - Sweet Voice</span>
                </div>
              </div>
              <div className="relative group">
                <img
                  src="/lovable-uploads/8f3d2a00-ac1a-4dc9-beaa-22ce697945f3.png"
                  alt="Miara - Cute AI Voice"
                  className="w-full aspect-square rounded-xl object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-medium">Miara - Cute Voice</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
