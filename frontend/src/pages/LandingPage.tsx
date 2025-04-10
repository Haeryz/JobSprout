import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  Check, 
  LineChart, 
  ChevronRight, 
  Users, 
  Building, 
  Shield, 
  Zap, 
  PanelRight, 
  Sparkles, 
  BarChart, 
  X,
  Rocket,
  BadgeCheck,
  Timer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import NeonGlow from '@/components/custom/NeonGlow'

const LandingPage = () => {
  const navigate = useNavigate()
  const [isHeroButtonHovered, setIsHeroButtonHovered] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/10 py-24 relative overflow-hidden flex justify-center">
        {/* Gradient Elements */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full filter blur-[100px] opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/20 rounded-full filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
        
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10"
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div 
              className="space-y-2"
              variants={fadeInUp}
            >
              <Badge variant="outline" className="px-3 py-1">
                <Rocket className="h-3.5 w-3.5 mr-1" />
                <span>Modern Job Search Platform</span>
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
                The SaaS Solution for <br />
                Job Seekers
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Streamline your job search, manage applications efficiently, and land your dream job faster with JobSprout's integrated platform.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 mt-6"
              variants={fadeInUp}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-b from-[#4ADE80] to-[#22C55E] hover:from-[#22C55E] hover:to-[#22C55E] rounded-full h-12 px-8
                shadow-[0_0_0_3px_rgba(74,222,128,0.1)]
                dark:shadow-[0_0_15px_1px_rgba(74,222,128,0.4)]
                hover:dark:shadow-[0_0_25px_5px_rgba(74,222,128,0.5)]
                transition-all duration-300"
                onMouseEnter={() => setIsHeroButtonHovered(true)}
                onMouseLeave={() => setIsHeroButtonHovered(false)}
                onClick={() => navigate('/auth/sign-up')}
              >
                Get Started Free
                <ChevronRight className={`h-4 w-4 ml-2 transition-transform duration-200 ${isHeroButtonHovered ? 'transform translate-x-1' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full h-12 px-8"
                onClick={() => {
                  const featuresElement = document.getElementById('features')
                  if (featuresElement) {
                    featuresElement.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                See Features
              </Button>
            </motion.div>
          </div>
          
          {/* Dashboard Preview */}
          <motion.div 
            className="relative mt-16 mx-auto max-w-5xl"
            variants={fadeInUp}
          >
            <div className="relative rounded-xl overflow-hidden border shadow-xl dark:shadow-primary/20">
              <NeonGlow active color="green" className="relative">
                <img 
                  src="/images/dashboard-preview.png" 
                  alt="JobSprout Dashboard" 
                  className="w-full rounded-lg"
                  onError={(e) => {
                    // Fallback if the image doesn't exist
                    e.currentTarget.src = "https://placehold.co/1200x800/22C55E/FFFFFF?text=JobSprout+Dashboard&font=Montserrat"
                  }}
                />
              </NeonGlow>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Floating Cards */}
            <div className="hidden lg:block absolute -right-12 -bottom-8">
              <Card className="w-52 shadow-lg">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-500">+27%</span>
                    <BarChart className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="hidden lg:block absolute -left-8 top-1/4">
              <Card className="w-52 shadow-lg">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-500">+42%</span>
                    <LineChart className="h-5 w-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          style={{ opacity, y }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-muted flex justify-center">
            <motion.div 
              className="w-1.5 h-3 bg-muted rounded-full mt-2"
              animate={{ 
                y: [0, 12, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-background flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Unbeatable Features for Job Seekers</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need to streamline your job search and stand out from the competition.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <FeatureCard 
              icon={<PanelRight className="h-6 w-6 text-white" />}
              title="Smart Job Tracking"
              description="Organize all your job applications in one place with automatic status updates and reminders."
              index={0}
            />
            
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6 text-white" />}
              title="AI-Powered Resume Optimization"
              description="Get personalized suggestions to improve your resume for each job application."
              index={1}
            />
            
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-white" />}
              title="Team Management"
              description="Effortlessly collaborate with mentors or career coaches to improve your job search strategy."
              index={2}
            />
            
            <FeatureCard 
              icon={<Building className="h-6 w-6 text-white" />}
              title="Multi-Platform Integration"
              description="Search and apply to jobs across multiple job boards with a single click."
              index={3}
            />
            
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-white" />}
              title="Secure Authentication"
              description="Your data is protected with enterprise-grade security and authentication."
              index={4}
            />
            
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-white" />}
              title="Advanced Analytics"
              description="Gain insights into your job search performance with detailed analytics and reports."
              index={5}
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section - Using Shadcn Tabs */}
      <section className="w-full py-24 bg-muted/30 dark:bg-muted/10 flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Choose Your Plan</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Start with our free plan and upgrade as your job search needs grow.
            </p>
          </motion.div>
          
          <div className="flex justify-center w-full">
            <Tabs defaultValue="monthly" className="w-full max-w-4xl">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="monthly" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <PricingCard
                    title="Free"
                    description="Get started with basic features"
                    price="$0"
                    period="/month"
                    buttonText="Get Started"
                    buttonVariant="outline"
                    buttonAction={() => navigate('/auth/sign-up')}
                    features={[
                      { included: true, text: "Up to 30 job applications" },
                      { included: true, text: "Basic resume upload" },
                      { included: true, text: "Job search across one platform" },
                      { included: true, text: "Community access" },
                      { included: false, text: "AI resume optimization" },
                      { included: false, text: "Analytics dashboard" }
                    ]}
                    index={0}
                  />
                  
                  {/* Premium Plan */}
                  <PricingCard
                    title="Premium"
                    description="Perfect for active job seekers"
                    price="$29"
                    period="/month"
                    buttonText="Upgrade Now"
                    buttonVariant="default"
                    buttonAction={() => navigate('/app/subscription')}
                    features={[
                      { included: true, text: "Up to 300 job applications" },
                      { included: true, text: "AI-powered resume optimization" },
                      { included: true, text: "Job search across all platforms" },
                      { included: true, text: "Analytics dashboard" },
                      { included: true, text: "Email support" },
                      { included: true, text: "Custom application tracking" },
                      { included: false, text: "Interview preparation" }
                    ]}
                    popular={true}
                    index={1}
                  />
                  
                  {/* Premium+ Plan */}
                  <PricingCard
                    title="Premium+"
                    description="Maximum features and support"
                    price="$49"
                    period="/month"
                    buttonText="Upgrade to Premium+"
                    buttonVariant="outline"
                    buttonAction={() => navigate('/app/subscription')}
                    buttonStyle="border-primary text-primary hover:bg-primary/10"
                    features={[
                      { included: true, text: "Unlimited job applications" },
                      { included: true, text: "All Premium features" },
                      { included: true, text: "AI-powered interview preparation" },
                      { included: true, text: "Cover letter generation" },
                      { included: true, text: "Priority support" },
                      { included: true, text: "Career coaching sessions" },
                      { included: true, text: "Personalized job recommendations" }
                    ]}
                    index={2}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="annual" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Free Plan - Annual */}
                  <PricingCard
                    title="Free"
                    description="Get started with basic features"
                    price="$0"
                    period="/month"
                    buttonText="Get Started"
                    buttonVariant="outline"
                    buttonAction={() => navigate('/auth/sign-up')}
                    features={[
                      { included: true, text: "Up to 30 job applications" },
                      { included: true, text: "Basic resume upload" },
                      { included: true, text: "Job search across one platform" },
                      { included: true, text: "Community access" },
                      { included: false, text: "AI resume optimization" },
                      { included: false, text: "Analytics dashboard" }
                    ]}
                    index={0}
                  />
                  
                  {/* Premium Plan - Annual */}
                  <PricingCard
                    title="Premium"
                    description="Perfect for active job seekers"
                    price="$23"
                    period="/month"
                    annualPrice="$276"
                    buttonText="Upgrade Now"
                    buttonVariant="default"
                    buttonAction={() => navigate('/app/subscription')}
                    features={[
                      { included: true, text: "Up to 300 job applications" },
                      { included: true, text: "AI-powered resume optimization" },
                      { included: true, text: "Job search across all platforms" },
                      { included: true, text: "Analytics dashboard" },
                      { included: true, text: "Email support" },
                      { included: true, text: "Custom application tracking" },
                      { included: false, text: "Interview preparation" }
                    ]}
                    popular={true}
                    index={1}
                  />
                  
                  {/* Premium+ Plan - Annual */}
                  <PricingCard
                    title="Premium+"
                    description="Maximum features and support"
                    price="$39"
                    period="/month"
                    annualPrice="$468"
                    buttonText="Upgrade to Premium+"
                    buttonVariant="outline"
                    buttonAction={() => navigate('/app/subscription')}
                    buttonStyle="border-primary text-primary hover:bg-primary/10"
                    features={[
                      { included: true, text: "Unlimited job applications" },
                      { included: true, text: "All Premium features" },
                      { included: true, text: "AI-powered interview preparation" },
                      { included: true, text: "Cover letter generation" },
                      { included: true, text: "Priority support" },
                      { included: true, text: "Career coaching sessions" },
                      { included: true, text: "Personalized job recommendations" }
                    ]}
                    index={2}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center mt-8 text-muted-foreground">
            All plans include access to JobSprout's core platform features. <br />
            Need custom features for your organization? <Button variant="link" className="p-0 h-auto text-primary">Contact us</Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="w-full py-24 bg-background flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">What Our Users Say</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Job seekers like you have found success with JobSprout.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonials */}
            <Testimonial 
              content="JobSprout helped me organize my job search and track applications efficiently. I landed a great position within 6 weeks!"
              name="Sarah K."
              role="Software Engineer"
              index={0}
            />
            
            <Testimonial 
              content="The AI resume optimization gave me the edge I needed. I saw an immediate increase in interview invitations after using it."
              name="Michael T."
              role="Marketing Manager"
              index={1}
            />
            
            <Testimonial 
              content="Premium+ was worth every penny. The career coaching and interview prep helped me negotiate a salary 15% higher than I expected."
              name="Jessica L."
              role="Product Manager"
              index={2}
            />
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="w-full py-24 bg-muted/30 dark:bg-muted/10 flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard
              value="90%"
              label="Success Rate"
              icon={<BadgeCheck className="h-6 w-6 text-primary" />}
            />
            
            <StatCard
              value="7 days"
              label="Avg. First Interview"
              icon={<Timer className="h-6 w-6 text-primary" />}
            />
            
            <StatCard
              value="10,000+"
              label="Active Users"
              icon={<Users className="h-6 w-6 text-primary" />}
            />
            
            <StatCard
              value="1.5M+"
              label="Applications Sent"
              icon={<Rocket className="h-6 w-6 text-primary" />}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-24 bg-primary text-primary-foreground flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Ready to take your job search to the next level?</h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Get started today with our free plan. No credit card required.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg"
                className="bg-background text-primary hover:bg-background/90 rounded-full h-12 px-8 shadow-lg"
                onClick={() => navigate('/auth/sign-up')}
              >
                Start Your Free Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }: { 
  icon: React.ReactNode;
  title: string; 
  description: string;
  index: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="bg-gradient-to-br from-primary to-primary/80 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Pricing Card Component
const PricingCard = ({ 
  title, 
  description, 
  price, 
  period, 
  annualPrice,
  buttonText, 
  buttonVariant, 
  buttonAction,
  buttonStyle,
  features,
  popular = false,
  index
}: { 
  title: string; 
  description: string; 
  price: string; 
  period: string; 
  annualPrice?: string;
  buttonText: string; 
  buttonVariant: "default" | "outline"; 
  buttonAction: () => void;
  buttonStyle?: string;
  features: { included: boolean; text: string }[];
  popular?: boolean;
  index: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={popular ? "md:-my-2 md:z-10" : ""}
    >
      <Card className={`h-full ${popular ? "border-primary md:scale-105" : ""} relative ${popular ? "pt-2" : ""}`}>
        {popular && (
          <div className="absolute top-0 left-0 right-0 flex justify-center -mt-3">
            <Badge className="px-3 py-1 capitalize bg-primary hover:bg-primary text-primary-foreground shadow-sm">Most Popular</Badge>
          </div>
        )}
        <CardHeader className={popular ? "pt-4" : ""}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground text-sm ml-1">{period}</span>
          </div>
          {annualPrice && (
            <div className="text-sm text-muted-foreground mt-1">
              Billed {annualPrice} annually
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start">
                {feature.included ? (
                  <Check className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                )}
                <span className={`${feature.included ? "" : "text-muted-foreground"}`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            variant={buttonVariant} 
            className={`w-full ${buttonStyle || ''} ${popular && buttonVariant === "default" ? "bg-primary hover:bg-primary/90" : ""}`}
            onClick={buttonAction}
          >
            {buttonVariant === "default" && popular && <Zap className="w-4 h-4 mr-2" />}
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Testimonial Component
const Testimonial = ({ content, name, role, index }: {
  content: string;
  name: string;
  role: string;
  index: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="italic text-muted-foreground mb-6">"{content}"</p>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="font-semibold">{name}</p>
              <p className="text-muted-foreground text-sm">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Stat Card Component
const StatCard = ({ value, label, icon }: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center space-y-2"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        {icon}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  )
}

export default LandingPage