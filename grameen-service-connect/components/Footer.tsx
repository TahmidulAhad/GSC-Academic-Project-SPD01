
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t, language } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{language === 'en' ? 'Grameen Service Connect' : 'গ্রামীণ সেবা সংযোগ'}</h3>
            <p className="text-gray-400 text-sm mt-1">{t('footer.copyright')}</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">{t('footer.aboutUs')}</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">{t('footer.contact')}</Link>
            <Link to="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
