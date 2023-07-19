export type ConfigProperties = {
    /** Please, end it with '_' symbol. 
     * 
     * *Example:* 
     * 
     *      'test_'
     *      'google_' */
    css_prefix?: string
}

export class Config {
    css_prefix: string = 'zmeya_'
    constructor(props?: ConfigProperties) {
        // Override default config by users config
        Object.assign(this, props)
    }
}