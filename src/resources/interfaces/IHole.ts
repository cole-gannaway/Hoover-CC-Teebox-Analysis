import { IPinLocation } from "./IPinLocation";
import { ITeeBox } from "./ITeeBox";

export interface IHole {
  id: number;
  pinLocations: IPinLocation[];
  par: number;
  teeboxes?: ITeeBox[];
}
