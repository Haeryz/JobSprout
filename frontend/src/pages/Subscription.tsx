import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import NeonGlow from '@/components/custom/NeonGlow'

// This badge component should be installed with 'npx shadcn-ui@latest add badge'
// If not installed yet, please install it first
const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}: { 
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive" | "success";
  className?: string;
}) => {
  const variantClasses = {
    default: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    success: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

const MotionCard = motion(Card)

const Subscription = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  
  // Define pricing for monthly and annual (annual with 20% discount)
  const pricing = {
    premium: {
      monthly: 29.99,
      annual: 29.99 * 12 * 0.8, // 20% off
    },
    premiumPlus: {
      monthly: 49.99,
      annual: 49.99 * 12 * 0.8, // 20% off
    },
  }
  
  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price)
  }
  

  // const monthlyPrice = isAnnual ? pricing.premium.annual / 12 : pricing.premium.monthly;
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#4ADE80] to-[#22C55E]">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select the perfect plan to accelerate your job search and land your dream role faster.
        </p>
        
        <div className="flex items-center justify-center mt-8 space-x-2">
          <span className={`text-sm font-medium ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
          <Switch 
            checked={isAnnual} 
            onCheckedChange={setIsAnnual} 
            className="data-[state=checked]:bg-green-500" 
          />
          <span className={`text-sm font-medium ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual <Badge variant="success" className="ml-1.5">Save 20%</Badge>
          </span>
        </div>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-3 lg:gap-12 mb-12">
        {/* Free Tier */}
        <MotionCard 
          className="relative overflow-hidden"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <CardDescription>Get started with basic features</CardDescription>
            <div className="mt-4 text-3xl font-bold">
              $0
              <span className="text-muted-foreground text-sm font-normal ml-1">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <div className="space-y-4">
              <FeatureItem included>Up to 30 job applications per month</FeatureItem>
              <FeatureItem included>Access to one job platform (Indeed)</FeatureItem>
              <FeatureItem included>Basic resume upload</FeatureItem>
              <FeatureItem included>Community support via forums or FAQs</FeatureItem>
              <FeatureItem>AI-powered resume optimization</FeatureItem>
              <FeatureItem>Multiple job platforms</FeatureItem>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Current Plan
            </Button>
          </CardFooter>
        </MotionCard>
        
        {/* Premium Tier */}
        <MotionCard
          className="relative overflow-hidden border-green-500 border-2 md:scale-105 md:-my-2"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="absolute -right-12 top-7 rotate-45 bg-green-500 text-white px-12 py-1 text-sm font-semibold">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Premium</CardTitle>
            <CardDescription>Perfect for active job seekers</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold">
                {isAnnual 
                  ? formatPrice(pricing.premium.annual / 12) 
                  : formatPrice(pricing.premium.monthly)}
                <span className="text-muted-foreground text-sm font-normal ml-1">/ month</span>
              </div>
              {isAnnual && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed {formatPrice(pricing.premium.annual)} annually
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <NeonGlow active color="green" className="relative -mx-2 px-2 rounded-md">
              <div className="space-y-4">
                <FeatureItem included>Up to 300 job applications per month</FeatureItem>
                <FeatureItem included>Access to multiple job platforms</FeatureItem>
                <FeatureItem included>Customization of resumes and cover letters</FeatureItem>
                <FeatureItem included>Basic analytics on application status</FeatureItem>
                <FeatureItem included>Email support for assistance</FeatureItem>
                <FeatureItem included>AI-powered resume optimization</FeatureItem>
                <FeatureItem>Advanced analytics and tracking</FeatureItem>
              </div>
            </NeonGlow>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </CardFooter>
        </MotionCard>
        
        {/* Premium+ Tier */}
        <MotionCard
          className="relative overflow-hidden"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <CardHeader>
            <CardTitle className="text-xl">Premium+</CardTitle>
            <CardDescription>Maximum features and support</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold">
                {isAnnual 
                  ? formatPrice(pricing.premiumPlus.annual / 12) 
                  : formatPrice(pricing.premiumPlus.monthly)}
                <span className="text-muted-foreground text-sm font-normal ml-1">/ month</span>
              </div>
              {isAnnual && (
                <div className="text-sm text-muted-foreground mt-1">
                  Billed {formatPrice(pricing.premiumPlus.annual)} annually
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <div className="space-y-4">
              <FeatureItem included>Unlimited job applications</FeatureItem>
              <FeatureItem included>All premium features</FeatureItem>
              <FeatureItem included>AI-powered cover letter generation</FeatureItem>
              <FeatureItem included>Advanced analytics and tracking</FeatureItem>
              <FeatureItem included>Priority customer support</FeatureItem>
              <FeatureItem included>AI-powered interview preparation</FeatureItem>
              <FeatureItem included>Career advice and coaching</FeatureItem>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-500/10">
              Upgrade to Premium+
            </Button>
          </CardFooter>
        </MotionCard>
      </div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-muted-foreground">
          All plans include access to JobSprout's core platform features.
          <br />Need a custom enterprise solution? <Button variant="link" className="p-0 h-auto">Contact our sales team</Button>
        </p>
      </motion.div>
      
      {/* Feature Comparison Section */}
      <motion.div 
        className="mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Compare All Features</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 font-medium">Feature</th>
                <th className="text-center py-4 px-6 font-medium">Free</th>
                <th className="text-center py-4 px-6 font-medium text-green-500">Premium</th>
                <th className="text-center py-4 px-6 font-medium">Premium+</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow 
                feature="Monthly Application Limit" 
                free="30" 
                premium="300" 
                premiumPlus="Unlimited" 
              />
              <ComparisonRow 
                feature="Job Platform Access" 
                free="1 (Indeed)" 
                premium="Multiple" 
                premiumPlus="All Platforms" 
              />
              <ComparisonRow 
                feature="Resume Customization" 
                free="Basic Upload" 
                premium="Full Customization" 
                premiumPlus="Advanced AI Optimization" 
              />
              <ComparisonRow 
                feature="Cover Letter Generation" 
                free={false} 
                premium="Basic Templates" 
                premiumPlus="AI-Generated Custom Letters" 
              />
              <ComparisonRow 
                feature="Application Analytics" 
                free={false} 
                premium="Basic Tracking" 
                premiumPlus="Advanced Analytics" 
              />
              <ComparisonRow 
                feature="Customer Support" 
                free="Community Forum" 
                premium="Email Support" 
                premiumPlus="Priority Support" 
              />
              <ComparisonRow 
                feature="Interview Preparation" 
                free={false} 
                premium={false} 
                premiumPlus="AI-Powered Mock Interviews" 
              />
              <ComparisonRow 
                feature="Career Advice" 
                free="Basic Articles" 
                premium="General Guidance" 
                premiumPlus="Personalized Coaching" 
              />
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* FAQ Section could go here */}
    </div>
  )
}

// Feature Item Component for Plan Cards
const FeatureItem = ({ children, included = false }: { children: React.ReactNode; included?: boolean }) => {
  return (
    <div className="flex items-start">
      {included ? (
        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
      )}
      <span className={included ? "" : "text-muted-foreground"}>{children}</span>
    </div>
  )
}

// Comparison Row Component for Feature Table
const ComparisonRow = ({ 
  feature, 
  free, 
  premium, 
  premiumPlus 
}: { 
  feature: string; 
  free: string | boolean; 
  premium: string | boolean; 
  premiumPlus: string | boolean; 
}) => {
  const renderCell = (value: string | boolean) => {
    if (value === false) return <X className="w-5 h-5 text-muted-foreground mx-auto" />;
    if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
    return value;
  };

  return (
    <tr className="border-b">
      <td className="py-4 px-6">{feature}</td>
      <td className="text-center py-4 px-6">{renderCell(free)}</td>
      <td className="text-center py-4 px-6">{renderCell(premium)}</td>
      <td className="text-center py-4 px-6">{renderCell(premiumPlus)}</td>
    </tr>
  );
};

export default Subscription