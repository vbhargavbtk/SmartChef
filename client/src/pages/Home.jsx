import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  ChefHat, 
  Brain, 
  Calendar, 
  ShoppingCart, 
  Sparkles, 
  Clock, 
  Users, 
  Zap 
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const features = [
    {
      icon: Brain,
      title: 'AI Recipe Generation',
      description: 'Generate unique recipes from your available ingredients using advanced AI technology.'
    },
    {
      icon: Calendar,
      title: 'Smart Meal Planning',
      description: 'Plan your weekly meals with drag-and-drop interface and automatic scheduling.'
    },
    {
      icon: ShoppingCart,
      title: 'Automated Grocery Lists',
      description: 'Create organized grocery lists categorized by store sections.'
    },
    {
      icon: Sparkles,
      title: 'Personalized Recommendations',
      description: 'Get recipe suggestions based on your dietary preferences and cooking style.'
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Reduce meal planning time from hours to minutes'
    },
    {
      icon: Users,
      title: 'Family Friendly',
      description: 'Create meals that everyone in your family will love'
    },
    {
      icon: Zap,
      title: 'Reduce Waste',
      description: 'Use ingredients efficiently and minimize food waste'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <ChefHat className="h-16 w-16 text-primary-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="text-gradient">YourSmartChef</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Your AI-powered kitchen companion. Generate recipes, plan meals, and create grocery lists with the help of artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/recipe-generator"
                  className="btn-primary text-lg px-8 py-3"
                >
                  Generate Recipe
                </Link>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for smart cooking
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                              YourSmartChef combines the power of AI with intuitive design to revolutionize your kitchen experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-hover text-center"
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose YourSmartChef?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of home cooks who have transformed their kitchen experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card text-center"
              >
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-10 w-10 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your cooking?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Start creating amazing meals with AI-powered recipe generation and smart meal planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Get Started Free
                </Link>
              )}
              <Link
                to="/recipe-generator"
                className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Try Recipe Generator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 