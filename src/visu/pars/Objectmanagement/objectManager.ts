import { createBasicObject } from "./Objects/basicObject";
import { createPolyObject } from "./Objects/polyObject";
import { createPiechartObject } from "./Objects/piechartObject";
import { createScrollbarObject } from "./Objects/scrollbarObject";
import {
  IBasicShape,
  IPiechartShape,
  IPolyShape,
  IScrollbarShape,
} from "../../Interfaces/javainterfaces";

export function createVisuObject(
  javaObject: any,
  dynamicElements: Map<string, string[][]>
): any {
  // This function acts as broker for different objects
  if (["polygon", "bezier", "polyline"].includes(javaObject.shape)) {
    // Its a polyform
    return createPolyObject(javaObject as IPolyShape, dynamicElements);
  } else if (
    [
      "round-rect",
      "circle",
      "line",
      "rectangle",
      "bitmap",
      "button",
      "subvisu",
    ].includes(javaObject.shape)
  ) {
    // Its a simpleshape, bitmap, button or subvisu
    return createBasicObject(javaObject as IBasicShape, dynamicElements);
  } else if (javaObject.shape === "piechart") {
    // Its a piechart
    return createPiechartObject(javaObject as IPiechartShape, dynamicElements);
  } else if (javaObject.shape === "scrollbar") {
    // Its a scrollbar
    return createScrollbarObject(
      javaObject as IScrollbarShape,
      dynamicElements
    );
  }
}
