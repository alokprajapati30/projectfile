(function () {
  // userdata 

   const userId = localStorage.getItem("userId");
  //console.log("Assistant script userId:", userId);

  //const script = document.currentScript;
  //const userId = script?.dataset?.userId;
  // console.log("UserId from dataset:", userId);

  //const userId = script?.dataset?.userId;

  const theme = "dark"

  let assistantConfig = null;

  //load css

  const link = document.createElement("link");
  link.rel = "stylesheet";
  //link.href = "assistant.css";
  link.href = "http://localhost:5173/assistant.css";

  document.head.appendChild(link);


  //popcreate
  const popup = document.createElement("div");
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
    <p class="nexa-subtitle">
      Your smart voice assistant.<br/>
      Ask anything about your website.
    </p>

    <div class="nexa-status">Top button to Speak</div>

    <div class="nexa-wave">
      <span></span><span></span><span></span>
      <span></span><span></span><span></span>
    </div>

    <div class="nexa-user-text"></div>
    <div class="nexa-ai-text"></div>
  </div>

  <div class="nexa-bottom">
    <button class="nexa-mic">
      <img src="http://localhost:5173/mic.png" alt="mic" class="nexa-mic-icon"/>
    </button>
  </div>
</div>



`;

  document.body.appendChild(popup);


  // floating button 
  const button = document.createElement("button")
  button.className = `nexa-btn theme-${theme}`;

  button.innerHTML = `
    <img src="http://localhost:5173/logo1.jpeg" alt="logo"/>`;

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
      const res = await fetch(`http://localhost:3000/api/assistant/config/${userId}`)
      const data = await res.json()
      //console.log(data)


      if (data) {
        assistantConfig = data.user
        applyConfig()
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
    subtitle.innerHTML = `${assistantConfig.businessName}.
        <br/>
        Ask anything about your website.`;

  }



  loadAssistant()

  //Element

  const status = popup.querySelector(".nexa-status")

  const wave = popup.querySelector(".nexa-wave")

  const userText = popup.querySelector(".nexa-user-text")

  const aitext = popup.querySelector(".nexa-ai-text")

  const mic = popup.querySelector(".nexa-mic")



  //text to speech


  const speak = (text) => {
    window.speechSynthesis.cancel();

    //show ai responses 
    aitext.innerText = text;
    status.innerText = "AI Speaking...";


    const speech = new SpeechSynthesisUtterance(text)
    speech.lang =
      "hi-IN";

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;


    //voice end


    speech.onend = () => {
      status.innerText =
        "Tap button to speak";
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
    recognition.lang =
      "en-US";

    recognition.continuous =
      false

    recognition.interimResults = false;

    mic.onclick = () => {
      wave.style.opacity = "1";
      status.innerText = "Listening";

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
          const res = await fetch("http://localhost:3000/api/assistant/ask", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              message: text,
              userId

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
              speak(data.aiResponse)

            }
          } else {
            speak(" Response error please Check your plan")
          }


        } catch (error) {
          console.log(error)
          speak("Ai server Error")

        }


      }, 600)

    };

    recognition.onerror = () => {
      status.innerText = "Tap Button to speak";
      wave.style.opacity = "0";
    }

  } else {
    status.innerText = "Speech Recognition not supported";

  }





})();



