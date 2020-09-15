import { DataService } from "./data-service";
import { YardageUtils } from "./yardage-utils";
import { IYardageCalc } from "../interfaces/IYardageCalc";

export class CalculationUtils {
  public static canCombinationProduceDesiredYardage(
    holeId: number,
    pinId: number,
    markerId: number,
    desiredYardage: number
  ) {
    let retVal = false;
    // get pinInfo for the hole
    const pinInfo = DataService.getPinInfoForHole(holeId, pinId);
    // if markerInfo can get the desiredYardage then add it
    const markerInfo = DataService.getMarkerInfoForHole(holeId, markerId);
    if (pinInfo && markerInfo) {
      // constants
      const yardage = markerInfo.yardage;
      const slope = markerInfo.slope;
      const pinDepth = pinInfo.depth;
      const constantYardage = yardage + pinDepth + slope;
      const markerDelta = YardageUtils.computePlusMinus(markerInfo.depth);
      const desiredYardageDelta = constantYardage - desiredYardage;
      const absDesiredYardageDelta = Math.abs(desiredYardageDelta);
      // this hole, pin, and marker combination can be used for this desired yardage
      if (absDesiredYardageDelta < markerDelta) retVal = true;
    }

    return retVal;
  }
  public static findAllCombos(
    holeIds: number[],
    desiredYardages: number[],
    yardageCalcArr: IYardageCalc[]
  ): IYardageCalc[][] {
    const combos: IYardageCalc[][] = [];
    let combo: IYardageCalc[] = [];
    this.recursiveFunction(
      combo,
      combos,
      holeIds,
      desiredYardages,
      yardageCalcArr
    );
    return combos;
  }
  private static recursiveFunction(
    combo: IYardageCalc[],
    combos: IYardageCalc[][],
    holeIds: number[],
    desiredYardages: number[],
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
      combo
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
          filtered
        );
        // remove from combo
        combo.pop();
      }
    }
  }
  public static filterPossibleValues(
    possibleValues: IYardageCalc[],
    combo: IYardageCalc[]
  ): IYardageCalc[] {
    const comboHoleIds = combo.map((val) => val.holeId);
    const comboDesiredYardages = combo.map((val) => val.desiredYardage);
    if (combo.length === 0) {
      return possibleValues;
    } else {
      const comboPinId = combo[0].pinId;
      const filtered = possibleValues
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
        })
        .filter((val) => {
          if (comboPinId) {
            return val.pinId === comboPinId;
          } else {
            return false;
          }
        });
      return filtered;
    }
  }

  private static cloneCombo(combo: IYardageCalc[]) {
    const cloned: IYardageCalc[] = [];
    combo.forEach((val) => cloned.push(val));
    return cloned;
  }
}
