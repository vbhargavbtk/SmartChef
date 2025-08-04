import { Link } from 'react-router-dom'
import { ChefHat, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">SmartChef</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your AI-powered kitchen companion. Generate recipes, plan meals, and create grocery lists with the help of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipe-generator" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Recipe Generator
                </Link>
              </li>
              <li>
                <Link to="/meal-planner" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Meal Planner
                </Link>
              </li>
              <li>
                <Link to="/grocery-list" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Grocery List
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 SmartChef. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 