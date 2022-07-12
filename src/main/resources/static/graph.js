import getLinkColor from './utils/getLinkColor.js'
import getNodeColor from './utils/getNodeColor.js'
import getTextColor from './utils/getTextColor.js'
import getNeighbors from './utils/getNeighbors.js'
import resetNodeColor from "./utils/resetNodeColor.js";
import resetTextColor from "./utils/resetTextColor.js";
import resetLinkColor from "./utils/resetLinkColor.js";

import baseNodes from './data/nodes.js'
import baseLinks from './data/links.js'

const dependencies = document.querySelector(".dependencies");
const connections = document.querySelector(".connections");

let nodes = [...baseNodes]
let links = [...baseLinks]
let zoom = d3.zoom().on("zoom", zoomy)

var width = window.innerWidth
var height = window.innerHeight
let searchNodes = []
let searchLinks = []

var svg = d3.select('#graph').append("svg")
    .attr("width",  width)
    .attr("height",  height)
    .call(zoom)
    .append("g")

var linkElements,
    nodeElements,
    textElements

// we use svg groups to logically group the elements together
var linkGroup = svg.append('g').attr('class', 'links')
var nodeGroup = svg.append('g').attr('class', 'nodes')
var textGroup = svg.append('g').attr('class', 'texts')

// we use this reference to select/deselect
// after clicking the same element twice
var selectedId

// simulation setup with all forces
var linkForce = d3
    .forceLink()
    .id(function (link) { return link.id })
    .strength(function (link) { return link.strength })

var simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-240))
    .force('center', d3.forceCenter(width / 2, height / 2))

var dragDrop = d3.drag().on('start', function (event, node) {
    node.fx = node.x
    node.fy = node.y
}).on('drag', function (event, node) {
    simulation.alphaTarget(0.7).restart()
    node.fx = event.x
    node.fy = event.y
}).on('end', function (event, node) {
    if (!event.active) {
        simulation.alphaTarget(0)
    }
    node.fx = event.x
    node.fy = event.y
})

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function zoomy(event){
    svg.attr("transform", event.transform)
}

function zoomIn() {
    svg
        .transition()
        .call(zoom.scaleBy, 2);
}

function zoomOut() {
    svg
        .transition()
        .call(zoom.scaleBy, 0.5);
}

function resetZoom() {
    svg
        .transition()
        .call(zoom.scaleTo, 1);
}

function center() {
    svg
        .transition()
        .call(zoom.translateTo, 0.5 * width, 0.5 * height);
}

// select node is called on every click
// we either update the data according to the selection
// or reset the data if the same node is clicked twice
function selectNode(event, selectedNode) {
    if (selectedId === selectedNode.id) {
        selectedId = undefined
        resetData()
        updateSimulation()
    } else {
        selectNodeExplicit(selectedNode);
        getInfoBox(selectedNode);
    }
}

export default function selectNodeExplicit(selectedNode) {
        selectedId = selectedNode.id
        updateData(selectedNode)
        updateSimulation()
        var neighbors = getNeighbors(selectedNode, baseLinks)

        // we modify the styles to highlight selected nodes
        nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors, selectedNode) })
        textElements.attr('fill', function (node) { return getTextColor(node, neighbors, selectedNode) })
        linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
}

function getInfoBox(selectedNode) {
    // Show info box
    const cb = document.querySelector('#menuToggle');
    cb.checked = true;
    // Set info box data
    document.getElementById("nodeName").innerHTML = selectedNode.id;

    let found = false;
    let newLinks = [];

    links.forEach(link => {
        if (link.source === selectedNode) {
            found = true;
            newLinks.push(link);
        }
    });

    if (found) {
        newLinks = newLinks.map((data) => {
            data = '<li>' + data.target.id + '</li>';
            return data;
        });
        dependencies.innerHTML = newLinks.join('');
    } else {
        dependencies.innerHTML = "No Dependencies Found";
    }
}

export function selectNodesExplicit(selectedNode) {
    selectedId = selectedNode.id

    var val;
    for (let i = 0; i < searchNodes.length; i++){
        val = searchNodes.values().next().value
    }

    if (!(typeof val === undefined)) {
        searchNodes.push(selectedNode)
    }
    var diff = {
        removed: nodes.filter(function (node) { return searchNodes.indexOf(node) === -1 }),
        added: searchNodes.filter(function (node) { return nodes.indexOf(node) === -1 })
    }

    diff.removed.forEach(function (node) { nodes.splice(nodes.indexOf(node), 1) })
    diff.added.forEach(function (node) { nodes.push(node) })
}

export function selectLinksExplicit(){
    var newLinks = baseLinks.filter(function (link) {
        return (searchNodes.includes(link.source) && searchNodes.includes(link.target)) || searchNodes.length === 0
    })
    links = newLinks
    updateSimulation()
}

export function resetNodeExplicit() {
    nodeElements.attr('fill', 'gray')
    textElements.attr('fill', 'black')
    linkElements.attr('stroke', '#E5E5E5')
    resetData()
    updateSimulation()
}

// this helper simple adds all nodes and links
// that are missing, to recreate the initial state
function resetData() {
    var nodeIds = nodes.map(function (node) { return node.id })
    var neighbors = {}

    baseNodes.forEach(function (node) {
        if (nodeIds.indexOf(node.id) === -1) {
            nodes.push(node)
        }
        nodeElements.attr('fill', function (node) { return resetNodeColor(node) })
        textElements.attr('fill', function (node) { return resetTextColor(node) })
        linkElements.attr('stroke', function (link) { return resetLinkColor(node) })
    })

    links = baseLinks
    for(let i = 0; i < searchNodes.length; i++)
    {
        searchNodes.pop();
    }
}



// diffing and mutating the data
function updateData(selectedNode) {
    var neighbors = getNeighbors(selectedNode, baseLinks)
    var newNodes = baseNodes.filter(function (node) {
        return neighbors.indexOf(node) > -1 || node.level === 1
    })

    var diff = {
        removed: nodes.filter(function (node) { return newNodes.indexOf(node) === -1 }),
        added: newNodes.filter(function (node) { return nodes.indexOf(node) === -1 })
    }

    diff.removed.forEach(function (node) { nodes.splice(nodes.indexOf(node), 1) })
    diff.added.forEach(function (node) { nodes.push(node) })

    links = baseLinks.filter(function (link) {
        return link.target.id === selectedNode.id || link.source.id === selectedNode.id
    })
}

function updateGraph() {
    // links
    linkElements = linkGroup.selectAll('line')
        .data(links, function (link) {
            return link.target.id + link.source.id
        })

    linkElements.exit().remove()

    var linkEnter = linkElements
        .enter().append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'rgba(50, 50, 50, 0.2)')

    linkElements = linkEnter.merge(linkElements)

    // nodes
    nodeElements = nodeGroup.selectAll('circle')
        .data(nodes, function (node) { return node.id })

    nodeElements.exit().remove()

    var nodeEnter = nodeElements
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', function (node) { return node.level === 1 ? 'red' : 'gray' })
        .call(dragDrop)
        // we link the selectNode method here
        // to update the graph on every click
        .on('click', selectNode)
        .on("mouseover", function(event, d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(d.id + "<br/>"  + d.label)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

    nodeElements = nodeEnter.merge(nodeElements)

    // texts
    textElements = textGroup.selectAll('text')
        .data(nodes, function (node) { return node.id })

    textElements.exit().remove()

    var textEnter = textElements
        .enter()
        .append('text')
        .text(function (node) { return node.label })
        .attr('font-size', 15)
        .attr('dx', 15)
        .attr('dy', 4)

    textElements = textEnter.merge(textElements)
}

function updateSimulation() {
    updateGraph()

    simulation.nodes(nodes).on('tick', () => {
        nodeElements
            .attr('cx', function (node) { return node.x })
            .attr('cy', function (node) { return node.y })
        textElements
            .attr('x', function (node) { return node.x })
            .attr('y', function (node) { return node.y })
        linkElements
            .attr('x1', function (link) { return link.source.x })
            .attr('y1', function (link) { return link.source.y })
            .attr('x2', function (link) { return link.target.x })
            .attr('y2', function (link) { return link.target.y })
    })

    simulation.force('link').links(links)
    simulation.alphaTarget(0.7).restart()
}
// last but not least, we call updateSimulation
// to trigger the initial render
//initZoom();
updateSimulation()
window.zoomIn=zoomIn
window.zoomOut=zoomOut
window.resetZoom=resetZoom
window.center=center