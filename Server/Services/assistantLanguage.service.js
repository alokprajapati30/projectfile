export const normalizeAssistantMessage = (message) => message
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()

export const detectAssistantLanguage = (message, responseLanguage) => {
    const normalizedMessage = normalizeAssistantMessage(message)
    const hasHindiScript = /[\u0900-\u097f]/.test(message)
    const usesHindiWords = /\b(kya|kaise|kahan|kholo|kholiye|dikhao|le chalo|wapas|ghar|jao|batao)\b/.test(normalizedMessage)

    return {
        normalizedMessage,
        isHindi: responseLanguage === "hi-IN" || hasHindiScript || usesHindiWords,
    }
}

export const isAssistantNavigationRequest = (message, normalizedMessage) => (
    /\b(open|go|start|show|navigate|take me|bring me|visit|load|back|return|chalo|jao|kholo|kholiye|dikhao|le chalo|wapas)\b/.test(normalizedMessage) ||
    /(खोलो|खोलिए|दिखाओ|ले चलो|वापस|चलो|जाओ)/.test(message)
)

export const getPredefinedAssistantResponse = ({ message, normalizedMessage, isHindi, assistantName }) => {
    const isCreatorQuestion = (
        /\b(who (made|created|built) (you|nexa ai|this assistant|the assistant)|who is your creator|your creator|kisne (banaya|bnaya)|aapko kisne banaya|tumhe kisne banaya)\b/.test(normalizedMessage) ||
        /(किसने.{0,20}बनाया|आपको किसने बनाया|तुम्हें किसने बनाया)/.test(message)
    )

    if (isCreatorQuestion) {
        return {
            success: true,
            aiResponse: isHindi
                ? "मुझे Alok Prajapati ने Nexa AI के साथ बनाया है।"
                : "I was created by Alok Prajapati using Nexa AI.",
        }
    }

    const isAboutQuestion = (
        normalizedMessage === "about" ||
        /\b(about (you|yourself|assistant|nexa ai)|tell me about yourself|what can you do|your features|tum kya kar sakte ho|aap kya kar sakte ho)\b/.test(normalizedMessage) ||
        /(अपने बारे में|तुम कौन हो|आप कौन हैं|तुम क्या कर सकते हो|आप क्या कर सकते हैं)/.test(message)
    )

    if (isAboutQuestion) {
        return {
            success: true,
            aiResponse: isHindi
                ? `मैं ${assistantName} हूँ। Alok Prajapati ने मुझे बनाया है। मैं सवालों के जवाब और वेबसाइट navigation कर सकता हूँ।`
                : `I'm ${assistantName}. Alok Prajapati created me. I can answer questions and navigate this website.`,
        }
    }

    const isHindiSupportQuestion = (
        /(speak hindi|understand hindi)/.test(normalizedMessage) ||
        /(हिंदी बोल|हिंदी समझ)/.test(message)
    )

    if (isHindiSupportQuestion) {
        return {
            success: true,
            aiResponse: isHindi
                ? "हाँ, मैं हिंदी समझ और बोल सकता हूँ। भाषा बदलने के लिए ऊपर का selector इस्तेमाल करें।"
                : "Yes, I can understand and speak Hindi. Use the language selector above to switch languages.",
        }
    }

    return null
}
