import React, { useState } from 'react';
import { Mail, Phone, MapPin, HelpCircle, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: t('contact.faq.1.question'),
      answer: t('contact.faq.1.answer')
    },
    {
      question: t('contact.faq.2.question'),
      answer: t('contact.faq.2.answer')
    },
    {
      question: t('contact.faq.3.question'),
      answer: t('contact.faq.3.answer')
    },
    {
      question: t('contact.faq.4.question'),
      answer: t('contact.faq.4.answer')
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-green-800 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information Box */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Mail className="w-6 h-6 text-green-800 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">{t('contact.info.title')}</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('contact.info.getintouch')}</h4>
                <p className="text-gray-600 mb-6">
                  {t('contact.info.description')}
                </p>
                
                <div className="bg-emerald-50 rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Mail className="w-6 h-6 text-emerald-600" />
                    <a 
                      href="mailto:admin@abadanhaly.com"
                      className="text-xl font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      admin@abadanhaly.com
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {t('contact.info.response')}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h5 className="font-semibold text-gray-900 mb-3">{t('contact.info.howto.title')}</h5>
                  <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                    <li>{t('contact.info.howto.1')}</li>
                    <li>{t('contact.info.howto.2')}</li>
                    <li>{t('contact.info.howto.3')}</li>
                    <li>{t('contact.info.howto.4')}</li>
                  </ol>
                </div>
              </div>
              </div>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.getintouch.title')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.headOffice')}</h4>
                    <p className="text-gray-600">
                      {t('contact.headOffice.address')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.phone')}</h4>
                    <p className="text-gray-600">
                      {t('footer.phone.full')}<br />
                      {t('hero.contact.phone')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('contact.email')}</h4>
                    <p className="text-gray-600">
                      {t('footer.email.full')}<br />
                      sales@abadanhaly.com.tm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center mb-6">
                <HelpCircle className="w-6 h-6 text-green-800 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">{t('contact.faq.title')}</h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          openFaq === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {openFaq === index && (
                      <div className="px-6 pb-4 pt-0 animate-fade-in-up">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}