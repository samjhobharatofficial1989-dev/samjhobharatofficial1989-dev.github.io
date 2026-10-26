/* समझो भारत — भाषाएँ (UI translations). नई भाषा जोड़ने के लिए LANGS और STR में एक प्रविष्टि जोड़ें। */
window.SB_LANGS = [
  { code: "hi", name: "हिंदी" },
  { code: "en", name: "English" },
  { code: "bn", name: "বাংলা" },
  { code: "mr", name: "मराठी" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "ur", name: "اردو", rtl: true },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" }
];

window.SB_STR = {
  hi: {
    tr_loading: "अनुवाद लोड हो रहा है…", tr_pending: "इस लेख का अनुवाद जल्द आएगा। तब तक नीचे वाले बटन से पढ़ें।",
    nav_news: "खबरें", nav_gyan: "जानकारी", nav_quiz: "क्विज़", nav_video: "वीडियो", nav_links: "जुड़ें",
    search_ph: "खबर खोजें…", all: "सभी", latest: "ताज़ा खबरें", search_prefix: "खोज: ",
    gyan_head: "अच्छी जानकारी", did_you_know: "क्या आप जानते हैं?", quiz_head: "आज का क्विज़", video_head: "हमारे वीडियो",
    yt_btn: "YouTube चैनल खोलें और Subscribe करें", links_head: "हमसे जुड़ें",
    about_head: "समझो भारत के बारे में", about_text: "समझो भारत देश-दुनिया की खबरों और उपयोगी जानकारी को आसान भाषा में आप तक पहुँचाता है।",
    privacy: "गोपनीयता नीति", version: "संस्करण",
    updating: "अपडेट हो रहा है…", offline: "ऑफ़लाइन — पुरानी खबरें", load_fail: "खबरें लोड नहीं हो पाईं। इंटरनेट जाँचें।", retry: "फिर से कोशिश करें",
    no_news: "अभी कोई खबर नहीं है। जल्द ही नई खबरें आएँगी।", no_results: "इस शब्द से कोई खबर नहीं मिली। कोई दूसरा शब्द आज़माएँ।",
    no_label: "इस विषय में अभी कोई खबर नहीं है।", gyan_empty: "जल्द ही यहाँ उपयोगी जानकारी वाले लेख आएँगे।",
    read_blog: "ब्लॉग पर पूरा लेख देखें", read_lang: "यह लेख हिंदी में पढ़ें", mt_note: "यह मशीन अनुवाद है। मूल लेख हिंदी या अंग्रेज़ी में है।",
    comments: "टिप्पणियाँ", comment_btn: "टिप्पणी पढ़ें और लिखें", comment_count: "{n} टिप्पणियाँ", no_comments: "सबसे पहले अपनी राय लिखें",
    comment_note: "टिप्पणी ब्लॉग पर खुलेगी। अपनी राय सम्मान के साथ लिखें।",
    lang_title: "भाषा चुनें", lang_btn: "भाषा",
    q_label: "सवाल", q_score: "स्कोर", q_right: "सही जवाब! ✔", q_wrong: "गलत जवाब ✘", q_next: "अगला सवाल →", q_result: "नतीजा देखें",
    q_m4: "शानदार! सारे जवाब सही।", q_m3: "बहुत बढ़िया!", q_m2: "अच्छा प्रयास!", q_m1: "कोई बात नहीं, कल फिर कोशिश करें।",
    q_done: "आज का क्विज़ पूरा हुआ।", q_already: "आज का क्विज़ आप पूरा कर चुके हैं।", q_tomorrow: "कल नए सवाल आएँगे।",
    q_share: "दोस्तों को चुनौती दें (WhatsApp)", q_streak: "🔥 लगातार {n} दिन", q_empty: "जल्द ही नए सवाल आएँगे।", v_empty: "जल्द ही नए वीडियो आएँगे।"
  },
  en: {
    tr_loading: "Loading translation…", tr_pending: "The translation of this article is coming soon. Until then, use the button below.",
    nav_news: "News", nav_gyan: "Info", nav_quiz: "Quiz", nav_video: "Videos", nav_links: "Connect",
    search_ph: "Search news…", all: "All", latest: "Latest news", search_prefix: "Search: ",
    gyan_head: "Useful information", did_you_know: "Did you know?", quiz_head: "Today's quiz", video_head: "Our videos",
    yt_btn: "Open YouTube channel and Subscribe", links_head: "Connect with us",
    about_head: "About Samjho Bharat", about_text: "Samjho Bharat brings you news and useful information in simple language.",
    privacy: "Privacy Policy", version: "Version",
    updating: "Updating…", offline: "Offline — older news", load_fail: "Could not load news. Please check your internet.", retry: "Try again",
    no_news: "No news right now. New articles are coming soon.", no_results: "No news found for this word. Try another word.",
    no_label: "No news in this topic yet.", gyan_empty: "Useful articles are coming here soon.",
    read_blog: "Read the full article on the blog", read_lang: "Read this article in English", mt_note: "This is a machine translation. The original article is in Hindi or English.",
    comments: "Comments", comment_btn: "Read and write comments", comment_count: "{n} comments", no_comments: "Be the first to share your view",
    comment_note: "Comments open on the blog. Please write respectfully.",
    lang_title: "Choose language", lang_btn: "Language",
    q_label: "Question", q_score: "Score", q_right: "Correct! ✔", q_wrong: "Wrong answer ✘", q_next: "Next question →", q_result: "See result",
    q_m4: "Excellent! All answers correct.", q_m3: "Very good!", q_m2: "Good try!", q_m1: "No problem, try again tomorrow.",
    q_done: "Today's quiz is complete.", q_already: "You have already completed today's quiz.", q_tomorrow: "New questions tomorrow.",
    q_share: "Challenge friends (WhatsApp)", q_streak: "🔥 {n}-day streak", q_empty: "New questions are coming soon.", v_empty: "New videos are coming soon."
  },
  bn: {
    tr_loading: "অনুবাদ লোড হচ্ছে…", tr_pending: "এই লেখার অনুবাদ শিগগিরই আসবে। ততক্ষণ নিচের বোতাম দিয়ে পড়ুন।",
    nav_news: "খবর", nav_gyan: "তথ্য", nav_quiz: "কুইজ", nav_video: "ভিডিও", nav_links: "যুক্ত হন",
    search_ph: "খবর খুঁজুন…", all: "সব", latest: "সর্বশেষ খবর", search_prefix: "খোঁজ: ",
    gyan_head: "দরকারি তথ্য", did_you_know: "আপনি কি জানেন?", quiz_head: "আজকের কুইজ", video_head: "আমাদের ভিডিও",
    yt_btn: "YouTube চ্যানেল খুলুন এবং Subscribe করুন", links_head: "আমাদের সঙ্গে যুক্ত হন",
    about_head: "সমঝো ভারত সম্পর্কে", about_text: "সমঝো ভারত দেশ-বিদেশের খবর ও দরকারি তথ্য সহজ ভাষায় আপনার কাছে পৌঁছে দেয়।",
    privacy: "গোপনীয়তা নীতি", version: "সংস্করণ",
    updating: "আপডেট হচ্ছে…", offline: "অফলাইন — পুরোনো খবর", load_fail: "খবর লোড হয়নি। ইন্টারনেট দেখে নিন।", retry: "আবার চেষ্টা করুন",
    no_news: "এখন কোনো খবর নেই। শিগগিরই নতুন খবর আসবে।", no_results: "এই শব্দে কোনো খবর পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।",
    no_label: "এই বিষয়ে এখনও কোনো খবর নেই।", gyan_empty: "শিগগিরই এখানে দরকারি লেখা আসবে।",
    read_blog: "ব্লগে পুরো লেখা দেখুন", read_lang: "এই লেখাটি বাংলায় পড়ুন", mt_note: "এটি মেশিন অনুবাদ। মূল লেখা হিন্দি বা ইংরেজিতে।",
    comments: "মন্তব্য", comment_btn: "মন্তব্য পড়ুন ও লিখুন", comment_count: "{n}টি মন্তব্য", no_comments: "প্রথম মন্তব্যটি আপনিই লিখুন",
    comment_note: "মন্তব্য ব্লগে খুলবে। সম্মানের সঙ্গে লিখুন।",
    lang_title: "ভাষা বেছে নিন", lang_btn: "ভাষা",
    q_label: "প্রশ্ন", q_score: "স্কোর", q_right: "সঠিক উত্তর! ✔", q_wrong: "ভুল উত্তর ✘", q_next: "পরের প্রশ্ন →", q_result: "ফলাফল দেখুন",
    q_m4: "দারুণ! সব উত্তর সঠিক।", q_m3: "খুব ভালো!", q_m2: "ভালো চেষ্টা!", q_m1: "কোনো ব্যাপার না, কাল আবার চেষ্টা করুন।",
    q_done: "আজকের কুইজ শেষ হয়েছে।", q_already: "আজকের কুইজ আপনি শেষ করেছেন।", q_tomorrow: "কাল নতুন প্রশ্ন আসবে।",
    q_share: "বন্ধুদের চ্যালেঞ্জ দিন (WhatsApp)", q_streak: "🔥 টানা {n} দিন", q_empty: "শিগগিরই নতুন প্রশ্ন আসবে।", v_empty: "শিগগিরই নতুন ভিডিও আসবে।"
  },
  mr: {
    tr_loading: "भाषांतर लोड होत आहे…", tr_pending: "या लेखाचे भाषांतर लवकरच येईल. तोपर्यंत खालील बटणाने वाचा.",
    nav_news: "बातम्या", nav_gyan: "माहिती", nav_quiz: "क्विझ", nav_video: "व्हिडिओ", nav_links: "जोडा",
    search_ph: "बातमी शोधा…", all: "सर्व", latest: "ताज्या बातम्या", search_prefix: "शोध: ",
    gyan_head: "उपयुक्त माहिती", did_you_know: "तुम्हाला माहीत आहे का?", quiz_head: "आजचे क्विझ", video_head: "आमचे व्हिडिओ",
    yt_btn: "YouTube चॅनेल उघडा आणि Subscribe करा", links_head: "आमच्याशी जोडले जा",
    about_head: "समझो भारत विषयी", about_text: "समझो भारत देश-विदेशातील बातम्या आणि उपयुक्त माहिती सोप्या भाषेत तुमच्यापर्यंत पोहोचवते.",
    privacy: "गोपनीयता धोरण", version: "आवृत्ती",
    updating: "अपडेट होत आहे…", offline: "ऑफलाइन — जुन्या बातम्या", load_fail: "बातम्या लोड झाल्या नाहीत. इंटरनेट तपासा.", retry: "पुन्हा प्रयत्न करा",
    no_news: "सध्या कोणतीही बातमी नाही. लवकरच नवीन बातम्या येतील.", no_results: "या शब्दाने कोणतीही बातमी सापडली नाही. दुसरा शब्द वापरून पाहा.",
    no_label: "या विषयात अजून कोणतीही बातमी नाही.", gyan_empty: "लवकरच इथे उपयुक्त लेख येतील.",
    read_blog: "ब्लॉगवर पूर्ण लेख पाहा", read_lang: "हा लेख मराठीत वाचा", mt_note: "हे मशीन भाषांतर आहे. मूळ लेख हिंदी किंवा इंग्रजीत आहे.",
    comments: "प्रतिक्रिया", comment_btn: "प्रतिक्रिया वाचा आणि लिहा", comment_count: "{n} प्रतिक्रिया", no_comments: "पहिली प्रतिक्रिया तुम्ही लिहा",
    comment_note: "प्रतिक्रिया ब्लॉगवर उघडेल. आदराने लिहा.",
    lang_title: "भाषा निवडा", lang_btn: "भाषा",
    q_label: "प्रश्न", q_score: "गुण", q_right: "बरोबर उत्तर! ✔", q_wrong: "चुकीचे उत्तर ✘", q_next: "पुढचा प्रश्न →", q_result: "निकाल पाहा",
    q_m4: "छान! सर्व उत्तरे बरोबर.", q_m3: "खूप छान!", q_m2: "चांगला प्रयत्न!", q_m1: "काही हरकत नाही, उद्या पुन्हा प्रयत्न करा.",
    q_done: "आजचे क्विझ पूर्ण झाले.", q_already: "आजचे क्विझ तुम्ही पूर्ण केले आहे.", q_tomorrow: "उद्या नवीन प्रश्न येतील.",
    q_share: "मित्रांना आव्हान द्या (WhatsApp)", q_streak: "🔥 सलग {n} दिवस", q_empty: "लवकरच नवीन प्रश्न येतील.", v_empty: "लवकरच नवीन व्हिडिओ येतील."
  },
  te: {
    tr_loading: "అనువాదం లోడ్ అవుతోంది…", tr_pending: "ఈ వ్యాసం అనువాదం త్వరలో వస్తుంది. అప్పటివరకు కింది బటన్‌తో చదవండి.",
    nav_news: "వార్తలు", nav_gyan: "సమాచారం", nav_quiz: "క్విజ్", nav_video: "వీడియోలు", nav_links: "కలవండి",
    search_ph: "వార్తలు వెతకండి…", all: "అన్నీ", latest: "తాజా వార్తలు", search_prefix: "వెతుకు: ",
    gyan_head: "ఉపయోగకరమైన సమాచారం", did_you_know: "మీకు తెలుసా?", quiz_head: "నేటి క్విజ్", video_head: "మా వీడియోలు",
    yt_btn: "YouTube ఛానల్ తెరిచి Subscribe చేయండి", links_head: "మాతో కలవండి",
    about_head: "సమఝో భారత్ గురించి", about_text: "సమఝో భారత్ దేశ విదేశాల వార్తలు, ఉపయోగకరమైన సమాచారాన్ని సులభమైన భాషలో మీకు అందిస్తుంది.",
    privacy: "గోప్యతా విధానం", version: "వెర్షన్",
    updating: "అప్‌డేట్ అవుతోంది…", offline: "ఆఫ్‌లైన్ — పాత వార్తలు", load_fail: "వార్తలు లోడ్ కాలేదు. ఇంటర్నెట్ చూడండి.", retry: "మళ్ళీ ప్రయత్నించండి",
    no_news: "ప్రస్తుతం వార్తలు లేవు. త్వరలో కొత్త వార్తలు వస్తాయి.", no_results: "ఈ పదంతో వార్తలు దొరకలేదు. మరో పదం ప్రయత్నించండి.",
    no_label: "ఈ అంశంలో ఇంకా వార్తలు లేవు.", gyan_empty: "త్వరలో ఇక్కడ ఉపయోగకరమైన వ్యాసాలు వస్తాయి.",
    read_blog: "బ్లాగ్‌లో పూర్తి వ్యాసం చూడండి", read_lang: "ఈ వ్యాసాన్ని తెలుగులో చదవండి", mt_note: "ఇది యంత్ర అనువాదం. అసలు వ్యాసం హిందీ లేదా ఇంగ్లీష్‌లో ఉంది.",
    comments: "వ్యాఖ్యలు", comment_btn: "వ్యాఖ్యలు చదవండి, రాయండి", comment_count: "{n} వ్యాఖ్యలు", no_comments: "మొదటి వ్యాఖ్య మీరే రాయండి",
    comment_note: "వ్యాఖ్యలు బ్లాగ్‌లో తెరుచుకుంటాయి. గౌరవంగా రాయండి.",
    lang_title: "భాషను ఎంచుకోండి", lang_btn: "భాష",
    q_label: "ప్రశ్న", q_score: "స్కోర్", q_right: "సరైన జవాబు! ✔", q_wrong: "తప్పు జవాబు ✘", q_next: "తర్వాతి ప్రశ్న →", q_result: "ఫలితం చూడండి",
    q_m4: "అద్భుతం! అన్ని జవాబులు సరైనవి.", q_m3: "చాలా బాగుంది!", q_m2: "మంచి ప్రయత్నం!", q_m1: "పర్వాలేదు, రేపు మళ్ళీ ప్రయత్నించండి.",
    q_done: "నేటి క్విజ్ పూర్తయింది.", q_already: "నేటి క్విజ్ మీరు ఇప్పటికే పూర్తి చేశారు.", q_tomorrow: "రేపు కొత్త ప్రశ్నలు వస్తాయి.",
    q_share: "స్నేహితులకు సవాల్ చేయండి (WhatsApp)", q_streak: "🔥 వరుసగా {n} రోజులు", q_empty: "త్వరలో కొత్త ప్రశ్నలు వస్తాయి.", v_empty: "త్వరలో కొత్త వీడియోలు వస్తాయి."
  },
  ta: {
    tr_loading: "மொழிபெயர்ப்பு ஏற்றப்படுகிறது…", tr_pending: "இந்தக் கட்டுரையின் மொழிபெயர்ப்பு விரைவில் வரும். அதுவரை கீழே உள்ள பொத்தானில் படியுங்கள்.",
    nav_news: "செய்திகள்", nav_gyan: "தகவல்", nav_quiz: "வினாடி வினா", nav_video: "வீடியோ", nav_links: "இணையுங்கள்",
    search_ph: "செய்தி தேடுங்கள்…", all: "அனைத்தும்", latest: "சமீபத்திய செய்திகள்", search_prefix: "தேடல்: ",
    gyan_head: "பயனுள்ள தகவல்", did_you_know: "உங்களுக்குத் தெரியுமா?", quiz_head: "இன்றைய வினாடி வினா", video_head: "எங்கள் வீடியோக்கள்",
    yt_btn: "YouTube சேனலைத் திறந்து Subscribe செய்யுங்கள்", links_head: "எங்களுடன் இணையுங்கள்",
    about_head: "சமஜோ பாரத் பற்றி", about_text: "சமஜோ பாரத் நாட்டு, உலகச் செய்திகளையும் பயனுள்ள தகவல்களையும் எளிய மொழியில் உங்களுக்குத் தருகிறது.",
    privacy: "தனியுரிமைக் கொள்கை", version: "பதிப்பு",
    updating: "புதுப்பிக்கப்படுகிறது…", offline: "ஆஃப்லைன் — பழைய செய்திகள்", load_fail: "செய்திகள் ஏற்றப்படவில்லை. இணையத்தைச் சரிபாருங்கள்.", retry: "மீண்டும் முயலுங்கள்",
    no_news: "இப்போது செய்திகள் இல்லை. விரைவில் புதிய செய்திகள் வரும்.", no_results: "இந்தச் சொல்லுக்குச் செய்தி கிடைக்கவில்லை. வேறு சொல்லை முயலுங்கள்.",
    no_label: "இந்தத் தலைப்பில் இன்னும் செய்தி இல்லை.", gyan_empty: "விரைவில் இங்கே பயனுள்ள கட்டுரைகள் வரும்.",
    read_blog: "முழுக் கட்டுரையை வலைப்பதிவில் பாருங்கள்", read_lang: "இந்தக் கட்டுரையைத் தமிழில் படியுங்கள்", mt_note: "இது இயந்திர மொழிபெயர்ப்பு. மூலக் கட்டுரை இந்தி அல்லது ஆங்கிலத்தில் உள்ளது.",
    comments: "கருத்துகள்", comment_btn: "கருத்துகளைப் படியுங்கள், எழுதுங்கள்", comment_count: "{n} கருத்துகள்", no_comments: "முதல் கருத்தை நீங்களே எழுதுங்கள்",
    comment_note: "கருத்துகள் வலைப்பதிவில் திறக்கும். மரியாதையுடன் எழுதுங்கள்.",
    lang_title: "மொழியைத் தேர்ந்தெடுங்கள்", lang_btn: "மொழி",
    q_label: "கேள்வி", q_score: "மதிப்பெண்", q_right: "சரியான பதில்! ✔", q_wrong: "தவறான பதில் ✘", q_next: "அடுத்த கேள்வி →", q_result: "முடிவைப் பாருங்கள்",
    q_m4: "அருமை! எல்லாப் பதில்களும் சரி.", q_m3: "மிக நன்று!", q_m2: "நல்ல முயற்சி!", q_m1: "பரவாயில்லை, நாளை மீண்டும் முயலுங்கள்.",
    q_done: "இன்றைய வினாடி வினா முடிந்தது.", q_already: "இன்றைய வினாடி வினாவை ஏற்கெனவே முடித்துவிட்டீர்கள்.", q_tomorrow: "நாளை புதிய கேள்விகள் வரும்.",
    q_share: "நண்பர்களுக்குச் சவால் விடுங்கள் (WhatsApp)", q_streak: "🔥 தொடர்ந்து {n} நாள்", q_empty: "விரைவில் புதிய கேள்விகள் வரும்.", v_empty: "விரைவில் புதிய வீடியோக்கள் வரும்."
  },
  gu: {
    tr_loading: "અનુવાદ લોડ થઈ રહ્યો છે…", tr_pending: "આ લેખનો અનુવાદ જલદી આવશે. ત્યાં સુધી નીચેના બટનથી વાંચો.",
    nav_news: "સમાચાર", nav_gyan: "માહિતી", nav_quiz: "ક્વિઝ", nav_video: "વિડિયો", nav_links: "જોડાઓ",
    search_ph: "સમાચાર શોધો…", all: "બધા", latest: "તાજા સમાચાર", search_prefix: "શોધ: ",
    gyan_head: "ઉપયોગી માહિતી", did_you_know: "શું તમે જાણો છો?", quiz_head: "આજની ક્વિઝ", video_head: "અમારા વિડિયો",
    yt_btn: "YouTube ચેનલ ખોલો અને Subscribe કરો", links_head: "અમારી સાથે જોડાઓ",
    about_head: "સમઝો ભારત વિશે", about_text: "સમઝો ભારત દેશ-દુનિયાના સમાચાર અને ઉપયોગી માહિતી સરળ ભાષામાં તમારા સુધી પહોંચાડે છે.",
    privacy: "ગોપનીયતા નીતિ", version: "આવૃત્તિ",
    updating: "અપડેટ થઈ રહ્યું છે…", offline: "ઑફલાઇન — જૂના સમાચાર", load_fail: "સમાચાર લોડ થયા નથી. ઇન્ટરનેટ તપાસો.", retry: "ફરી પ્રયાસ કરો",
    no_news: "હાલમાં કોઈ સમાચાર નથી. જલદી નવા સમાચાર આવશે.", no_results: "આ શબ્દથી કોઈ સમાચાર મળ્યા નથી. બીજો શબ્દ અજમાવો.",
    no_label: "આ વિષયમાં હજી કોઈ સમાચાર નથી.", gyan_empty: "જલદી અહીં ઉપયોગી લેખો આવશે.",
    read_blog: "બ્લૉગ પર આખો લેખ જુઓ", read_lang: "આ લેખ ગુજરાતીમાં વાંચો", mt_note: "આ મશીન અનુવાદ છે. મૂળ લેખ હિન્દી અથવા અંગ્રેજીમાં છે.",
    comments: "ટિપ્પણીઓ", comment_btn: "ટિપ્પણી વાંચો અને લખો", comment_count: "{n} ટિપ્પણીઓ", no_comments: "પહેલી ટિપ્પણી તમે લખો",
    comment_note: "ટિપ્પણી બ્લૉગ પર ખુલશે. આદરપૂર્વક લખો.",
    lang_title: "ભાષા પસંદ કરો", lang_btn: "ભાષા",
    q_label: "પ્રશ્ન", q_score: "સ્કોર", q_right: "સાચો જવાબ! ✔", q_wrong: "ખોટો જવાબ ✘", q_next: "આગળનો પ્રશ્ન →", q_result: "પરિણામ જુઓ",
    q_m4: "શાનદાર! બધા જવાબ સાચા.", q_m3: "ખૂબ સરસ!", q_m2: "સારો પ્રયાસ!", q_m1: "કંઈ વાંધો નહીં, કાલે ફરી પ્રયાસ કરો.",
    q_done: "આજની ક્વિઝ પૂરી થઈ.", q_already: "આજની ક્વિઝ તમે પૂરી કરી દીધી છે.", q_tomorrow: "કાલે નવા પ્રશ્નો આવશે.",
    q_share: "મિત્રોને પડકાર આપો (WhatsApp)", q_streak: "🔥 સતત {n} દિવસ", q_empty: "જલદી નવા પ્રશ્નો આવશે.", v_empty: "જલદી નવા વિડિયો આવશે."
  },
  ur: {
    tr_loading: "ترجمہ لوڈ ہو رہا ہے…", tr_pending: "اس مضمون کا ترجمہ جلد آئے گا۔ تب تک نیچے والے بٹن سے پڑھیں۔",
    nav_news: "خبریں", nav_gyan: "معلومات", nav_quiz: "کوئز", nav_video: "ویڈیو", nav_links: "جڑیں",
    search_ph: "خبر تلاش کریں…", all: "سب", latest: "تازہ خبریں", search_prefix: "تلاش: ",
    gyan_head: "مفید معلومات", did_you_know: "کیا آپ جانتے ہیں؟", quiz_head: "آج کا کوئز", video_head: "ہماری ویڈیوز",
    yt_btn: "YouTube چینل کھولیں اور Subscribe کریں", links_head: "ہم سے جڑیں",
    about_head: "سمجھو بھارت کے بارے میں", about_text: "سمجھو بھارت ملک اور دنیا کی خبریں اور مفید معلومات آسان زبان میں آپ تک پہنچاتا ہے۔",
    privacy: "رازداری کی پالیسی", version: "ورژن",
    updating: "اپ ڈیٹ ہو رہا ہے…", offline: "آف لائن — پرانی خبریں", load_fail: "خبریں لوڈ نہیں ہو سکیں۔ انٹرنیٹ چیک کریں۔", retry: "دوبارہ کوشش کریں",
    no_news: "ابھی کوئی خبر نہیں ہے۔ جلد ہی نئی خبریں آئیں گی۔", no_results: "اس لفظ سے کوئی خبر نہیں ملی۔ کوئی دوسرا لفظ آزمائیں۔",
    no_label: "اس موضوع میں ابھی کوئی خبر نہیں ہے۔", gyan_empty: "جلد ہی یہاں مفید مضامین آئیں گے۔",
    read_blog: "بلاگ پر پورا مضمون دیکھیں", read_lang: "یہ مضمون اردو میں پڑھیں", mt_note: "یہ مشینی ترجمہ ہے۔ اصل مضمون ہندی یا انگریزی میں ہے۔",
    comments: "تبصرے", comment_btn: "تبصرے پڑھیں اور لکھیں", comment_count: "{n} تبصرے", no_comments: "سب سے پہلے اپنی رائے لکھیں",
    comment_note: "تبصرہ بلاگ پر کھلے گا۔ براہِ کرم احترام سے لکھیں۔",
    lang_title: "زبان منتخب کریں", lang_btn: "زبان",
    q_label: "سوال", q_score: "اسکور", q_right: "صحیح جواب! ✔", q_wrong: "غلط جواب ✘", q_next: "اگلا سوال ←", q_result: "نتیجہ دیکھیں",
    q_m4: "شاندار! سارے جواب صحیح۔", q_m3: "بہت خوب!", q_m2: "اچھی کوشش!", q_m1: "کوئی بات نہیں، کل پھر کوشش کریں۔",
    q_done: "آج کا کوئز مکمل ہوا۔", q_already: "آج کا کوئز آپ مکمل کر چکے ہیں۔", q_tomorrow: "کل نئے سوال آئیں گے۔",
    q_share: "دوستوں کو چیلنج دیں (WhatsApp)", q_streak: "🔥 مسلسل {n} دن", q_empty: "جلد ہی نئے سوال آئیں گے۔", v_empty: "جلد ہی نئی ویڈیوز آئیں گی۔"
  },
  kn: {
    tr_loading: "ಅನುವಾದ ಲೋಡ್ ಆಗುತ್ತಿದೆ…", tr_pending: "ಈ ಲೇಖನದ ಅನುವಾದ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ. ಅಲ್ಲಿಯವರೆಗೆ ಕೆಳಗಿನ ಬಟನ್ ಮೂಲಕ ಓದಿ.",
    nav_news: "ಸುದ್ದಿ", nav_gyan: "ಮಾಹಿತಿ", nav_quiz: "ರಸಪ್ರಶ್ನೆ", nav_video: "ವೀಡಿಯೊ", nav_links: "ಸೇರಿ",
    search_ph: "ಸುದ್ದಿ ಹುಡುಕಿ…", all: "ಎಲ್ಲಾ", latest: "ಇತ್ತೀಚಿನ ಸುದ್ದಿ", search_prefix: "ಹುಡುಕಾಟ: ",
    gyan_head: "ಉಪಯುಕ್ತ ಮಾಹಿತಿ", did_you_know: "ನಿಮಗೆ ಗೊತ್ತೇ?", quiz_head: "ಇಂದಿನ ರಸಪ್ರಶ್ನೆ", video_head: "ನಮ್ಮ ವೀಡಿಯೊಗಳು",
    yt_btn: "YouTube ಚಾನೆಲ್ ತೆರೆದು Subscribe ಮಾಡಿ", links_head: "ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ",
    about_head: "ಸಮಝೋ ಭಾರತ್ ಬಗ್ಗೆ", about_text: "ಸಮಝೋ ಭಾರತ್ ದೇಶ-ವಿದೇಶದ ಸುದ್ದಿ ಮತ್ತು ಉಪಯುಕ್ತ ಮಾಹಿತಿಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ನಿಮಗೆ ತಲುಪಿಸುತ್ತದೆ.",
    privacy: "ಗೌಪ್ಯತಾ ನೀತಿ", version: "ಆವೃತ್ತಿ",
    updating: "ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತಿದೆ…", offline: "ಆಫ್‌ಲೈನ್ — ಹಳೆಯ ಸುದ್ದಿ", load_fail: "ಸುದ್ದಿ ಲೋಡ್ ಆಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಪರಿಶೀಲಿಸಿ.", retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    no_news: "ಈಗ ಯಾವುದೇ ಸುದ್ದಿ ಇಲ್ಲ. ಶೀಘ್ರದಲ್ಲೇ ಹೊಸ ಸುದ್ದಿ ಬರಲಿದೆ.", no_results: "ಈ ಪದಕ್ಕೆ ಯಾವುದೇ ಸುದ್ದಿ ಸಿಗಲಿಲ್ಲ. ಬೇರೆ ಪದ ಪ್ರಯತ್ನಿಸಿ.",
    no_label: "ಈ ವಿಷಯದಲ್ಲಿ ಇನ್ನೂ ಸುದ್ದಿ ಇಲ್ಲ.", gyan_empty: "ಶೀಘ್ರದಲ್ಲೇ ಇಲ್ಲಿ ಉಪಯುಕ್ತ ಲೇಖನಗಳು ಬರಲಿವೆ.",
    read_blog: "ಬ್ಲಾಗ್‌ನಲ್ಲಿ ಪೂರ್ಣ ಲೇಖನ ನೋಡಿ", read_lang: "ಈ ಲೇಖನವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಓದಿ", mt_note: "ಇದು ಯಂತ್ರ ಅನುವಾದ. ಮೂಲ ಲೇಖನ ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆ.",
    comments: "ಕಾಮೆಂಟ್‌ಗಳು", comment_btn: "ಕಾಮೆಂಟ್ ಓದಿ ಮತ್ತು ಬರೆಯಿರಿ", comment_count: "{n} ಕಾಮೆಂಟ್‌ಗಳು", no_comments: "ಮೊದಲ ಕಾಮೆಂಟ್ ನೀವೇ ಬರೆಯಿರಿ",
    comment_note: "ಕಾಮೆಂಟ್ ಬ್ಲಾಗ್‌ನಲ್ಲಿ ತೆರೆಯುತ್ತದೆ. ಗೌರವದಿಂದ ಬರೆಯಿರಿ.",
    lang_title: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", lang_btn: "ಭಾಷೆ",
    q_label: "ಪ್ರಶ್ನೆ", q_score: "ಅಂಕ", q_right: "ಸರಿಯಾದ ಉತ್ತರ! ✔", q_wrong: "ತಪ್ಪು ಉತ್ತರ ✘", q_next: "ಮುಂದಿನ ಪ್ರಶ್ನೆ →", q_result: "ಫಲಿತಾಂಶ ನೋಡಿ",
    q_m4: "ಅದ್ಭುತ! ಎಲ್ಲಾ ಉತ್ತರಗಳು ಸರಿ.", q_m3: "ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ!", q_m2: "ಒಳ್ಳೆಯ ಪ್ರಯತ್ನ!", q_m1: "ಪರವಾಗಿಲ್ಲ, ನಾಳೆ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    q_done: "ಇಂದಿನ ರಸಪ್ರಶ್ನೆ ಮುಗಿಯಿತು.", q_already: "ಇಂದಿನ ರಸಪ್ರಶ್ನೆಯನ್ನು ನೀವು ಈಗಾಗಲೇ ಮುಗಿಸಿದ್ದೀರಿ.", q_tomorrow: "ನಾಳೆ ಹೊಸ ಪ್ರಶ್ನೆಗಳು ಬರಲಿವೆ.",
    q_share: "ಸ್ನೇಹಿತರಿಗೆ ಸವಾಲು ಹಾಕಿ (WhatsApp)", q_streak: "🔥 ಸತತ {n} ದಿನ", q_empty: "ಶೀಘ್ರದಲ್ಲೇ ಹೊಸ ಪ್ರಶ್ನೆಗಳು ಬರಲಿವೆ.", v_empty: "ಶೀಘ್ರದಲ್ಲೇ ಹೊಸ ವೀಡಿಯೊಗಳು ಬರಲಿವೆ."
  },
  or: {
    tr_loading: "ଅନୁବାଦ ଲୋଡ୍ ହେଉଛି…", tr_pending: "ଏହି ଲେଖାର ଅନୁବାଦ ଶୀଘ୍ର ଆସିବ। ସେପର୍ଯ୍ୟନ୍ତ ତଳ ବଟନ୍‌ରେ ପଢ଼ନ୍ତୁ।",
    nav_news: "ଖବର", nav_gyan: "ସୂଚନା", nav_quiz: "କୁଇଜ୍", nav_video: "ଭିଡିଓ", nav_links: "ଯୋଡ଼ି ହୁଅନ୍ତୁ",
    search_ph: "ଖବର ଖୋଜନ୍ତୁ…", all: "ସବୁ", latest: "ତାଜା ଖବର", search_prefix: "ଖୋଜ: ",
    gyan_head: "ଉପଯୋଗୀ ସୂଚନା", did_you_know: "ଆପଣ ଜାଣନ୍ତି କି?", quiz_head: "ଆଜିର କୁଇଜ୍", video_head: "ଆମ ଭିଡିଓ",
    yt_btn: "YouTube ଚ୍ୟାନେଲ ଖୋଲନ୍ତୁ ଏବଂ Subscribe କରନ୍ତୁ", links_head: "ଆମ ସହ ଯୋଡ଼ି ହୁଅନ୍ତୁ",
    about_head: "ସମଝୋ ଭାରତ ବିଷୟରେ", about_text: "ସମଝୋ ଭାରତ ଦେଶ-ବିଦେଶର ଖବର ଓ ଉପଯୋଗୀ ସୂଚନା ସରଳ ଭାଷାରେ ଆପଣଙ୍କ ପାଖରେ ପହଞ୍ଚାଏ।",
    privacy: "ଗୋପନୀୟତା ନୀତି", version: "ସଂସ୍କରଣ",
    updating: "ଅପଡେଟ୍ ହେଉଛି…", offline: "ଅଫଲାଇନ୍ — ପୁରୁଣା ଖବର", load_fail: "ଖବର ଲୋଡ୍ ହେଲା ନାହିଁ। ଇଣ୍ଟରନେଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ।", retry: "ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ",
    no_news: "ବର୍ତ୍ତମାନ କୌଣସି ଖବର ନାହିଁ। ଶୀଘ୍ର ନୂଆ ଖବର ଆସିବ।", no_results: "ଏହି ଶବ୍ଦରେ କୌଣସି ଖବର ମିଳିଲା ନାହିଁ। ଅନ୍ୟ ଶବ୍ଦ ଚେଷ୍ଟା କରନ୍ତୁ।",
    no_label: "ଏହି ବିଷୟରେ ଏଯାଏଁ କୌଣସି ଖବର ନାହିଁ।", gyan_empty: "ଶୀଘ୍ର ଏଠାରେ ଉପଯୋଗୀ ଲେଖା ଆସିବ।",
    read_blog: "ବ୍ଲଗରେ ପୂରା ଲେଖା ଦେଖନ୍ତୁ", read_lang: "ଏହି ଲେଖାକୁ ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ", mt_note: "ଏହା ମେସିନ୍ ଅନୁବାଦ। ମୂଳ ଲେଖା ହିନ୍ଦୀ କିମ୍ବା ଇଂରାଜୀରେ ଅଛି।",
    comments: "ମନ୍ତବ୍ୟ", comment_btn: "ମନ୍ତବ୍ୟ ପଢ଼ନ୍ତୁ ଓ ଲେଖନ୍ତୁ", comment_count: "{n}ଟି ମନ୍ତବ୍ୟ", no_comments: "ପ୍ରଥମ ମନ୍ତବ୍ୟ ଆପଣ ଲେଖନ୍ତୁ",
    comment_note: "ମନ୍ତବ୍ୟ ବ୍ଲଗରେ ଖୋଲିବ। ସମ୍ମାନର ସହ ଲେଖନ୍ତୁ।",
    lang_title: "ଭାଷା ବାଛନ୍ତୁ", lang_btn: "ଭାଷା",
    q_label: "ପ୍ରଶ୍ନ", q_score: "ସ୍କୋର୍", q_right: "ଠିକ୍ ଉତ୍ତର! ✔", q_wrong: "ଭୁଲ ଉତ୍ତର ✘", q_next: "ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ →", q_result: "ଫଳାଫଳ ଦେଖନ୍ତୁ",
    q_m4: "ଚମତ୍କାର! ସବୁ ଉତ୍ତର ଠିକ୍।", q_m3: "ବହୁତ ଭଲ!", q_m2: "ଭଲ ଚେଷ୍ଟା!", q_m1: "କିଛି ଅସୁବିଧା ନାହିଁ, କାଲି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।",
    q_done: "ଆଜିର କୁଇଜ୍ ସରିଲା।", q_already: "ଆଜିର କୁଇଜ୍ ଆପଣ ସାରିସାରିଛନ୍ତି।", q_tomorrow: "କାଲି ନୂଆ ପ୍ରଶ୍ନ ଆସିବ।",
    q_share: "ସାଙ୍ଗମାନଙ୍କୁ ଚ୍ୟାଲେଞ୍ଜ କରନ୍ତୁ (WhatsApp)", q_streak: "🔥 ଲଗାତାର {n} ଦିନ", q_empty: "ଶୀଘ୍ର ନୂଆ ପ୍ରଶ୍ନ ଆସିବ।", v_empty: "ଶୀଘ୍ର ନୂଆ ଭିଡିଓ ଆସିବ।"
  },
  ml: {
    tr_loading: "വിവർത്തനം ലോഡ് ചെയ്യുന്നു…", tr_pending: "ഈ ലേഖനത്തിന്റെ വിവർത്തനം ഉടൻ വരും. അതുവരെ താഴെയുള്ള ബട്ടൺ വഴി വായിക്കൂ.",
    nav_news: "വാർത്ത", nav_gyan: "വിവരം", nav_quiz: "ക്വിസ്", nav_video: "വീഡിയോ", nav_links: "ചേരൂ",
    search_ph: "വാർത്ത തിരയൂ…", all: "എല്ലാം", latest: "പുതിയ വാർത്തകൾ", search_prefix: "തിരയൽ: ",
    gyan_head: "ഉപകാരപ്രദമായ വിവരങ്ങൾ", did_you_know: "നിങ്ങൾക്കറിയാമോ?", quiz_head: "ഇന്നത്തെ ക്വിസ്", video_head: "ഞങ്ങളുടെ വീഡിയോകൾ",
    yt_btn: "YouTube ചാനൽ തുറന്ന് Subscribe ചെയ്യൂ", links_head: "ഞങ്ങളോടൊപ്പം ചേരൂ",
    about_head: "സമഝോ ഭാരത്-നെ കുറിച്ച്", about_text: "സമഝോ ഭാരത് രാജ്യത്തെയും ലോകത്തെയും വാർത്തകളും ഉപകാരപ്രദമായ വിവരങ്ങളും ലളിതമായ ഭാഷയിൽ നിങ്ങളിലെത്തിക്കുന്നു.",
    privacy: "സ്വകാര്യതാ നയം", version: "പതിപ്പ്",
    updating: "അപ്‌ഡേറ്റ് ചെയ്യുന്നു…", offline: "ഓഫ്‌ലൈൻ — പഴയ വാർത്തകൾ", load_fail: "വാർത്തകൾ ലോഡ് ആയില്ല. ഇന്റർനെറ്റ് പരിശോധിക്കൂ.", retry: "വീണ്ടും ശ്രമിക്കൂ",
    no_news: "ഇപ്പോൾ വാർത്തകളില്ല. ഉടൻ പുതിയ വാർത്തകൾ വരും.", no_results: "ഈ വാക്കിന് വാർത്തയൊന്നും കിട്ടിയില്ല. മറ്റൊരു വാക്ക് ശ്രമിക്കൂ.",
    no_label: "ഈ വിഷയത്തിൽ ഇതുവരെ വാർത്തയില്ല.", gyan_empty: "ഉടൻ ഇവിടെ ഉപകാരപ്രദമായ ലേഖനങ്ങൾ വരും.",
    read_blog: "ബ്ലോഗിൽ മുഴുവൻ ലേഖനം കാണൂ", read_lang: "ഈ ലേഖനം മലയാളത്തിൽ വായിക്കൂ", mt_note: "ഇത് യന്ത്ര വിവർത്തനമാണ്. യഥാർത്ഥ ലേഖനം ഹിന്ദിയിലോ ഇംഗ്ലീഷിലോ ആണ്.",
    comments: "അഭിപ്രായങ്ങൾ", comment_btn: "അഭിപ്രായങ്ങൾ വായിക്കൂ, എഴുതൂ", comment_count: "{n} അഭിപ്രായങ്ങൾ", no_comments: "ആദ്യ അഭിപ്രായം നിങ്ങൾ എഴുതൂ",
    comment_note: "അഭിപ്രായം ബ്ലോഗിൽ തുറക്കും. ബഹുമാനത്തോടെ എഴുതൂ.",
    lang_title: "ഭാഷ തിരഞ്ഞെടുക്കൂ", lang_btn: "ഭാഷ",
    q_label: "ചോദ്യം", q_score: "സ്കോർ", q_right: "ശരിയായ ഉത്തരം! ✔", q_wrong: "തെറ്റായ ഉത്തരം ✘", q_next: "അടുത്ത ചോദ്യം →", q_result: "ഫലം കാണൂ",
    q_m4: "ഗംഭീരം! എല്ലാ ഉത്തരങ്ങളും ശരി.", q_m3: "വളരെ നല്ലത്!", q_m2: "നല്ല ശ്രമം!", q_m1: "സാരമില്ല, നാളെ വീണ്ടും ശ്രമിക്കൂ.",
    q_done: "ഇന്നത്തെ ക്വിസ് പൂർത്തിയായി.", q_already: "ഇന്നത്തെ ക്വിസ് നിങ്ങൾ പൂർത്തിയാക്കി.", q_tomorrow: "നാളെ പുതിയ ചോദ്യങ്ങൾ വരും.",
    q_share: "സുഹൃത്തുക്കളെ വെല്ലുവിളിക്കൂ (WhatsApp)", q_streak: "🔥 തുടർച്ചയായി {n} ദിവസം", q_empty: "ഉടൻ പുതിയ ചോദ്യങ്ങൾ വരും.", v_empty: "ഉടൻ പുതിയ വീഡിയോകൾ വരും."
  },
  pa: {
    tr_loading: "ਅਨੁਵਾਦ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…", tr_pending: "ਇਸ ਲੇਖ ਦਾ ਅਨੁਵਾਦ ਜਲਦੀ ਆਵੇਗਾ। ਤਦ ਤੱਕ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ ਨਾਲ ਪੜ੍ਹੋ।",
    nav_news: "ਖ਼ਬਰਾਂ", nav_gyan: "ਜਾਣਕਾਰੀ", nav_quiz: "ਕੁਇਜ਼", nav_video: "ਵੀਡੀਓ", nav_links: "ਜੁੜੋ",
    search_ph: "ਖ਼ਬਰ ਖੋਜੋ…", all: "ਸਾਰੀਆਂ", latest: "ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ", search_prefix: "ਖੋਜ: ",
    gyan_head: "ਕੰਮ ਦੀ ਜਾਣਕਾਰੀ", did_you_know: "ਕੀ ਤੁਸੀਂ ਜਾਣਦੇ ਹੋ?", quiz_head: "ਅੱਜ ਦਾ ਕੁਇਜ਼", video_head: "ਸਾਡੀਆਂ ਵੀਡੀਓ",
    yt_btn: "YouTube ਚੈਨਲ ਖੋਲ੍ਹੋ ਅਤੇ Subscribe ਕਰੋ", links_head: "ਸਾਡੇ ਨਾਲ ਜੁੜੋ",
    about_head: "ਸਮਝੋ ਭਾਰਤ ਬਾਰੇ", about_text: "ਸਮਝੋ ਭਾਰਤ ਦੇਸ਼-ਦੁਨੀਆ ਦੀਆਂ ਖ਼ਬਰਾਂ ਅਤੇ ਕੰਮ ਦੀ ਜਾਣਕਾਰੀ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਤੁਹਾਡੇ ਤੱਕ ਪਹੁੰਚਾਉਂਦਾ ਹੈ।",
    privacy: "ਪਰਦੇਦਾਰੀ ਨੀਤੀ", version: "ਸੰਸਕਰਣ",
    updating: "ਅੱਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ…", offline: "ਆਫ਼ਲਾਈਨ — ਪੁਰਾਣੀਆਂ ਖ਼ਬਰਾਂ", load_fail: "ਖ਼ਬਰਾਂ ਲੋਡ ਨਹੀਂ ਹੋਈਆਂ। ਇੰਟਰਨੈੱਟ ਜਾਂਚੋ।", retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    no_news: "ਹਾਲੇ ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਹੈ। ਜਲਦੀ ਨਵੀਆਂ ਖ਼ਬਰਾਂ ਆਉਣਗੀਆਂ।", no_results: "ਇਸ ਸ਼ਬਦ ਨਾਲ ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ। ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਅਜ਼ਮਾਓ।",
    no_label: "ਇਸ ਵਿਸ਼ੇ ਵਿੱਚ ਹਾਲੇ ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਹੈ।", gyan_empty: "ਜਲਦੀ ਇੱਥੇ ਕੰਮ ਦੇ ਲੇਖ ਆਉਣਗੇ।",
    read_blog: "ਬਲੌਗ 'ਤੇ ਪੂਰਾ ਲੇਖ ਵੇਖੋ", read_lang: "ਇਹ ਲੇਖ ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹੋ", mt_note: "ਇਹ ਮਸ਼ੀਨੀ ਅਨੁਵਾਦ ਹੈ। ਅਸਲ ਲੇਖ ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੈ।",
    comments: "ਟਿੱਪਣੀਆਂ", comment_btn: "ਟਿੱਪਣੀਆਂ ਪੜ੍ਹੋ ਅਤੇ ਲਿਖੋ", comment_count: "{n} ਟਿੱਪਣੀਆਂ", no_comments: "ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਰਾਇ ਲਿਖੋ",
    comment_note: "ਟਿੱਪਣੀ ਬਲੌਗ 'ਤੇ ਖੁੱਲ੍ਹੇਗੀ। ਸਤਿਕਾਰ ਨਾਲ ਲਿਖੋ।",
    lang_title: "ਭਾਸ਼ਾ ਚੁਣੋ", lang_btn: "ਭਾਸ਼ਾ",
    q_label: "ਸਵਾਲ", q_score: "ਸਕੋਰ", q_right: "ਸਹੀ ਜਵਾਬ! ✔", q_wrong: "ਗ਼ਲਤ ਜਵਾਬ ✘", q_next: "ਅਗਲਾ ਸਵਾਲ →", q_result: "ਨਤੀਜਾ ਵੇਖੋ",
    q_m4: "ਸ਼ਾਨਦਾਰ! ਸਾਰੇ ਜਵਾਬ ਸਹੀ।", q_m3: "ਬਹੁਤ ਵਧੀਆ!", q_m2: "ਚੰਗੀ ਕੋਸ਼ਿਸ਼!", q_m1: "ਕੋਈ ਗੱਲ ਨਹੀਂ, ਕੱਲ੍ਹ ਫਿਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    q_done: "ਅੱਜ ਦਾ ਕੁਇਜ਼ ਪੂਰਾ ਹੋਇਆ।", q_already: "ਅੱਜ ਦਾ ਕੁਇਜ਼ ਤੁਸੀਂ ਪੂਰਾ ਕਰ ਚੁੱਕੇ ਹੋ।", q_tomorrow: "ਕੱਲ੍ਹ ਨਵੇਂ ਸਵਾਲ ਆਉਣਗੇ।",
    q_share: "ਦੋਸਤਾਂ ਨੂੰ ਚੁਣੌਤੀ ਦਿਓ (WhatsApp)", q_streak: "🔥 ਲਗਾਤਾਰ {n} ਦਿਨ", q_empty: "ਜਲਦੀ ਨਵੇਂ ਸਵਾਲ ਆਉਣਗੇ।", v_empty: "ਜਲਦੀ ਨਵੀਆਂ ਵੀਡੀਓ ਆਉਣਗੀਆਂ।"
  }
};

/* भाषा चुनना और लागू करना */
window.SB_I18N = (function () {
  var KEY = "sb_lang";
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function guess() {
    var nav = (navigator.languages || [navigator.language || "hi"]).map(function (l) { return String(l).slice(0, 2).toLowerCase(); });
    // फ़ोन की भाषा English हो तो भी हिंदी से शुरू करें; बाकी भारतीय भाषाएँ अपने आप चुनें
    for (var i = 0; i < nav.length; i++) if (nav[i] !== "en" && window.SB_STR[nav[i]]) return nav[i];
    return "hi";
  }
  var lang = saved();
  if (!window.SB_STR[lang]) lang = guess();
  function t(k, n) {
    var s = (window.SB_STR[lang] && window.SB_STR[lang][k]) || window.SB_STR.hi[k] || k;
    return n === undefined ? s : s.replace("{n}", n);
  }
  function info(code) { return window.SB_LANGS.filter(function (l) { return l.code === code; })[0] || window.SB_LANGS[0]; }
  function apply() {
    var L = info(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = L.rtl ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    var lb = document.getElementById("langBtnText"); if (lb) lb.textContent = L.name;
  }
  function set(code) {
    if (!window.SB_STR[code]) return;
    lang = code;
    try { localStorage.setItem(KEY, code); } catch (e) {}
    apply();
  }
  return { t: t, get: function () { return lang; }, set: set, apply: apply, info: info };
})();
