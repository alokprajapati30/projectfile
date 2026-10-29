const PLATFORM_ROUTES = [
    {
        path: "/billing",
        phrases: ["billing", "payment", "payments", "payment option", "checkout", "upgrade", "subscription", "plan", "भुगतान", "पेमेंट", "बिलिंग", "प्लान"],
        hindiName: "बिलिंग",
        englishName: "Billing",
    },
    {
        path: "/builder",
        phrases: ["builder", "builder page", "assistant setup", "assistant builder", "customize assistant", "बिल्डर", "असिस्टेंट सेटअप"],
        hindiName: "बिल्डर",
        englishName: "Builder",
    },
    {
        path: "/",
        phrases: ["home", "homepage", "main page", "dashboard", "होम", "घर", "मुख्य पेज"],
        hindiName: "होम पेज",
        englishName: "Home",
    },
]

const isPlatformPage = ({ currentUrl, platformUrl }) => {
    try {
        return new URL(currentUrl).origin === new URL(platformUrl).origin
    } catch {
        return false
    }
}

const createNavigationResponse = ({ path, name, currentPath, isHindi }) => {
    if (currentPath === path) {
        return {
            success: true,
            response: isHindi ? `${name} पहले से खुला है।` : `${name} is already open.`,
        }
    }

    return {
        success: true,
        action: "navigate",
        path,
        response: isHindi ? `${name} खोल रहा हूँ।` : `Opening ${name}.`,
    }
}

export const getAssistantNavigationResponse = ({
    user,
    normalizedMessage,
    message,
    currentPath,
    currentUrl,
    platformUrl,
    isHindi,
}) => {
    if (!user.enableNavigation) {
        return null
    }

    if (isPlatformPage({ currentUrl, platformUrl })) {
        const platformRoute = PLATFORM_ROUTES.find(({ phrases }) =>
            phrases.some((phrase) => normalizedMessage.includes(phrase))
        )

        if (platformRoute) {
            const name = isHindi ? platformRoute.hindiName : platformRoute.englishName
            return createNavigationResponse({
                path: platformRoute.path,
                name,
                currentPath,
                isHindi,
            })
        }
    }

    const matchedPage = user.pages.find((page) => {
        const searchableText = [page.name, ...(page.keywords || [])]
            .filter(Boolean)
            .map((value) => value.toLowerCase())

        return searchableText.some((value) => value.length > 1 && normalizedMessage.includes(value))
    })

    if (matchedPage) {
        return createNavigationResponse({
            path: matchedPage.path,
            name: matchedPage.name,
            currentPath,
            isHindi,
        })
    }

    const isHomeRequest = (
        /\b(home|homepage|main page|back|return|ghar|wapas|ghar chalo)\b/.test(normalizedMessage) ||
        /(होम|घर|वापस|मुख्य पेज)/.test(message)
    )

    if (isHomeRequest) {
        return {
            success: true,
            action: "navigate",
            path: "/",
            response: isHindi ? "आपको होम पेज पर ले जा रहा हूँ।" : "Taking you to the home page.",
        }
    }

    return {
        success: true,
        aiResponse: isHindi
            ? "यह पेज नहीं मिला। Builder में पेज का नाम, path और voice keywords जोड़ें।"
            : "I couldn't find that page. Add its name, path, and voice keywords in your assistant Builder.",
    }
}
