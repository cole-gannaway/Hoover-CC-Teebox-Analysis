export class ColorService {
  private static pinIdColors = [
    { pinId: 1, color: "#FF9AA2" },  // Coral Pink
    { pinId: 2, color: "#C2AC9A" },  // Soft Brown
    { pinId: 3, color: "#FFDAC1" },  // Peach
    { pinId: 4, color: "#E2F0CB" },  // Light Green
    { pinId: 5, color: "#7FDBFF" },  // Sky Blue
    { pinId: 6, color: "#C7CEEA" },  // Lavender
    { pinId: 7, color: "#F4B942" },  // Mustard Yellow
    { pinId: 8, color: "#28A745" },  // Forest Green
    { pinId: 9, color: "#BDC3C7" }, // Light Grey

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
