# AutoLayerMasks
Adobe Photoshop Script for auto creating layers out of masks

This is a free JavaScript for Adobe Photoshop. It allows user to generate for a layer automatically masks out of a group of layers.
Basic usage: 
1) Create in PS a group with mask layers (basically black&white or grayscale images representing masks). 
2) Select the RGB Layer (the beauty shot)
Run the AutoLayerMasks Script.

It will create RGB (Beauty Shot) images masked with masks from the group. 
If there are 20 predefined masks in the group, 20 RBG masked BeautyShots will be automatically created.

This script works at best in combination with Crytpmatte render passes from 3D Software. 
They can be imported in Photoshop using Exr-IO importer.
You can get the free Exr-IO Importer from
www.exr-io.com

VideoTutorial:
https://youtu.be/VCasmKdRLc4


