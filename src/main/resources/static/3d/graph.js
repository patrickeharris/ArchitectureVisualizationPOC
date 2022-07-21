// Import for lighting
//import {UnrealBloomPass} from '../libraries/UnrealBloomPassFixed.ts';
import {UnrealBloomPass} from '//cdn.skypack.dev/three@0.136/examples/jsm/postprocessing/UnrealBloomPass.js';
import getNeighbors from "../utils/getNeighbors.js";
import { saveAs } from '../utils/file-saver.js';
import rightClick from "../utils/rightClick.js";
import {CustomSinCurve} from "../utils/CustomSinCurve.js";
import {nodes, updateSimulation} from "../2d/graph.js";
import rightClickLink from "../utils/rightClickLink.js"
//import {updateSimulation} from "../2d/graph.js";

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
let defLinkColor = null;
let threshold = 8;
let highlighted = false;
let removing = false;
let bloomPass = new UnrealBloomPass();
var a, downloads = 0;
// HTML elements
const searchWrapper = document.querySelector(".search-box");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom_box");
const dependencies = document.querySelector(".dependencies");
const dependson = document.querySelector(".dependson");
const trackMenu = document.querySelector("#trackMenu");
const coupling = document.querySelector("#rangeValue");
const connections = document.querySelector(".connections");
const nodeForm = document.getElementById('addNode');
const cb = document.querySelector('#menuToggle');
nodeForm.style.display = 'none';
const linkForm = document.getElementById('addLink');
linkForm.style.display = 'none';

// Make graph
const Graph = ForceGraph3D()
(document.getElementById('graph'))
    // Setup shapes
    .nodeThreeObject((node) =>
        new THREE.Mesh(
            [
                new THREE.SphereGeometry(5),
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.ConeGeometry(5, 10),
                new THREE.CylinderGeometry(5, 5, 10),
                new THREE.TubeGeometry( new CustomSinCurve( 10 ), 5, 2, 8, false ),
                new THREE.OctahedronGeometry(5)][getShape(node.nodeType)],
            new THREE.MeshLambertMaterial({
                // Setup colors
                color: highlightNodes.has(node) ? node === hoverNode ? 'rgb(50,50,200)' : 'rgba(0,200,200)' : getColor(node),
                transparent: true,
                opacity: 0.75
            })
        ))
    .nodeThreeObjectExtend(false)
    // Get data
    .jsonUrl('../data/pipeline.json')
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
    }).onLinkRightClick((link, e) => {
        rightClickLink(e);
        selectedLink = link;
    })

// When user types something in search box
inputBox.onkeyup = (e)=>{
    // Get data
    let { nodes, links } = Graph.graphData();
    // Get rid of info box
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
        visibleNodes = nodes;
        reset();
        resetView();
    }
}

function getShape(type){
    if(type === "service"){
        return 0;
    }
    else if(type === "processor"){
        return 1;
    }
    else if(type === "handler"){
        return 2;
    }
    else if(type === "storage"){
        return 3;
    }
    else if(type === "interface"){
        return 4;
    }
    else if(type === "configuration"){
        return 5;
    }
    else{
        return 0;
    }
}

function updateSlider(newVal){
    coupling.innerText = newVal;
    threshold = parseInt(newVal);
    updateHighlight();
}

function getColor(node){
    let { nodes, links } = Graph.graphData();
    let numNeighbors = getNeighbors(node, links).length;

    if(numNeighbors > threshold){
        return 'rgb(255,0,0)';
    }
    if(numNeighbors > threshold/2){
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
    document.getElementById("nodeType").innerHTML = "<b>Node Type: </b>" + node.nodeType;
    document.getElementById("nodeID").innerHTML = "<b>Node ID: </b>" + node.nodeID;

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

function addNode() {
    nodeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let {nodes, links} = Graph.graphData();
        let newName = event.target.elements.name.value;
        let found = false;

        nodes.forEach(node => {
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
            nodes.push(node);

            deps.forEach(d => {
                nodes.forEach(n => {
                    if (n.nodeID.toString() === d) {
                        let link = {
                            source: newName,
                            target: n.id
                        }
                        links.push(link);
                    }
                })
            })

            Graph.graphData({
                nodes: nodes,
                links: links
            })

            updateSimulation();
            closeNodeForm();
        }
    });
    nodeForm.style.display = 'block';
}

function closeNodeForm() {
    nodeForm.style.display = 'none';
}

function addLink() {
    linkForm.addEventListener('submit', (event) => {

        event.preventDefault();
        let {nodes, links} = Graph.graphData();
        let newTarget = event.target.elements.target.value;
        let foundNode = false;

        nodes.forEach(node => {
            if (node.id === newTarget) {
                foundNode = true;
            }
        })

        if (!foundNode) {
            window.alert("The target you selected is not currently a node in this graph. Try again.");
        } else {
            let found = false;
            links.forEach(link => {
                if (link.source.id === selectedNode.id && link.target.id === newTarget) {
                    found = true;
                }
            })

            if (found) {
                window.alert("That link already exists! Try again.");
            } else {
                let link = {
                    source: selectedNode,
                    target: newTarget
                }
                links.push(link);
                Graph.graphData({
                    nodes: nodes,
                    links: links
                })
                selectedNode = null;
                //updateSimulation();
                closeLinkForm();
                resetZoom();
            }
        }
    })
    linkForm.style.display = 'block';
}

function closeLinkForm() {
    linkForm.style.display = 'none';
}

function deleteNode() {
    let { nodes, links } = Graph.graphData();
    let nodesNew = [];
    let newLinks = [];
    if (window.confirm("Are you sure you want to delete this node and all its links?")) {
        nodes.forEach((node) => {
            if (node !== selectedNode) {
                nodesNew.push(node);
            }
        })
        links.forEach((link) => {
            if (link.source !== selectedNode && link.target !== selectedNode) {
                newLinks.push(link);
            }
        })

        Graph.graphData({
            nodes: nodesNew,
            links: newLinks
        });
        //updateSimulation();
    }
}

function deleteLink() {
    let {nodes, links} = Graph.graphData();
    let linksNew = [];
    if (window.confirm("Are you sure you want to delete this link?")) {
        links.forEach((link) => {
            if (link !== selectedLink) {
                linksNew.push(link);
            }
        });
        Graph.graphData({
            nodes: nodes,
            links: linksNew
        })
        //updateSimulation();
        closeBox();
    } else {
        closeBox();
    }
}

function select(element){
    if(!removing) {
        let {nodes, links} = Graph.graphData();
        let selectUserData = element.textContent;
        inputBox.value = selectUserData;
        searchWrapper.classList.remove("active");
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id.startsWith(selectUserData)) {
                nodeClick(nodes[i])
            }
        }
    }
    else{
        removing = false;
    }
}

function recolor(){
    if(!highlighted) {
        highlighted = true;
        // Create bloom
        bloomPass.strength = 3;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.1;
        // Add bloom to graph
        Graph.postProcessingComposer().addPass(bloomPass);
    }
    else{
        highlighted = false;
        Graph.postProcessingComposer().removePass(bloomPass);
    }
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
    if (key==="__threeObj") return undefined;
    else if (key==="__lineObj") return undefined;
    else if (key==="__arrowObj") return undefined;
    else if (key==="__curve") return undefined;
    else if (key==="index") return undefined;
    else if (key==="source") return value.id;
    else if (key==="target") return value.id;
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

function lightTheme(){
    Graph.backgroundColor("#FFFFFF");
    Graph.linkColor(() => "#000000");
    Graph.linkDirectionalParticleColor(() => "#FFFFFF");
    document.querySelector(".scene-tooltip").classList.add("active");
}

function darkTheme(){
    Graph.backgroundColor("#000000");
    Graph.linkColor(defLinkColor);
    Graph.linkDirectionalParticleColor(defLinkColor);
    document.querySelector(".scene-tooltip").classList.remove("active");
}

function track(){
    trackMenu.checked = true;
    if(!connections.innerHTML.includes(selectedNode.id)) {
        connections.innerHTML = connections.innerHTML + "<label for=\"trackMenu\" class=\"md-button\" onclick=\"select(this)\">" + selectedNode.id + "<i class=\"fas fa-trash\" onclick=\"removeTrack(this.parentElement.textContent)\"></i></label>";
    }
}

function removeTrack(node){
    removing = true;
    let firstHalf = connections.innerHTML.substring(0, connections.innerHTML.indexOf(node) - 64);
    let secondHalf = connections.innerHTML.substring(connections.innerHTML.indexOf(node) + node.length + 109, connections.innerHTML.length);
    connections.innerHTML = firstHalf + secondHalf;
    resetView();
}

function download(){
        cancelAnimationFrame(a);
        //Obviously, you should swap this out for a selector that gets only the 3D graph
        Graph.renderer().domElement.toBlob(function(blob){
            //Powered by [FileSaver](https://github.com/eligrey/FileSaver.js/)
            saveAs(blob, 'a.png');
        });
}

function forceReset(){
    let {nodes, links} = Graph.graphData();
    cb.checked = false;
    searchWrapper.classList.remove("active");
    visibleNodes = nodes;
    reset();
    resetView();
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

    defLinkColor = Graph.linkColor();

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
window.lightTheme = lightTheme;
window.darkTheme = darkTheme;
window.addLink = addLink;
window.track = track;
window.updateSlider = updateSlider;
window.addNode = addNode;
window.forceReset = forceReset;
window.removeTrack = removeTrack;