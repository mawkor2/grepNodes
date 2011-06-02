function grepNodes(searchText, bodyText, frameId) {
  var matchedNodes = [];
  var regXSearch;
  if (typeof searchText === "string") {
    regXSearch = new RegExp(searchText, "g");
  }
  else {
    regXSearch = searchText;
  } 
  var currentNode = null, matches = null;
  if (frameId && !window.frames[frameId]) {
    return null;
  }
  var oDoc = (frameId) ? window.frames[frameId].contentDocument : document;
  for (var nodeIdx in oDoc.all) {
    currentNode = oDoc.all[nodeIdx];
    if (!currentNode.nodeName || currentNode.nodeName === undefined) {
      break;
    }
    if (!(currentNode.nodeName.toLowerCase().match(/html|script|head|meta|link|object/))) {
      matches = currentNode.innerText.match(regXSearch);
      var totalMatches = 0;
      if (matches) {
        var totalChildElements = 0;
        for (var i=0;i<currentNode.children.length;i++) {
          if (!(currentNode.children[i].nodeName.toLowerCase().match(/html|script|head|meta|link|object/))) {
            totalChildElements++;
          }
        }
        matchedNodes.push({node: currentNode, numMatches: matches.length, childElementsWithMatch: 0, nodesYetTraversed: totalChildElements});
      }
      for (var i = matchedNodes.length - 1; i >= 0; i--) {
        previousElement = matchedNodes[i - 1];
        if (!previousElement) {
          continue;
        }
        if (previousElement.nodesYetTraversed !== 0 && previousElement.numMatches !== previousElement.childElementsWithMatch) {
          previousElement.childElementsWithMatch++;
          previousElement.nodesYetTraversed--;
        }      
        else if (previousElement.nodesYetTraversed !== 0) {
          previousElement.nodesYetTraversed--;
        }               
      }
    }
  }
  var processedMatches = [];
  for (var i =0; i <  matchedNodes.length; i++) {
    if (matchedNodes[i].numMatches > matchedNodes[i].childElementsWithMatch) {
      processedMatches.push(matchedNodes[i].node);
    }
  }
  return processedMatches; 
};
