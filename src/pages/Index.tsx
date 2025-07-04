import { useState } from "react";
import { Mic, Download, Share, Pen, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const [selectedVoice, setSelectedVoice] = useState("Luna");
  const [message, setMessage] = useState("");
  const [selectedVoiceFilter, setSelectedVoiceFilter] = useState("All");

  const voices = [
    { name: "Luna", type: "Soft", description: "Gentle, warm whispers with a hint of playfulness", avatar: "L" },
    { name: "Ava", type: "Playful", description: "Upbeat, flirtatious tone with a melodic rhythm", avatar: "A" },
    { name: "Sofia", type: "Dominant", description: "Confident, assertive voice with commanding presence", avatar: "S" },
  ];

  const voiceFilters = ["All", "Soft", "Playful", "Dominant", "Accented", "Breathy"];

  const filteredVoices = selectedVoiceFilter === "All" 
    ? voices 
    : voices.filter(voice => voice.type === selectedVoiceFilter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <div className="bg-gradient-purple text-white text-center py-3 px-4">
        <p className="text-sm font-medium">
          NEW 100% Ultra-Realistic AI Voices
        </p>
      </div>

      {/* Header/Navigation */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Whispr.AI</span>
            </div>
            
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Create Your Own{" "}
                  <span className="text-primary">Seductive</span>{" "}
                  AI Voice Notes
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Generate captivating, ultra-realistic voice notes to engage with your audience. 
                  Choose from various voice styles and personalities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="whispr-primary" size="lg">
                  Start Creating Now
                </Button>
                <Button variant="whispr-outline" size="lg">
                  Listen to Demos
                </Button>
              </div>
            </div>

            {/* Voice Generation Widget */}
            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Generate Voice
                    <Badge className="bg-primary/20 text-primary">AI Powered</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Voice</label>
                  <div className="grid grid-cols-3 gap-2">
                    {voices.map((voice) => (
                      <Button
                        key={voice.name}
                        variant={selectedVoice === voice.name ? "whispr-primary" : "outline"}
                        className="h-auto p-3 flex-col"
                        onClick={() => setSelectedVoice(voice.name)}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                          {voice.avatar}
                        </div>
                        <span className="text-xs">{voice.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Your Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px] bg-input/50"
                  />
                </div>

                <Button variant="whispr-primary" className="w-full" size="lg">
                  Generate Voice Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need For Perfect Voice Notes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform offers all the tools you need to create engaging, realistic voice content for your audience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Realistic AI Voice Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create ultra-realistic voice notes that sound natural and engaging using cutting-edge AI technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multiple Voice Personalities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose from a variety of voice styles and personalities to match your content needs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant MP3 Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate and download high-quality MP3 files instantly for use across your platforms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Whispr.AI Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your creative vision into reality with our powerful AI-driven workflow in just four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: User, title: "Choose a Voice", description: "Select from our library of premium AI voices with different personalities and styles." },
              { icon: Pen, title: "Write Your Message", description: "Craft your custom message or select from our pre-written templates." },
              { icon: Mic, title: "Generate Audio", description: "Our AI transforms your text into a natural-sounding voice note in seconds." },
              { icon: Share, title: "Share & Connect", description: "Share & Connect" }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
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

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {voiceFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedVoiceFilter === filter ? "whispr-primary" : "outline"}
                onClick={() => setSelectedVoiceFilter(filter)}
                className="rounded-full"
              >
                {filter}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredVoices.map((voice) => (
              <Card key={voice.name} className="bg-card/50 backdrop-blur border-border/20 shadow-card hover:shadow-purple transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">{voice.avatar}</span>
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {voice.name}
                        <Badge variant="outline">{voice.type}</Badge>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{voice.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Preview</Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your voice creation needs. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Basic Plan</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-4xl font-bold">$19<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    50 AI Voice Credits
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    5 Voice Personalities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    MP3 Downloads
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    History for 30 days
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/20 shadow-card relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
              <CardHeader>
                <CardTitle className="text-2xl">Creator Plan</CardTitle>
                <CardDescription>Most popular for content creators</CardDescription>
                <div className="text-4xl font-bold">$49<span className="text-lg text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    150 AI Voice Credits
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    All Voice Personalities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    MP3 & WAV Downloads
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    History Forever
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    Priority Support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="whispr-primary" className="w-full">Subscribe Now</Button>
              </CardFooter>
            </Card>
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
            <AccordionItem value="item-1" className="bg-card/50 backdrop-blur border border-border/20 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                What is Whispr.AI?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Whispr.AI is an advanced AI voice generation platform that creates ultra-realistic voice notes from text. 
                Our technology allows you to choose from various voice personalities and styles to create engaging audio content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card/50 backdrop-blur border border-border/20 rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                How does the credit system work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Each voice generation uses one credit. Credits reset monthly with your subscription. 
                Unused credits don't roll over, but you can always upgrade your plan for more credits.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">Ready to Create Your First AI Voice Note?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of creators already using Whispr.AI to connect with their audience in a more personal and engaging way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="whispr-primary" size="lg">
                Get Started Free
              </Button>
              <Button variant="link" size="lg" className="text-primary">
                Try Live Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required to start • Cancel anytime • Free tier available
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;