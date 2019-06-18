// This is free software released into the public domain.
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any means.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// AND NO SUPPORT.
// author 3d-io GmbH, 2019


function GetSelectedLayers() {
	// returns array of all layers that are currently selected (any layers, not just ArtLayer).
	var resultLayers = new Array();
	try {
		var idGrp = stringIDToTypeID("groupLayersEvent");
		var descGrp = new ActionDescriptor();
		var refGrp = new ActionReference();
		refGrp.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
		descGrp.putReference(charIDToTypeID("null"), refGrp);
		executeAction(idGrp, descGrp, DialogModes.NO);
		for (var ix = 0; ix < app.activeDocument.activeLayer.layers.length; ix++) {
			resultLayers.push(app.activeDocument.activeLayer.layers[ix])
		}
		var ref = new ActionReference();
		ref.putEnumerated(charIDToTypeID("HstS"), charIDToTypeID("Ordn"), charIDToTypeID("Prvs"));
		var desc = new ActionDescriptor();
		desc.putReference(charIDToTypeID("null"), ref);
		executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
	} catch (err) { }
	return resultLayers;
};

function AddMaskFromSelection() {
	// creates mask for current doc.activeLayer based on current doc.selection.
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
	var desc = new ActionDescriptor();
	desc.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
	desc.putReference(charIDToTypeID("At  "), ref);
	desc.putEnumerated( charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
	executeAction(charIDToTypeID("Mk  "), desc, DialogModes.NO);
}

function HideAllLayers(layerSet) {
	// Returns an array with all layers that are already hidden (to restore the original state again).
	var hiddenLayers = new Array();
	for (var i = 0; i < layerSet.artLayers.length; i++) {
		if (!layerSet.artLayers[i].visible) {
			hiddenLayers.push(layerSet.artLayers[i]);
		}
		layerSet.artLayers[i].visible = false;
	}
	for (var i = 0; i < layerSet.layerSets.length; i++) {
		hiddenLayers.push(HideAllLayers(layerSet.layerSets[i]));
	}
	return hiddenLayers;
}

function ShowAllLayers(layerSet) {
	// shows all layers in given set and all sub sets.
	for (var i = 0; i < layerSet.artLayers.length; i++) {
		layerSet.artLayers[i].visible = true;
	}
	for (var i = 0; i < layerSet.layerSets.length; i++) {
		ShowAllLayers(layerSet.layerSets[i]);
	}
}

function ProcessChildLayers(layerSet, baseLayer) {
	// recursively iterates all sub sets of the given layer set.
	for (var i = 0; i < layerSet.artLayers.length; i++) {
		MakeMaskedCopy(layerSet.artLayers[i], baseLayer);
	}
	for (var i = 0; i < layerSet.layerSets.length; i++) {
		ProcessChildLayers(layerSet.layerSets[i], baseLayer);
	}
}

function MakeMaskedCopy(maskLayer, baseLayer) {
	// copies the given baseLayer and applies the given maskLayer (assumed to be a grayscale image) as mask.
	try {
		var copyLayer = baseLayer.duplicate(baseLayer, ElementPlacement.PLACEAFTER);
		copyLayer.name = baseLayer.name + "#" + maskLayer.name;
		doc.activeLayer = maskLayer;
		copyLayer.visible = false;
		maskLayer.visible = true;
		var channelRef = doc.channels[0];
		doc.selection.load(channelRef, SelectionType.REPLACE);
		doc.activeLayer = copyLayer;
		AddMaskFromSelection();
		maskLayer.visible = false;
		copyLayer.visible = false;
	} catch (err) {
		alert(err);
	}
}

if (documents.length != 0) {
	var doc = app.activeDocument;
	var selectedLayers = GetSelectedLayers();
	var baseLayer = null;
	var maskSet = null;
	for (var i = 0; i < selectedLayers.length; i++) {
		selectedLayers[i].selected = true;
		doc.activeLayer = selectedLayers[i];
		if (doc.activeLayer.typename == "LayerSet") {
			maskSet = doc.activeLayer;
		} else {
			baseLayer = doc.activeLayer;
		}
	}
	if (baseLayer != null && maskSet != null) {
		var hiddenLayers = HideAllLayers(doc);
		ProcessChildLayers(maskSet, baseLayer);
		ShowAllLayers(doc);
		for (var i = 0; i < hiddenLayers.length; i++) {
			hiddenLayers[i].visible = false;
		}
	} else {
		alert("Please select one base layer and one group of masks.");
	}
}