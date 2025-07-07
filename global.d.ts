declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

declare module '*.wasm' {
  const content: string
  export default content
}
