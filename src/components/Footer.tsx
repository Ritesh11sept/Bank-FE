import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

const CircleRow = () => (
    <div className="flex justify-center gap-2 mb-1">
      <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
      <div className="w-4 h-4 rounded-full bg-purple-400"></div>
      <div className="w-4 h-4 rounded-full bg-orange-400"></div>
      <div className="w-4 h-4 rounded-full bg-red-400"></div>
      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-xs font-medium text-slate-600">
        100K+
      </div>
    </div>
  );
  
  const HeroContent = () => (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-[2.5rem] p-16 text-center">
      <div className="flex justify-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i === 4 ? 'text-gray-300' : 'text-yellow-400'}`}
            fill={i === 4 ? 'rgb(209 213 219)' : 'rgb(250 204 21)'}
          />
        ))}
        <span className="ml-2 text-white">4.9/5</span>
      </div>
      
      <CircleRow />
      
      <p className="text-gray-400 text-sm mb-8">
        Over 100K+ Entrepreneurs and <br/>
        business choose us
      </p>
      
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Empowering Your Financial <br/>
        Freedom
      </h1>
      
      <p className="text-gray-400 max-w-2xl mx-auto mb-8">
        Trust us to deliver cutting-edge innovation, transparency, and personalized <br/>
        service, all designed to help you achieve financial freedom
      </p>
      
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto transition-colors group">
        Get Started now
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
const Footer = () => {
  const footerLinks = {
    Home: [
      { title: 'Product Features', href: '#' },
      { title: 'Benefits', href: '#' },
      { title: 'How To Use', href: '#' },
      { title: 'Key Features', href: '#' },
      { title: 'Pricing', href: '#' },
      { title: 'Testimonials', href: '#' },
      { title: "FAQ's", href: '#' },
    ],
    App: [
      { title: 'Mobile App', href: '#' },
      { title: 'Desktop App', href: '#' },
      { title: 'How To Use', href: '#' },
    ],
    'All Pages': [
      { title: 'Home', href: '#' },
      { title: 'App', href: '#' },
      { title: 'Blogs', href: '#' },
      { title: 'Blog Open', href: '#' },
      { title: 'Contact', href: '#' },
      { title: 'Privacy Policy', href: '#' },
      { title: '404', href: '#' },
    ],
  };

  return (
    <footer className="bg-slate-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Section */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-600 w-8 h-8 rounded-lg"></div>
            <span className="text-white text-xl font-bold">Euphoria</span>
          </div>
          <p className="text-sm mb-4">
            Empowering Your Projects, Enhancing Your Success, Every Step of the Way.
          </p>
          <div className="flex gap-4">
            {['facebook', 'linkedin', 'instagram', 'twitter'].map((social) => (
              <a
                key={social}
                href={`#${social}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="w-8 h-8 border border-gray-700 rounded-full flex items-center justify-center">
                  <i className={`fab fa-${social}`}></i>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Links Sections */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Download Section */}
        <div className="md:col-span-3">
          <h3 className="text-white font-semibold mb-4">Download our App</h3>
          <div className="space-y-3">
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <img src="/api/placeholder/24/24" alt="Play Store" className="w-6 h-6" />
              Get it on Google Play
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
              <img src="/api/placeholder/24/24" alt="App Store" className="w-6 h-6" />
              Download on App Store
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2024 Euphoria. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm hover:text-white transition-colors">
              Terms of Services
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CombinedComponent = () => (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <HeroContent />
      </div>
      <Footer />
    </div>
  );
  

export default CombinedComponent;