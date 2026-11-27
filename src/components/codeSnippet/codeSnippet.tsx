import './codeSnippet.css'

import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, highlightSpecialChars } from '@codemirror/view'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { useEffect, useRef } from 'react'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { CodeData } from '../types'

/** The `CodeSnippet` component, powered by [CodeMirror](https://codemirror.net/), enables displaying code blocks with syntax highlighting for [various programming languages](https://codemirror.net/5/mode/). For further customization of the component's theme, refer to the [styling guide](https://codemirror.net/examples/styling/) provided by the CodeMirror library.

* Note: CodeMirror libraries are not bundled, so they must be included in the application's build process. You can install them using npm:

* ```typescript
* npm i @codemirror/language @codemirror/language-data @codemirror/state @codemirror/theme-one-dark @codemirror/view
* ``` */
export default function CodeSnippet(props: CodeData) {
  const codeSnippetContainer = useRef<HTMLDivElement>(null)
  const editorView = useRef<EditorView>(undefined)
  const langCompartment = new Compartment()

  const minimalExtensions = [
    EditorState.readOnly.of(true),
    highlightSpecialChars(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    langCompartment.of([]),
  ]

  const languageObject = languages.find(
    (language) => language.name.toLowerCase() === props.language.toLowerCase()
  )

  useEffect(() => {
    if (codeSnippetContainer.current && !editorView.current) {
      const editorContainer = codeSnippetContainer.current as HTMLElement

      const editorState = EditorState.create({
        doc: props.code,
        extensions: minimalExtensions,
      })
      editorView.current = new EditorView({
        state: editorState,
        parent: editorContainer,
      })

      if (languageObject && editorView.current) {
        languageObject.load().then((module) => {
          editorView.current?.dispatch({
            effects: langCompartment.reconfigure(module.extension),
          })
        })
      }
    }
  }, [])

  return (
    <Box>
      {props.title && <Typography variant="h6">{props.title}</Typography>}
      {props.description && <MarkedMarkdown text={props.description} />}
      <Box
        className="rustic-code-snippet"
        sx={{ backgroundColor: 'background.default' }}
        aria-label="code snippet"
        ref={codeSnippetContainer}
        data-cy="code-block"
      >
        <Typography
          variant="body2"
          aria-label="language type"
          data-cy="language-type"
        >
          {props.language}
        </Typography>
      </Box>
    </Box>
  )
}
