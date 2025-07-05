
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mic, Download, Share, Pen, User, ChevronDown, Play, Lightbulb, Brain, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import AnimatedCounter from "@/components/AnimatedCounter";
import WaveAnimation from "@/components/WaveAnimation";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import VoiceCard from "@/components/VoiceCard";
import AnimatedIcon from "@/components/AnimatedIcon";

const Index = () => {
  const [selectedVoice, setSelectedVoice] = useState("Luna");
  const [message, setMessage] = useState("");
  const [selectedVoiceFilter, setSelectedVoiceFilter] = useState("All");
  const [isTyping, setIsTyping] = useState(false);

  const voices = [
    { 
      name: "Luna", 
      type: "Soft", 
      description: "Gentle, warm whispers with a hint of playfulness", 
      avatar: "L",
      quote: "Let me whisper sweet secrets in your ear..."
    },
    { 
      name: "Ava", 
      type: "Playful", 
      description: "Upbeat, flirtatious tone with a melodic rhythm", 
      avatar: "A",
      quote: "Ready for some fun? I'll make you smile..."
    },
    { 
      name: "Sofia", 
      type: "Dominant", 
      description: "Confident, assertive voice with commanding presence", 
      avatar: "S",
      quote: "I know exactly what you need to hear..."
    },
  ];

  const voiceFilters = ["All", "Soft", "Playful", "Dominant", "Accented", "Breathy"];

  const filteredVoices = selectedVoiceFilter === "All" 
    ? voices 
    : voices.filter(voice => voice.type === selectedVoiceFilter);

  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.3, triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.3, triggerOnce: true });
  const { ref: stepsRef, inView: stepsInView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Top Banner */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-purple text-white text-center py-3 px-4 relative overflow-hidden"
      >
        <motion.div
          animate={{ x: [-100, 100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <p className="text-sm font-medium relative z-10">
          NEW 100% Ultra-Realistic AI Voices
        </p>
      </motion.div>

      {/* Header/Navigation */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Mic className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="text-2xl font-bold">Whispr.AI</span>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#voices" className="hover:text-primary transition-colors">Voices</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost">Login</Button>
              <Button variant="whispr-primary">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Background */}
      <section ref={heroRef} className="py-20 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-whispr-purple/10 via-transparent to-whispr-purple-dark/10" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -5, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Create Your Own{" "}
                  <motion.span 
                    className="text-primary relative"
                    animate={{ 
                      textShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.5)",
                        "0 0 40px rgba(139, 92, 246, 0.8)",
                        "0 0 20px rgba(139, 92, 246, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Seductive
                  </motion.span>{" "}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    AI Voice Notes
                  </motion.span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Generate captivating, ultra-realistic voice notes to engage with your audience. 
                  Choose from various voice styles and personalities.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  variant="whispr-primary" 
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10">Start Creating Now</span>
                </Button>
                <Button variant="whispr-outline" size="lg" className="group">
                  <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Listen to Demos
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">
                    <AnimatedCounter end={12000} suffix="+" />
                  </span>
                  <span>Creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">
                    <AnimatedCounter end={500000} suffix="+" />
                  </span>
                  <span>Voice Notes</span>
                </div>
              </motion.div>

              {/* Testimonial Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.4 }}
              >
                <TestimonialCarousel />
              </motion.div>
            </div>

            {/* Enhanced Voice Generation Widget */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      Generate Voice
                      <Badge className="bg-primary/20 text-primary animate-pulse">AI Powered</Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Select Voice</label>
                    <div className="space-y-3">
                      {voices.map((voice) => (
                        <motion.div
                          key={voice.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant={selectedVoice === voice.name ? "whispr-primary" : "outline"}
                            className="w-full h-auto p-4 justify-start"
                            onClick={() => setSelectedVoice(voice.name)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                {voice.avatar}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{voice.name}</div>
                                <div className="text-xs opacity-70">{voice.type}</div>
                              </div>
                            </div>
                            {selectedVoice === voice.name && (
                              <div className="ml-auto">
                                <WaveAnimation isActive={true} />
                              </div>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Your Message</label>
                    <Textarea
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setIsTyping(e.target.value.length > 0);
                      }}
                      className="min-h-[100px] bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                    />
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center"
                      >
                        <WaveAnimation isActive={true} />
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="whispr-primary" 
                      className="w-full relative overflow-hidden group" 
                      size="lg"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-primary via-primary-hover to-primary opacity-80"
                      />
                      <span className="relative z-10">Generate Voice Note</span>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="ml-2 relative z-10"
                      >
                        <Mic className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 px-4 bg-secondary/20 relative">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need For Perfect Voice Notes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform offers all the tools you need to create engaging, realistic voice content for your audience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Mic, title: "Realistic AI Voice Generation", description: "Create ultra-realistic voice notes that sound natural and engaging using cutting-edge AI technology.", delay: 0 },
              { icon: User, title: "Multiple Voice Personalities", description: "Choose from a variety of voice styles and personalities to match your content needs.", delay: 0.2 },
              { icon: Download, title: "Instant MP3 Downloads", description: "Generate and download high-quality MP3 files instantly for use across your platforms.", delay: 0.4 }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: feature.delay, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300 h-full">
                  <CardHeader>
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How Whispr.AI Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your creative vision into reality with our powerful AI-driven workflow in just four simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: User, title: "Choose a Voice", description: "Select from our library of premium AI voices with different personalities and styles.", number: "01" },
              { icon: Pen, title: "Write Your Message", description: "Craft your custom message or select from our pre-written templates.", number: "02" },
              { icon: Mic, title: "Generate Audio", description: "Our AI transforms your text into a natural-sounding voice note in seconds.", number: "03" },
              { icon: Share, title: "Share & Connect", description: "Download and share your voice notes across all your platforms.", number: "04" }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={stepsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center space-y-4 relative"
              >
                <motion.div 
                  className="relative mx-auto w-20 h-20"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-purple flex items-center justify-center shadow-purple">
                    <AnimatedIcon icon={step.icon} delay={index * 0.1} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < 3 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={stepsInView ? { width: "100%" } : {}}
                    transition={{ delay: 1 + index * 0.3, duration: 0.8 }}
                    className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-primary to-transparent z-0"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Voices Section */}
      <section id="voices" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Discover Our Premium Voices</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our collection of ultra-realistic AI voices for your content. Listen to previews and find the perfect match for your style.
            </p>
          </div>

          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {voiceFilters.map((filter, index) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedVoiceFilter === filter ? "whispr-primary" : "outline"}
                  onClick={() => setSelectedVoiceFilter(filter)}
                  className="rounded-full relative overflow-hidden"
                >
                  {selectedVoiceFilter === filter && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredVoices.map((voice, index) => (
              <motion.div
                key={voice.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VoiceCard
                  {...voice}
                  isSelected={selectedVoice === voice.name}
                  onSelect={() => setSelectedVoice(voice.name)}
                  onPreview={() => console.log(`Playing ${voice.name} preview`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your voice creation needs. All plans include our core features.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground"
            >
              <span>Trusted by</span>
              <span className="font-bold text-primary">
                <AnimatedCounter end={10000} suffix="+" />
              </span>
              <span>creators worldwide</span>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card h-full relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Basic Plan</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-4xl font-bold">$19<span className="text-lg text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "50 AI Voice Credits",
                      "5 Voice Personalities", 
                      "MP3 Downloads",
                      "History for 30 days"
                    ].map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-green-500 text-xs">✓</span>
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Get Started</Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary z-10 animate-pulse">
                  Most Popular
                </Badge>
              </motion.div>
              <Card className="bg-gradient-to-br from-card/80 to-primary/10 backdrop-blur border-primary/50 shadow-purple h-full relative overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
                />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl">Creator Plan</CardTitle>
                  <CardDescription>Most popular for content creators</CardDescription>
                  <div className="text-4xl font-bold">$49<span className="text-lg text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <ul className="space-y-3">
                    {[
                      "150 AI Voice Credits",
                      "All Voice Personalities",
                      "MP3 & WAV Downloads", 
                      "History Forever",
                      "Priority Support"
                    ].map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-green-500 text-xs">✓</span>
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="relative z-10">
                  <Button variant="whispr-primary" className="w-full">Subscribe Now</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about Whispr.AI. If you don't see what you're looking for, reach out to our support team.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                icon: Lightbulb,
                question: "What is Whispr.AI?",
                answer: "Whispr.AI is an advanced AI voice generation platform that creates ultra-realistic voice notes from text. Our technology allows you to choose from various voice personalities and styles to create engaging audio content."
              },
              {
                icon: Brain,
                question: "How does the credit system work?",
                answer: "Each voice generation uses one credit. Credits reset monthly with your subscription. Unused credits don't roll over, but you can always upgrade your plan for more credits."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index + 1}`} className="bg-card/50 backdrop-blur border border-border/20 rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline group">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30"
                      >
                        <faq.icon className="h-4 w-4 text-primary" />
                      </motion.div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
        <motion.div
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />
        
        {/* Voice Wave Animation Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-96 h-96"
          >
            <WaveAnimation isActive={true} />
          </motion.div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 bg-card/20 backdrop-blur-lg rounded-2xl p-12 border border-border/20"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold"
              animate={{ 
                backgroundImage: [
                  "linear-gradient(45deg, #ffffff, #8b5cf6)",
                  "linear-gradient(45deg, #8b5cf6, #ffffff)", 
                  "linear-gradient(45deg, #ffffff, #8b5cf6)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
            >
              Ready to Create Your First AI Voice Note?
            </motion.h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of creators already using Whispr.AI to connect with their audience in a more personal and engaging way.
            </p>
            
            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Bell className="h-4 w-4 text-primary" />
                <span>Loved by <AnimatedCounter end={12000} suffix="+" /> creators</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <span className="text-primary">#1</span>
                <span>Seductive AI Voice Tool</span>
              </div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="whispr-primary" 
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <motion.div
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  <span className="relative z-10">Get Started Free</span>
                </Button>
              </motion.div>
              <Button variant="link" size="lg" className="text-primary hover:text-primary-hover">
                <Play className="h-4 w-4 mr-2" />
                Try Live Demo
              </Button>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              No credit card required to start • Cancel anytime • Free tier available
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
