import { IMarker } from "./IMarker";
import { IPinLocation } from "./IPinLocation";

export interface IHole {
  id: number;
  pinLocations: IPinLocation[];
  par: number;
  markers?: IMarker[];
}
