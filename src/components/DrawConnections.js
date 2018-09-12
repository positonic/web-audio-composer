var findTransputByModuleIdAndIndex = function(moduleId, index, type) {
  var typeClass = type === 'input' ? 'input' : 'output';
  var selector =
    'div[data-id="' +
    moduleId +
    '"].module .' +
    typeClass +
    '[data-index="' +
    index +
    '"]';

  return $(selector);
};

export default function createLineSegments() {
  var segments = [];
  var $output = this.findTransputByModuleIdAndIndex(
    connection.sourceModule.id,
    connection.sourceOutputIndex,
    'output',
  );
  var $input = this.findTransputByModuleIdAndIndex(
    connection.destinationModule.id,
    connection.destinationInputIndex,
    'input',
  );
  var transputOutDistanceGrowth = 5;
  var transputOutDistance =
    8 + connection.sourceOutputIndex * transputOutDistanceGrowth;
  var transputInDistance =
    14 + connection.destinationInputIndex * transputOutDistanceGrowth;

  if ($output[0] && $input[0]) {
    var outputOffset = $output.offset();
    var inputOffset = $input.offset();
    var startX = outputOffset.left + $output.outerWidth();
    var startY = outputOffset.top + 0.5 * $output.outerHeight();
    var endX = inputOffset.left;
    var endY = inputOffset.top + 0.5 * $input.outerHeight();

    var positionMode;
    if (endX - transputInDistance > startX + transputOutDistance) {
      // end to the right
      positionMode = 'right';
    } else {
      // end to the left
      positionMode = 'left';
    }

    // first go a little right, out of the output

    segments.push({
      fromX: startX,
      fromY: startY,
      toX: startX + transputOutDistance,
      toY: startY,
      connectionIndex: index,
    });

    switch (positionMode) {
      case 'right': {
        // end is to the right, most simple case. just move to the correct y first, and then go to end
        segments.push({
          fromX: startX + transputOutDistance,
          fromY: startY,
          toX: startX + transputOutDistance,
          toY: endY,
          connectionIndex: index,
        });
        segments.push({
          fromX: startX + transputOutDistance,
          fromY: endY,
          toX: endX - transputInDistance,
          toY: endY,
          connectionIndex: index,
        });
        break;
      }
      case 'left': {
        // end is to the left, for now jsut go down halfway, then fully to the left, then final half down
        segments.push({
          fromX: startX + transputOutDistance,
          fromY: startY,
          toX: startX + transputOutDistance,
          toY: startY + 0.5 * (endY - startY),
          connectionIndex: index,
        });
        segments.push({
          fromX: startX + transputOutDistance,
          fromY: startY + 0.5 * (endY - startY),
          toX: endX - transputInDistance,
          toY: startY + 0.5 * (endY - startY),
          connectionIndex: index,
        });
        segments.push({
          fromX: endX - transputInDistance,
          fromY: startY + 0.5 * (endY - startY),
          toX: endX - transputInDistance,
          toY: endY,
          connectionIndex: index,
        });
        break;
      }
      default: {
        // unhandled cases. just draw a straight line
        segments.push({
          fromX: startX + transputOutDistance,
          fromY: startY,
          toX: endX - transputInDistance,
          toY: endY,
          connectionIndex: index,
        });
      }
    }

    // final part that goes into the input
    segments.push({
      fromX: endX - transputInDistance,
      fromY: endY,
      toX: endX,
      toY: endY,
      connectionIndex: index,
      end: true,
    });
  } else {
    console.log('No output or input found!');
  }
  return segments;
}
