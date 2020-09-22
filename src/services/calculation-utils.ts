import { DataService } from "./data-service";
import { YardageUtils } from "./yardage-utils";
import { IYardageCalc } from "../interfaces/IYardageCalc";

export class CalculationUtils {
  public static canCombinationProduceDesiredYardage(
    dataService: DataService,
    holeId: number,
    pinId: number,
    teeBoxId: number,
    desiredYardage: number
  ) {
    let retVal = false;
    // get pinInfo for the hole
    const pinInfo = dataService.getPinInfoForHole(holeId, pinId);
    // if teeBoxInfo can get the desiredYardage then add it
    const teeBoxInfo = dataService.getTeeboxInfoForHole(holeId, teeBoxId);
    if (pinInfo && teeBoxInfo) {
      // constants
      const yardage = teeBoxInfo.yardage;
      const slope = teeBoxInfo.slope;
      const pinDepth = pinInfo.depth;
      const constantYardage = yardage + pinDepth + slope;
      const markerDelta = YardageUtils.computePlusMinus(teeBoxInfo.depth);
      const desiredYardageDelta = constantYardage - desiredYardage;
      const absDesiredYardageDelta = Math.abs(desiredYardageDelta);
      // this hole, pin, and teeBox combination can be used for this desired yardage
      if (absDesiredYardageDelta < markerDelta) retVal = true;
    }

    return retVal;
  }
  public static findAllCombos(
    holeIds: number[],
    desiredYardages: number[],
    mixAndMatchPinIdsAllowed: boolean,
    yardageCalcArr: IYardageCalc[]
  ): IYardageCalc[][] {
    const combos: IYardageCalc[][] = [];
    let combo: IYardageCalc[] = [];
    this.recursiveFunction(
      combo,
      combos,
      holeIds,
      desiredYardages,
      mixAndMatchPinIdsAllowed,
      yardageCalcArr
    );
    return combos;
  }
  private static recursiveFunction(
    combo: IYardageCalc[],
    combos: IYardageCalc[][],
    holeIds: number[],
    desiredYardages: number[],
    mixAndMatchPinIdsAllowed: boolean,
    possibleValues: IYardageCalc[]
  ) {
    // success base case
    if (combo.length === desiredYardages.length) {
      combos.push(this.cloneCombo(combo));
      return;
    }
    // failure base case
    if (possibleValues.length === 0) {
      return;
    }
    // filter out
    const filtered: IYardageCalc[] = this.filterPossibleValues(
      possibleValues,
      combo,
      mixAndMatchPinIdsAllowed
    );
    while (filtered.length !== 0) {
      const lastElement = filtered.pop();
      if (lastElement) {
        // add to combo
        combo.push(lastElement);
        // recurse
        this.recursiveFunction(
          combo,
          combos,
          holeIds,
          desiredYardages,
          mixAndMatchPinIdsAllowed,
          filtered
        );
        // remove from combo
        combo.pop();
      }
    }
  }
  public static filterPossibleValues(
    possibleValues: IYardageCalc[],
    combo: IYardageCalc[],
    mixAndMatchPinIdsAllowed: boolean
  ): IYardageCalc[] {
    const comboHoleIds = combo.map((val) => val.holeId);
    const comboDesiredYardages = combo.map((val) => val.desiredYardage);
    if (combo.length === 0) {
      return possibleValues;
    } else {
      const comboPinId = combo[0].pinId;
      let filtered = possibleValues
        .filter((val) => {
          return (
            comboHoleIds.findIndex((holeId) => val.holeId === holeId) === -1
          );
        })
        .filter((val) => {
          return (
            comboDesiredYardages.findIndex(
              (dy) => val.desiredYardage === dy
            ) === -1
          );
        });
      // mix and matching pin ids
      if (!mixAndMatchPinIdsAllowed) {
        filtered = filtered.filter((val) => {
          if (comboPinId) {
            return val.pinId === comboPinId;
          } else {
            return false;
          }
        });
      }

      return filtered;
    }
  }

  private static cloneCombo(combo: IYardageCalc[]) {
    const cloned: IYardageCalc[] = [];
    combo.forEach((val) => cloned.push(val));
    return cloned;
  }
}
