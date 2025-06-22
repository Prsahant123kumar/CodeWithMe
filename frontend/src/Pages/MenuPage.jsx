import { useState } from 'react'
import heroImage from '../assets/heroImage.avif'
import { Link } from 'react-router-dom'

function MenuPage() {
  const [activeTab, setActiveTab] = useState(null)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Coding background" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              CodeWithMe
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Your unified coding portfolio across all platforms. Showcase your skills, connect with peers, and grow your developer network.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ProfileFetcher"
              onClick={() => setActiveTab('profile')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              View Profile
            </Link>
            <Link to="/EnterUserNameToChat"
              onClick={() => setActiveTab('chat')}
              className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-full font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Chat
            </Link>
            <button 
              onClick={() => setActiveTab('contacts')}
              className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-full font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
            >
              My Contacts
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-gray-400 text-sm">
          Connect all your coding platforms in one place
        </div>
      </div>
      
      {/* Tab Content (would be implemented based on activeTab) */}
      {activeTab && (
        <div className="fixed inset-0 bg-gray-900/90 z-20 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setActiveTab(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>
            <p className="text-gray-300">
              {activeTab === 'profile' && "This would display your unified coding profile from GitHub, LeetCode, CodePen, etc."}
              {activeTab === 'chat' && "Chat interface would appear here to connect with other developers."}
              {activeTab === 'contacts' && "Your network of developer contacts would be displayed here."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuPage