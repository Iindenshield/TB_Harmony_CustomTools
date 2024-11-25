// Author: Iolanda Filipponi https://www.linkedin.com/in/iolandafilipponi/
// Match all selected (target) layer (s)' pivot point to the last selected (source) layer's pivot, without moving the layers themselves.
// click target (s) first, source later

function matchPivot() {
	
	scene.beginUndoRedoAccum("matchPivot");

	var currentFrame = frame.current();
	
	// get the list of selected layers
	listOfSelectedLayers = selection.selectedNodes()
	// number of selected layers
	var n = listOfSelectedLayers.length;

	if (n < 2) {
		MessageLog.trace("Error: At least two selected elements expected. Select the target (s) first, then the source.");
		scene.endUndoRedoAccum();
		return;
	} 

	// get source
	var source = listOfSelectedLayers[n - 1];
	if(node.type(source) !== "PEG" && node.type(source) !== "READ") {
		MessageLog.trace("Error: Source layer's type must be drawing or peg.");
		scene.endUndoRedoAccum();
		return;
	}
	// get source's pivot coordinates
	var sourcePivotX = node.getPivot(source, currentFrame, "X").x;	
      	var sourcePivotY = node.getPivot(source, currentFrame, "Y").y;

	// list of targets
	var targets = listOfSelectedLayers.slice(0, n-1);
	
	for (i = 0; i < n-1; ++i) {
		var currentTarget = targets[i]
		if(node.type(currentTarget) !== "PEG" && node.type(currentTarget) !== "READ") {
			MessageLog.trace("Error: Target layer (s) type must be drawing or peg.");
			scene.endUndoRedoAccum();
			return;
		}
		node.setTextAttr(currentTarget, "PIVOT.X", currentFrame, sourcePivotX);
		node.setTextAttr(currentTarget, "PIVOT.Y", currentFrame, sourcePivotY);
	}

	MessageLog.trace("Message: MatchPivot script executed successfully! Source: " + source);

	scene.endUndoRedoAccum();
	
}

matchPivot()
