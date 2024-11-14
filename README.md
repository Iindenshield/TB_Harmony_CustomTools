# TB_Harmony_CustomTools
A small collection of custom tools for Toon Boom Harmony. 

###### DISCLAIMER: This project has been a stepping stone in my Toon Boom Harmony scripting journey; a powerfull tool for improving my confidence in programming, understanding Harmony's internal processes, and improving my problem-solving skills. Any feedback/suggestions are greatly appreciated, thanks!

##### Scripts
[matchPivot](#matchPivot.js)

[armRig](#armRig.js)

# matchPivot.js
Match all selected (target) layer(s)' pivot point to the last selected (source) layer's pivot, without moving the layers themselves.

## Further improvements
Harmony treats selections of different types inconsistently. Harmony tends to reorder selected nodes based on type rather than respecting selection order. DISCLAIMER: selection order is preserved with READ and PEG type layers only (not if source = READ and one of the target is its parent PEG. The parent PEG is going to be the source).

# armRig.js
