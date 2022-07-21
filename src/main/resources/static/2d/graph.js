import getLinkColor from '../utils/getLinkColor.js';
import getNodeColor from '../utils/getNodeColor.js';
import getNeighbors from '../utils/getNeighbors.js';
import rightClick from "../utils/rightClick.js";
import rightClickLink from "../utils/rightClickLink.js";

import inputFile from '../data/pipeline.json' assert { type: "json" };
import {saveAs} from "../utils/file-saver.js";

const width = window.innerWidth;
const height = window.innerHeight;
const dependencies = document.querySelector(".dependencies");
const dependson = document.querySelector(".dependson");
const cb = document.querySelector("#menuToggle");
const nodeForm = document.getElementById('addNode');
nodeForm.style.display = 'none';
const linkForm = document.getElementById('addLink');
linkForm.style.display = 'none'
const coupling = document.querySelector("#rangeValue");
const searchWrapper = document.querySelector(".search-box");

export let nodes = [...inputFile.nodes];
let links = [...inputFile.links];
let allLinks = [...inputFile.links];
let allNodes = [...inputFile.nodes];
let changeColor = true;
let changeLinkColor = true;
let clickedNode = null;
let clickedLink = null;
let hoveredNode = null;
let hoveredLink = null;
let theme = 0;
let threshold = 8;
let zoom = d3.zoom().scaleExtent([1 / 4, 8]).on("zoom", zoomController);
let svg = d3.select('#graph').append("svg")
    .attr("width",  width)
    .attr("height",  height)
    .call(zoom);
let g = svg.append("g");
var linkElements,
    nodeElements,
    rectNodeElements,
    starNodeElements,
    ringNodeElements,
    triangleNodeElements,
    yNodeElements,
    textElements;

svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr('refX', 17)//so that it comes towards the center.
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// we use svg groups to logically group the elements together
let linkGroup = g.attr('class', 'links');
let nodeGroup = g.attr('class', 'nodes');
let textGroup = g.attr('class', 'texts');

// simulation setup with all forces
let linkForce = d3
    .forceLink()
    .id(function (link) { return link.id })
    .strength(function (link) { return 0.1 });

let simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-240))
    .force('center', d3.forceCenter(width / 2, height / 2));

let dragDrop = d3.drag().on('start', function (event, node) {
    node.fx = node.x;
    node.fy = node.y;
}).on('drag', function (event, node) {
    simulation.alphaTarget(0.7).restart();
    node.fx = event.x;
    node.fy = event.y;
}).on('end', function (event, node) {
    if (!event.active) {
        simulation.alphaTarget(0);
    }
    node.fx = event.x;
    node.fy = event.y;
})

function zoomController(event){
    g.attr("transform", event.transform);
}

function zoomIn() {
    svg.transition().call(zoom.scaleBy, 2);
}

function zoomOut() {
    svg.transition().call(zoom.scaleBy, 0.5);
}

function resetZoom() {
    svg.transition().call(zoom.scaleTo, 1);
}

function center() {
    svg.transition().call(zoom.translateTo, 0.5 * width, 0.5 * height);
}

function addNode() {
    nodeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let newName = event.target.elements.name.value;
        let found = false;

        allNodes.forEach(node => {
            if (node.id === newName) {
                found = true;
            }
        })

        if (found) {
            window.alert("That node already exists! Try again.");
        } else {

            let newType = event.target.elements.node_type.value;
            let newDeps = event.target.elements.dependencies.value;
            let deps = newDeps.split(',');

            let node = {
                id: newName,
                nodeType: newType,
                dependencies: deps,
                nodeID: 23
            }
            allNodes.push(node);
            nodes = allNodes;

            deps.forEach(d => {
                nodes.forEach(n => {
                    if (n.nodeID.toString() === d) {
                        let link = {
                            source: newName,
                            target: n.id
                        }
                        allLinks.push(link);
                    }
                })
            })
            links = allLinks;
            changeColor = true;
            updateSimulation();
            closeNodeForm();
        }
    });
    nodeForm.style.display = 'block';
}

function closeNodeForm() {
    nodeForm.style.display = 'none';
}

function closeLinkForm() {
    linkForm.style.display = 'none';
}

function addLink() {
    linkForm.addEventListener('submit', (event) => {

        event.preventDefault();
        let newTarget = event.target.elements.target.value;
        let foundNode = false;

        allNodes.forEach(node => {
            if (node.id === newTarget) {
                foundNode = true;
            }
        })

        if (!foundNode) {
            window.alert("The target you selected is not currently a node in this graph. Try again.");
        } else {
            let found = false;
            links.forEach(link => {
                if (link.source.id === clickedNode.id && link.target.id === newTarget) {
                    found = true;
                }
            })

            if (found) {
                window.alert("That link already exists! Try again.");
            } else {
                let link = {
                    source: clickedNode,
                    target: newTarget
                }
                allLinks.push(link);
                links = allLinks;
                clickedNode = null;
                changeColor = true;
                updateSimulation();
                closeLinkForm();
                resetZoom();
            }
        }
    })
    linkForm.style.display = 'block';
}

// select node is called on every click
// we either update the data according to the selection
// or reset the data if the same node is clicked twice
export function selectNode(selectedNode) {
    clickedNode = selectedNode;
    nodes = [selectedNode];
    links = [];
    changeColor = true;
    updateSimulation();
    getInfoBox(selectedNode);
    svg.transition().call(zoom.translateTo, selectedNode.x, selectedNode.y);
}

function getNeighborsSelected(){
    nodes = getNeighbors(clickedNode, allLinks);
    links = allLinks.filter(function (link) {
        return link.target.id === clickedNode.id || link.source.id === clickedNode.id;
    });
    changeColor = true;
    updateSimulation();
}

function deleteNode(){

    let visibleNodes = [];
    let visibleLinks = [];
    if (window.confirm("Are you sure you want to delete this node and all its links?")) {
        nodes.forEach((node) => {
            if (node !== clickedNode) {
                visibleNodes.push(node);
            }
        });
        links.forEach((link) => {
            if (link.source !== clickedNode && link.target !== clickedNode) {
                visibleLinks.push(link);
            }
        });
        links = visibleLinks;
        nodes = visibleNodes;
        updateSimulation();
    }
}

function deleteLink() {
    let linksNew = [];
    if (window.confirm("Are you sure you want to delete this link?")) {
        allLinks.forEach((link) => {
            if (link !== clickedLink) {
                linksNew.push(link);
            }
        });
        links = linksNew;
        allLinks = links;
        nodes = allNodes;
        changeColor = true;
        updateSimulation();
        resetZoom();
    } else {
        closeBox();
        resetZoom();
    }
}

function getInfoBox(selectedNode) {
    // Show info box
    cb.checked = true;
    // Set info box data
    document.getElementById("nodeName").innerHTML = selectedNode.id;
    document.getElementById("nodeType").innerHTML = "<b>Node Type: </b>" + selectedNode.nodeType;
    document.getElementById("nodeID").innerHTML = "<b>Node ID: </b>" + selectedNode.nodeID;

    let found = false;
    let found2 = false;
    let newLinks = [];
    let dependLinks = [];

    allLinks.forEach(link => {
        if (link.source === selectedNode) {
            found = true;
            newLinks.push(link);
        }
        if (link.target === selectedNode) {
            found2 = true;
            dependLinks.push(link);
        }
    });

    if (found) {
        newLinks = newLinks.map((data) => {
            data = '<li>' + data.target.id + '</li>';
            return data;
        });
        dependencies.innerHTML = newLinks.join('');
    } else {
        dependencies.innerHTML = '<li>N/A</li>';
    }

    if (found2) {
        dependLinks = dependLinks.map((data) => {
            data = '<li>' + data.source.id + '</li>';
            return data;
        });
        dependson.innerHTML = dependLinks.join('');
    } else {
        dependson.innerHTML = '<li>N/A</li>';
    }
}

export function selectSearchNodes(selectedNodes){
    nodes = selectedNodes;
    selectLinksExplicit();
    changeColor = true;
    updateSimulation();
}

function selectLinksExplicit(){
    links = allLinks.filter(function (link) {
        return nodes.includes(link.source) && nodes.includes(link.target);
    });
}

function closeBox() {
    clickedNode = null;
    hoveredNode = null;
    changeColor = true;
    center();
    resetData();
}

// this helper simple adds all nodes and links
// that are missing, to recreate the initial state
export function resetData() {
    nodes = allNodes;
    links = allLinks;
    clickedNode = null;
    hoveredNode = null;
    changeColor = true;
    updateSimulation();
}

function hoverNode(selectedNode){
    hoveredNode = selectedNode;
    changeColor = true;
    updateSimulation();
}

function hoverLink(selectedLink) {
    hoveredLink = selectedLink
    changeLinkColor = true;
    updateSimulation();
}

function stopHoverNode(selectedNode){
    hoveredNode = null;
    changeColor = true;
    updateSimulation();
}

function stopHoverLink(selectedLink) {
    hoveredLink = null;
    changeLinkColor = true;
    updateSimulation();
}

function darkMode(){
    document.body.style.backgroundColor = "black";
    theme = 1;
    d3.selectAll("marker").style("fill", "rgba(255,255,255,1)")
    changeLinkColor = true;
    updateSimulation();
}

function lightMode(){
    document.body.style.backgroundColor = "white";
    theme = 0;
    d3.selectAll("marker").style("fill", "rgba(0,0,0,1)")
    changeLinkColor = true;
    updateSimulation();
}

function updateSlider(newVal){
    coupling.innerText = newVal;
    threshold = parseInt(newVal);
    changeColor = true;
    updateSimulation();
}

function replacer(key,value)
{
    if (key==="source") return value.id;
    else if (key==="target") return value.id;
    else return value;
}

function exportGraph(){
    exportToJsonFile(nodes)
}

function exportToJsonFile(jsonData) {
    let map1 = new Map();
    map1.set("nodes", jsonData);
    let map2 = new Map();
    map2.set("links", links);
    let obj1 = Object.assign({},Object.fromEntries(map1), Object.fromEntries(map2), zoom, svg._groups[0][0].__zoom);
    let dataStr = JSON.stringify(obj1, replacer);
    //let dataStr2 = JSON.stringify(Graph.cameraPosition());
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data-out.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importGraph(){
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            var parsedData = JSON.parse(content);
            nodes = [...parsedData.nodes];
            links = [...parsedData.links];
            allLinks = links;
            allNodes = nodes;
            changeColor = true;
            zoom.transform(svg, d3.zoomIdentity.translate(parsedData.x, parsedData.y).scale(parsedData.k));
            updateSimulation();
        }
    }

    input.click();
}


function download(){
    var svgString = getSVGString(svg.node());
    svgString2Image( svgString, 2*width, 2*height, 'png', save );

    function save( dataBlob, filesize ){
        saveAs( dataBlob, 'screenshot.png' ); // FileSaver.js function
    }
}

function getSVGString( svgNode ) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles( parentElement ) {
        var selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push( '#'+parentElement.id );
        for (var c = 0; c < parentElement.classList.length; c++)
            if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                selectorTextArr.push( '.'+parentElement.classList[c] );

        // Add Children element Ids and Classes to the list
        var nodes = parentElement.getElementsByTagName("*");
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i].id;
            if ( !contains('#'+id, selectorTextArr) )
                selectorTextArr.push( '#'+id );

            var classes = nodes[i].classList;
            for (var c = 0; c < classes.length; c++)
                if ( !contains('.'+classes[c], selectorTextArr) )
                    selectorTextArr.push( '.'+classes[c] );
        }

        // Extract CSS Rules
        var extractedCSSText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            var s = document.styleSheets[i];

            try {
                if(!s.cssRules) continue;
            } catch( e ) {
                if(e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            var cssRules = s.cssRules;
            for (var r = 0; r < cssRules.length; r++) {
                if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                    extractedCSSText += cssRules[r].cssText;
            }
        }


        return extractedCSSText;

        function contains(str,arr) {
            return arr.indexOf( str ) === -1 ? false : true;
        }

    }

    function appendCSS( cssText, element ) {
        var styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css");
        styleElement.innerHTML = cssText;
        var refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
}


function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function() {
        context.fillStyle='white';
        if(theme === 0) {
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        if(theme === 1) {
            context.clearRect(0, 0, width, height);
        }
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            var filesize = Math.round( blob.length/1024 ) + ' KB';
            if ( callback ) callback( blob, filesize );
        });


    };

    image.src = imgsrc;
}

function forceReset(){
    searchWrapper.classList.remove("active");
    cb.checked = false;
    resetData();
    resetZoom();
    center();
}

function updateGraph() {
    // links
    linkElements = linkGroup.selectAll('.link')
        .data(links, function (link) {
            return link.target.id + link.source.id
        });

    linkElements.exit().remove();

    let linkEnter = linkElements
        .enter().append( "path" )//append path
        .attr( "class", "link" )
        .attr('stroke-width', 3)
        .attr('stroke', 'rgba(50, 50, 50, 0.2)')
        .attr('marker-end', (d) => "url(#arrow)")//attach the arrow from defs
        .on('click', function (e, link) {
            clickedLink = link;
        })
        .on('contextmenu', function (e, link) {
            clickedLink = link;
            rightClickLink(e);
         })
        .on('mouseover', function(e, link){hoverLink(link)})
        .on('mouseout', function(e, link){stopHoverLink(link)});

    linkElements = linkEnter.merge(linkElements);

    // nodes
    nodeElements = nodeGroup.selectAll('circle')
        .data(nodes.filter((node) => {if(node.nodeType === "service"){return node;}}), function (node) { return node.id });

    nodeElements.exit().remove();

    let nodeEnter = nodeElements
        .enter()
        .append('circle')
        .attr('r', 10)
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', function(e, node){selectNode(node)})
        .on('mouseover', function(e, node){hoverNode(node)})
        .on('mouseout', function(e, node){stopHoverNode(node)})
        .on("contextmenu", function (e, node) {
            rightClick(e);
            clickedNode = node;
        });

    nodeElements = nodeEnter.merge(nodeElements);

    rectNodeElements = nodeGroup.selectAll('rect')
        .data(nodes.filter((node) => {if(node.nodeType === "processor"){return node;}}), function (node) { return node.id });

    rectNodeElements.exit().remove();

    let rectNodeEnter = rectNodeElements
        .enter()
        .append('rect')
        .attr('width', 17)
        .attr('height', 17)
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', function(e, node){selectNode(node)})
        .on('mouseover', function(e, node){hoverNode(node)})
        .on('mouseout', function(e, node){stopHoverNode(node)})
        .on("contextmenu", function (e, node) {
            rightClick(e);
            clickedNode = node;
        });

    rectNodeElements = rectNodeEnter.merge(rectNodeElements);

    starNodeElements = nodeGroup.selectAll('.star')
        .data(nodes.filter((node) => {if(node.nodeType === "handler"){return node;}}), function (node) { return node.id });

    starNodeElements.exit().remove();

    let starNodeEnter = starNodeElements
        .enter()
        .append("path")
        .attr( "class", "star" )
        .attr("d", d3.symbol().type(d3.symbolStar).size(50))
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', function(e, node){selectNode(node)})
        .on('mouseover', function(e, node){hoverNode(node)})
        .on('mouseout', function(e, node){stopHoverNode(node)})
        .on("contextmenu", function (e, node) {
            rightClick(e);
            clickedNode = node;
        });

    starNodeElements = starNodeEnter.merge(starNodeElements);

    ringNodeElements = nodeGroup.selectAll('.ring')
        .data(nodes.filter((node) => {if(node.nodeType === "storage"){return node;}}), function (node) { return node.id });

    ringNodeElements.exit().remove();

    let ringNodeEnter = ringNodeElements
        .enter()
        .append("path")
        .attr( "class", "ring" )
        .attr("transform", "translate(400,200)")
        .attr("d", d3.arc()
            .innerRadius( 100 )
            .outerRadius( 150 )
            .startAngle( 3.14 )     // It's in radian, so Pi = 3.14 = bottom.
            .endAngle( 6.28 )       // 2*Pi = 6.28 = top
        )
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', function(e, node){selectNode(node)})
        .on('mouseover', function(e, node){hoverNode(node)})
        .on('mouseout', function(e, node){stopHoverNode(node)})
        .on("contextmenu", function (e, node) {
            rightClick(e);
            clickedNode = node;
        });

    ringNodeElements = ringNodeEnter.merge(ringNodeElements);

    triangleNodeElements = nodeGroup.selectAll('.triangle')
        .data(nodes.filter((node) => {if(node.nodeType === "configuration"){return node;}}), function (node) { return node.id });

    triangleNodeElements.exit().remove();

    let triangleNodeEnter = triangleNodeElements
        .enter()
        .append("path")
        .attr( "class", "triangle" )
        .attr("d", d3.symbol().type(d3.symbolTriangle).size(200))
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', function(e, node){selectNode(node)})
        .on('mouseover', function(e, node){hoverNode(node)})
        .on('mouseout', function(e, node){stopHoverNode(node)})
        .on("contextmenu", function (e, node) {
            rightClick(e);
            clickedNode = node;
        });

    triangleNodeElements = triangleNodeEnter.merge(triangleNodeElements);

    yNodeElements = nodeGroup.selectAll('.y')
        .data(nodes.filter((node) => {if(node.nodeType === "interface"){return node;}}), function (node) { return node.id });

    yNodeElements.exit().remove();

    let yNodeEnter = yNodeElements
        .enter()
        .append("path")
        .attr( "class", "y" )
        .attr("d", d3.symbol().type(d3.symbolWye).size(200))
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', function(e, node){selectNode(node)})
        .on('mouseover', function(e, node){hoverNode(node)})
        .on('mouseout', function(e, node){stopHoverNode(node)})
        .on("contextmenu", function (e, node) {
            rightClick(e);
            clickedNode = node;
        });

    yNodeElements = yNodeEnter.merge(yNodeElements);

    // texts
    textElements = textGroup.selectAll('text')
        .data(nodes, function (node) { return node.id });

    textElements.exit().remove();

    let textEnter = textElements
        .enter()
        .append('text')
        .text(function (node) { return node.id })
        .attr('font-size', 15)
        .attr('dx', 15)
        .attr('dy', 4);

    textElements = textEnter.merge(textElements);
}

export function updateSimulation() {
    updateGraph();

    simulation.nodes(nodes).on('tick', () => {
        if(changeColor) {
            changeColor = false;
            nodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            rectNodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            starNodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            ringNodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            triangleNodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            yNodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            textElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            linkElements.attr('stroke', function (link) {
                return getLinkColor(link, hoveredNode, null, theme);
            });
        }
        if (changeLinkColor) {
            linkElements.attr('stroke', function(link){
                return getLinkColor(link, hoveredNode, hoveredLink, theme);
            });
        }
        nodeElements
            .attr('cx', function (node) { return node.x })
            .attr('cy', function (node) { return node.y })
        rectNodeElements
            .attr('x', function (node) { return node.x - 17 / 2 })
            .attr('y', function (node) { return node.y - 17 / 2})
        starNodeElements
            .attr("d", function(node) { return "m" + (node.x + 3) + " " + (node.y + 3) + "l 7 4 l -1 -8 l 6 -6 l -9 -1 l -3 -7 l -4 7 l -9 1 l 6 6 l -1 8 l 8 -4"})
        ringNodeElements
            .attr("d", d3.arc()
                .innerRadius( 7 )
                .outerRadius( 10 )
                .startAngle( 3.14 )     // It's in radian, so Pi = 3.14 = bottom.
                .endAngle( 2 * 6.28 )       // 2*Pi = 6.28 = top
            )
            .attr("transform", function(node){return "translate("+node.x+","+node.y+")"})
        triangleNodeElements
            .attr("transform", function(node){return "translate("+node.x+","+node.y+")"})
        yNodeElements
            .attr("transform", function(node){return "translate("+node.x+","+node.y+")"})
        textElements
            .attr('x', function (node) { return node.x })
            .attr('y', function (node) { return node.y });
        linkElements
            .attr('x1', function (link) { return link.source.x })
            .attr('y1', function (link) { return link.source.y })
            .attr('x2', function (link) { return link.target.x })
            .attr('y2', function (link) { return link.target.y })
            .attr( "d", (d) => "M" + d.source.x + "," + d.source.y + ", " + d.target.x + "," + d.target.y);
    });

    simulation.force('link').links(links);
    simulation.alphaTarget(0).restart();
}

// last but not least, we call updateSimulation
// to trigger the initial render
updateSimulation();
window.zoomIn=zoomIn;
window.zoomOut=zoomOut;
window.resetZoom=resetZoom;
window.center=center;
window.getNeighborsSelected = getNeighborsSelected;
window.deleteNode = deleteNode;
window.deleteLink = deleteLink;
window.closeBox = closeBox;
window.darkMode = darkMode;
window.lightMode = lightMode;
window.addNode = addNode;
window.addLink = addLink;
window.updateSlider = updateSlider;
window.exportGraph = exportGraph;
window.importGraph = importGraph;
window.closeNodeForm = closeNodeForm;
window.closeLinkForm = closeLinkForm;
window.download = download;
window.forceReset = forceReset;