import './icon.css'


export type IconProps = {
    name: string
    className?: string
    color?: string
}

export default function Icon(props: IconProps) {
    const dataCyPrefix = props.name.replaceAll('_', '-')
    let extraStyle = {}
    if (props.color) {
        extraStyle = {color: props.color}
    }
    return (
        <span
            className={`${props.className ? props.className + ' ' : ''}material-symbols-rounded`}
            data-cy={`${dataCyPrefix}-icon`}
            style={{...extraStyle}}
        >
      {props.name}
    </span>
    )
}
