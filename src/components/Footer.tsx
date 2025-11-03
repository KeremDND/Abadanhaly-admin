import React from 'react';
import { MapPin, Phone, Mail, Instagram, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'gallery' | 'certificates' | 'about') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/Images/logo.png"
                alt="Abadan Haly Logo" 
                className="h-10 w-auto"
              />
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
              {t('footer.company.desc')}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-600">{t('footer.address.full')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-600">{t('footer.phone.full')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-600">{t('footer.email.full')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('nav.home'), page: 'home' as const },
                { label: t('nav.gallery'), page: 'gallery' as const },
                { label: t('nav.collab'), page: 'collaboration' as const },
                { label: t('nav.about'), page: 'about' as const }
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-emerald-600" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Certificates and Awards */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900">{t('footer.certificates')}</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                {t('footer.certificates.iso9001')}
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                {t('footer.certificates.iso14001')}
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                {t('footer.certificates.iso45001')}
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                {t('footer.certificates.award')}
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                {t('footer.certificates.export')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-300">
          <div className="text-center">
            <div className="text-sm text-gray-600">
              © {currentYear} Abadan Haly. {t('footer.copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}