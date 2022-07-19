import getLinkColor from '../utils/getLinkColor.js';
import getNodeColor from '../utils/getNodeColor.js';
import getNeighbors from '../utils/getNeighbors.js';
import rightClick from "../utils/rightClick.js";

import inputFile from '../data/train_ticket_new.json' assert { type: "json" };

const width = window.innerWidth;
const height = window.innerHeight;
const dependencies = document.querySelector(".dependencies");
const dependson = document.querySelector(".dependson");
const connections = document.querySelector(".connections");
const cb = document.querySelector("#menuToggle");
const cbl = document.querySelector("#linkMenuToggle");
const nodeForm = document.getElementById('addNode');
nodeForm.style.display = 'none';
const linkForm = document.getElementById('addLink');
linkForm.style.display = 'none'
const functionForm = document.getElementById('addFunction');
functionForm.style.display = 'none'
const coupling = document.querySelector("#rangeValue");

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
    .strength(function (link) { return link.strength });

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
    nodeForm.style.display = 'block';
    nodeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let newId = event.target.elements.name.value;
        console.log(newId);
        /*let node = {
            id: newId,
            group: 1
        }
        nodes.push(node);
        updateSimulation();
        */
        nodeForm.style.display = 'none';
    });
}

function closeNodeForm() {
    nodeForm.style.display = 'none';
}


function addLink() {

}

function addFunction() {

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

export function selectLink(selectedLink) {

    clickedLink = selectedLink;
    links = [selectedLink];
    nodes = [selectedLink.source, selectedLink.target];
    updateSimulation();
    // Show info box
    cbl.checked = true;
    // Set info box data
    document.getElementById("linkName").innerHTML = selectedLink.source.id + " => " + selectedLink.target.id;

    let newLinks = [];
    selectedLink.functions.forEach(l => {
        newLinks.push(l);
    });
    newLinks = newLinks.map((data) => {
        data = '<li> Function Name: ' + data.endpointName + '<br>Function Type: ' + data.functionType
            + '<br>Arguments: ' + data.arguments + '<br>Return: ' + data.returnData + '<br></li>';
        return data;
    });
    connections.innerHTML = newLinks.join('');
}

function selectLinksExplicit(){
    links = allLinks.filter(function (link) {
        return nodes.includes(link.source) && nodes.includes(link.target);
    });
}

function closeBox() {
    clickedNode = null;
    hoveredNode = null;
    center();
    resetData();
}

function closeLinkBox(){
    clickedNode = null;
    hoveredNode = null;
    resetData();
}

// this helper simple adds all nodes and links
// that are missing, to recreate the initial state
export function resetData() {
    nodes = allNodes;
    links = allLinks;
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
    if (key=="source") return value.id;
    else if (key=="target") return value.id;
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

function updateGraph() {
    // links
    linkElements = linkGroup.selectAll('path')
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
            selectLink(link);
        })
        .on('mouseover', function(e, link){hoverLink(link)})
        .on('mouseout', function(e, link){stopHoverLink(link)})

    linkElements = linkEnter.merge(linkElements);

    // nodes
    nodeElements = nodeGroup.selectAll('circle')
        .data(nodes, function (node) { return node.id });

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
        if(changeColor){
            changeColor = false;
            nodeElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            textElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, allLinks), clickedNode, hoveredNode, threshold);
            });
            linkElements.attr('stroke', function(link){
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
window.closeLinkBox = closeLinkBox;
window.darkMode = darkMode;
window.lightMode = lightMode;
window.addNode = addNode;
window.addLink = addLink;
window.addFunction = addFunction;
window.updateSlider = updateSlider;
window.exportGraph = exportGraph;
window.importGraph = importGraph;
window.closeNodeForm = closeNodeForm;