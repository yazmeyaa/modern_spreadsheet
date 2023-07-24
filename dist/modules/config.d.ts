import { Column } from "./column";
import { Row } from "./row";
export interface ViewProperties {
    width: number;
    height: number;
}
export type ConfigProperties = {
    /** Please, end it with '_' symbol.
     *
     * *Example:*
     *
     *      'test_'
     *      'google_' */
    rows: Row[];
    columns: Column[];
    view: ViewProperties;
};
export type SheetConfigConstructorProps = {
    rows: Row[];
    columns: Column[];
};
export declare class Config {
    rows: Row[];
    columns: Column[];
    view: ViewProperties;
    constructor(props: ConfigProperties);
}
