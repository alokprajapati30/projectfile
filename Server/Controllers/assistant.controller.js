import User from "../Models/user.model.js"
import { generateGeminiResponse } from '../Configs/gemini.js'

export const getAssistantConfig = async (req, res) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId).select("-geminiApiKey")

        if (!user) {
           // console.log("No user found for id:", userId);
            return res.status(404).json({ message: " faild to get user" })
        }
        return res.status(200).json({ message: "Assistant Config data", user })

    } catch (error) {
        return res.status(500).json({ message: `Assistant Config failed $(error)` })

    }

}


export const askAssistant = async (req, res) => {
    try {
        const { message, userId } = req.body
        if (!message || !userId) {
            return res.status(400).json({ message: "Message and UserId are required" })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "user is not found" })
        }

        if (!user.geminiApiKey) {
            return res.status(404).json({ message: "gemini apikey is not added" })
        }

        if (user.plan === "free" && user.totalMessage >= user.requestLimit) {

            return res.status(400).json({ message: "free limit reached" })
        }


        if (user.plan === "pro" && new Date(user.proExpiresAt) < new Date()) {
            user.plan === "free"

            await user.save()

            return res.status(400).json({ message: "pro plan expired" })
        }

        const cleanMessage = message.toLowerCase()

        if (user.enableNavigation) {
            //navigation command
            const navigationWords = [

                "open",
                "go",
                "start",
                "show",
                "navigate",
                "take me",
            ];

            //cheak navigation intent
            const wantsNavigation =
                navigationWords.some((word) =>
                    cleanMessage.startsWith(word));

            //user wants navigation

            if (wantsNavigation) {
                //find matching page

                const matchedPage =
                    user.pages.find((page) =>
                        page.keywords.some((keyword) =>
                            cleanMessage.includes(keyword.toLowerCase()
                            )
                        )
                    );


                //page found

                if (matchedPage) {

                    //already open page

                    if (req.body.currentPath === matchedPage.path) {
                        return res.json({
                            success: true,
                            response: `${matchedPage.name}already open `
                        });
                    }


                    //navigate

                    return res.json({
                        success: true,
                        action: "navigate",
                        path: matchedPage.path,
                        response: `opening${matchedPage.name}`,
                    });

                }
            }
        }

      const prompt = `
        you are ${user.assistantName}.
        Business Name: ${user.businessName}
        Business Type: ${user.businesstype}
        Business Description ${user.businessDescription}

        Assistant Tone ${user.tone}


        Rules:

        - keep replied under 15 words
        - Give fast direct responses
        - Talk naturally 
        - Behave like smart voice assistant
        - Avoid long explanations
        - Keep responses short for quick voice playback

        User Question:${message}`;


const aiResponse =await generateGeminiResponse( {prompt, apikey:user.geminiApiKey, user})

if(user.plan === "free"){
    user.totalMessage += 1
    await user.save()
}
return res.json({
    success:true,
    aiResponse
});


    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success:false,
            message:"Assistant Ai Error"
        })

    }
}