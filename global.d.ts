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

// Side-effect CSS imports, which TypeScript 6 checks by default.
declare module '*.css'
