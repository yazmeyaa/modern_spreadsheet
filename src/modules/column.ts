export type ColumnConstructorProperties = {
  width: number;
  title: string;
};

export class Column {
  width: number;
  title: string;

  constructor(props: ColumnConstructorProperties) {
    this.width = props.width;
    this.title = props.title;
  }
}
