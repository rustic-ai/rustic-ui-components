# Vendored `uniforms-mui`

This is a copy of [`uniforms-mui`](https://github.com/vazco/uniforms/tree/master/packages/uniforms-mui)
4.0.0 (MIT, see `LICENSE`), ported to MUI 9. Upstream only supports
`@mui/material` 6, and `UniformsForm` needs its `AutoForm`.

`uniforms` and `uniforms-bridge-json-schema` stay regular npm packages; they
don't depend on MUI.

Apps can use it in place of `uniforms-mui`; `@rustic-ai/ui-components/dynamicForm`
re-exports everything in `index.ts` (`AutoForm`, `AutoField`, `SubmitField`, ...).

## Changes from upstream 4.0.0

- `TextField`, `LongTextField`, `NumField`, `DateField` and `SelectField` pass
  their defaults through `slotProps` (`htmlInput`, `inputLabel`, `select`)
  instead of the `inputProps`, `InputLabelProps` and `SelectProps` props that
  MUI 9 removed. A caller's own `slotProps` entries are merged in and win, as
  the old prop spreads did.
- `BoolField` and `RadioField` declare `inputRef` themselves, since MUI 9's
  Checkbox, Radio and Switch types no longer include it. It is still applied
  as `ref`, as upstream does.
- `lodash` and `invariant` imports are replaced by small helpers in
  `utils.ts`, so the copy adds no runtime dependencies.
- Type-only imports and exports are marked `type`, as this project's
  `verbatimModuleSyntax` setting requires.
- `ListField` narrows `isValidElement` to `{ name?: string }` props, since
  React 19's types make an element's props `unknown` by default.

The code otherwise keeps upstream's formatting so it can be diffed against
future uniforms releases, which is why this folder is excluded from ESLint and
Prettier.
