// Script to build simple arm rig

function armRig() {
	
	scene.beginUndoRedoAccum("armRig");



	// get current frame
	var currentFrame = frame.current();
	
	// number of selected nodes
	var n = selection.numberOfNodesSelected();

	if (n < 3) {
		MessageBox.information("Please select three arm drawing layers");
		scene.endUndoRedoAccum();
		return;
	} 

	// get all selected nodes WARNING: selection order might not be preserved
	var listOfSelLayers = makeList(selection.selectedNodes(), n);	// Top/Lower_Arm,Top/Hand,Top/Upper_Arm
	/* listOfSelLayers = Top/Lower_Arm,Top/Hand,Top/Upper_Arm, Array.isArray(listOfSelLayers) = True */

	// Clear the current selection
	selection.clearSelection();
	
	// arm guide group
	var armGuidesGrp = "Top/arm_guides-G";

	// get all nodes in the scene and store them into a list
	var listOfAllNodes = getAllDescendants("Top");
	var itemsToRemove = ["Top/Composite","Top/Write","Top/Display", "Top/arm_guides-G/Input", "Top/arm_guides-G/Output", "Top/arm_guides-G/Composite", armGuidesGrp];
	
	// remove guides from list and add them to the list of guides
	listOfAllNodes = listOfAllNodes.filter(function(node) {
    if (node.indexOf("-guide") !== -1) {
					// Add to listOfGuides if it contains "-guide"
					var drawingNode = node.replace("-guide", "");
					var index = listOfSelLayers.indexOf(drawingNode);
					// Remove from listOfAllNodes 
     return false;           
    }
				// Keep in listOfAllNodes
    return true;                
	});

	// remove items stored in the remove list
	listOfAllNodes = listOfAllNodes.filter(function(item) {
		return itemsToRemove.indexOf(item) === -1;
	});
	
	// remove items stored in the selected layers list
	listOfAllNodes = listOfAllNodes.filter(function(item) {
		return listOfSelLayers.indexOf(item) === -1;
	});

	
	// check if arm grp exists. If not, create it
	if (listOfAllNodes.indexOf("Top/Arm-G") === -1) {	
		var armGrp = node.add( "Top", "Arm-G", "GROUP", 0,0,0);
	}
	else {
		var armGrp = "Top/Arm-G";
	}

	// check if arm master peg exists. If not, create it
	if (listOfAllNodes.indexOf(armGrp + "/Arm_MASTER-P") === -1) {
		var masterArm = node.add("Top", "Arm_MASTER-P", "PEG", 0,0,0);	//ex armGrp	
	}
	else {
		var masterArm = "Top" + "/Arm_MASTER-P";	//ex armGrp
	}
	
	var lowerArmHandPegExists = false;
	var lowerArmHandPeg = "";

	// check if Lower_Arm+Hand peg exists
	for (var ni = 0; ni < listOfAllNodes.length; ++ni) {
		var currentNode = listOfAllNodes[ni]
		if (currentNode.indexOf("Lower_Arm+Hand-P") !== -1) {
			lowerArmHandPegExists = true;
			lowerArmHandPeg = currentNode;
			break;
		}
	}

	// if Lower_Arm+Hand does not exist, create it
	if (!lowerArmHandPegExists) {
		// create peg (parented to armGrp. You can only parent it to a grp with node.add)
		var lowerArmHandPeg = node.add("Top", "Lower_Arm+Hand-P", "PEG", 0,0,0);
		// parent lowerArmHandPeg to rootArm
		node.link(masterArm, 0, lowerArmHandPeg, 0, true, true);
	}else {
			// parent lowerArmHandPeg to rootArm
			node.link(masterArm, 0, lowerArmHandPeg, 0, true, true);
			// TODO: if Lower_Arm+Hand parented to Top, we need to parent it to Arm-G (aka the parentNode of rootArm) first then link it
	}

	// create drawing layers' peg
	for (var i = 0; i < n; ++i) {
		
		var currentLayerPath = listOfSelLayers[i]
		
		// get peg layer name
		var layerName = node.getName(currentLayerPath)
		MessageLog.trace("The layerName is: " + layerName);
		
		// get current arm layer's coords
		newX=node.coordX(currentLayerPath);
		newY=node.coordY(currentLayerPath);
		// create and place peg layer
		pegPath = node.add("Top", layerName + "-P", "PEG", newX,newY,0);
		node.link(pegPath, 0, currentLayerPath, 0, true, true);
		if (layerName.indexOf("Upper")) {
			node.link(lowerArmHandPeg, 0, pegPath, 0, true, true);
		} else {
			node.link(masterArm, 0, pegPath, 0, true, true)
		}

		// get corresponding layer guide
		var guidePath = armGuidesGrp + "/" + layerName + "-guide";

		// get guide's pivot
		var guidePivot = matchPivotToDrawingCenter(guidePath, currentFrame);
			
		var guidePivotX = guidePivot[0];
		var guidePivotY = guidePivot[1];


		// match current peg pivot to corresponding guide's pivot
		node.setTextAttr(pegPath, "PIVOT.X", currentFrame, guidePivotX);
		node.setTextAttr(pegPath, "PIVOT.Y", currentFrame, guidePivotY);

		if (guidePath.indexOf("Upper_Arm") !== -1) {
			// match arm master peg's pivot to upper arm guide's pivot
			node.setTextAttr(masterArm, "PIVOT.X", currentFrame, guidePivotX);
			node.setTextAttr(masterArm, "PIVOT.Y", currentFrame, guidePivotY);
		} else if (guidePath.indexOf("Lower_Arm") !== -1) {
					// match lowerArmHandPeg's pivot to lower arm guide's pivot
					node.setTextAttr(lowerArmHandPeg, "PIVOT.X", currentFrame, guidePivotX);
					node.setTextAttr(lowerArmHandPeg, "PIVOT.Y", currentFrame, guidePivotY);
		}

	} // endOf for (var i = 0; i < n; ++i)
	
	// rename drawing layer's sublayers
	renameSublayers(listOfAllNodes, listOfSelLayers);



	scene.endUndoRedoAccum();
	
} //endOf ArmRig





//----------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------







function getAllDescendants(parentNodePath) {
	
	var listOfDescendants = [];
	var directChildren = node.subNodes(parentNodePath);

	// Loop through all direct children
	for (var c = 0; c < directChildren.length; c++) {
		var child = directChildren[c];
		// Add child to descendants list
		listOfDescendants.push(child); 

		// Recursively find and add grandchildren and beyond
		var childDescendants = getAllDescendants(child);
		// concatenate the direct child's descendants list with the parentNode's 
		// direct children list
  listOfDescendants = listOfDescendants.concat(childDescendants);
  }

	return listOfDescendants;
}


//----------------------------------------------------------------------------------------


function makeList(elements, nElements) {

	// creates a javascript Array
	var newList = [];
	for (var sl=0; sl < nElements; sl++) {
		newList.push(elements[sl]);
	/*MessageLog.trace("The newList is: " + newList);
	MessageLog.trace("The newList is an Array? " + Array.isArray(newList));*/
	}
	return newList;

}


//----------------------------------------------------------------------------------------


function getParentLayer(inputNode, listOfLayers) {
	// get parent
	var parentNodePath = node.srcNode(inputNode,0);
	// if parent is one of the selected layers, get name
	if (listOfLayers.indexOf(parentNodePath) !== -1) {
		return parentNodePath;
	} else if (parentNodePath) {
		return getParentLayer(parentNodePath, listOfLayers);
	} else {return "";}
}


//----------------------------------------------------------------------------------------


function renameSublayers(sceneNodes, selNodes) {
	sceneNodes = sceneNodes.filter(function(item) {
		return selNodes.indexOf(item) === -1;
	});
	var n_sn = sceneNodes.length;
	for (var s=0; s < n_sn; s++) {
		// get node's parent
		var currentNode = sceneNodes[s];
		var parentNodePath = getParentLayer(currentNode, selNodes);
		// in javascript "" = false
		if (parentNodePath) {
			parentNodeName = node.getName(parentNodePath)
			var currentNodeName = node.getName(currentNode);
			node.rename(currentNode, parentNodeName + "_" + currentNodeName);
			// update node's name in sceneNodes list too (fixes cutter and hand_Line-Art)
			sceneNodes[s] = parentNodePath + "/" + parentNodeName + "_" + currentNodeName;
		}
	}
	return;
}


//----------------------------------------------------------------------------------------


function midPointAt(p1, p2, t) {
		var x = (p1.x *(1 -t) + p2.x *t);
		var y = (p1.y *(1 -t) + p2.y *t);
		return Point2d(parseFloat(x.toFixed(20)), parseFloat(y.toFixed(20)));
}


//----------------------------------------------------------------------------------------


function matchPivotToDrawingCenter(drawingLayerPath, cframe) {
	// match guide's pivot with center of drawing (ellipse)
	// initialize bounding box corners
	var corners = [{},{},{}];
	// set art layer to 2 = index of lineArt layer (L)
	var at = 2;
	var shapeInfo = {drawing: {node: drawingLayerPath, frame: cframe}, art: at};
	var box = Drawing.query.getBox(shapeInfo);
		
	// populate corners
	corners[0].x = box.x0 /1875;		
	corners[0].y = box.y0 /1875;		// corners[0] = { "x": xValue, "y": yValue }
	corners[1].x = box.x1 /1875;
	corners[1].y = box.y1 /1875;

	// get the geometric center of the bounding box
	var btmL_OGL = Point2d(corners[0].x, corners[0].y);	
	var topR_OGL = Point2d(corners[1].x, corners[1].y);		
	var center_OGL = midPointAt(btmL_OGL, topR_OGL, 0.5);
		
	// we need to inverse the drawing pivot position from the center point:
	// Setting layer pivot on the current drawing while it is on "Apply Embedded Pivot on Drawing Layer" mode.
	var embeddedPivotOption = node.getTextAttr(drawingLayerPath, cframe, "useDrawingPivot");
	if (embeddedPivotOption === "Apply Embedded Pivot on Drawing Layer")
	{
		node.setTextAttr(drawingLayerPath, "pivot.x", 1, 0);
		node.setTextAttr(drawingLayerPath, "pivot.y", 1, 0);	
	}

	// match guide's pivot to guidePath boundinxBox's center
	node.setTextAttr(drawingLayerPath, "pivot.x", cframe, scene.fromOGLX(center_OGL.x));
	node.setTextAttr(drawingLayerPath, "pivot.y", cframe, scene.fromOGLY(center_OGL.y));
	
	// get guide's pivot
	var drawingLayerPivotX = node.getPivot(drawingLayerPath, cframe, "X").x;	
 	var drawingLayerPivotY = node.getPivot(drawingLayerPath, cframe, "Y").y;

	return [drawingLayerPivotX, drawingLayerPivotY];
}






//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------





armRig()
