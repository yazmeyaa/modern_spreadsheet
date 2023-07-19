export type RowConstructorProps =  {
    height: number
    title: string
}

export class Row {
    height: number
    title: string
    constructor(props: RowConstructorProps) {
        this.height = props.height
        this.title = props.title
    }
}