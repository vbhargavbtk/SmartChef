import { ChefHat } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Simple brand */}
          <div className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <span className="text-lg font-semibold">YourSmartChef</span>
          </div>
          {/* Simple description */}
          <p className="text-gray-400 text-sm text-center max-w-md">
            Your AI-powered kitchen companion
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 