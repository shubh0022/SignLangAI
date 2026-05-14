"""
Multilingual Gesture Translation Service
Supports: English, Hindi (हिंदी), Gujarati (ગુજરાતી)
"""

GESTURE_TRANSLATIONS = {
    "Help":       {"en": "Help",        "hi": "मदद करो",    "gu": "મદદ કરો"},
    "Yes":        {"en": "Yes",         "hi": "हाँ",         "gu": "હા"},
    "No":         {"en": "No",          "hi": "नहीं",        "gu": "ના"},
    "Thank You":  {"en": "Thank You",   "hi": "धन्यवाद",    "gu": "આભાર"},
    "Sorry":      {"en": "Sorry",       "hi": "माफ़ करें",  "gu": "માફ કરશો"},
    "Hello":      {"en": "Hello",       "hi": "नमस्ते",     "gu": "હેલ્લો"},
    "Goodbye":    {"en": "Goodbye",     "hi": "अलविदा",     "gu": "ગુડ બાય"},
    "Good":       {"en": "Good",        "hi": "अच्छा",      "gu": "સારું"},
    "Bad":        {"en": "Bad",         "hi": "बुरा",        "gu": "ખરાબ"},
    "Water":      {"en": "Water",       "hi": "पानी",        "gu": "પાણી"},
    "Food":       {"en": "Food",        "hi": "खाना",        "gu": "ખોરાક"},
    "Doctor":     {"en": "Doctor",      "hi": "डॉक्टर",     "gu": "ડૉક્ટર"},
    "Pain":       {"en": "Pain",        "hi": "दर्द",        "gu": "દુઃખ"},
    "Medicine":   {"en": "Medicine",    "hi": "दवाई",        "gu": "દવા"},
    "Emergency":  {"en": "Emergency",   "hi": "आपातकाल",    "gu": "કટોકટી"},
    "Phone":      {"en": "Phone",       "hi": "फ़ोन",        "gu": "ફોન"},
    "Home":       {"en": "Home",        "hi": "घर",          "gu": "ઘર"},
    "Love":       {"en": "Love",        "hi": "प्यार",       "gu": "પ્રેમ"},
    "Peace":      {"en": "Peace",       "hi": "शांति",       "gu": "શાંતિ"},
    "Stop":       {"en": "Stop",        "hi": "रुको",        "gu": "રોકો"},
    "Come":       {"en": "Come Here",   "hi": "यहाँ आओ",    "gu": "અહીં આવો"},
    "Go":         {"en": "Go Away",     "hi": "जाओ",        "gu": "જાઓ"},
    "Eat":        {"en": "I am Hungry", "hi": "मुझे भूख है","gu": "મને ભૂખ છે"},
    "Drink":      {"en": "I am Thirsty","hi": "मुझे प्यास है","gu": "મને તરસ છે"},
    "Sleep":      {"en": "I am Tired",  "hi": "मैं थका हूँ","gu": "હું થાકેલ છું"},
    "Thumbs Up":  {"en": "Great!",      "hi": "बहुत अच्छा!", "gu": "ખૂબ સરસ!"},
    "Thumbs Down":{"en": "Not Good",    "hi": "अच्छा नहीं", "gu": "સારું નથી"},
    "Open Palm":  {"en": "Wait / Stop", "hi": "रुकिए",      "gu": "રાહ જુઓ"},
    "Fist":       {"en": "Strength / OK","hi": "ठीक है",    "gu": "બરાબર"},
    "Rock":       {"en": "Rock On!",    "hi": "शानदार!",    "gu": "ભવ્ય!"},
}

# Category groupings for dashboard analytics
GESTURE_CATEGORIES = {
    "Emergency": ["Help", "Emergency", "Pain", "Doctor", "Medicine"],
    "Greetings": ["Hello", "Goodbye", "Thank You", "Sorry", "Love"],
    "Basic Needs": ["Water", "Food", "Sleep", "Eat", "Drink"],
    "Responses": ["Yes", "No", "Good", "Bad", "Stop"],
    "Expressions": ["Thumbs Up", "Thumbs Down", "Open Palm", "Fist", "Rock"],
}

def translate(gesture: str) -> dict:
    """Return all language translations for a gesture."""
    if gesture in GESTURE_TRANSLATIONS:
        translations = GESTURE_TRANSLATIONS[gesture]
        return {
            "gesture": gesture,
            "en": translations["en"],
            "hi": translations["hi"],
            "gu": translations["gu"],
        }
    return {
        "gesture": gesture,
        "en": gesture,
        "hi": gesture,
        "gu": gesture,
    }

def get_all_gestures() -> list:
    return list(GESTURE_TRANSLATIONS.keys())
