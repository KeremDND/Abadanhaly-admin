import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getAssetPath } from '../../lib/paths';
import { 
  Award, 
  Users, 
  Factory, 
  Globe, 
  Target, 
  CheckCircle,
  Star,
  Building,
  Phone,
  Mail,
  MapPin,
  Eye,
  Download,
  X,
  Zap,
  Shield,
  Leaf,
  ArrowRight
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: 'home' | 'gallery' | 'certificates' | 'about' | 'support') => void;
}

export default function About({ onNavigate }: AboutProps) {
  const { t } = useTranslation();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null); // -1 for award, 0-2 for certificates
  const [counters, setCounters] = useState({
    employees: 0,
    looms: 0,
    production: 0,
    years: 0
  });

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (visibleSections.has('stats')) {
      const targets = { employees: 600, looms: 8, production: 3, years: 9 };
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 2);

        setCounters({
          employees: Math.floor(targets.employees * easeOut),
          looms: Math.floor(targets.looms * easeOut),
          production: Math.floor(targets.production * easeOut),
          years: Math.floor(targets.years * easeOut)
        });

        if (step >= steps) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [visibleSections]);

  const milestones = [
    {
      year: '2016',
      title: t('about.milestones.2016'),
      description: t('about.milestones.2016.desc'),
      icon: <Factory className="w-5 h-5" />
    },
    {
      year: '2017',
      title: t('about.milestones.2017'),
      description: t('about.milestones.2017.desc'),
      icon: <Globe className="w-5 h-5" />
    },
    {
      year: '2020',
      title: t('about.milestones.2020'),
      description: t('about.milestones.2020.desc'),
      icon: <Award className="w-5 h-5" />
    },
    {
      year: '2022',
      title: t('about.milestones.2022'),
      description: t('about.milestones.2022.desc'),
      icon: <Zap className="w-5 h-5" />
    },
    {
      year: '2025',
      title: t('about.milestones.current'),
      description: t('about.milestones.current.desc'),
      icon: <Users className="w-5 h-5" />
    }
  ];

  const certifications = [
    {
      name: t('certs.iso9001').split(' — ')[0],
      title: t('certs.quality'),
      description: t('certs.quality.desc'),
      icon: <Star className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      image: getAssetPath('/Images/Certificats and awards/ISO 9001 Quality Management.jpeg'
    },
    {
      name: t('certs.iso14001').split(' — ')[0],
      title: t('certs.environmental'),
      description: t('certs.environmental.desc'),
      icon: <Leaf className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      image: getAssetPath('/Images/Certificats and awards/ISO 14001 Environmental Management.jpeg'
    },
    {
      name: t('certs.iso45001').split(' — ')[0],
      title: t('certs.safety'),
      description: t('certs.safety.desc'),
      icon: <Shield className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      image: getAssetPath('/Images/Certificats and awards/ISO 45001 Occupational Health Safety.jpeg'
    }
  ];

  const award = {
    name: t('about.award.title'),
    title: t('about.award.subtitle'),
    description: t('about.award.desc'),
    icon: <Award className="w-6 h-6" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    image: getAssetPath('/Images/Certificats and awards/The Union of Industrial and Entrepreneurs of Turkmenistan Industry Recognition.JPG'
  };

  const missions = [
    t('about.mission.1'),
    t('about.mission.2'),
    t('about.mission.3'),
    t('about.mission.4'),
    t('about.mission.5'),
    t('about.mission.6')
  ];

  const markets = {
    exports: ['Kazakhstan', 'Afghanistan', 'Turkey'],
    domestic: 'Turkmenistan',
    stores: 3
  };

  return (
    <section className="min-h-screen bg-white py-8 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Intro */}
        <div 
          ref={el => sectionRefs.current['hero'] = el}
          id="hero"
          className={`pt-24 mb-32 transition-all duration-500 ease-out ${
            visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
            {/* Left - Text Content */}
            <div className="flex flex-col justify-center space-y-8 lg:space-y-10 order-2 lg:order-1">
              {/* Heading with refined typography */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1A1A1A] leading-[1.1] tracking-tight" dangerouslySetInnerHTML={{ __html: t('about.hero.title') }}></h1>
                
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl font-light">
                  {t('about.hero.subtitle')}
                </p>
              </div>
              
              {/* CTA Buttons with enhanced design */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => onNavigate('gallery')}
                  className="group relative inline-flex items-center justify-center bg-[#0F3B2F] text-white px-10 py-4 rounded-lg font-semibold text-base hover:bg-[#0F3B2F]/95 transition-all duration-300 hover:shadow-xl hover:shadow-[#0F3B2F]/20 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">{t('about.hero.explore')}</span>
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F3B2F] to-[#1a5a4a] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative inline-flex items-center justify-center bg-white text-[#1A1A1A] border-2 border-gray-200 px-10 py-4 rounded-lg font-semibold text-base hover:border-[#0F3B2F] hover:text-[#0F3B2F] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="relative z-10">{t('about.hero.contact')}</span>
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right - Image Content */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl shadow-gray-900/10 aspect-[4/3] lg:aspect-[3/4] lg:h-[600px]">
                {/* Image with improved object positioning */}
                <img
                  src=getAssetPath("/Images/page-images/Abadan haly building about us.JPG"
                  alt="Abadan Haly building, Turkmenistan"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  onError={(e) => {
                    console.log('Image failed to load:', e.currentTarget.src);
                    e.currentTarget.src = getAssetPath('/Images/logo.png';
                  }}
                />
                {/* Refined gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/10 pointer-events-none"></div>
                {/* Subtle border glow effect */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none"></div>
              </div>
              
              {/* Decorative accent elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#0F3B2F]/5 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>

        {/* Our Story Timeline */}
        <div 
          ref={el => sectionRefs.current['timeline'] = el}
          id="timeline"
          className={`mb-32 transition-all duration-300 delay-100 ${
            visibleSections.has('timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('about.story.title')}</h2>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F7F7F8] rounded-xl flex items-center justify-center text-[#0F3B2F]">
                  {milestone.icon}
                </div>
                <div className="flex-1 pb-8 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-[#0F3B2F]">{milestone.year}</span>
                    <span className="text-lg font-semibold text-[#1A1A1A]">{milestone.title}</span>
                  </div>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scale & Technology */}
        <div 
          ref={el => sectionRefs.current['stats'] = el}
          id="stats"
          className={`mb-32 transition-all duration-300 delay-200 ${
            visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { number: `${counters.employees}+`, label: t('about.stats.employees') },
              { number: '24/7', label: t('about.stats.production') },
              { number: `${counters.looms}`, label: t('about.stats.looms') },
              { number: `${counters.production}M m²`, label: '(2020)' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#F7F7F8] rounded-xl px-4 py-3 mb-2">
                  <div className="text-2xl font-bold text-[#0F3B2F]">{stat.number}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Two Column Features */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F7F7F8] rounded-xl flex items-center justify-center text-[#0F3B2F] flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">{t('about.features.yarn.title')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.features.yarn.desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F7F7F8] rounded-xl flex items-center justify-center text-[#0F3B2F] flex-shrink-0">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">{t('about.features.machinery.title')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.features.machinery.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Quality, Safety & Environment */}
        <div 
          ref={el => sectionRefs.current['certifications'] = el}
          id="certifications"
          className={`mb-32 transition-all duration-300 delay-400 ${
            visibleSections.has('certifications') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4 text-center">
            {t('about.certificates.subtitle')}
          </h2>
          <p className="text-lg text-gray-600 mb-16 text-center max-w-3xl mx-auto">
            {t('about.certificates.subtitle.full')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {certifications.map((cert, index) => (
              <button
                key={index}
                onClick={() => setSelectedCertificate(index)}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-180 text-left group cursor-pointer"
              >
                <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-50 aspect-[3/4] flex items-center justify-center">
                  <img
                    src={cert.image}
                    alt={`${cert.name} Certificate`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className={`w-12 h-12 ${cert.bgColor} rounded-xl flex items-center justify-center ${cert.color} mb-4 group-hover:scale-110 transition-transform duration-180`}>
                  {cert.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{cert.name}</h3>
                <h4 className="text-sm font-medium text-[#0F3B2F] mb-3">{cert.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{cert.description}</p>
              </button>
            ))}
          </div>

          {/* Award - Same design but wider */}
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCertificate(-1)}
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-180 text-left group cursor-pointer w-full"
            >
              <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-50 aspect-[16/9] flex items-center justify-center">
                <img
                  src={award.image}
                  alt={`${award.name} Award`}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className={`w-12 h-12 ${award.bgColor} rounded-xl flex items-center justify-center ${award.color} mb-4 group-hover:scale-110 transition-transform duration-180`}>
                {award.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{award.name}</h3>
              <h4 className="text-sm font-medium text-[#0F3B2F] mb-3">{award.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{award.description}</p>
            </button>
          </div>
        </div>

        {/* Markets & Stores */}
        <div 
          ref={el => sectionRefs.current['markets'] = el}
          id="markets"
          className={`mb-32 transition-all duration-300 delay-500 ${
            visibleSections.has('markets') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('about.markets.title')}</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">{t('about.markets.exports')}</h3>
              <ul className="space-y-2">
                {markets.exports.map((country, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                    <span className="text-gray-700">{country}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">{t('about.markets.domestic')}</h3>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#0F3B2F]" />
                <span className="text-gray-700">{markets.domestic}</span>
              </div>
            </div>

            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">{t('about.markets.retail')}</h3>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-[#0F3B2F]" />
                <span className="text-gray-700">{markets.stores} {t('about.markets.stores')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What Drives Us */}
        <div 
          ref={el => sectionRefs.current['mission'] = el}
          id="mission"
          className={`mb-32 transition-all duration-300 delay-600 ${
            visibleSections.has('mission') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">{t('about.mission.title')}</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all duration-180"
              >
                <div className="w-8 h-8 bg-[#0F3B2F] rounded-lg flex items-center justify-center text-white mb-4">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-[#1A1A1A] font-medium leading-relaxed">{mission}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div 
          ref={el => sectionRefs.current['cta'] = el}
          id="cta"
          className={`mb-32 transition-all duration-300 delay-700 ${
            visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
                {t('hero.contact.title')}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                {t('hero.description')}
              </p>
              
              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
                  {t('contact.info.getintouch')}
                </h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <a 
                    href="mailto:admin@abadanhaly.com"
                    className="text-xl font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    admin@abadanhaly.com
                  </a>
                </div>
                <p className="text-sm text-gray-600 mb-3 text-center">
                  {t('contact.info.description')}
                </p>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>{t('contact.instructions')}</strong> {t('contact.instructions.text')}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">{t('contact.info.title')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-600">{t('hero.contact.phone')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-600">{t('footer.email.full')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-gray-600">{t('footer.address')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">{t('contact.responseTime')}</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {t('contact.responseTime.initial')}</li>
                    <li>• {t('contact.responseTime.detailed')}</li>
                    <li>• {t('contact.responseTime.product')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Lightbox */}
        {selectedCertificate !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedCertificate === -1 ? (
                // Award lightbox
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                        {award.name}
                      </h3>
                      <h4 className="text-lg text-[#0F3B2F] font-medium">
                        {award.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mb-6 rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={award.image}
                      alt={`${award.name} Award`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {award.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.open(award.image, '_blank')}
                      className="flex items-center gap-2 bg-[#0F3B2F] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t('about.lightbox.view')}
                    </button>
                    <a
                      href={award.image}
                      download
                      className="flex items-center gap-2 border border-gray-200 text-[#1A1A1A] px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t('about.lightbox.download')}
                    </a>
                  </div>
                </div>
              ) : (
                // Certificate lightbox
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                        {certifications[selectedCertificate].name}
                      </h3>
                      <h4 className="text-lg text-[#0F3B2F] font-medium">
                        {certifications[selectedCertificate].title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedCertificate(null)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mb-6 rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={certifications[selectedCertificate].image}
                      alt={`${certifications[selectedCertificate].name} Certificate`}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {certifications[selectedCertificate].description}
                  </p>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => window.open(certifications[selectedCertificate].image, '_blank')}
                      className="flex items-center gap-2 bg-[#0F3B2F] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t('about.lightbox.view')}
                    </button>
                    <a
                      href={certifications[selectedCertificate].image}
                      download
                      className="flex items-center gap-2 border border-gray-200 text-[#1A1A1A] px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {t('about.lightbox.download')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}