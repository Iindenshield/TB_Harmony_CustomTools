# TB_Harmony_CustomTools
A small collection of custom tools for Toon Boom Harmony. 

###### DISCLAIMER: This project has been a stepping stone in my Toon Boom Harmony scripting journey; a powerfull tool for improving my confidence in programming, understanding Harmony's internal processes, and improving my problem-solving skills. Any feedback/suggestions are greatly appreciated, thanks!

##### Scripts
[matchPivot](#matchPivot.js)

[armRig](#armRig.js)

# matchPivot.js
Match all selected (target) layer(s)' pivot point to the last selected (source) layer's pivot, without moving the layers themselves.

## Implementation
The algorithm is simple. 
1. Get target(s) and source layer from the list of selected layers using `selection.selectedNodes()`. Source layer will always be at the end of the list (`index = list_lenght-1`)
2. Loop over each target layer and match its pivot to the source pivot. Note: `currentTarget` contains the [layer's path](#node)

## Code analysis

### scene.beginUndoRedoAccum(), scene.endUndoRedoAccum()
These functions group multiple actions within a script into a single operation. Therefore, after running the script, the user can undo/redo the entire batch of changes with a single undo/redo command, rather than undoing/redoing each operation individually.

###### source: https://docs.toonboom.com/help/harmony-20/scripting/script/classscene.html#afe794b757a6d36416136083f483ec40a

### node
Nodes can have identical names, so, their identified by their full path. The full path is `Top/FirstParentGroup/.../nParentGroup/NodeName` and it always starts with the root group name, **Top**.

###### source: https://docs.toonboom.com/help/harmony-20/scripting/script/classnode.html#details

#### node.type()
Returns the node type. Node types available in TB Harmony: `"READ", "DRAWING", "PEG", "CAMERA", "EFFECT", "COMPOSITE", "SOUND", "GROUP", "XSHEET", "MASTER CONTROLLER", "CUTTER", "TEXT", "PATH"`

###### source: https://docs.toonboom.com/help/harmony-20/scripting/script/classnode.html#ab998a4813d17ec712b20bd721afafa49

#### node.getPivot(), node.setTextAttr()
These functions were used to get the source's pivot and change the value of target(s)' pivot. PivotX and PivotY are pivot's x and y coordinates 

###### source: https://docs.toonboom.com/help/harmony-20/scripting/script/classnode.html#aad2f580ae40fe9575f9872f680648e19, https://docs.toonboom.com/help/harmony-20/scripting/script/classnode.html#ad5c707905cb2f1ab1cc4344013f97189

### MessageLog.trace()
It prints the message to the Message Log window (**Windows > Message Log**).

###### source: https://docs.toonboom.com/help/harmony-20/scripting/script/classMessageLog.html

### && operator

### ===, == operators
== compares the value of the variables `0 == false is true;  0 == null is false`
=== compares the type and value of the variables `0 === false is false;  0 === 0 is true`


## Further improvements
Harmony treats selections of different node types inconsistently. Therefore, it might reorder selected nodes based on type rather than respecting selection order. My goal is to find a workaround and implement a `matchTransform` tool similar to Autodesk Maya's.

# armRig.js
