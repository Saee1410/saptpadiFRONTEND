import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome_title_1": "AI Wedding",
          "welcome_title_2": "Planner",
          "welcome_subtitle": "Precise planning for your dream wedding",
          "total_budget": "Total Budget (₹)",
          "guests": "Number of Guests",
          "location_type": "Venue Type",
          "generate_plan": "Generate Budget Plan",
          "loading_plan": "AI is creating your plan...",
          "save_pdf": "Save as PDF",
          "report_title": "Wedding Budget Report",
          "analysis_title": "Budget Analysis",
          "breakdown_title": "Detailed Breakdown",
          "expert_summary_title": "Expert Summary",
          "history": "📜 Recent History",
          "no_history": "No history yet",
          "guests_label": "Guests",
          "confirm_delete": "Do you want to delete this plan?",
          "fill_all_fields": "Please fill all fields!"
        }
      },
      mr: {
        translation: {
          "welcome_title_1": "AI वेडिंग",
          "welcome_title_2": "प्लॅनर",
          "welcome_subtitle": "तुमच्या स्वप्नातील लग्नाचे अचूक नियोजन",
          "total_budget": "एकूण बजेट (₹)",
          "guests": "पाहुण्यांची संख्या",
          "location_type": "ठिकाण",
          "generate_plan": "बजेट प्लॅन तयार करा",
          "loading_plan": "AI प्लॅन तयार करत आहे...",
          "save_pdf": "PDF म्हणून सेव्ह करा",
          "report_title": "वेडिंग बजेट रिपोर्ट",
          "analysis_title": "बजेट विश्लेषण",
          "breakdown_title": "सविस्तर माहिती",
          "expert_summary_title": "तज्ज्ञांचा सल्ला",
          "history": "📜 अलीकडील हिस्ट्री",
          "no_history": "अद्याप हिस्ट्री नाही",
          "guests_label": "पाहुणे",
          "confirm_delete": "हा प्लॅन डिलीट करायचा का?",
          "fill_all_fields": "कृपया सर्व माहिती भरा!"
        }
      },
      hi: {
  translation: {
    "welcome_title_1": "AI वेडिंग",
    "welcome_title_2": "प्लानर",
    "welcome_subtitle": "आपके सपनों की शादी का सटीक नियोजन",
    "total_budget": "कुल बजट (₹)",
    "guests": "मेहमानों की संख्या",
    "location_type": "स्थान का प्रकार",
    "generate_plan": "बजट प्लान बनाएं",
    "loading_plan": "AI प्लान तैयार कर रहा है...",
    "save_pdf": "PDF में सेव करें",
    "report_title": "वेडिंग बजट रिपोर्ट",
    "analysis_title": "बजट विश्लेषण",
    "breakdown_title": "विस्तृत विवरण",
    "expert_summary_title": "विशेषज्ञ की राय",
    "history": "📜 पुराना इतिहास",
    "no_history": "अभी तक कोई इतिहास नहीं",
    "guests_label": "मेहमान",
    "confirm_delete": "क्या आप इस प्लान को हटाना चाहते हैं?",
    "fill_all_fields": "कृपया सभी जानकारी भरें!"
  }
},
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;