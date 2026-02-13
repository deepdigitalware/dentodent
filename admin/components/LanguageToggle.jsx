import React from 'react';
import { useI18n } from '@/lib/i18n.jsx';

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="opacity-70">🌐</span>
      <button
        aria-label="Switch to English"
        className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
        onClick={() => setLang('en')}
      >
        {t('lang_en')}
      </button>
      <button
        aria-label="हिन्दी भाषा चुनें"
        className={`px-2 py-1 rounded ${lang === 'hi' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
        onClick={() => setLang('hi')}
      >
        {t('lang_hi')}
      </button>
      <button
        aria-label="বাংলা ভাষা"
        className={`px-2 py-1 rounded ${lang === 'bn' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
        onClick={() => setLang('bn')}
      >
        {t('lang_bn')}
      </button>
    </div>
  );
}