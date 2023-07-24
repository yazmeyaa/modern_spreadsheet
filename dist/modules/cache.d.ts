export interface CachedColumnProperties {
    xPos: number;
    colIdx: number;
}
export declare class CachedColumn {
    xPos: number;
    colIdx: number;
    constructor(props: CachedColumnProperties);
}
export interface CachedRowProperties {
    yPos: number;
    rowIdx: number;
}
export declare class CachedRow {
    yPos: number;
    rowIdx: number;
    constructor(props: CachedRowProperties);
}
export interface CacheConstructorProps {
    columns: CachedColumn[];
    rows: CachedRow[];
}
export declare class Cache {
    columns: CachedColumn[];
    rows: CachedRow[];
    constructor(initial: CacheConstructorProps);
    getRowByYCoord(y: number): number;
    getColumnByXCoord(x: number): number;
}
