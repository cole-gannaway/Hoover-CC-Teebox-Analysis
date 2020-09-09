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
      const pinDepth = pinInfo.depth;
      const constantYardage = yardage + pinDepth;
      const markerDelta = YardageUtils.computePlusMinus(markerInfo.depth);
      const desiredYardageDelta = constantYardage - desiredYardage;
      const absDesiredYardageDelta = Math.abs(desiredYardageDelta);
      // this hole, pin, and marker combination can be used for this desired yardage
      if (absDesiredYardageDelta < markerDelta) retVal = true;
    }

    return retVal;
  }
  public static findCombo(
    holeIds: number[],
    desiredYardages: number[],
    yardageCalcArr: IYardageCalc[]
  ): IYardageCalc[] {
    let combo: IYardageCalc[] = [];
    let index = 0;
    while (
      !this.isComboValid(combo, holeIds, desiredYardages) &&
      index < yardageCalcArr.length
    ) {
      const potentialCalc = yardageCalcArr[index];
      if (this.canAddToCombo(combo, potentialCalc)) {
        combo.push(potentialCalc);
        index = 0;
      } else {
        index++;
      }
    }

    return combo;
  }
  private static canAddToCombo(
    combo: IYardageCalc[],
    potentialCalc: IYardageCalc
  ) {
    const comboHoleIds = combo.map((val) => val.holeId);
    const comboDesiredYardages = combo.map((val) => val.desiredYardage);
    const indexOfExistingHoleId = comboHoleIds.findIndex(
      (holeId) => holeId === potentialCalc.holeId
    );
    const indexOfExistingDesiredYardage = comboDesiredYardages.findIndex(
      (desiredYardage) => desiredYardage === potentialCalc.desiredYardage
    );

    let holeIdExists = true;
    let desiredYardageExists = true;
    if (indexOfExistingDesiredYardage === -1) holeIdExists = false;
    if (indexOfExistingHoleId === -1) desiredYardageExists = false;
    if (!holeIdExists && !desiredYardageExists) return true;
    else return false;
  }
  private static isComboValid(
    combo: IYardageCalc[],
    holeIds: number[],
    desiredYardages: number[]
  ): boolean {
    const comboHoleIds = combo.map((val) => val.holeId);
    const comboDesiredYardages = combo.map((val) => val.desiredYardage);
    const doHoleIdsMatch = holeIds === comboHoleIds;
    const doYardagesMatch = desiredYardages === comboDesiredYardages;
    if (doHoleIdsMatch && doYardagesMatch) return true;
    else return false;
  }
}
