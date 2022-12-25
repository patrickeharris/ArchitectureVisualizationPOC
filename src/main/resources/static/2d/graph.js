// Import functions from utils file
import getLinkColor from '../utils/getLinkColor.js';
import getNodeColor from '../utils/getNodeColor.js';
import getNeighbors from '../utils/getNeighbors.js';
import rightClick from "../utils/rightClick.js";
import rightClickLink from "../utils/rightClickLink.js";
import inputFile from '../data/train_ticket_new.json' assert {type: 'json'};
import {saveAs} from "../utils/file-saver.js";

// HTML elements
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
const trackMenu = document.querySelector("#trackMenu");
const connections = document.querySelector(".connections");

// Data Abstraction
export let nodes = [...inputFile.nodes];
let links = [...inputFile.links];
let allLinks = [...inputFile.links];
let allNodes = [...inputFile.nodes];
let changeColor = true;
let removing = false;
let changeLinkColor = true;
let clickedNode = null;
let clickedLink = null;
let hoveredNode = null;
let hoveredLink = null;
let defNodeColor = false;
let i = 0;
let testNodes = [];
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
    .id(function (link) { return link.nodeName })
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

// Zoom controller
function zoomController(event) {
    g.attr("transform", event.transform);
}

// Zoom in
function zoomIn() {
    svg.transition().call(zoom.scaleBy, 2);
}

// Zoom out
function zoomOut() {
    svg.transition().call(zoom.scaleBy, 0.5);
}

// Reset zoom
function resetZoom() {
    svg.transition().call(zoom.scaleTo, 1);
}

// Center camera
function center() {
    svg.transition().call(zoom.translateTo, 0.5 * width, 0.5 * height);
}

// Add node button
function addNode() {

    // If node form is submitted, this happens
    nodeForm.addEventListener('submit', (event) => {

        event.preventDefault();

        // Extract name of node
        let newName = event.target.elements.name.value;
        let found = false;

        // Check to see if node already exists
        allNodes.forEach(node => {
            if (node.nodeName === newName) {
                found = true;
            }
        })

        // If found, user is warned. If not, adding node continues
        if (found) {
            window.alert("That node already exists! Try again.");
        } else {

            // Extract all info from add node form
            let newType = event.target.elements.node_type.value;
            let newDeps = event.target.elements.dependencies.value;
            let deps = newDeps.split(',');

            // Create node with extracted info
            let node = {
                nodeName: newName,
                nodeType: newType,
                dependencies: deps,
            }
            allNodes.push(node);
            nodes = allNodes;

            // Create links based on dependencies
            deps.forEach(d => {
                nodes.forEach(n => {
                    if (n.nodeName.toString() === d) {
                        let link = {
                            source: newName,
                            target: n.nodeName
                        }
                        allLinks.push(link);
                    }
                })
            })
            links = allLinks;

            // Update simulation
            changeColor = true;
            updateSimulation();
            closeNodeForm();
        }
    });

    // Display add node form
    nodeForm.style.display = 'block';
}


// Close add node form
function closeNodeForm() {
    nodeForm.style.display = 'none';
}

// Close add link form
function closeLinkForm() {
    linkForm.style.display = 'none';
}

// Add link button
function addLink() {

    // If link form is submitted, this happens
    linkForm.addEventListener('submit', (event) => {

        event.preventDefault();

        // Extract name of target from add link form
        let newTarget = event.target.elements.target.value;
        let foundNode = false;
        let linkNode;

        // Check to make sure target exists
        allNodes.forEach(node => {
            if (node.nodeName === newTarget) {
                foundNode = true;
                linkNode = node;
            }
        })

        // If target does not exists, warn user. If it does, continue adding link
        if (!foundNode) {
            window.alert("The target you selected is not currently a node in this graph. Try again.");
        } else {

            // Check to make sure link doesn't already exist
            let found = false;
            allLinks.forEach(link => {
                if (link.source === clickedNode.nodeName && link.target === newTarget) {
                    found = true;
                }
            })

            // If link is found, warn user. If not, continue adding link
            if (found) {
                window.alert("That link already exists! Try again.");
            } else {

                // Create link with extracted info
                let link = {
                    source: clickedNode,
                    target: linkNode
                }
                allLinks.push(link);
                links = allLinks;

                // Update simulation
                clickedNode = null;
                changeColor = true;
                updateSimulation();
                closeLinkForm();
                resetZoom();
            }
        }
    })

    // Display add link form
    linkForm.style.display = 'block';
}

// Event if node is clicked on
export function selectNode(selectedNode) {
    clickedNode = selectedNode;
    if(!removing) {
        selectedNode.fx = selectedNode.x;
        selectedNode.fy = selectedNode.y;

        // Only display node that is clicked on
        clickedNode = selectedNode;
        nodes = [selectedNode];
        links = [];

        // Update simulation
        changeColor = true;
        updateSimulation();

        // Display info box
        getInfoBox(selectedNode);

        // Zoom in on selected node
        svg.transition().call(zoom.translateTo, selectedNode.x, selectedNode.y);
    }
    else{
        removing = false;
    }
}

// Get neighbors of selected node
function getNeighborsSelected() {

    // Only display selected node and its neighbors
    nodes = getNeighbors(clickedNode, allLinks);
    links = allLinks.filter(function (link) {
        return link.target === clickedNode.nodeName || link.source === clickedNode.nodeName;
    });

    // Update simulation
    changeColor = true;
    updateSimulation();
}

// Delete node button
function deleteNode(){

    // Data abstraction
    let visibleNodes = [];
    let visibleLinks = [];

    // Confirm user wants to delete node and its links
    if (window.confirm("Are you sure you want to delete this node and all its links?")) {

        // Update nodes and links to not include selected node and its links
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

        // Update simulation
        links = visibleLinks;
        nodes = visibleNodes;
        updateSimulation();
    }
}


// Delete link button
function deleteLink() {

    // Data abstraction
    let linksNew = [];

    // Confirm user wants to delete link
    if (window.confirm("Are you sure you want to delete this link?")) {

        // Update links to not include selected link
        allLinks.forEach((link) => {
            if (link !== clickedLink) {
                linksNew.push(link);
            }
        });

        // Update simulation
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

// Display node info box
function getInfoBox(selectedNode) {

    // Show info box
    cb.checked = true;

    // Set info box data
    document.getElementById("nodeName").innerHTML = selectedNode.nodeName;
    document.getElementById("nodeType").innerHTML = "<b>Node Type: </b>" + selectedNode.nodeType;

    let found = false;
    let found2 = false;
    let newLinks = [];
    let dependLinks = [];

    // Find dependencies to display
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

    // Display dependencies if found
    if (found) {
        newLinks = newLinks.map((data) => {
            let link = '<li> <button class="accordion">' + data.target.nodeName + '</button> <div class="panel" Endpoints: <br> <ul>';
            let funcs = data.requests.map((func) => {
                func = '<li style="margin-left: 20px">' + func.type + '<br>' + func.msReturn + '<br>' + func.endpointFunction + '(' + '<br>' + func.argument + ') </li>';
                return func;
            })
            return link + funcs.join('') + '</ul></div> </li>';
        });
        dependencies.innerHTML = newLinks.join('');
    } else {
        dependencies.innerHTML = '<li>N/A</li>';
    }

    // Display depends on if found.
    if (found2) {
        dependLinks = dependLinks.map((data) => {
            let link = '<li> <button class="accordion">' + data.source.nodeName + '</button> <div class="panel" Endpoints: <br> <ul>';
            let funcs = data.requests.map((func) => {
                func = '<li style="margin-left: 20px">' + func.type + '<br>' + func.msReturn + '<br>' + func.endpointFunction + '(' + '<br>' + func.argument + ') </li>';
                return func;
            })
            return link + funcs.join('') + '</ul></div> </li>';
        });
        dependson.innerHTML = dependLinks.join('');
    } else {
        dependson.innerHTML = '<li>N/A</li>';
    }
    var acc = document.getElementsByClassName("accordion");
    var i;
    for(i = 0; i < acc.length; i++){
        acc[i].addEventListener("click", function(){
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if(panel.style.maxHeight){
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        })
    }
}

export function selectSearchNodes(selectedNodes) {
    //nodes = selectedNodes;
    //selectLinksExplicit();
    testNodes = selectedNodes;
    changeColor = true;
    updateSimulation();
}

function selectLinksExplicit() {
    links = allLinks.filter(function (link) {
        return nodes.includes(link.source) && nodes.includes(link.target);
    });
}

// Close info box
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

// Hover over node
function hoverNode(selectedNode) {
    hoveredNode = selectedNode;
    changeColor = true;
    updateSimulation();
}

/*
// Hover over link
function hoverLink(selectedLink) {
    hoveredLink = selectedLink
    changeLinkColor = true;
    updateSimulation();
}

 */

// Stop hovering over node
function stopHoverNode(selectedNode) {
    hoveredNode = null;
    changeColor = true;
    updateSimulation();
}

/*
// Stop hovering over link
function stopHoverLink(selectedLink) {
    hoveredLink = null;
    changeLinkColor = true;
    updateSimulation();
}

 */

// Set dark mode
function darkMode() {
    document.body.style.backgroundColor = "black";
    theme = 1;
    d3.selectAll("marker").style("fill", "rgba(255,255,255,1)")
    changeLinkColor = true;
    updateSimulation();
}

// Set light mode
function lightMode() {
    document.body.style.backgroundColor = "white";
    theme = 0;
    d3.selectAll("marker").style("fill", "rgba(0,0,0,1)")
    changeLinkColor = true;
    updateSimulation();
}

function updateSlider(newVal) {
    coupling.innerText = newVal;
    threshold = parseInt(newVal);
    changeColor = true;
    updateSimulation();
}

function replacer(key,value) {
    if (key==="source") return value.nodeName;
    else if (key==="target") return value.nodeName;
    else return value;
}

function exportGraph() {
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

function importGraph() {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        let file = e.target.files[0];

        // setting up the reader
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            let content = readerEvent.target.result; // this is the content!
            let parsedData = JSON.parse(content);
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


function download() {
    let svgString = getSVGString(svg.node());
    svgString2Image( svgString, 2*width, 2*height, 'png', save );

    function save(dataBlob, filesize) {
        saveAs(dataBlob, 'screenshot.png'); // FileSaver.js function
    }
}

function getSVGString(svgNode) {

    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    let cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    let serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
        let i;
        let c;
        let selectorTextArr = [];

        // Add Parent element Id and Classes to the list
        selectorTextArr.push( '#'+parentElement.id );
        for (c = 0; c < parentElement.classList.length; c++)
            if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                selectorTextArr.push( '.'+parentElement.classList[c] );

        // Add Children element Ids and Classes to the list
        let nodes = parentElement.getElementsByTagName("*");
        for (i = 0; i < nodes.length; i++) {
            let id = nodes[i].nodeName;
            if ( !contains('#'+id, selectorTextArr) )
                selectorTextArr.push( '#'+id );

            let classes = nodes[i].classList;
            for (c = 0; c < classes.length; c++)
                if ( !contains('.'+classes[c], selectorTextArr) )
                    selectorTextArr.push( '.'+classes[c] );
        }

        // Extract CSS Rules
        let extractedCSSText = "";
        for (i = 0; i < document.styleSheets.length; i++) {
            let s = document.styleSheets[i];

            try {
                if (!s.cssRules) continue;
            } catch( e ) {
                if (e.name !== 'SecurityError') throw e; // for Firefox
                continue;
            }

            let cssRules = s.cssRules;
            for (let r = 0; r < cssRules.length; r++) {
                if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                    extractedCSSText += cssRules[r].cssText;
            }
        }

        return extractedCSSText;

        function contains(str,arr) {
            return arr.indexOf(str) !== -1;
        }
    }

    function appendCSS(cssText, element) {
        let styleElement = document.createElement("style");
        styleElement.setAttribute("type","text/css");
        styleElement.innerHTML = cssText;
        let refNode = element.hasChildNodes() ? element.children[0] : null;
        element.insertBefore( styleElement, refNode );
    }
}


function svgString2Image( svgString, width, height, format, callback ) {
    var format = format ? format : 'png';

    let imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    let image = new Image();
    image.onload = function() {
        context.fillStyle='white';
        if (theme === 0) {
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (theme === 1) {
            context.clearRect(0, 0, width, height);
        }
        context.drawImage(image, 0, 0, width, height);

        canvas.toBlob( function(blob) {
            let filesize = Math.round(blob.length / 1024) + ' KB';
            if ( callback ) callback( blob, filesize );
        });
    };

    image.src = imgsrc;
}

// Force reset graph
function forceReset() {
    searchWrapper.classList.remove("active");
    cb.checked = false;
    resetData();
    resetZoom();
    center();
}

function resetHoveredNode(){
    //clickedNode = null;
    hoveredNode = null;
    changeColor = true;
    updateSimulation();
}

function track() {
    trackMenu.checked = true;
    if(!connections.innerHTML.includes(clickedNode.nodeName)) {
        connections.innerHTML = connections.innerHTML + "<li for=\"trackMenu\" class=\"md-button-2\"  onclick=\"selectTrack(this.textContent)\">" + clickedNode.nodeName + "<i class=\"fas fa-trash\" onclick=\"removeTrack(this.parentElement.textContent)\"></i></li>";
    }
}

function selectTrack(selectUserData){
    let emptyArray = nodes.filter((data)=>{
        return data.nodeName.startsWith(selectUserData);
    });
    selectNode(emptyArray.values().next().value);
}

function toggleTrack(){
    if(trackMenu.checked){
        trackMenu.checked = false;
    }
    else{
        trackMenu.checked = true;
    }
}

function removeTrack(node) {
    removing = true;
    let firstHalf = connections.innerHTML.substring(0, connections.innerHTML.indexOf(node) - 64);
    let secondHalf = connections.innerHTML.substring(connections.innerHTML.indexOf(node) + node.length + 109, connections.innerHTML.length);
    connections.innerHTML = firstHalf + secondHalf;
}

function setOpacity(node) {
    if (testNodes.includes(node) || testNodes.length === 0) {
        return 1;
    } else {
        return 0.2;
    }
}

function setLinkOpacity(link) {
    if (testNodes.includes(link.source) || testNodes.includes(link.target) || testNodes.length === 0) {
        return 1;
    } else {
        return 0.2;
    }
}

function setLinkWidth(link) {
    return link.requests.length * 3;
}

function updateGraph() {

    // links
    linkElements = linkGroup.selectAll('.link')
        .data(links, function (link) {
            return link.target + link.source
        });

    linkElements.exit().remove();

    let linkEnter = linkElements
        .enter().append( "path" )//append path
        .attr( "class", "link" )
        .attr('stroke-width', function(link) {
            return setLinkWidth(link);
        })
        .attr('stroke', 'rgba(50, 50, 50, 0.2)')
        .attr('marker-end', (d) => "url(#arrow)")//attach the arrow from defs
        .style("fill", "transparent")
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

    linkElements.transition()
        .duration(500)
        .style('opacity', function(link) {
            return setLinkOpacity(link);
        })

    // nodes
    nodeElements = nodeGroup.selectAll('circle')
        .data(nodes.filter((node) => {if(node.nodeType === "service"){return node;}}), function (node) { return node.nodeName });

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
            clickedNode = node;
            rightClick(e);
        });

    nodeElements = nodeEnter.merge(nodeElements);

    nodeElements.transition()
        .duration(500)
        .style('opacity', function(node) {
            return setOpacity(node);
        })

    // rectangle nodes
    rectNodeElements = nodeGroup.selectAll('rect')
        .data(nodes.filter((node) => {if(node.nodeType === "kafka" || node.nodeType === "proxy" || node.nodeType === "writer" || node.nodeType === "pipeline"){return node;}}), function (node) { return node.nodeName });

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

    // star nodes
    starNodeElements = nodeGroup.selectAll('.star')
        .data(nodes.filter((node) => {if(node.nodeType === "customer" || node.nodeType === "srcSink"){return node;}}), function (node) { return node.nodeName });

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

    // ring nodes
    ringNodeElements = nodeGroup.selectAll('.ring')
        .data(nodes.filter((node) => {if(node.nodeType === "archive" || node.nodeType === "bucket" || node.nodeType === "database"){return node;}}), function (node) { return node.nodeName });

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

    // triangle nodes
    triangleNodeElements = nodeGroup.selectAll('.triangle')
        .data(nodes.filter((node) => {if(node.nodeType === "config"){return node;}}), function (node) { return node.nodeName });

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

    // y nodes
    yNodeElements = nodeGroup.selectAll('.y')
        .data(nodes.filter((node) => {if(node.nodeType === "API"){return node;}}), function (node) { return node.nodeName });

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
        .data(nodes, function (node) { return node.nodeName });

    textElements.exit().remove();

    let textEnter = textElements
        .enter()
        .append('text')
        .text(function (node) { return node.nodeName })
        .attr('font-size', 15)
        .attr('dx', 15)
        .attr('dy', 4);

    textElements = textEnter.merge(textElements);
    textElements.transition()
        .duration(500)
        .style('opacity', function(node) {
            return setOpacity(node);
        })
}

function getColor(node) {

    let neighbors = getNeighbors(node, allLinks);

    if (node === clickedNode || node === hoveredNode) {
        return 'blue';
    }

    /*
    if (neighbors.indexOf(hoveredNode) > -1) {
        return 'deepskyblue';
    }
     */

    if (!defNodeColor) {
        allNodes.map((n) => {
            n.color = "-1";
        })
        defNodeColor = true;
    }

    if (node.color === "-1") {

        const colors = ["rgb(255, 153, 204)", "rgb(255, 167, 0)", "rgb(245, 239, 71)",
            "rgb(51, 153, 255)", "rgb(204, 51, 255)", "rgb(153, 0, 51)"];

        node.color = colors[0];

        neighbors.map((neighbor) => {
            if (neighbor.color !== null) {
                if (neighbor.color === node.color) {

                    if (i === 5) {
                        i = 0;
                    } else {
                        i++;
                    }
                    node.color = colors[i];
                }
            }
        })
    }

    return node.color;
}

export function updateSimulation() {
    updateGraph();

    // Set color of nodes and links
    simulation.nodes(nodes).on('tick', () => {
        if(changeColor) {
            changeColor = false;
            nodeElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            rectNodeElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            starNodeElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            ringNodeElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            triangleNodeElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            yNodeElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            textElements.attr('fill', function (node) {
                return getColor(node);
                //return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, defNodeColor);
            });
            linkElements.attr('stroke', function (link) {
                return getLinkColor(link, hoveredNode, hoveredLink, theme);
            });
        }
        /*if (changeLinkColor) {
            linkElements.attr('stroke', function(link){
                return getLinkColor(link, hoveredNode, hoveredLink, theme);
            });
        }

         */
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
            .attr("d", function(d) {
                let test = false;
                allLinks.forEach(function (link) {
                    if(link.target === d.source && link.source === d.target){
                        test = true;
                    }
                });
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                if(test){
                    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                }
                else{
                    return  "M" + d.source.x + "," + d.source.y + ", " + d.target.x + "," + d.target.y;
                }
            });
    });

    simulation.force('link').links(links);
    simulation.alphaTarget(0).restart();
}

// Call update simulation to trigger initial render
updateSimulation();

// Global functions (accessible by HTML)
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
window.track = track;
window.removeTrack = removeTrack;
window.toggleTrack = toggleTrack;
window.selectTrack = selectTrack;
window.resetHoveredNode = resetHoveredNode;