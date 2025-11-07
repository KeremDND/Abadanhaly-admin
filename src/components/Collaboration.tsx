import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight,
  Factory,
  Shield,
  Award,
  Target,
  Package,
  Star,
  Mail
} from 'lucide-react';

export default function Collaboration() {
  const { t } = useTranslation();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);



  const certificates = [
    {
      name: t('certs.iso9001').split(' — ')[0],
      title: t('certs.quality'),
      description: t('certs.quality.desc'),
      icon: <Star className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: t('certs.iso14001').split(' — ')[0],
      title: t('certs.environmental'),
      description: t('certs.environmental.desc'),
      icon: <Shield className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: t('certs.iso45001').split(' — ')[0],
      title: t('certs.safety'),
      description: t('certs.safety.desc'),
      icon: <Shield className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];


  return (
    <section className="min-h-screen bg-white py-8 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Professional Hero Section */}
        <div 
          id="hero"
          data-animate
          className={`relative mb-32 transition-all duration-500 ease-out ${
            visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
            {/* Left - Text Content */}
            <div className="flex flex-col justify-center space-y-8 lg:space-y-10 order-2 lg:order-1">
              {/* Heading with refined typography */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1A1A1A] leading-[1.1] tracking-tight">
                  {t('collaboration.title')}
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-light">
                  {t('collaboration.subtitle')}
                </p>
              </div>
              
              {/* CTA Button with enhanced design */}
              <div className="pt-2">
                <a
                  href="mailto:admin@abadanhaly.com"
                  className="group relative inline-flex items-center justify-center bg-[#0F3B2F] text-white px-10 py-4 rounded-lg font-semibold text-base hover:bg-[#0F3B2F]/95 transition-all duration-300 hover:shadow-xl hover:shadow-[#0F3B2F]/20 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">{t('collaboration.cta.partnership')}</span>
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F3B2F] to-[#1a5a4a] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>

            {/* Right - Image Content */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl shadow-gray-900/10 aspect-[4/3] lg:aspect-[3/4] lg:h-[600px]">
                {/* Image with improved object positioning */}
                <img
                  src="/Images/page-images/Abadan Haly collab page.jpg"
                  alt="Abadan Haly building, Turkmenistan"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  onError={(e) => {
                    console.log('Image failed to load:', e.currentTarget.src);
                    e.currentTarget.src = '/Images/logo.png';
                  }}
                />
                {/* Refined gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/10 pointer-events-none"></div>
                {/* Subtle border glow effect */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none"></div>
              </div>
              
              {/* Decorative accent element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#0F3B2F]/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>

        {/* Why Partner with Abadan Haly */}
        <div 
          id="value-pillars"
          data-animate
          className={`mb-32 transition-all duration-300 delay-100 ${
            visibleSections.has('value-pillars') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('collaboration.why.title')}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">{t('collaboration.why.scale')}</h3>
              <p className="text-sm text-gray-600">{t('collaboration.why.scale.desc')}</p>
            </div>

            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">{t('collaboration.why.consistency')}</h3>
              <p className="text-sm text-gray-600">{t('collaboration.why.consistency.desc')}</p>
            </div>

            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">{t('collaboration.why.range')}</h3>
              <p className="text-sm text-gray-600">{t('collaboration.why.range.desc')}</p>
            </div>

            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">{t('collaboration.why.assurance')}</h3>
              <p className="text-sm text-gray-600">{t('collaboration.why.assurance.desc')}</p>
            </div>
          </div>

        </div>

        {/* Product Programs (B2B) */}
        <div 
          id="programs"
          data-animate
          className={`mb-32 transition-all duration-300 delay-200 ${
            visibleSections.has('programs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('collaboration.programs.title')}</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-8">
            {/* Standard Range Supply */}
            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t('collaboration.programs.standard.title')}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.standard.sizes')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.standard.sizes.desc')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.standard.materials')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.standard.materials.desc')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.standard.styles')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.standard.styles.desc')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.standard.logistics')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.standard.logistics.desc')}</p>
                </div>
              </div>
            </div>

            {/* Private Label & Custom */}
            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t('collaboration.programs.custom.title')}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.custom.customization')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.custom.customization.desc')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.custom.design')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.custom.design.desc')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.custom.speed')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.custom.speed.desc')}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">{t('collaboration.programs.custom.support')}</h4>
                  <p className="text-sm text-gray-600">{t('collaboration.programs.custom.support.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/gallery'}
              className="bg-[#0F3B2F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180 inline-block"
            >
              {t('collaboration.programs.seeGallery')}
            </button>
          </div>
        </div>

        {/* Distribution & Store Opportunities */}
        <div 
          id="opportunities"
          data-animate
          className={`mb-32 transition-all duration-300 delay-400 ${
            visibleSections.has('opportunities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('collaboration.opportunities.title')}</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-8">
            {/* Global B2B Distribution */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t('collaboration.opportunities.global.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('collaboration.opportunities.global.desc')}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.global.territories')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.global.capex')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.global.marketing')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.global.operations')}</span>
                </div>
              </div>
            </div>

            {/* Local Store Opening */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t('collaboration.opportunities.local.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('collaboration.opportunities.local.desc')}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.local.location')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.local.inventory')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.local.visual')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">{t('collaboration.opportunities.local.training')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="mailto:admin@abadanhaly.com"
              className="text-[#0F3B2F] hover:text-[#0F3B2F]/80 font-medium transition-colors duration-180 flex items-center gap-2 mx-auto inline-block"
            >
              {t('collaboration.opportunities.apply')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div 
          id="certifications"
          data-animate
          className={`mb-32 transition-all duration-300 delay-600 ${
            visibleSections.has('certifications') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('collaboration.certifications.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-all duration-180 text-left"
              >
                <div className={`w-10 h-10 ${cert.bgColor} rounded-lg flex items-center justify-center ${cert.color} mb-4`}>
                  {cert.icon}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">{cert.name}</h3>
                <h4 className="text-sm font-medium text-[#0F3B2F] mb-2">{cert.title}</h4>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-[#C6A866] to-[#D4B876] text-white px-6 py-3 rounded-xl font-medium shadow-sm">
              <Award className="w-4 h-4 mr-2" />
              {t('collaboration.certifications.award')}
            </div>
          </div>
        </div>

        {/* Contact Email Box */}
        <div 
          id="contact"
          data-animate
          className={`mb-32 transition-all duration-300 delay-800 ${
            visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-12 max-w-2xl mx-auto">
          <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
                {t('collaboration.contact.title')}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                {t('collaboration.contact.subtitle')}
              </p>

              <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {t('collaboration.contact.description')}
                </p>
                
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  <a 
                    href="mailto:admin@abadanhaly.com"
                    className="text-2xl font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    admin@abadanhaly.com
                  </a>
              </div>
              
                <div className="bg-white rounded-lg p-6 mt-6 border border-gray-200">
                  <h3 className="font-semibold text-[#1A1A1A] mb-4 text-sm uppercase tracking-wide">
                    {t('collaboration.contact.include.title')}
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{t('collaboration.contact.include.company')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{t('collaboration.contact.include.contact')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{t('collaboration.contact.include.country')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{t('collaboration.contact.include.programs')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{t('collaboration.contact.include.volumes')}</span>
                    </li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  {t('collaboration.contact.response')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}