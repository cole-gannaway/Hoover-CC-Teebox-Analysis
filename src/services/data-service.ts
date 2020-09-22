import { IAdjustablePinInfo } from "../interfaces/IAdjustablePinInfo";
import testData from "../resources/data.json";
import { ICourse } from "../resources/interfaces/ICourse";

export class DataService {
  private course: ICourse = testData;
  private adjustablePinDepths: IAdjustablePinInfo[] = [];
  private adjustablePinId: number = 7;
  setCourse(course: ICourse) {
    this.course = course;
  }
  public getAllData() {
    return this.course;
  }

  public setAdjustablePinDepths(newVal: IAdjustablePinInfo[]) {
    this.adjustablePinDepths = newVal;
  }

  public getAllHoleIds(parFilter: string | null) {
    // apply filters
    let fitleredHoles = this.course.holes;
    if (parFilter) {
      fitleredHoles = this.course.holes.filter(
        (hole) => hole.par.toString() === parFilter
      );
    } else {
      fitleredHoles = this.course.holes;
    }

    const holeIds = fitleredHoles.map((hole) => {
      return hole.id;
    });
    return holeIds;
  }
  public getAllPinLocationIds() {
    const allIds: number[] = [];
    this.course.holes.forEach((hole) => {
      const pinLocationIdsForHole = hole.pinLocations.map((pinLocation) => {
        return pinLocation.id;
      });
      // add all new ids
      pinLocationIdsForHole.forEach((id) => {
        if (!allIds.includes(id)) {
          allIds.push(id);
        }
      });
    });
    this.adjustablePinId = allIds.length + 1;
    allIds.push(this.adjustablePinId);
    return allIds;
  }
  public getPinInfoForHole(holeId: number, pinId: number) {
    let retVal = null;
    const foundHole = this.course.holes.find((hole) => hole.id === holeId);
    if (foundHole) {
      const foundPinLocationInfo = foundHole.pinLocations.find(
        (pinLocation) => pinLocation.id === pinId
      );
      if (foundPinLocationInfo) {
        retVal = foundPinLocationInfo;
      } else {
        console.log(
          "Could not find pin location " + pinId + " at hole " + holeId + "."
        );

        if (pinId === this.adjustablePinId) {
          const foundAdjustableInfo = this.adjustablePinDepths.find(
            (pinInfo) => pinInfo.holeId === holeId
          );
          if (foundAdjustableInfo) {
            retVal = {
              id: pinId,
              depth: foundAdjustableInfo.depth,
            };
          } else {
            console.log("Couldn't find adjustable pin Depth");
          }
        }
      }
    } else {
      console.log("Could not find hole " + holeId + ".");
    }
    return retVal;
  }
  public getAllTeeboxIds() {
    const allIds: number[] = [];
    this.course.holes.forEach((hole) => {
      if (hole.teeboxes) {
        const teeBoxIdsForHole = hole.teeboxes.map((teebox) => {
          return teebox.id;
        });
        // add all new ids
        teeBoxIdsForHole.forEach((id) => {
          if (!allIds.includes(id)) {
            allIds.push(id);
          }
        });
      }
    });
    return allIds;
  }
  public getTeeboxInfoForHole(holeId: number, teeBoxId: number) {
    let retVal = null;
    const foundHole = this.course.holes.find((hole) => hole.id === holeId);
    if (foundHole) {
      if (foundHole.teeboxes) {
        const foundTeeBoxInfo = foundHole.teeboxes.find(
          (teeBox) => teeBox.id === teeBoxId
        );
        if (foundTeeBoxInfo) {
          retVal = foundTeeBoxInfo;
        } else {
          console.log(
            "Could not find teeBox " + teeBoxId + " at hole " + holeId + "."
          );
        }
      }
    } else {
      console.log("Could not find hole " + holeId + ".");
    }
    return retVal;
  }
}
