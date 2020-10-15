export class ColorService {
  private static pinIdColors = [
    { pinId: 1, color: "#FF9AA2" },
    { pinId: 2, color: "#C2AC9A" },
    { pinId: 3, color: "#FFDAC1" },
    { pinId: 4, color: "#E2F0CB" },
    { pinId: 5, color: "#7FDBFF" },
    { pinId: 6, color: "#C7CEEA" },
  ];
  public static getColorByPinId(pinId: number) {
    const found = this.pinIdColors.find((val) => val.pinId === pinId);
    let retVal = "";
    if (found) {
      retVal = found.color;
    }
    return retVal;
  }
}
