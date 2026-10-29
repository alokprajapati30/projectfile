import User from '../Models/user.model.js'


export const getCurrentUser = async (req, res) => {
    try {
       // console.log("req.userId:", req.userId);
        const user = await User.findById(req.userId)
        
        if (!user) {
            return res.status(404).json({ message: "Failed to get current user" })
        }
        //console.log("User found:", user);
        return res.status(200).json(user)
    } catch (error) {
        console.error("Error in getCurrentUser:", error);
        return res.status(500).json({ message: "Failed to get current user" })
    }
}



export const saveAssistant = async (req, res) => {
    try {
        const {
            assistantName,
            businessName,
            businessType,
            businessDescription,
            tone,
            theme,
            geminiApiKey,
            pages,
        } = req.body

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: "failed to get current user " })

        }
        user.assistantName= assistantName;
        user.businessName= businessName;
        user.businesstype= businessType;
        user.businessDescription=businessDescription;
        user.tone=tone;
        user.theme = theme ;

        if(geminiApiKey){
            user.geminiApiKey = geminiApiKey
        }
        user.geminiStatus="active"
        user.pages =pages || [];

        user.isSetupComplete= true

        await user.save()
        return res.status(200).json ({message:"Assistant saved successfully",user})

    } catch (error) {
        return res.status(500).json({ message: "Failed to save current user" })

    }
}