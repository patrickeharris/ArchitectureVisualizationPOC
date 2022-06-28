// Import for lighting
import { UnrealBloomPass } from '//cdn.skypack.dev/three@0.136/examples/jsm/postprocessing/UnrealBloomPass.js';
import links from "../data/links.js";

// Data Abstraction
const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;
let selectedNode = null;
let visibleNodes = [];
let initX = null;
let initY = null;
let initZ = null;
let initAngle = null;
// HTML elements
const searchWrapper = document.querySelector(".search-box");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom_box");
const contextMenu = document.querySelector(".wrapper");
const shareMenu = contextMenu.querySelector(".share-menu");

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
                color: highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0)' : 'rgba(255,160,0)' : node.group < 4 ? node.group < 2 ? 'rgba(0,255,0)' : 'rgb(255,0,255)' : 'rgba(0,255,255)',
                transparent: true,
                opacity: 0.75
            })
        ))
    .nodeThreeObjectExtend(false)
    // Get data
    .jsonUrl('./train_ticket_new.json')
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
    // Change where noode is when clicking and dragging
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
        // Prevent normal right click menu
        e.preventDefault();

        // Set position for menu
        let x = e.offsetX, y = e.offsetY,
            winWidth = window.innerWidth,
            winHeight = window.innerHeight,
            cmWidth = contextMenu.offsetWidth,
            cmHeight = contextMenu.offsetHeight;

        if(x > (winWidth - cmWidth - shareMenu.offsetWidth)) {
            shareMenu.style.left = "-200px";
        } else {
            shareMenu.style.left = "";
            shareMenu.style.right = "-200px";
        }

        x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
        y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;

        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.visibility = "visible";
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
            getNeighbors(node);
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
        3000  // ms transition duration
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
function getNeighbors(node){
    let { nodes, links } = Graph.graphData();
    console.log(node.id);
    links.forEach((link) => {
        if(link.source === node || link.target === node){
            highlightLinks.add(link);
            if(!highlightNodes.has(link.source))
                highlightNodes.add(link.source);
            if(!highlightNodes.has(link.target))
                highlightNodes.add(link.target);
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
function resetView(){
    const coords = { x: initX, y: initY, z: initZ };

    Graph.cameraPosition(
        coords, // new position
        initAngle, // lookAt ({ x, y, z })
        3000  // ms transition duration
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
    // Empty visible nodes
    visibleNodes = [];

    // Add nodes that are linked to selected nodes
    links.filter((link) => {
        if(link.source.id === selectedNode.id || link.target.id === selectedNode.id){
            if(!visibleNodes.includes(link.source))
                visibleNodes.push(link.source);
            if(!visibleNodes.includes(link.target))
                visibleNodes.push(link.target);
        }
    });

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

// Populate graph after 100ms (after async jsonURL runs)
delay(100).then(() => {
    let { nodes, links } = Graph.graphData();
    visibleNodes = nodes;
    reset();

    let {x, y, z, lookAt} = Graph.cameraPosition();
    initX = x;
    initY = y;
    initZ = z;
    initAngle = lookAt;

    /* Export stuff:
    for(let j = 0; j < nodes.length; j++){
        let oldNode = {node: nodes[j], x: nodes[j].fx, y: nodes[j].fy, z: nodes[j].fz, x2: nodes[j].x, y2: nodes[j].y, z2: nodes[j].z};
        movedNodes.push(oldNode);
    }*/
});

// Hide right click menu when clicking out of it
document.addEventListener("click", () => {
    contextMenu.style.visibility = "hidden";
});

// Make functions global (accessible from html)
window.recolor = recolor;
window.getNeighborsSelected = getNeighborsSelected;
window.select = select;
window.closeBox = closeBox;