/** Base (root) component */
export class Table {
    element: HTMLDivElement
    constructor() {
        const container = document.createElement('div')
        this.element = container
    }
}