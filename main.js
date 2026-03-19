document.addEventListener('DOMContentLoaded', () => {
    const sourceText = document.getElementById('source-text');
    const translatedText = document.getElementById('translated-text');
    const targetLanguage = document.getElementById('target-language');
    const translateBtn = document.getElementById('translate-btn');
    const listenBtn = document.getElementById('listen-btn');

    let voices = [];

    // Web Speech API의 음성 목록을 비동기적으로 가져옵니다.
    function populateVoiceList() {
        voices = window.speechSynthesis.getVoices();
        // 일부 브라우저에서는 'voiceschanged' 이벤트가 발생해야 음성 목록이 로드됩니다.
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
            };
        }
    }

    populateVoiceList();

    // 번역 버튼 클릭 이벤트
    translateBtn.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        const lang = targetLanguage.value;

        if (!text) {
            alert('번역할 텍스트를 입력하세요.');
            return;
        }

        translatedText.value = '번역 중...';
        try {
            const result = await translateText(text, lang);
            translatedText.value = result;
        } catch (error) {
            console.error('Error during translation:', error);
            translatedText.value = '번역 실패. 콘솔을 확인하세요.';
        }
    });

    // 소리 듣기 버튼 클릭 이벤트
    listenBtn.addEventListener('click', () => {
        const text = translatedText.value.trim();
        const lang = targetLanguage.value;

        if (!text || text === '번역 중...' || text.startsWith('번역 실패')) {
            alert('먼저 텍스트를 번역해주세요.');
            return;
        }

        speakText(text, lang);
    });

    /**
     * Gemini API를 호출하여 텍스트를 번역하는 함수 (뼈대)
     * @param {string} text - 번역할 텍스트
     * @param {string} targetLang - 목표 언어 코드 (e.g., 'en', 'ko')
     * @returns {Promise<string>} 번역된 텍스트
     */
    async function translateText(text, targetLang) {
        // 중요: 아래 URL과 API_KEY를 실제 값으로 교체해야 합니다.
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY`;

        // Gemini API에 맞는 언어 이름으로 변환합니다.
        const languageMap = {
            'en': 'English',
            'ko': 'Korean',
            'ja': 'Japanese'
        };
        const targetLanguageName = languageMap[targetLang];

        const prompt = `Translate the following text to ${targetLanguageName}: "${text}"`;

        /*
        // --- 실제 API 호출 예시 ---
        //
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
        //         throw new Error(`API call failed with status: ${response.status}`);
        //     }
        //
        //     const data = await response.json();
        //     // API 응답 구조에 따라 실제 번역된 텍스트를 추출해야 합니다.
        //     const translated = data.candidates[0].content.parts[0].text;
        //     return translated.trim();
        //
        // } catch (error) {
        //     console.error("API Error:", error);
        //     throw error; // 오류를 상위로 전파
        // }
        */

        // --- 모의(Mock) API 응답 ---
        // 실제 API를 구현하기 전까지 사용할 임시 코드입니다.
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`[${targetLanguageName} 번역 결과] ${text}`);
            }, 500);
        });
    }

    /**
     * Web Speech API를 사용하여 텍스트를 음성으로 출력하는 함수
     * @param {string} text - 읽을 텍스트
     * @param {string} lang - 언어 코드 (e.g., 'en-US', 'ko-KR')
     */
    function speakText(text, lang) {
        // 진행 중인 음성 출력이 있다면 중지
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // 언어 코드에 맞는 음성을 찾습니다. (예: 'en' -> 'en-US')
        const langCodeForSpeech = {
            'en': 'en-US',
            'ko': 'ko-KR',
            'ja': 'ja-JP'
        }[lang];

        utterance.lang = langCodeForSpeech;

        // 해당 언어에 가장 적합한 음성을 찾아서 설정
        const specificVoice = voices.find(voice => voice.lang === langCodeForSpeech);
        if (specificVoice) {
            utterance.voice = specificVoice;
        } else {
            console.warn(`'${langCodeForSpeech}'에 맞는 음성을 찾을 수 없습니다. 기본 음성을 사용합니다.`);
        }
        
        utterance.pitch = 1;
        utterance.rate = 1;

        window.speechSynthesis.speak(utterance);
    }
});
