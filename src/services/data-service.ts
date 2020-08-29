import data from "../resources/data.json";

export class DataService {
  public static getAllData() {
    return data;
  }
  /* This will disappear when all data is present */
  public static getAllHoleIdsWithMarkers() {
    const fitleredHoles = data.holes.filter((hole) => {
      if (hole.markers) return true;
      else return false;
    });
    const holeIds = fitleredHoles.map((hole) => {
      return hole.id;
    });
    return holeIds;
  }
  public static getAllHoleIds(parFilter: string | null) {
    // apply filters
    let fitleredHoles = data.holes;
    if (parFilter) {
      fitleredHoles = data.holes.filter(
        (hole) => hole.par.toString() === parFilter
      );
    } else {
      fitleredHoles = data.holes;
    }

    const holeIds = fitleredHoles.map((hole) => {
      return hole.id;
    });
    return holeIds;
  }
  public static getAllPinLocationIds() {
    const allIds: number[] = [];
    data.holes.forEach((hole) => {
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
  public static getPinInfoForHole(holeId: number, pinId: number) {
    let retVal = null;
    const foundHole = data.holes.find((hole) => hole.id === holeId);
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
  public static getAllMarkerIds() {
    const allIds: number[] = [];
    data.holes.forEach((hole) => {
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
  public static getMarkerInfoForHole(holeId: number, markerId: number) {
    let retVal = null;
    const foundHole = data.holes.find((hole) => hole.id === holeId);
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
