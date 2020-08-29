import { ITeeBox } from "./ITeeBox";
import { IPinLocation } from "./IPinLocation";

export interface IHole {
  id: number;
  yardage: number;
  teeBoxes: ITeeBox[];
  pinLocations: IPinLocation[];
}
