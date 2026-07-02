import { EmergencyGuide } from './types';

export const emergencyGuides: EmergencyGuide[] = [
  {
    id: 'cpr',
    title: {
      en: 'Cardiopulmonary Resuscitation (CPR)',
      si: 'හෘද පෙනහළු පුනර්ජීවනය (CPR)',
      ta: 'நெஞ்சு அழுத்தல் புத்துயிர்ப்பு (CPR)'
    },
    description: {
      en: 'Immediate treatment for someone whose heart or breathing has stopped.',
      si: 'හදවත හෝ ශ්වසනය නතර වූ අයෙකුට වහාම දෙනු ලබන ප්‍රතිකාරය.',
      ta: 'இதயம் அல்லது சுவாசம் நின்ற ஒருவருக்கு உடனடியாக வழங்கப்படும் சிகிச்சை.'
    },
    icon: 'Heart',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    metronomeBpm: 110, // 100-120 bpm is recommended for chest compressions
    steps: {
      en: [
        'Check surroundings for safety, then tap the person and shout "Are you okay?".',
        'If unresponsive, check for breathing for no more than 10 seconds.',
        'Call emergency services immediately (dial 1990 in Sri Lanka or local number) and request an AED.',
        'Place the heel of one hand in the center of their chest, and interlocking your other hand on top.',
        'Push hard and fast: Compress at least 2 inches deep, 100 to 120 times per minute (match the pulsing metronome below).',
        'Keep your arms straight and shoulders positioned directly over your hands.',
        'If trained, give 2 rescue breaths after every 30 chest compressions. If untrained, continue continuous chest compressions.'
      ],
      si: [
        'පළමුව වටපිටාවේ ආරක්ෂාව පරීක්ෂා කර, රෝගියාගේ උරහිසට තට්ටු කර "ඔබට සනීපද?" කියා අසන්න.',
        'ප්‍රතිචාරයක් නැතිනම්, උපරිම තත්පර 10ක් පුරා හුස්ම ගන්නේ දැයි පරීක්ෂා කරන්න.',
        'වහාම හදිසි සේවා අමතන්න (ශ්‍රී ලංකාවේ නම් 1990) සහ AED උපකරණයක් ඉල්ලන්න.',
        'එක් අතක අල්ල පපුව මැද තබා, අනෙක් අතේ ඇඟිලි එයට උඩින් පටලවා ගන්න.',
        'ශක්තිමත්ව සහ වේගයෙන් තෙරපන්න: අඟල් 2ක් ගැඹුරට, මිනිත්තුවකට 100-120 වාරයක් තෙරපන්න (පහත ඇති ස්පන්දන වේගය අනුව).',
        'ඔබේ දෑත් කෙළින් තබාගෙන උරහිස් හරියටම පපුවට ඉහළින් තබා ගන්න.',
        'පුහුණුව ලබා ඇත්නම්, සෑම පපුවේ තෙරපුම් 30කට පසු කෘතිම ශ්වසන 2ක් ලබා දෙන්න. නැතහොත් දිගටම තෙරපන්න.'
      ],
      ta: [
        'சுற்றுப்புறப் பாதுகாப்பைச் சரிபார்த்து, நபரைத் தட்டி "நீங்கள் நலமாக இருக்கிறீர்களா?" என்று சத்தமாகக் கேளுங்கள்.',
        'பதிலளிக்கவில்லை என்றால், 10 வினாடிகளுக்கு மேல் சுவாசம் இருக்கிறதா என்று சோதிக்கவும்.',
        'உடனடியாக அவசர சேவைகளை அழைக்கவும் (இலங்கையில் 1990) மற்றும் ஒரு AED ஐக் கோரவும்.',
        'ஒரு கையின் மணிக்கட்டுப் பகுதியை நெஞ்சின் மையத்தில் வைத்து, மற்ற கையை அதன் மேல் கோர்த்துக்கொள்ளுங்கள்.',
        'வேகமாகவும் பலமாகவும் அழுத்தவும்: குறைந்தது 2 அங்குல ஆழத்தில், நிமிடத்திற்கு 100 முதல் 120 முறை அழுத்தவும் (கீழே உள்ள துடிப்புடன் ஒப்பிடவும்).',
        'உங்கள் கைகளை நேராக வைத்து, தோள்களை உங்கள் கைகளுக்கு நேர் மேலே கொண்டு வாருங்கள்.',
        'பயிற்சி பெற்றிருந்தால், ஒவ்வொரு 30 நெஞ்சு அழுத்தங்களுக்கும் பிறகு 2 செயற்கை சுவாசங்களை வழங்கவும். இல்லையெனில், தொடர்ந்து அழுத்தவும்.'
      ]
    },
    warnings: {
      en: [
        'Do not pause chest compressions for more than 10 seconds.',
        'Do not lean on the chest between compressions; let it fully recoil.'
      ],
      si: [
        'පපුව තෙරපීම තත්පර 10 කට වඩා නතර නොකරන්න.',
        'තෙරපීම් අතරතුර පපුව මත බර නොතබන්න; පපුවට යථා තත්ත්වයට පත්වීමට ඉඩ හරින්න.'
      ],
      ta: [
        'நெஞ்சு அழுத்தங்களை 10 வினாடிகளுக்கு மேல் நிறுத்த வேண்டாம்.',
        'அழுத்தங்களுக்கு இடையில் நெஞ்சின் மேல் சாய வேண்டாம்; அது முழுமையாக பழைய நிலைக்கு வர அனுமதிக்கவும்.'
      ]
    }
  },
  {
    id: 'bleeding',
    title: {
      en: 'Severe Bleeding Control',
      si: 'දරුණු රුධිර වහනය පාලනය කිරීම',
      ta: 'கடுமையான இரத்தப்போக்குக் கட்டுப்பாடு'
    },
    description: {
      en: 'Immediate actions to stop rapid and heavy arterial or venous blood loss.',
      si: 'ශරීරයෙන් වේගයෙන් සහ අධික ලෙස ලේ වැගිරීම් නැවැත්වීමට ගත යුතු වහා පියවර.',
      ta: 'வேகமான மற்றும் கடுமையான இரத்த இழப்பை நிறுத்துவதற்கான உடனடி நடவடிக்கைகள்.'
    },
    icon: 'Droplet',
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    steps: {
      en: [
        'Put on protective gloves if available to avoid blood-borne pathogen contact.',
        'Expose the wound by removing or cutting away clothing.',
        'Apply direct, firm pressure to the bleeding wound using a clean cloth, sterile gauze, or your gloved hand.',
        'If blood seeps through, place another cloth on top. Do not remove the original dressing.',
        'Elevate the injured limb above the level of the heart if there is no suspected fracture.',
        'If bleeding is life-threatening on a limb and direct pressure fails, apply a tourniquet 2-3 inches above the wound (never on a joint).',
        'Wrap the wound with a tight bandage to hold pressure, checking that fingers/toes remain warm.'
      ],
      si: [
        'හැකි නම්, රුධිරය ස්පර්ශ වීම වැළැක්වීමට අත්වැසුම් පළඳින්න.',
        'ඇඳුම් ඉවත් කර හෝ කපා තුවාලය නිරාවරණය කරන්න.',
        'පිරිසිදු රෙදි කැබැල්ලක් හෝ ගෝස් කැබැල්ලක් භාවිතයෙන් තුවාලය මත සෘජුව හා තදින් පීඩනය යොදන්න.',
        'ලේ කාන්දු වන්නේ නම්, මුල් රෙද්ද ඉවත් නොකර එයට උඩින් තවත් රෙද්දක් තබා තද කරන්න.',
        'අස්ථි බිඳීමක් නැතැයි ස්ථිර නම්, තුවාල වූ අත්/පා හදවතේ මට්ටමට වඩා ඉහළට ඔසවන්න.',
        'රුධිරය වහනය ජීවිතයට තර්ජනයක් නම් සහ පීඩනයෙන් පාලනය කළ නොහැකි නම්, තුවාලයට අඟල් 2-3ක් ඉහළින් තදින් ගැටයක් (tourniquet) යොදන්න.',
        'තුවාලය තද වෙළුම් පටියකින් බඳින්න. ඇඟිලි උණුසුම්ව පවතී දැයි පරීක්ෂා කරන්න.'
      ],
      ta: [
        'இரத்த தொடர்பைத் தவிர்க்க முடிந்தால் பாதுகாப்பு கையுறைகளை அணியுங்கள்.',
        'ஆடைகளை அகற்றி அல்லது வெட்டி காயத்தை வெளிப்படுத்துங்கள்.',
        'சுத்தமான துணி, மலட்டுத்தன்மையுள்ள துணி அல்லது உங்கள் கையுறை அணிந்த கையைப் பயன்படுத்தி காயத்தின் மேல் நேரடியாகவும் பலமாகவும் அழுத்தம் கொடுங்கள்.',
        'இரத்தம் வெளியேறினால், அசல் துணியை அகற்றாமல் அதன் மேல் மற்றொரு துணியை வைக்கவும்.',
        'எலும்பு முறிவு ஏதும் இல்லை என்றால், காயமடைந்த பகுதியை இதய மட்டத்திற்கு மேல் உயர்த்தவும்.',
        'இரத்தப்போக்கு உயிருக்கு ஆபத்தானது எனில், காயத்திற்கு 2-3 அங்குல மேலே ஒரு இறுக்கமான கட்டை (tourniquet) இடுங்கள் (மூட்டுகளில் கட்ட வேண்டாம்).',
        'அழுத்தத்தை பராமரிக்க காயத்தை ஒரு இறுக்கமான கட்டால் கட்டுங்கள், விரல்கள் சூடாக இருப்பதை உறுதி செய்யவும்.'
      ]
    },
    warnings: {
      en: [
        'Do not wash deep, heavily bleeding wounds.',
        'Never remove embedded objects; stabilize them in place with padding instead.'
      ],
      si: [
        'අධික ලෙස ලේ ගලන ගැඹුරු තුවාල සෝදන්න එපා.',
        'තුවාලය තුළ ඇනී ඇති දේවල් කිසිවිටෙක ඉවත් නොකරන්න; දෙපසින් රෙදි තබා වෙළන්න.'
      ],
      ta: [
        'ஆழமான, பலத்த இரத்தப்போக்கு உள்ள காயங்களைக் கழுவ வேண்டாம்.',
        'காயத்தில் பதிந்திருக்கும் பொருட்களை ஒருபோதும் அகற்ற வேண்டாம்; அவற்றை சுற்றி துணிகளை வைத்து அசையாமல் பாதுகாக்கவும்.'
      ]
    }
  },
  {
    id: 'choking',
    title: {
      en: 'Choking (Heimlich Maneuver)',
      si: 'හුස්ම හිරවීම (Heimlich Maneuver)',
      ta: 'மூச்சுத்திணறல் (ஹெய்ம்லிச் சூழ்ச்சி)'
    },
    description: {
      en: 'First aid for an airway obstruction by food or foreign objects.',
      si: 'කෑමක් හෝ විදේශීය ද්‍රව්‍යයක් උගුරේ සිරවීම නිසා සිදුවන හුස්ම හිරවීමට ප්‍රථමාධාර.',
      ta: 'உணவு அல்லது அந்நிய பொருட்களால் சுவாசப்பாதை அடைபடுவதற்கான முதலுதவி.'
    },
    icon: 'Activity',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    steps: {
      en: [
        'Ask the person, "Are you choking?" and check if they can cough, speak or breathe.',
        'If they can cough strongly, encourage them to continue coughing to dislodge the object.',
        'If they cannot speak or breathe, stand behind them and wrap your arms around their waist.',
        'Make a fist with one hand and place the thumb side of your fist slightly above the person\'s navel (well below the breastbone).',
        'Grasp your fist with your other hand and press into their abdomen with a quick, upward thrust.',
        'Repeat abdominal thrusts until the object is expelled or the person becomes unconscious.',
        'If they lose consciousness, lower them gently to the floor and start CPR (checking the mouth for the object during breaths).'
      ],
      si: [
        'රෝගියාගෙන් "ඔබේ උගුරේ යමක් සිරවීද?" කියා විමසා ඔවුන්ට කැස්සක්, කතාවක් හෝ හුස්ම ගැනීමට හැකිදැයි බලන්න.',
        'ඔවුන්ට තදින් කැස්ස හැකිනම්, එය ඉවත් වන තුරු දිගටම කැසීමට දිරිගන්වන්න.',
        'ඔවුන්ට කතා කිරීමට හෝ හුස්ම ගැනීමට නොහැකි නම්, ඔවුන් පිටුපසින් සිටගෙන ඉණ වටා ඔබේ දෑත් යවන්න.',
        'එක් අතක් මිටි කර, මිටි කළ අතේ මහපටැඟිල්ල පැත්ත රෝගියාගේ පෙකණියට මඳක් ඉහළින් තබන්න (පපුව අස්ථියට පහළින්).',
        'අනෙක් අතින් මිටි කළ අත තදින් අල්ලාගෙන, වේගයෙන් ඇතුළට සහ ඉහළට තෙරපුම් (thrusts) ලබා දෙන්න.',
        'යම් ද්‍රව්‍යය ඉවතට එන තුරු හෝ රෝගියා සිහිසුන් වන තුරු මෙම තෙරපීම් නැවත නැවත කරන්න.',
        'ඔවුන් සිහිසුන් වුවහොත්, බිම සතපවා වහාම CPR ක්‍රියාවලිය ආරම්භ කරන්න.'
      ],
      ta: [
        'நபரிடம் "மூச்சுத்திணறுகிறதா?" என்று கேட்டு, அவர்களால் இரும, பேச அல்லது சுவாசிக்க முடிகிறதா என்று சோதிக்கவும்.',
        'அவர்களால் பலமாக இரும முடிந்தால், பொருளை வெளியேற்ற தொடர்ந்து இருமுமாறு ஊக்குவிக்கவும்.',
        'அவர்களால் பேசவோ சுவாசிக்கவோ முடியாவிட்டால், அவர்களுக்குப் பின்னால் நின்று அவர்களின் இடுப்பைச் சுற்றி உங்கள் கைகளை வளைக்கவும்.',
        'ஒரு கையை முஷ்டியாக மடித்து, முஷ்டியின் பெருவிரல் பகுதியை நபரின் தொப்புளுக்கு சற்று மேலே வைக்கவும்.',
        'மற்றொரு கையால் உங்கள் முஷ்டியைப் பிடித்து, அவர்களின் வயிற்றில் வேகமாக மேல்நோக்கி அழுத்தவும்.',
        'பொருள் வெளியேறும் வரை அல்லது நபர் மயக்கமடையும் வரை வயிற்றில் அழுத்துவதை மீண்டும் செய்யவும்.',
        'அவர்கள் மயக்கமடைந்தால், அவர்களை மெதுவாக தரையில் கிடத்திவிட்டு CPR ஐத் தொடங்கவும்.'
      ]
    },
    warnings: {
      en: [
        'Never perform abdominal thrusts on a pregnant woman or an infant under 1 year. Instead, use chest thrusts (pregnancy) or back blows and chest thrusts (infants).',
        'Do not perform blind finger sweeps in the mouth; you may push the object deeper.'
      ],
      si: [
        'ගර්භනී කාන්තාවන්ට හෝ අවුරුද්දකට අඩු බිළිඳුන්ට පපුවේ තෙරපුම් හෝ පිටට තට්ටු කිරීම් පමණක් කරන්න.',
        'මුඛය තුලට ඇඟිලි දමා අන්ධ ලෙස සෙවීම් නොකරන්න; එයින් සිරවූ ද්‍රව්‍යය තවත් ඇතුළට යා හැක.'
      ],
      ta: [
        'கர்ப்பிணிப் பெண் அல்லது 1 வயதுக்குட்பட்ட குழந்தைக்கு வயிற்றில் அழுத்த வேண்டாம். அதற்குப் பதிலாக நெஞ்சு அழுத்தம் (கர்ப்பம்) அல்லது முதுகுத் தட்டல்களைப் பயன்படுத்தவும்.',
        'வாயினுள் விரல்களை விட்டு குருட்டுத்தனமாகத் தேட வேண்டாம்; அது பொருளை மேலும் உள்ளே தள்ளக்கூடும்.'
      ]
    }
  },
  {
    id: 'burns',
    title: {
      en: 'Burns First Aid',
      si: 'පිළිස්සුම් තුවාල සඳහා ප්‍රථමාධාර',
      ta: 'தீக்காய முதலுதவி'
    },
    description: {
      en: 'Immediate treatment for thermal, chemical or electrical skin burns.',
      si: 'තාප, රසායනික හෝ විද්‍යුත් හේතූන් මත සිදුවන පිළිස්සීම් සඳහා වන ක්ෂණික ප්‍රතිකර්ම.',
      ta: 'வெப்பம், இரசாயனம் அல்லது மின்சாரத்தால் ஏற்படும் தோல் தீக்காயங்களுக்கான உடனடி சிகிச்சை.'
    },
    icon: 'Flame',
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    steps: {
      en: [
        'Stop the burning process: Extinguish flames or remove the person from heat/steam.',
        'Cool the burn immediately under cool, running water for at least 10 to 20 minutes. Do not use ice.',
        'Remove restrictive jewelry, rings, or tight clothing from the burned area gently before swelling starts.',
        'Do not peel away clothing that is melted or stuck to the burn.',
        'Cover the burn loosely with a clean, non-stick sterile bandage or clean plastic cling wrap to prevent infection.',
        'Elevate burned limbs if possible to reduce swelling.',
        'Do not pop any blisters that have formed on the skin.'
      ],
      si: [
        'පිළිස්සීම නවත්වන්න: ගින්න නිවා දමන්න හෝ රෝගියා රස්නයෙන් ඉවත් කරන්න.',
        'පිළිස්සුණු ස්ථානය අවම වශයෙන් විනාඩි 10-20ක් පුරා ගලා යන සිසිල් ජලයෙන් සිසිල් කරන්න. අයිස් නොදමන්න.',
        'තුවාලය ඉදිමීමට පෙර මුදු, අත් පළඳනා හෝ තද ඇඳුම් ඉතා ප්‍රවේශමෙන් ඉවත් කරන්න.',
        'පිළිස්සුණු ස්ථානයට ඇලී ඇති ඇඳුම් බලහත්කාරයෙන් ගැලවීමට උත්සාහ නොකරන්න.',
        'ආසාදන වැලැක්වීමට පිරිසිදු, නොඇලෙන සුළු වෙළුම් පටියකින් හෝ ප්ලාස්ටික් ක්ලින්ග් රැප් එකකින් තුවාලය ලිහිල්ව වසන්න.',
        'ඉදිමීම අඩු කිරීම සඳහා පිළිස්සුණු අත්/පා ඉහළට ඔසවා තබන්න.',
        'ඇති වී තිබෙන බිබිලි කිසිවිටෙකත් කඩා හෝ සිදුරු නොකරන්න.'
      ],
      ta: [
        'எரியும் செயல்முறையை நிறுத்துங்கள்: நெருப்பை அணையுங்கள் அல்லது வெப்பத்திலிருந்து நபரை அகற்றுங்கள்.',
        'குறைந்தது 10 முதல் 20 நிமிடங்களுக்கு குளிர்ந்த ஓடும் நீரில் காயத்தை உடனடியாகக் குளிரூட்டவும். ஐஸ் பயன்படுத்த வேண்டாம்.',
        'வீக்கம் தொடங்குவதற்கு முன் எரிக்கப்பட்ட பகுதியிலிருந்து இறுக்கமான நகைகள், மோதிரங்கள் அல்லது ஆடைகளை மெதுவாக அகற்றுங்கள்.',
        'காயத்தில் உருகி ஒட்டியிருக்கும் ஆடைகளை இழுத்து அகற்ற வேண்டாம்.',
        'தொற்றுநோயைத் தடுக்க சுத்தமான, ஒட்டாத மலட்டுத்தன்மையுள்ள துணியால் அல்லது சுத்தமான பிளாஸ்டிக் உறையால் காயத்தை லேசாக மூடுங்கள்.',
        'வீக்கத்தைக் குறைக்க முடிந்தால் காயமடைந்த பகுதியை உயர்த்தி வைக்கவும்.',
        'தோலில் ஏற்பட்ட கொப்புளங்களை ஒருபோதும் உடைக்க வேண்டாம்.'
      ]
    },
    warnings: {
      en: [
        'Do not apply butter, oil, toothpaste, or home remedies to the burn; they trap heat and invite severe infection.',
        'Seek emergency help immediately for major burns (face, hands, groin, or larger than 3 inches).'
      ],
      si: [
        'පිළිස්සුම් ස්ථානය මත බටර්, තෙල්, දන්තාලේප (toothpaste) හෝ ගෘහස්ථ බෙහෙත් වර්ග නොගාන්න; ඒවා උණුසුම රඳවාගෙන ආසාදන ඇති කරයි.',
        'විශාල පිළිස්සීම් (මුහුණ, දෑත් හෝ අඟල් 3කට වඩා ලොකු) සඳහා වහාම වෛද්‍ය ආධාර ලබාගන්න.'
      ],
      ta: [
        'தீக்காயத்தில் வெண்ணெய், எண்ணெய், பற்பசை அல்லது வீட்டு வைத்தியங்களைப் பயன்படுத்த வேண்டாம்; அவை வெப்பத்தைத் தக்கவைத்து கடுமையான தொற்றை ஏற்படுத்தும்.',
        'பெரிய தீக்காயங்களுக்கு உடனடியாக அவசர உதவியை நாடுங்கள் (முகம், கைகள், அல்லது 3 அங்குலத்தை விட பெரிய காயம்).'
      ]
    }
  },
  {
    id: 'heart_attack',
    title: {
      en: 'Heart Attack (Chest Pain)',
      si: 'හෘදයාබාධයක් (පපුවේ කැක්කුම)',
      ta: 'மாரடைப்பு (நெஞ்சு வலி)'
    },
    description: {
      en: 'Crucial support when someone experiences symptoms of cardiac arrest or heart failure.',
      si: 'හෘදයාබාධ ලක්ෂණ ඇති වූ විට දෙනු ලබන අත්‍යවශ්‍ය ජීවිතාරක්ෂක ප්‍රථමාධාර.',
      ta: 'மாரடைப்பு அறிகுறிகள் ஏற்படும்போது வழங்கப்படும் முக்கியமான முதலுதவி.'
    },
    icon: 'AlertTriangle',
    color: 'bg-red-600/10 text-red-600 border-red-600/20',
    steps: {
      en: [
        'Have the person sit down, rest, and try to keep calm. Do not let them walk or exert effort.',
        'Call emergency response immediately (1990 in Sri Lanka) – every second counts.',
        'Loosen any tight clothing around their neck, chest, and waist.',
        'Ask if they take prescribed heart medications (such as Nitroglycerin) and help them administer it if available.',
        'If the person is fully awake and not allergic, have them chew and swallow one adult aspirin (325mg) or four baby aspirins (81mg each).',
        'Monitor their breathing and heart rate. Be ready to perform CPR immediately if they lose consciousness.'
      ],
      si: [
        'රෝගියාව සන්සුන්ව වාඩි කරවන්න. ඔවුන්ට ඇවිදීමට හෝ වෙහෙස වීමට ඉඩ නොදෙන්න.',
        'වහාම 1990 ගිලන්රථ සේවය අමතන්න – සෑම තත්පරයක්ම ඉතා වටී.',
        'බෙල්ල, පපුව සහ ඉණ වටා ඇති තද ඇඳුම් ලිහිල් කරන්න.',
        'ඔවුන්ට හෘද රෝග සඳහා නියම කරන ලද ඖෂධ තිබේදැයි අසා (උදා: නයිට්‍රොග්ලිසරින්), ඒවා ලබා ගැනීමට උදවු වන්න.',
        'රෝගියා සිහිබුද්ධියෙන් සිටී නම් සහ අසාත්මිකතා නැතිනම්, ඇස්පිරින් (Aspirin) පෙත්තක් හපන්නට සලස්වන්න.',
        'ශ්වසනය සහ සිහිය ගැන නිතර අවධානයෙන් සිටින්න්න. සිහිසුන් වුවහොත් වහාම CPR ආරම්භ කරන්න.'
      ],
      ta: [
        'நபரை அமர வைத்து, ஓய்வெடுக்கச் செய்து, அமைதியாக இருக்கச் சொல்லுங்கள். அவர்களை நடக்கவோ அல்லது சிரமப்படவோ அனுமதிக்க வேண்டாம்.',
        'உடனடியாக அவசர சேவையை அழைக்கவும் (இலங்கையில் 1990) - ஒவ்வொரு நொடியும் முக்கியம்.',
        'கழுத்து, நெஞ்சு மற்றும் இடுப்பைச் சுற்றியுள்ள இறுக்கமான ஆடைகளைத் தளர்த்தவும்.',
        'அவர்களுக்கு பரிந்துரைக்கப்பட்ட இதய மருந்துகள் (Nitroglycerin போன்றவை) இருக்கிறதா என்று கேட்டு, அவற்றை உட்கொள்ள உதவுங்கள்.',
        'நபர் முழு விழிப்புணர்வுடன் இருந்து அலர்ஜி இல்லை என்றால், ஒரு அஸ்பிரின் (Aspirin - 325mg) மாத்திரையை மென்று விழுங்கச் சொல்லுங்கள்.',
        'அவர்களின் சுவாசம் மற்றும் இதயத் துடிப்பைக் கண்காணிக்கவும். மயக்கமடைந்தால் உடனடியாக CPR செய்ய தயாராக இருங்கள்.'
      ]
    },
    warnings: {
      en: [
        'Do not leave the patient alone.',
        'Do not give aspirin if they are allergic, have a severe bleeding disorder, or if their doctor has specifically forbidden it.'
      ],
      si: [
        'රෝගියාව කිසිවිටෙක තනි නොකරන්න.',
        'ඇස්පිරින් වලට අසාත්මිකතා ඇත්නම් හෝ දරුණු ලේ ගැලීම් රෝගී තත්වයන් තිබේ නම් ඇස්පිරින් ලබා නොදෙන්න.'
      ],
      ta: [
        'நோயாளிவைத் தனியாக விட்டுவிடாதீர்கள்.',
        'அஸ்பிரின் அலர்ஜி இருந்தாலோ அல்லது கடுமையான இரத்தப்போக்கு குறைபாடு இருந்தாலோ அஸ்பிரின் கொடுக்க வேண்டாம்.'
      ]
    }
  }
];
