// Script to  align a peg/drawing layer's pivot to another peg/drawing layer's pivot
// click target (s) first, source later
/* Harmony treats selections of different types inconsistently. Harmony tends to reorder selected nodes based on type rather than respecting selection order. DISCLAIMER: selection order is preserved with READ and PEG type layers only (not if source = READ and one of the target is its parent PEG. The parent PEG is going to be the source). */

function matchPivot() {
	
	scene.beginUndoRedoAccum("matchPivot");

	var currentFrame = frame.current();
	
	// get the list of selected nodes in the order they were selected
	listOfSelectedLayers = selection.selectedNodes()
	/*MessageLog.trace("The listOfSelectedLayers is: " + listOfSelectedLayers);*/
	// number of selected layers
	var n = listOfSelectedLayers.length;

	if (n < 2) {
		MessageLog.trace("Error: At least two selected elements expected. Select the target (s) first, then the source.");
		scene.endUndoRedoAccum();
		return;
	} 

	// get source
	var source = listOfSelectedLayers[n - 1];
	/*MessageLog.trace("The source is: " + source);*/
	if(node.type(source) !== "PEG" && node.type(source) !== "READ") {
		MessageLog.trace("Error: Source layer's type must be drawing or peg.");
		scene.endUndoRedoAccum();
		return;
	}
	// get source pivot coordinates
	var sourcePivotX = node.getPivot(source, currentFrame, "X").x;	
      var sourcePivotY = node.getPivot(source, currentFrame, "Y").y;

	// list of targets
	var targets = listOfSelectedLayers.slice(0, n-1);
	/*MessageLog.trace("The target (s) is: " + targets);*/
	
	for (i = 0; i < n-1; ++i) {
		var currentTarget = targets[i]
		if(node.type(currentTarget) !== "PEG" && node.type(currentTarget) !== "READ") {
			MessageLog.trace("Error: Target layer (s) type must be drawing or peg.");
			scene.endUndoRedoAccum();
			return;
		}
		/*MessageLog.trace("The currentTarget (s) is: " + node.type(currentTarget));*/
		node.setTextAttr(currentTarget, "PIVOT.X", currentFrame, sourcePivotX);
		node.setTextAttr(currentTarget, "PIVOT.Y", currentFrame, sourcePivotY);
	}

	MessageLog.trace("Message: MatchPivot script executed successfully! Source: " + source);

	scene.endUndoRedoAccum();
	
}

matchPivot()