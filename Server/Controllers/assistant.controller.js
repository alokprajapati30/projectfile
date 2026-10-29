import User from "../Models/user.model.js"
import { generateGeminiResponse } from "../Configs/gemini.js"
import {
    detectAssistantLanguage,
    getPredefinedAssistantResponse,
    isAssistantNavigationRequest,
} from "../Services/assistantLanguage.service.js"
import { getAssistantNavigationResponse } from "../Services/assistantNavigation.service.js"
import { buildAssistantPrompt } from "../Services/assistantPrompt.service.js"

export const getAssistantConfig = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-geminiApiKey")

        if (!user) {
            return res.status(404).json({ message: "Assistant configuration was not found." })
        }

        return res.status(200).json({
            message: "Assistant configuration loaded.",
            user,
        })
    } catch (error) {
        console.error("Failed to load assistant configuration:", error)
        return res.status(500).json({ message: "Failed to load assistant configuration." })
    }
}

export const askAssistant = async (req, res) => {
    try {
        const { message, userId, currentPath, currentUrl, platformUrl, responseLanguage } = req.body

        if (typeof message !== "string" || !message.trim() || !userId) {
            return res.status(400).json({ message: "A message and user ID are required." })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User was not found." })
        }

        const language = detectAssistantLanguage(message, responseLanguage)
        const isNavigationRequest = isAssistantNavigationRequest(message, language.normalizedMessage)

        if (isNavigationRequest) {
            const navigationResponse = getAssistantNavigationResponse({
                user,
                normalizedMessage: language.normalizedMessage,
                message,
                currentPath,
                currentUrl,
                platformUrl,
                isHindi: language.isHindi,
            })

            if (navigationResponse) {
                return res.json(navigationResponse)
            }
        }

        const predefinedResponse = getPredefinedAssistantResponse({
            message,
            normalizedMessage: language.normalizedMessage,
            isHindi: language.isHindi,
            assistantName: user.assistantName,
        })

        if (predefinedResponse) {
            return res.json(predefinedResponse)
        }

        if (!user.geminiApiKey) {
            return res.status(404).json({
                message: "Add a Gemini API key in Assistant Builder to enable AI answers.",
            })
        }

        if (user.plan === "free" && user.totalMessage >= user.requestLimit) {
            return res.status(400).json({
                message: "Free message limit reached. Upgrade your plan to continue.",
            })
        }

        if (user.plan === "pro" && new Date(user.proExpiresAt) < new Date()) {
            user.plan = "free"
            await user.save()

            return res.status(400).json({
                message: "Your Pro plan expired. Upgrade to continue using AI answers.",
            })
        }

        const prompt = buildAssistantPrompt({
            user,
            message,
            isHindi: language.isHindi,
        })
        const aiResponse = await generateGeminiResponse({
            prompt,
            apikey: user.geminiApiKey,
            user,
        })

        if (user.plan === "free") {
            user.totalMessage += 1
            await user.save()
        }

        return res.json({
            success: true,
            aiResponse,
        })
    } catch (error) {
        console.error("Assistant AI error:", error)

        return res.status(502).json({
            success: false,
            message: error.message || "Assistant AI request failed.",
        })
    }
}
