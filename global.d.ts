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

// plotly.js ships types for its root entry only, not its dist bundles.
declare module 'plotly.js/dist/plotly.js' {
  const Plotly: object
  export default Plotly
}
