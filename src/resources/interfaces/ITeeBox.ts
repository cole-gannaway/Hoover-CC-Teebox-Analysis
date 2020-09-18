import { IMarker } from "./IMarker";

export interface ITeeBox {
  id: any;
  depth: number;
  yardage: number;
  markers?: IMarker[];
  slope: number;
}
