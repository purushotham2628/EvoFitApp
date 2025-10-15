import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp, Users, Utensils, Dumbbell, BarChart3, ArrowRight } from "lucide-react";
import heroImage from "@assets/stock_images/athletic_person_doin_f44ce44d.jpg";

export default function Landing() {
  const features = [
    {
      icon: Utensils,
      title: "Nutrition Tracking",
      description: "Search and log from 90,000+ foods with comprehensive nutritional data powered by Nutritionix API",
    },
    {
      icon: Dumbbell,
      title: "Workout Logger",
      description: "Track exercises, sets, reps, and weight with detailed workout history and progress tracking",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Visualize your progress with interactive charts for calories, macros, and body metrics over time",
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Share your journey, get motivated by others, and celebrate achievements together",
    },
    {
      icon: TrendingUp,
      title: "Goal Setting",
      description: "Set personalized nutrition and fitness goals and track your progress towards them",
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Monitor daily calorie intake, workout completion, and maintain your fitness streak",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        
        <div className="relative z-10 container px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground" data-testid="text-hero-title">
            Evolve Your Fitness Journey
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-2xl mx-auto">
            Track nutrition, log workouts, visualize progress, and join a community of fitness enthusiasts
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup">
              <a>
                <Button size="lg" className="text-base px-8" data-testid="button-get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
            <Link href="/login">
              <a>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base px-8 bg-background/50 backdrop-blur-sm border-2" 
                  data-testid="button-login-hero"
                >
                  Login
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" data-testid="text-features-title">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for nutrition tracking, workout logging, and progress visualization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200 border-2" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div data-testid="stat-foods">
              <div className="font-display text-5xl font-bold text-primary mb-2">90,000+</div>
              <div className="text-muted-foreground">Foods in Database</div>
            </div>
            <div data-testid="stat-exercises">
              <div className="font-display text-5xl font-bold text-chart-2 mb-2">500+</div>
              <div className="text-muted-foreground">Exercise Templates</div>
            </div>
            <div data-testid="stat-users">
              <div className="font-display text-5xl font-bold text-chart-3 mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-chart-2">
        <div className="container px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are achieving their fitness goals with EvoFit
          </p>
          <Link href="/signup">
            <a>
              <Button size="lg" variant="secondary" className="text-base px-8" data-testid="button-start-now">
                Start Your Journey Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
