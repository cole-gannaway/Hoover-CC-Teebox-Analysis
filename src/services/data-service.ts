import data from "../resources/data.json";
import testData from "../resources/data.json";
import { ICourse } from "../resources/interfaces/ICourse";

export class DataService {
  private course: ICourse = testData;
  setCourse(course: ICourse) {
    this.course = course;
  }
  public getAllData() {
    return this.course;
  }
  /* This will disappear when all data is present */
  public getAllHoleIdsWithMarkers() {
    const fitleredHoles = this.course.holes.filter((hole) => {
      if (hole.markers) return true;
      else return false;
    });
    const holeIds = fitleredHoles.map((hole) => {
      return hole.id;
    });
    return holeIds;
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
      }
    } else {
      console.log("Could not find hole " + holeId + ".");
    }
    return retVal;
  }
  public getAllMarkerIds() {
    const allIds: number[] = [];
    this.course.holes.forEach((hole) => {
      if (hole.markers) {
        const pinLocationIdsForHole = hole.markers.map((pinLocation) => {
          return pinLocation.id;
        });
        // add all new ids
        pinLocationIdsForHole.forEach((id) => {
          if (!allIds.includes(id)) {
            allIds.push(id);
          }
        });
      }
    });
    return allIds;
  }
  public getMarkerInfoForHole(holeId: number, markerId: number) {
    let retVal = null;
    const foundHole = this.course.holes.find((hole) => hole.id === holeId);
    if (foundHole) {
      if (foundHole.markers) {
        const foundMarkerInfo = foundHole.markers.find(
          (marker) => marker.id === markerId
        );
        if (foundMarkerInfo) {
          retVal = foundMarkerInfo;
        } else {
          console.log(
            "Could not find marker " + markerId + " at hole " + holeId + "."
          );
        }
      }
    } else {
      console.log("Could not find hole " + holeId + ".");
    }
    return retVal;
  }
}
