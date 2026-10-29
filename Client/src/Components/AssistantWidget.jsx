import { useEffect } from 'react'

const AssistantWidget = ({ userId, clientUrl, serverUrl }) => {
  useEffect(() => {
    if (!userId) return undefined

    const widgetBaseUrl = clientUrl.replace(/\/$/, '')
    const script = document.createElement('script')
    script.src = `${widgetBaseUrl}/assistant.js`
    script.dataset.userId = userId
    script.dataset.serverUrl = serverUrl
    script.dataset.platformUrl = clientUrl
    script.async = true
    script.onerror = () => {
      console.error('Failed to load the assistant widget script.')
    }

    document.body.appendChild(script)

    return () => {
      script.remove()
      document.getElementById('nexa-assistant-popup')?.remove()
      document.getElementById('nexa-assistant-button')?.remove()
      document.getElementById('nexa-assistant-styles')?.remove()
    }
  }, [userId, clientUrl, serverUrl])

  return null
}

export default AssistantWidget
