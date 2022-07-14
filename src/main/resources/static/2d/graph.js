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

let nodes = [...inputFile.nodes];
let links = [...inputFile.links];
let changeColor = true;
let clickedNode = null;
let hoveredNode = null;
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
    .attr('refX', 30)//so that it comes towards the center.
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

// select node is called on every click
// we either update the data according to the selection
// or reset the data if the same node is clicked twice
export function selectNode(selectedNode) {
    if (clickedNode === selectedNode) {
        clickedNode = null;
        changeColor = true;
        resetData();
        const cb = document.querySelector('#menuToggle');
        cb.checked = false;
    } else {
        clickedNode = selectedNode;
        nodes = [selectedNode];
        links = [];
        changeColor = true;
        updateSimulation();
        getInfoBox(selectedNode);
    }
}

function getNeighborsSelected(){
    nodes = getNeighbors(clickedNode, inputFile.links);
    links = inputFile.links.filter(function (link) {
        return link.target.id === clickedNode.id || link.source.id === clickedNode.id;
    });
    changeColor = true;
    updateSimulation();
}

function getInfoBox(selectedNode) {
    // Show info box
    const cb = document.querySelector('#menuToggle');
    cb.checked = true;
    // Set info box data
    document.getElementById("nodeName").innerHTML = selectedNode.id;

    let found = false;
    let found2 = false;
    let newLinks = [];
    let dependLinks = [];

    inputFile.links.forEach(link => {
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
    // Show info box
    const cb = document.querySelector('#linkMenuToggle');
    cb.checked = true;
    // Set info box data
    document.getElementById("linkName").innerHTML = selectedLink.source.id + " => " + selectedLink.target.id;

    let newLinks = [];
    selectedLink.functions.forEach(l => {
        newLinks.push(l);
    });
    newLinks = newLinks.map((data) => {
        data = '<li> Function Name: ' + data.endpointName + '<br>Function Type: ' + data.functionType
            + '<br>Arguments: ' + data.arguments + '<br>Return: ' + data.returnData + '</li>';
        return data;
    });
    connections.innerHTML = newLinks.join('');
}

function selectLinksExplicit(){
    links = inputFile.links.filter(function (link) {
        return nodes.includes(link.source) && nodes.includes(link.target);
    });
}

// this helper simple adds all nodes and links
// that are missing, to recreate the initial state
export function resetData() {
    nodes = inputFile.nodes;
    links = inputFile.links;
    changeColor = true;
    updateSimulation();
}

function hoverNode(selectedNode){
    hoveredNode = selectedNode;
    changeColor = true;
    updateSimulation();
}

function stopHoverNode(selectedNode){
    hoveredNode = null;
    changeColor = true;
    updateSimulation();
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
        .attr('stroke-width', 1)
        .attr('stroke', 'rgba(50, 50, 50, 0.2)')
        .attr('marker-end', (d) => "url(#arrow)")//attach the arrow from defs
        .on('click', function (link) { selectLink(link) });

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
                return getNodeColor(node, getNeighbors(node, inputFile.links), clickedNode, hoveredNode);
            });
            textElements.attr('fill', function (node) {
                return getNodeColor(node, getNeighbors(node, inputFile.links), clickedNode, hoveredNode);
            });
            linkElements.attr('stroke', function(link){
                return getLinkColor(link, hoveredNode);
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
    simulation.alphaTarget(0.7).restart();
}
// last but not least, we call updateSimulation
// to trigger the initial render
updateSimulation();
window.zoomIn=zoomIn;
window.zoomOut=zoomOut;
window.resetZoom=resetZoom;
window.center=center;
window.getNeighborsSelected = getNeighborsSelected;