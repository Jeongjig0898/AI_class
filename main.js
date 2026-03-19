document.addEventListener('DOMContentLoaded', () => {
    const sourceText = document.getElementById('source-text');
    const translatedText = document.getElementById('translated-text');
    const targetLanguage = document.getElementById('target-language');
    const translateBtn = document.getElementById('translate-btn');
    const listenBtn = document.getElementById('listen-btn');

    let voices = [];

    // Populates the voice list for the Web Speech API.
    function populateVoiceList() {
        voices = window.speechSynthesis.getVoices();
        if (voices.length === 0 && window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
            };
        }
    }

    populateVoiceList();

    // Event listener for the translate button
    translateBtn.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        const lang = targetLanguage.value;

        if (!text) {
            alert('Please enter text to translate.');
            return;
        }

        translatedText.value = 'Translating...';
        try {
            const result = await translateText(text, lang);
            translatedText.value = result;
        } catch (error) {
            console.error('Error during translation:', error);
            translatedText.value = 'Translation failed. Please check the console.';
        }
    });

    // Event listener for the listen button
    listenBtn.addEventListener('click', () => {
        const text = translatedText.value.trim();
        const lang = targetLanguage.value;

        if (!text || text === 'Translating...' || text.startsWith('Translation failed')) {
            alert('Please translate text first.');
            return;
        }

        speakText(text, lang);
    });

    /**
     * Calls the Gemini API to detect the source language and translate the text.
     * @param {string} text - The text to translate.
     * @param {string} targetLang - The target language code (e.g., 'en', 'ko').
     * @returns {Promise<string>} The translated text.
     */
    async function translateText(text, targetLang) {
        // IMPORTANT: Replace with your actual API key.
        const API_KEY = 'YOUR_API_KEY';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

        const languageMap = {
            'en': 'English',
            'ko': 'Korean',
            'ja': 'Japanese',
            'zh': 'Chinese',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German'
        };
        const targetLanguageName = languageMap[targetLang];

        const prompt = `First, automatically detect the language of the following text. Then, translate it into ${targetLanguageName}. Return only the translated text, without any extra explanation or original text. The text to translate is: "${text}"`;

        /*
        // --- Real API call example ---
        // try {
        //     const response = await fetch(API_URL, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             contents: [{
        //                 parts: [{ text: prompt }]
        //             }]
        //         })
        //     });
        //
        //     if (!response.ok) {
        //         const errorBody = await response.text();
        //         throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
        //     }
        //
        //     const data = await response.json();
        //     const translated = data.candidates[0].content.parts[0].text;
        //     return translated.trim();
        //
        // } catch (error) {
        //     console.error("API Error:", error);
        //     throw error;
        // }
        */

        // --- Mock API response for demonstration ---
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`[Mock Translation to ${targetLanguageName}] ${text}`);
            }, 500);
        });
    }

    /**
     * Speaks the given text using the Web Speech API.
     * @param {string} text - The text to speak.
     * @param {string} lang - The language code (e.g., 'en', 'ko').
     */
    function speakText(text, lang) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        const langCodeForSpeech = {
            'en': 'en-US',
            'ko': 'ko-KR',
            'ja': 'ja-JP',
            'zh': 'zh-CN',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE'
        }[lang];

        utterance.lang = langCodeForSpeech;

        // Find a specific voice for the language, if available.
        const specificVoice = voices.find(voice => voice.lang === langCodeForSpeech);
        if (specificVoice) {
            utterance.voice = specificVoice;
        } else {
            console.warn(`No specific voice found for '${langCodeForSpeech}'. Using default.`);
        }
        
        utterance.pitch = 1;
        utterance.rate = 1;

        speechSynthesis.speak(utterance);
    }
});