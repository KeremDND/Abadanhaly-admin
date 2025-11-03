import { useState, useRef, lazy, Suspense, useMemo } from 'react';
import { ArrowRight, Cuboid as Cube, MapPin, Mail, Phone, Target, Truck, Ruler, Palette, Home, Headphones as HeadphonesIcon, Factory, Globe, Award, Bot, Users, Clock, Car, Eye, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { products } from '../../data/products';


// Lazy load components
const Product3DViewer = lazy(() => import('./Product3DViewer'));

interface HeroProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'gallery' | 'about' | 'support') => void;
}

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string;
  mobile?: string;
  hours: string;
  mapUrl: string;
  distance?: number;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t, i18n } = useTranslation();
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const [selectedAward, setSelectedAward] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearestStore, setNearestStore] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const heroRef = useRef<HTMLElement>(null);
  const storesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  // Store data - these are location-specific and don't need translation
  const stores: Store[] = [
    {
      id: 1,
      name: "Abadan Haly Dükany",
      address: "Altyn Asyr köçesi, 27.jay",
      city: "Büzmeýin Şäheri",
      lat: 38.0555073,
      lng: 58.1579278,
      phone: "+993 12 357230",
      mobile: "+993 61 000028",
      hours: "09:00–18:00, daily",
      mapUrl: "https://maps.app.goo.gl/q9k2cTRTr228KjbEA"
    },
    {
      id: 2,
      name: "Çeper Haly Dükany",
      address: "Bitaraplyk șaýoly, 131.jaý",
      city: "Așgabat Şäheri",
      lat: 37.9158125,
      lng: 58.3443125,
      phone: "+993 12 956169",
      mobile: "+993 65 080848",
      hours: "09:00–18:00, daily",
      mapUrl: "https://maps.app.goo.gl/RKXJuH9ApxJxCC1E8"
    }
  ];

  // Services data
  const services = [
    {
      title: t('services.free.measure'),
      description: t('services.free.measure.desc'),
      icon: <Target className="w-5 h-5 text-[#0F3B2F]" />
    },
    {
      title: t('services.free.delivery'),
      description: t('services.free.delivery.desc'),
      icon: <Truck className="w-5 h-5 text-[#0F3B2F]" />
    },
    {
      title: t('services.custom.sizes'),
      description: t('services.custom.sizes.desc'),
      icon: <Ruler className="w-5 h-5 text-[#0F3B2F]" />
    },
    {
      title: t('services.custom.designs'),
      description: t('services.custom.designs.desc'),
      icon: <Palette className="w-5 h-5 text-[#0F3B2F]" />
    },
    {
      title: t('services.installation'),
      description: t('services.installation.desc'),
      icon: <Home className="w-5 h-5 text-[#0F3B2F]" />
    },
    {
      title: t('services.care.support'),
      description: t('services.care.support.desc'),
      icon: <HeadphonesIcon className="w-5 h-5 text-[#0F3B2F]" />
    }
  ];

  // Milestones data
  const milestones = [
    {
      year: '2016',
      title: t('milestones.founded'),
      description: t('milestones.founded.desc'),
      icon: <Factory className="w-5 h-5" />
    },
    {
      year: '2017',
      title: t('milestones.exports'),
      description: t('milestones.exports.desc'),
      icon: <Globe className="w-5 h-5" />
    },
    {
      year: '2020',
      title: t('milestones.production'),
      description: t('milestones.production.desc'),
      icon: <Award className="w-5 h-5" />
    },
    {
      year: '2024',
      title: t('milestones.ai'),
      description: t('milestones.ai.desc'),
      icon: <Bot className="w-5 h-5" />
    },
    {
      year: '2025',
      title: t('milestones.employees'),
      description: t('milestones.employees.desc'),
      icon: <Users className="w-5 h-5" />
    }
  ];

  // Certificates data
  const certificates = [
    {
      name: 'ISO 9001',
      title: 'Quality Management',
      image: '/Images/Certificats and awards/ISO 9001 Quality Management.jpeg',
      alt: 'ISO 9001 Quality Management Certificate'
    },
    {
      name: 'ISO 14001',
      title: 'Environmental Management',
      image: '/Images/Certificats and awards/ISO 14001 Environmental Management.jpeg',
      alt: 'ISO 14001 Environmental Management Certificate'
    },
    {
      name: 'ISO 45001',
      title: 'Occupational Health & Safety',
      image: '/Images/Certificats and awards/ISO 45001 Occupational Health Safety.jpeg',
      alt: 'ISO 45001 Occupational Health Safety Certificate'
    }
  ];

  // Awards data
  const awards = [
    {
      name: 'The Union of Industrial and Entrepreneurs of Turkmenistan',
      title: 'Industry Recognition',
      image: '/Images/Certificats and awards/The Union of Industrial and Entrepreneurs of Turkmenistan Industry Recognition.JPG',
      alt: 'The Union of Industrial and Entrepreneurs of Turkmenistan Industry Recognition Award'
    }
  ];

  // Distance calculation helper
  const km = (a: {lat: number, lng: number}, b: {lat: number, lng: number}) => {
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const s1 = Math.sin(dLat / 2);
    const s2 = Math.sin(dLng / 2);
    const c = 2 * Math.asin(Math.sqrt(s1 * s1 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * s2 * s2));
    return +(R * c).toFixed(1);
  };

  // Calculate distances and find nearest store
  const storesWithDistance = userLocation 
    ? stores.map(store => ({
        ...store,
        distance: km(userLocation, { lat: store.lat, lng: store.lng })
      })).sort((a, b) => a.distance - b.distance)
    : stores;

  // Get user location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError(t('stores.location.error'));
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Find nearest store
        const storesWithDist = stores.map(store => ({
          ...store,
          distance: km({ lat: latitude, lng: longitude }, { lat: store.lat, lng: store.lng })
        }));
        
        const nearest = storesWithDist.reduce((prev, current) => 
          (prev.distance < current.distance) ? prev : current
        );
        
        setNearestStore(nearest);
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = t('stores.location.retrieve');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('stores.location.denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('stores.location.unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('stores.location.timeout');
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };



  // Hero image configuration
  const HERO_IMG = "/Images/abadan-haly-Nusay- Cream- 2048- carpet.jpg";
  
  const heroProduct = {
    name: "Nusay Cream Collection",
    sku: "2048",
    sizeCm: { width: 200, height: 300 }
  };

  return (
    <>
      {/* Hero Section - Minimal with Semi-transparent Overlay */}
      <section 
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
      >
        {/* Background Image */}
        <picture>
          <source
            type="image/avif"
            srcSet="/Images/page-images/abadan haly main hero.jpg"
          />
          <source
            type="image/webp"
            srcSet="/Images/page-images/abadan haly main hero.jpg"
          />
          <img
            src="/Images/page-images/abadan haly main hero.jpg"
            alt="Abadan Haly main hero background"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onLoad={() => console.log('Background image loaded successfully')}
            onError={(e) => {
              console.log('Image failed to load, trying fallback');
              e.currentTarget.src = "/Images/Background_Image.jpg";
            }}
          />
        </picture>

        {/* Glassmorphism Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center px-4 lg:px-8">
          <div className="relative z-10 max-w-lg text-center transform translate-y-32">
            {/* Glassmorphism Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                   <button
                       onClick={() => onNavigate('gallery')}
                       className="group relative overflow-hidden rounded-full bg-white/10 backdrop-blur-[30px] border border-white/20 px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                       aria-label="Explore Gallery"
                     >
                <span className="relative z-10 flex items-center gap-2">
                  {t('hero.exploreGallery')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
                                   <button
                       onClick={() => setShow3DViewer(true)}
                       className="group relative overflow-hidden rounded-full bg-white/5 backdrop-blur-[30px] border border-white/10 px-8 py-4 text-base font-medium text-white/90 shadow-lg transition-all duration-300 hover:bg-white/15 hover:text-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                       aria-label="View in 3D"
                     >
                <span className="relative z-10 flex items-center gap-2">
                  <Cube className="w-4 h-4" />
                  {t('hero.view3d.button')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Scroll Indicator with Smooth Animation */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <span className="text-base md:text-lg font-semibold text-white/90 tracking-wide">{t('hero.scroll')}</span>
              <div className="flex flex-col items-center">
                <div className="w-1 h-12 bg-gradient-to-b from-white/60 via-white/40 to-transparent mb-3"></div>
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-white/80 rotate-90 transform animate-scroll-smooth" />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Reduced-motion support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-[fadeIn_.2s_ease-out] { animation: none; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) scale(0.995); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </section>

      {/* New Products Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {useMemo(() => {
              const newProducts = products.filter(p => p.category === 'new').slice(0, 8);
              const lang = i18n.language;
              
              return newProducts.map((product) => {
                const altText = lang === 'tk' ? product.altTK : lang === 'ru' ? product.altRU : product.altEN;
                
                return (
                  <div key={product.id} className="group relative">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-50 border border-gray-200 flex items-center justify-center group-hover:scale-[1.02] group-hover:shadow-md transition-all duration-200 ease-out">
                      <img
                        src={product.image}
                        alt={altText}
                        className="w-full h-full object-contain transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          console.log('Image failed to load:', e.currentTarget.src);
                          e.currentTarget.src = '/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg';
                        }}
                      />
                    </div>
                    <div className="mt-3 text-center text-sm font-medium text-neutral-800 truncate">
                      {product.name}
                    </div>
                  </div>
                );
              });
            }, [i18n.language])}
          </div>

          {/* View Gallery Button */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('gallery')}
              className="bg-[#0F3B2F] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180 inline-flex items-center gap-2 hover:scale-105"
            >
              {t('hero.exploreGallery')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

       

      {/* Stores Section */}
      {/* Store Section - Find your nearest store */}
      <section 
        ref={storesRef}
        data-section="stores" 
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              {t('stores.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('stores.description')}
            </p>
            <button
              onClick={getUserLocation}
              disabled={isLoadingLocation}
              className="bg-[#0F3B2F] hover:bg-[#0F3B2F]/90 disabled:bg-[#0F3B2F]/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-180 flex items-center gap-2 mx-auto"
            >
              {isLoadingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('stores.finding')}
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  {t('stores.useLocation')}
                </>
              )}
            </button>
            {locationError && (
              <p className="text-red-600 text-sm mt-2">{locationError}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {t('stores.location.use')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {storesWithDistance.map((store) => (
              <div
                key={store.id}
                className={`relative bg-white border rounded-2xl p-6 transition-all duration-300 ${
                  nearestStore?.id === store.id 
                    ? 'border-[#0F3B2F] bg-gradient-to-br from-[#0F3B2F]/5 to-transparent shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {nearestStore?.id === store.id && (
                  <div className="absolute -top-2 left-6 bg-gradient-to-r from-[#0F3B2F] to-emerald-700 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {t('stores.nearest')}
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                  {store.name}
                </h3>
                
                {store.distance && (
                  <div className="text-[#0F3B2F] font-medium mb-3">
                    {store.distance} {t('stores.km.away')}
                  </div>
                )}
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{store.address}, {store.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{store.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(store.mapUrl, '_blank')}
                    className="flex-1 bg-[#0F3B2F] hover:bg-[#0F3B2F]/90 text-white py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-180 flex items-center justify-center gap-1"
                  >
                    <Car className="w-4 h-4" />
                    {t('stores.go')}
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${store.phone}`}
                    className="flex-1 bg-[#F7F7F8] hover:bg-gray-200 text-[#1A1A1A] py-2 px-3 rounded-lg font-medium text-sm transition-colors duration-180"
                  >
                    {t('stores.call')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Our Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              {t('services.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#F7F7F8] rounded-lg flex items-center justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              {t('hero.qualityAssurance')}
            </div>
            <h2 className="text-3xl font-bold text-[#0F3B2F] mb-4">
              {t('certs.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.certificates.subtitle.full')}
            </p>
          </div>
          
          {/* Certificates Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Certificate Image */}
                <div className="relative mb-4">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={cert.image}
                      alt={cert.alt}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="eager"
                      onError={(e) => {
                        console.log('Certificate image failed to load:', e.currentTarget.src);
                        e.currentTarget.src = '/Images/logo.png';
                      }}
                    />
                  </div>
                  {/* Subtle overlay for professional look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Certificate Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#0F3B2F] mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cert.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Industry Recognition Award */}
          <div className="flex justify-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group max-w-md w-full">
              {/* Award Image */}
              <div className="relative mb-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={awards[0]?.image || '/Images/logo.png'}
                    alt={awards[0]?.alt || 'Industry Recognition Award'}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="eager"
                    onError={(e) => {
                      console.log('Award image failed to load:', e.currentTarget.src);
                      e.currentTarget.src = '/Images/logo.png';
                    }}
                  />
                </div>
                {/* Subtle overlay for professional look */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Award Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#0F3B2F] mb-2">
                  Industry Recognition
                </h3>
                <p className="text-sm text-gray-600">
                  Excellence in Manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Milestones */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              {t('milestones.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="w-8 h-8 bg-[#F7F7F8] rounded-lg flex items-center justify-center text-[#0F3B2F] mx-auto mb-3">
                  {milestone.icon}
                </div>
                <div className="text-lg font-bold text-[#0F3B2F] mb-1">
                  {milestone.year}
                </div>
                <h4 className="font-medium text-[#1A1A1A] mb-1 text-sm">
                  {milestone.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={() => onNavigate('about')}
              className="text-[#0F3B2F] hover:text-[#0F3B2F]/80 font-medium transition-colors duration-180 flex items-center gap-2 mx-auto"
            >
              {t('milestones.partner')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section 
        ref={contactRef}
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </section>

      {/* 3D Viewer Modal */}
      {show3DViewer && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading 3D Room Viewer...</p>
            </div>
          </div>
        }>
          <Product3DViewer
            productImage={HERO_IMG}
            productName={heroProduct.name}
            carpetSize={heroProduct.sizeCm}
            isOpen={show3DViewer}
            onClose={() => {
              setShow3DViewer(false);
            }}
            autoRotate={false}
            showControls={true}
          />
        </Suspense>
      )}

      {/* Certificate Lightbox */}
      {selectedCertificate !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {certificates[selectedCertificate].name}
                </h3>
                <h4 className="text-lg text-[#0F3B2F] font-medium">
                  {certificates[selectedCertificate].title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Certificate Image */}
            <div className="mb-6 flex justify-center">
              <img
                src={certificates[selectedCertificate].image}
                alt={certificates[selectedCertificate].alt}
                className="max-w-full h-auto max-h-96 rounded-lg shadow-lg border border-gray-200"
                onError={(e) => {
                  console.log('Certificate image failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/Images/logo.png';
                }}
              />
            </div>
            
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 bg-[#0F3B2F] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-colors">
                <Eye className="w-4 h-4" />
                {t('certs.view')}
              </button>
              <button className="flex items-center gap-2 border border-gray-200 text-[#1A1A1A] px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                {t('certs.download')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Lightbox */}
      {selectedAward !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {awards[selectedAward].name}
                </h3>
                <h4 className="text-lg text-[#0F3B2F] font-medium">
                  {awards[selectedAward].title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedAward(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Award Image */}
            <div className="mb-6 flex justify-center">
              <img
                src={awards[selectedAward].image}
                alt={awards[selectedAward].alt}
                className="max-w-full h-auto max-h-96 rounded-lg shadow-lg border border-gray-200"
                onError={(e) => {
                  console.log('Award image failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/Images/logo.png';
                }}
              />
            </div>
            
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 bg-[#0F3B2F] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-colors">
                <Eye className="w-4 h-4" />
                View Award
              </button>
              <button className="flex items-center gap-2 border border-gray-200 text-[#1A1A1A] px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}