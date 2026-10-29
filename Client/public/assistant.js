(function () {
  const script = document.currentScript;
  const userId = script?.dataset?.userId;
  const serverUrl = (script?.dataset?.serverUrl || "http://localhost:3000").replace(/\/$/, "");
  const clientUrl = script ? new URL(script.src).origin : window.location.origin;
  const platformUrl = script?.dataset?.platformUrl || clientUrl;
  let responseLanguage = "hi-IN";

  if (!userId) {
    console.error("Nexa AI assistant requires a data-user-id on its script tag.");
    return;
  }

  document.getElementById("nexa-assistant-popup")?.remove();
  document.getElementById("nexa-assistant-button")?.remove();
  document.getElementById("nexa-assistant-styles")?.remove();

  const theme = "dark"

  let assistantConfig = null;

  //load css

  const link = document.createElement("link");
  link.id = "nexa-assistant-styles";
  link.rel = "stylesheet";
  link.href = `${clientUrl}/assistant.css`;

  document.head.appendChild(link);


  //popcreate
  const popup = document.createElement("div");
  popup.id = "nexa-assistant-popup";
  popup.className = `nexa-popup theme-${theme}`;

  popup.innerHTML = `
 <div class="nexa-overlay"></div>

<div class="nexa-content">
  <div class="nexa-top">
    <div class="nexa-orb-wrap">
      <div class="nexa-orb-glow"></div>
      <div class="nexa-orb"></div>
    </div>

    <h2 class="nexa-title">Hello I'm Nexa Ai</h2>
    <p class="nexa-subtitle">Aapka smart voice assistant.<br/>Hindi ya English mein baat karein.</p>

    <label class="nexa-language-label" for="nexa-language">Language / भाषा</label>
    <select class="nexa-language" id="nexa-language" aria-label="Assistant language">
      <option value="hi-IN">हिंदी</option>
      <option value="en-IN">English</option>
    </select>

    <div class="nexa-status">बोलने के लिए माइक दबाएँ</div>

    <div class="nexa-wave">
      <span></span><span></span><span></span>
      <span></span><span></span><span></span>
    </div>

  </div>

  <div class="nexa-transcript">
    <div class="nexa-user-text"></div>
    <div class="nexa-ai-text"></div>
  </div>

  <div class="nexa-bottom">
    <button class="nexa-mic">
      <img src="${clientUrl}/mic.png" alt="mic" class="nexa-mic-icon"/>
    </button>
  </div>
</div>



`;

  document.body.appendChild(popup);


  // floating button 
  const button = document.createElement("button")
  button.id = "nexa-assistant-button";
  button.className = `nexa-btn theme-${theme}`;

  button.innerHTML = `
    <img src="${clientUrl}/logo1.jpeg" alt="logo"/>`;

  document.body.appendChild(button)

  // toggel popup


  let open = false

  button.onclick = () => {
    open = !open;
    popup.style.display = open ? "flex" : "none"
  }


  //.......load assistant/ ..........


  const loadAssistant = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/assistant/config/${userId}`)
      const data = await res.json()

      if (res.ok && data.user) {
        assistantConfig = data.user
        applyConfig()
      } else {
        throw new Error(data.message || "Failed to load assistant configuration")
      }

    } catch (error) {
      console.log("assistant load error: ", error);


    }
  }

  const applyConfig = () => {
    if (!assistantConfig) return;

    popup.className = `nexa-popup theme-${assistantConfig.theme}`;
    button.className = `nexa-btn theme-${assistantConfig.theme}`

    const title = popup.querySelector(".nexa-title")
    title.innerHTML = `Hello I'M ${assistantConfig.assistantName}`;

    const subtitle = popup.querySelector(".nexa-subtitle")
    subtitle.textContent = assistantConfig.businessName || "Hindi ya English mein apna sawal poochhein.";

  }



  loadAssistant()

  //Element

  const status = popup.querySelector(".nexa-status")

  const wave = popup.querySelector(".nexa-wave")

  const userText = popup.querySelector(".nexa-user-text")

  const aitext = popup.querySelector(".nexa-ai-text")

  const mic = popup.querySelector(".nexa-mic")
  const languageSelect = popup.querySelector(".nexa-language")

  languageSelect.addEventListener("change", () => {
    responseLanguage = languageSelect.value
    status.innerText = responseLanguage === "hi-IN"
      ? "बोलने के लिए माइक दबाएँ"
      : "Tap the mic to speak"
  })


  //text to speech


  const speak = (text) => {
    window.speechSynthesis.cancel();

    //show ai responses 
    aitext.innerText = text;
    status.innerText = responseLanguage === "hi-IN" ? "जवाब दे रहा हूँ..." : "AI Speaking...";

    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = responseLanguage

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;


    //voice end


    speech.onend = () => {
      status.innerText = responseLanguage === "hi-IN"
        ? "बोलने के लिए माइक दबाएँ"
        : "Tap the mic to speak"
      wave.style.opacity = 0;


    };
    //status speaking


    window.speechSynthesis.speak(
      speech
    );

  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (SpeechRecognition) {

    const recognition = new SpeechRecognition();
    recognition.lang = responseLanguage

    recognition.continuous =
      false

    recognition.interimResults = false;

    mic.onclick = () => {
      recognition.lang = responseLanguage
      wave.style.opacity = "1";
      status.innerText = responseLanguage === "hi-IN" ? "सुन रहा हूँ..." : "Listening..."

      userText.innerText = "";
      aitext.innerText = "";

      recognition.start();




    }


    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      userText.innerText = "you:" + text;
      recognition.stop();

      setTimeout(async () => {
        try {
          status.innerText = "Thinking...";
          const res = await fetch(`${serverUrl}/api/assistant/ask`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              message: text,
              userId,
              currentPath: window.location.pathname,
              currentUrl: window.location.href,
              platformUrl,
              responseLanguage

            })
          })
          const data = await res.json()
          console.log(data)
          if (data.success) {
            if (data.action === "navigate") {
              speak(data.response)
              setTimeout(() => {
                window.location.href = data.path
              }, 1500)

            } else {
              speak(data.aiResponse || data.response || "I couldn't understand that request.")
            }
          } else {
            speak(data.message || "Assistant request failed. Please check your plan and API key.")
          }


        } catch (error) {
          console.log(error)
          speak("Ai server Error")

        }


      }, 600)

    };

    recognition.onerror = () => {
      status.innerText = responseLanguage === "hi-IN"
        ? "माइक की अनुमति दें और फिर कोशिश करें"
        : "Allow microphone access and try again"
      wave.style.opacity = "0";
    }

  } else {
    status.innerText = "Speech recognition is not supported in this browser.";

  }





})();
