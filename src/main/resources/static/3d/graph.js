// Import for lighting
import {UnrealBloomPass} from '//cdn.skypack.dev/three@0.136/examples/jsm/postprocessing/UnrealBloomPass.js';
import getNeighbors from "../utils/getNeighbors.js";
import { saveAs } from '../utils/file-saver.js';
import rightClick from "../utils/rightClick.js";
import {updateSimulation} from "../2d/graph.js";

// Data Abstraction
let allLinks = null;
let highlightNodes = new Set();
let highlightLinks = new Set();
let hoverNode = null;
let selectedNode = null;
let selectedLink = null;
let visibleNodes = [];
let initX = null;
let initY = null;
let initZ = null;
// HTML elements
const searchWrapper = document.querySelector(".search-box");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom_box");
const dependencies = document.querySelector(".dependencies");
const connections = document.querySelector(".connections");
const dependson = document.querySelector(".dependson");

// Make graph
const Graph = ForceGraph3D()
(document.getElementById('graph'))
    // Setup shapes
    .nodeThreeObject((node) =>
        new THREE.Mesh(
            [
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.ConeGeometry(5, 10),
                new THREE.CylinderGeometry(5, 5, 10),
                new THREE.DodecahedronGeometry(5),
                new THREE.SphereGeometry(5),
                new THREE.TorusGeometry(5, 1),
                new THREE.TorusKnotGeometry(5, 1)][node.group % 7],
            new THREE.MeshLambertMaterial({
                // Setup colors
                color: highlightNodes.has(node) ? node === hoverNode ? 'rgb(50,50,200)' : 'rgba(0,200,200)' : getColor(node),
                transparent: true,
                opacity: 0.75
            })
        ))
    .nodeThreeObjectExtend(false)
    // Get data
    .jsonUrl('../data/train_ticket_new.json')
    // JSON column for node names
    .nodeLabel('id')
    // Setup link width
    .linkWidth(link => highlightLinks.has(link) ? 4 : 1)
    // Setup data transfer visualization across links
    .linkDirectionalParticles(link => highlightLinks.has(link) ? 4 : 0)
    // Width of data transfer points
    .linkDirectionalParticleWidth(4)
    // Setup visibility for filtering of nodes
    .nodeVisibility((node) => customNodeVisibility(node))
    .linkVisibility((link) => customLinkVisibility(link))
    .linkDirectionalArrowLength(3.5)
    .linkDirectionalArrowRelPos(1)
    // Change where node is when clicking and dragging
    .onNodeDragEnd(node => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;

    })
    // Setup select on left click
    .onNodeClick(node => {
        nodeClick(node);
    })
    // Setup right click menu
    .onNodeRightClick((node, e) =>{
        // Set selected node
        selectedNode = node;
        rightClick(e)
    })
    // Setup hovering on nodes
    .onNodeHover(node => {
        // No state change
        if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;

        // Clear currently highlighted nodes
        highlightNodes.clear();
        highlightLinks.clear();

        // Add node and neighbors to highlighted nodes list
        if (node) {
            highlightNodes.add(node);
            getHighlightNeighbors(node);
        }

        // Set node to hoverNode
        hoverNode = node || null;

        // Update highlighted nodes on graph
        updateHighlight();
    })
    // Setup hovering on links
    .onLinkHover(link => {
        // Clear currently highlighted nodes
        highlightNodes.clear();
        highlightLinks.clear();

        // Add link and nodes on end to highlighted list
        if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
        }

        // Update highlighted nodes on graph
        updateHighlight();
    }).onLinkClick(link => {
        selectedLink = link;
        linkClick();
    });

// When user types something in search box
inputBox.onkeyup = (e)=>{
    // Get data
    let { nodes, links } = Graph.graphData();
    // Get rid of info box
    const cb = document.querySelector('#menuToggle');
    cb.checked = false;
    // Get text in searchbox
    let userData = e.target.value;
    let emptyArray = [];
    visibleNodes = []
    if(userData){
        emptyArray = nodes.filter((data)=>{
            if(data.id.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())){
                visibleNodes.push(data)
            }
            return data.id.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data)=>{
            return data = '<li>' + data.id + '</li>';
        });
        reset()
        searchWrapper.classList.add("active");
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for(let index = 0; index < allList.length; index++){
            allList[index].setAttribute("onclick", "select(this)")
        }
    }
    else{
        searchWrapper.classList.remove("active");
        visibleNodes = nodes
        reset()
        resetView()
    }
}

function getColor(node){
    let { nodes, links } = Graph.graphData();
    let numNeighbors = getNeighbors(node, links).length;

    if(numNeighbors > 8){
        return 'rgb(255,0,0)';
    }
    if(numNeighbors > 4){
        //node.color =
        return 'rgba(255,160,0)';
    }

    return 'rgba(0,255,0)';
}

function nodeClick(node){
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

    Graph.cameraPosition(
        newPos, // new position
        node, // lookAt ({ x, y, z })
        2000  // ms transition duration
    );
    // Hide all other nodes
    visibleNodes = []
    visibleNodes.push(node)
    // Update visible nodes
    reset()
    // Show info box
    const cb = document.querySelector('#menuToggle');
    cb.checked = true;
    // Set info box data
    document.getElementById("nodeName").innerHTML = node.id;

    let found = false;
    let found2 = false;
    let newLinks = [];
    let dependLinks = [];

    allLinks.forEach(link => {
        if (link.source === node) {
            found = true;
            newLinks.push(link);
        }
        if (link.target === node) {
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

function linkClick() {
    const distance = 200;
    const distRatio = 1 + distance/Math.hypot(selectedLink.x, selectedLink.y, selectedLink.z);

    const newPos = selectedLink.x || selectedLink.y || selectedLink.z
        ? { x: (selectedLink.source.x + selectedLink.target.x) / 2 * distRatio, y: (selectedLink.source.y + selectedLink.target.y) / 2 * distRatio, z: (selectedLink.source.z + selectedLink.target.z) / 2 * distRatio }
        : { x: 0, y: 0, z: distance }; // special case if link is in (0,0,0)

    Graph.cameraPosition(
        newPos, // new position
        selectedLink, // lookAt ({ x, y, z })
        2000  // ms transition duration
    );
    // Hide all other nodes
    visibleNodes = []
    visibleNodes.push(selectedLink.source);
    visibleNodes.push(selectedLink.target);
    // Update visible nodes
    reset()
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

function deleteNode() {
    let { nodes, links } = Graph.graphData();
    let nodesNew = [];
    if (window.confirm("Are you sure you want to delete this node and all its links?")) {
        nodes.forEach((node) => {
            if (node !== selectedNode) {
                nodesNew.push(node);
            }
        })
        visibleNodes = nodesNew;
        nodes = nodesNew;
        links.filter((data)=>{
           if(nodes.includes(data.source) && nodes.includes(data.target)) {
               return data;
           }
        });
        Graph.graphData({
            nodes: nodes,
            links: links
        });
        updateSimulation();
    }
}

function deleteLink() {
    let linksNew = [];
    if (window.confirm("Are you sure you want to delete this link?")) {
        allLinks.forEach((link) => {
            if (link !== selectedLink) {
                linksNew.push(link);
            }
        });
        allLinks = linksNew;
        updateSimulation();
    }
}

function select(element){
    let { nodes, links } = Graph.graphData();
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
    for(let i = 0; i < nodes.length; i++){
        if(nodes[i].id.startsWith(selectUserData)){
            nodeClick(nodes[i])
        }
    }
}

function recolor(){
    // Create bloom
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 3;
    bloomPass.radius = 1;
    bloomPass.threshold = 0.1;
    // Add bloom to graph
    Graph.postProcessingComposer().addPass(bloomPass);
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        let userValue = inputBox.value;
        listData = '<li>' + userValue + '</li>';
    }
    else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

function updateHighlight() {
    // Trigger update of highlighted objects in scene
    Graph
        .nodeThreeObjectExtend(false)
        .nodeColor(Graph.nodeColor())
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}

// Highlight neighbors
function getHighlightNeighbors(node){
    let { nodes, links } = Graph.graphData();
    highlightNodes = new Set(getNeighbors(node, links))
    links.forEach((link) => {
        if ((highlightNodes.has(link.source) && link.target === node) || (highlightNodes.has(link.target)) && link.source === node) {
            highlightLinks.add(link)
        }
    })
    updateHighlight();
}

// Refresh visible nodes
function reset(){
    Graph.nodeVisibility((node) => customNodeVisibility(node)).linkVisibility((link) => customLinkVisibility(link));
    Graph.refresh();
}

// Set camera back to default view
function resetView() {
    const coords = {x: initX, y: initY, z: initZ};
    Graph.cameraPosition(
        coords, // new position
        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
        2000  // ms transition duration
    );
}

function closeBox(){
    let { nodes, links } = Graph.graphData();
    visibleNodes = nodes;
    reset();
    resetView();
}

// Get neighbors of a selected node
function getNeighborsSelected(){
    let { nodes, links } = Graph.graphData();
    // Set neighbors
    visibleNodes = getNeighbors(selectedNode, links)
    // Refresh visible nodes
    reset();
}

// Node is visible if contained in visibleNodes
function customNodeVisibility(node) {
    if(visibleNodes.includes(node))
        return true;
    return false;
}

// Link is visible if nodes on either end are visible
function customLinkVisibility(link) {
    return customNodeVisibility(link.source) && customNodeVisibility(link.target);
}

// Run code after a certain delay in ms
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function exportGraph(){
    exportToJsonFile(Graph.graphData())
}

function replacer(key,value)
{
    if (key=="__threeObj") return undefined;
    else if (key=="__lineObj") return undefined;
    else if (key=="__arrowObj") return undefined;
    else if (key=="__curve") return undefined;
    else if (key=="index") return undefined;
    else if (key=="source") return value.id;
    else if (key=="target") return value.id;
    else return value;
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(Object.assign({}, jsonData, Graph.cameraPosition()), replacer);
    //let dataStr2 = JSON.stringify(Graph.cameraPosition());
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data-out.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

var a, downloads = 0;

function download(){
        cancelAnimationFrame(a);
        //Obviously, you should swap this out for a selector that gets only the 3D graph
        Graph.renderer().domElement.toBlob(function(blob){
            //Powered by [FileSaver](https://github.com/eligrey/FileSaver.js/)
            saveAs(blob, 'a.png');
        });
}

function importGraph(){
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            var parsedData = JSON.parse(content);
            Graph.graphData(parsedData)
            delay(150).then(() => {
                let {nodes, links} = Graph.graphData();
                allLinks = links;
                visibleNodes = nodes;
                reset();

                Graph.cameraPosition(
                    { x: parsedData.x, y: parsedData.y, z: parsedData.z }, // new position
                    {x: 0, y: 0, z:0 },//parsedData.lookAt, // lookAt ({ x, y, z })
                    0  // ms transition duration
                );
            })
        }
    }

    input.click();
    /*var request = new XMLHttpRequest();
    request.open("GET", "./import.json", false);
    request.send(null)
    var parsedData = JSON.parse(request.responseText);
    //Graph.jsonUrl('./import.json')
    Graph.graphData(parsedData)
    delay(150).then(() => {
        let {nodes, links} = Graph.graphData();
        allLinks = links;
        visibleNodes = nodes;
        reset();

        Graph.cameraPosition(
            { x: parsedData.x, y: parsedData.y, z: parsedData.z }, // new position
            {x: 0, y: 0, z:0 },//parsedData.lookAt, // lookAt ({ x, y, z })
            0  // ms transition duration
        );
    })*/
}

// Populate graph after 150ms (after async jsonURL runs)
delay(150).then(() => {
    let { nodes, links } = Graph.graphData();
    allLinks = links;
    visibleNodes = nodes;
    reset();

    let {x, y, z, lookAt} = Graph.cameraPosition();
    initX = x;
    initY = y;
    initZ = z;

    //importGraph();

    /* Export stuff:
    for(let j = 0; j < nodes.length; j++){
        let oldNode = {node: nodes[j], x: nodes[j].fx, y: nodes[j].fy, z: nodes[j].fz, x2: nodes[j].x, y2: nodes[j].y, z2: nodes[j].z};
        movedNodes.push(oldNode);
    }*/
});

// Make functions global (accessible from html)
window.recolor = recolor;
window.getNeighborsSelected = getNeighborsSelected;
window.select = select;
window.closeBox = closeBox;
window.requestAnimationFrame = requestAnimationFrame;
window.download = download;
window.importGraph = importGraph;
window.exportGraph = exportGraph;
window.deleteLink = deleteLink;
window.deleteNode = deleteNode;