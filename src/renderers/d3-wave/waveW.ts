import Peak from '@/renderers/d3-wave/models/Peak';
import { getTextDimensions } from '@/renderers/d3-wave/util';
import Point from '@/renderers/d3-wave/models/Point';
import InfiniteLine from '@/renderers/d3-wave/models/InfiniteLine';
import { DebugWave } from '@/renderers/d3-wave/debugTools';
import Label from '@/renderers/d3-wave/models/Label';

/*
  Returns true if the W algorithm should be used:
  "w1" "w2"
  \/    /\
  \/ or /\
*/
export function isWType(peak: Peak) {
  return (
    // "w1"
    peak.A.slope <= 0 &&
    peak.B.slope >= 0 &&
    peak.C.slope < 0 &&
    peak.D.slope > 0
  ) ||
  (
    // "w2"
    peak.A.slope > 0 &&
    peak.B.slope < 0 &&
    peak.C.slope > 0 &&
    peak.D.slope < 0
  );
}

/*
  High level explanation:
  The text box should be either touching the "top" point (w1) or the
  "bottom" point (w2). With this assumption, we expand the text box as big
  as it can be.
*/
export function getWLabel(peak: Peak, text: string, font: string): Label | null {
  // Config
  const STARTING_FONT_SIZE = 5;
  const FONT_SIZE_INTERVAL = 2;
  const FONT_SIZE_SAFETY_SCALE = 0.9;

  let fontSize: number = STARTING_FONT_SIZE;
  let leftCollision;
  let rightCollision;
  let verticalPointyBound;
  let horizontalLeftBound;
  let horizontalRightBound;
  let textDimensions;

  // If we don't have enough space, don't even bother
  const minimumHeightRequired = getTextDimensions(text, font, fontSize).height;
  if ((peak.top.y - peak.bottom.y) < minimumHeightRequired) {
    return null;
  }

  // Slightly different code for "w1" vs "w2"
  const isW1 = (peak.A.slope <= 0);

  // We never go past the pointy bound. We expand up/down from it.
  if (isW1) {
    verticalPointyBound = peak.top.y;
    horizontalLeftBound = peak.C;
    horizontalRightBound = peak.D;
  } else {
    verticalPointyBound = peak.bottom.y;
    horizontalLeftBound = peak.A;
    horizontalRightBound = peak.B;
  }


  // Loop
  // TODO explain
  while (true) {
    let verticalInnerBound;
    textDimensions = getTextDimensions(text, font, fontSize);
    if (isW1) {
      verticalInnerBound = verticalPointyBound - textDimensions.height;
    } else {
      verticalInnerBound = verticalPointyBound + textDimensions.height;
    }

    // If we start going outisde our top/bottom, we need to stop
    if (verticalInnerBound > peak.top.y || verticalInnerBound < peak.bottom.y) {
      break;
    }

    // If we draw a line above our text box, how far can it stretch
    // to the left and right before it hits the sides
    // of our text box?
    const topLine = new InfiniteLine(0, new Point(0, verticalInnerBound));
    leftCollision = topLine.getIntersect(horizontalLeftBound);
    rightCollision = topLine.getIntersect(horizontalRightBound);

    if (!leftCollision) {
      leftCollision = new Point(peak.topLeft.x, verticalInnerBound);
    }
    if (!rightCollision) {
      rightCollision = new Point(peak.topRight.x, verticalInnerBound);
    }

    // This is the available width at this font size
    const availableWidth = rightCollision.x - leftCollision.x;

    if (DebugWave.isEnabled) {
      DebugWave.drawLine(topLine, 'black');
      DebugWave.drawPoint(leftCollision, 'red');
      DebugWave.drawPoint(rightCollision, 'green');
      DebugWave.drawTextBelowPoint(rightCollision, fontSize.toString());
    }

    if (textDimensions.width < availableWidth) {
      fontSize += FONT_SIZE_INTERVAL;
    } else {
      break;
    }
  }

  fontSize *= FONT_SIZE_SAFETY_SCALE;

  // Center the text vertically
  textDimensions = getTextDimensions(text, font, fontSize);
  let labelY;
  if (isW1) {
    labelY = peak.top.y - textDimensions.height;
  } else {
    labelY = peak.bottom.y;
  }

  // Final sanity check
  if (!leftCollision) {
    return null;
  }

  const labelX = leftCollision.x;

  return new Label(text, labelX, labelY, font, fontSize);
}
