// Import for lighting
//import {UnrealBloomPass} from '//cdn.skypack.dev/three@0.136/examples/jsm/postprocessing/UnrealBloomPass.js';
import getNeighbors from "../utils/getNeighbors.js";
import { saveAs } from '../utils/file-saver.js';
import rightClick from "../utils/rightClick.js";
import {CustomSinCurve} from "../utils/CustomSinCurve.js";
import rightClickLink from "../utils/rightClickLink.js"

// Data Abstraction
let allLinks = null;
let highlightNodes = new Set();
let highlightLinks = new Set();
let hoverNode = null;
let selectedNode = null;
let selectedLink = null;
let search = "";
let visibleNodes = [];
let initX = null;
let initY = null;
let initZ = null;
let defLinkColor = null;
let threshold = 8;
let highlighted = false;
let removing = false;
//let bloomPass = new UnrealBloomPass();
let a, downloads = 0;
let defNodeColor = false;
let i = 0;

// HTML elements
const searchWrapper = document.querySelector(".search-box");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom_box");
const dependencies = document.querySelector(".dependencies");
const dependson = document.querySelector(".dependson");
const trackMenu = document.querySelector("#trackMenu");
const coupling = document.querySelector("#rangeValue");
const nodeForm = document.getElementById('addNode');
const cb = document.querySelector('#menuToggle');
nodeForm.style.display = 'none';
const linkForm = document.getElementById('addLink');
linkForm.style.display = 'none';
const connections = document.querySelector(".connections");

// Make graph
const Graph = ForceGraph3D()
(document.getElementById('graph'))
    // Setup shapes
    .nodeThreeObject((node) => {
        const nodes = new THREE.Mesh(
            [
                new THREE.SphereGeometry(10),
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.ConeGeometry(5, 10),
                new THREE.CylinderGeometry(5, 5, 10),
                new THREE.TubeGeometry( new CustomSinCurve( 10 ), 5, 2, 8, false ),
                new THREE.OctahedronGeometry(5)][getShape(node.nodeType)],
            new THREE.MeshLambertMaterial({
                // Setup colors
                color: getColor(node),
                transparent: true,
                opacity: getNodeOpacity(node)
            })
        )
        const sprite = new SpriteText(node.nodeName);
        sprite.material.depthWrite = false; // make sprite background transparent
        sprite.color = getSpriteColor(node);
        sprite.textHeight = 8;
        sprite.position.set(0,15,0);

        nodes.add(sprite);

        return nodes;
    })
    .nodeThreeObjectExtend(false)
    // Get data
    .jsonUrl('../data/large_v1.json')
    // Setup link width
    .linkWidth(link => getLinkWidth(link))
    .linkColor(link => getLinkColor(link))
    // Setup data transfer visualization across links
    .linkDirectionalParticles(link => highlightLinks.has(link) ? 2 : 0)
    // Width of data transfer points
    .linkDirectionalParticleWidth(link => getLinkWidth(link))
    .nodeId("nodeName")
    // Setup visibility for filtering of nodes
    .nodeVisibility((node) => customNodeVisibility(node))
    .linkVisibility((link) => customLinkVisibility(link))
    .linkDirectionalArrowLength(link => getLinkWidth(link))
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
    })
    // Setup clicking on links
    .onLinkClick(link => {
        selectedLink = link;
    })
    .linkCurvature(link => {
        let test = false;
        allLinks.forEach((link2) => {
            if((link2.target === link.source) && (link2.source === link.target)){
                test = true;
            }
        })
        if(test){
            return 0.4;
        }
        else{
            return 0;
        }
    })
    // Setup right clicking on links
    .onLinkRightClick((link, e) => {
        rightClickLink(e);
        selectedLink = link;

    });

function getLinkColor(link) {

    if (link.source === hoverNode) {
        return `rgba(50,50,200, ${getLinkOpacity(link)})`;
    }
    let color = link.source.color;
    color = color.replace(`)`, `, ${getLinkOpacity(link)})`).replace('rgb', 'rgba');
    return color;
}

function getLinkWidth(link) {
    if (search === "") {
        return link.requests.length * 6;
    }
    if (link.source.nodeName.toLowerCase().includes(search.toLowerCase()) || link.target.nodeName.toLowerCase().includes(search.toLowerCase())) {
        return link.requests.length * 6;
    } else {
        return 0;
    }
}

// When user types something in search box
inputBox.onkeyup = (e)=> {
    console.log(Graph);
    console.log(Graph.graphData());
    // Get data
    let { nodes, links } = Graph.graphData();

    // Get rid of info box
    cb.checked = false;

    // Get text in search box
    search = e.target.value;

    let emptyArray = [];
    //visibleNodes = []
    if (search) {
        emptyArray = nodes.filter((data)=>{
            return data.nodeName.toLocaleLowerCase().startsWith(search.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
            return data = '<li>' + data.nodeName + '</li>';
        });
        reset()
        searchWrapper.classList.add("active2");
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let index = 0; index < allList.length; index++) {
            allList[index].setAttribute("onclick", "select(this)")
        }
    } else {
        searchWrapper.classList.remove("active2");
        reset();
        resetView();
    }
}

function getNodeOpacity(node) {
    if (search === "") {
        return 0.75;
    }
    if (node.nodeName.toLowerCase().includes(search.toLowerCase())) {
        return 0.8;
    } else {
        return 0.1;
    }
}

function getLinkOpacity(link) {
    if (search === "") {
        return 1;
    }
    if (link.source.nodeName.toLowerCase().includes(search.toLowerCase()) || link.target.nodeName.toLowerCase().includes(search.toLowerCase())) {
        return 1;
    } else {
        return 0.2;
    }
}

// Sets shape based on type of node
function getShape(type) {
    if (type === "service") {
        return 0;
    } else if (type === "kafka" || type === "proxy" || type === "writer" || type === "pipeline") {
        return 1;
    } else if (type === "customer" || type === "srcSink") {
        return 2;
    } else if (type === "archive" || type === "database" || type === "bucket") {
        return 3;
    } else if (type === "API") {
        return 4;
    } else if (type === "config") {
        return 5;
    } else {
        return 0;
    }
}
/*
function updateSlider(newVal){
    coupling.innerText = newVal;
    threshold = parseInt(newVal);
    updateHighlight();
}
 */

function getSpriteColor(node){
    if (!node.nodeName.toLowerCase().includes(search.toLowerCase())) {
        return 'rgba(255,255,255,0)';
    }
    return getColor(node);
}

// Sets color of node
function getColor(node) {

    let { nodes, links } = Graph.graphData();

    if(highlightNodes.has(node)){
        if(node === hoverNode){
            return 'rgb(50,50,200)';
        }
    }

    if (!defNodeColor) {
        nodes.map((n) => {
            n.color = "-1";
        })
        defNodeColor = true;
    }

    if (node.color === "-1") {

        const colors = ["rgb(250, 93, 57)", "rgb(255, 167, 0)", "rgb(245, 239, 71)",
            "rgb(51, 241, 255)", "rgb(204, 51, 255)", "rgb(255, 51, 112)", "rgb(173, 255, 51)",
            "rgb(194, 151, 252)"];

        let neighbors = getNeighbors(node, links);

        let offLimits = [];
        let newColors = [];

        neighbors.map((neighbor) => {
            if (neighbor.color !== "-1") {
                offLimits.push(neighbor.color);
            }
        })

        colors.map((color) => {
            if (offLimits.indexOf(color) === -1) {
                newColors.push(color);
            }
        })

        let randIndex = Math.floor(Math.random() * newColors.length);

        node.color = newColors[randIndex];
    }

    return node.color;
}

// Event when node is clicked on
function nodeClick(node) {

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
    document.getElementById("nodeName").innerHTML = node.nodeName;
    document.getElementById("nodeType").innerHTML = "<b>Node Type: </b>" + node.nodeType;
    //document.getElementById("nodeID").innerHTML = "<b>Node ID: </b>" + node.nodeID;
    let endpointLinks = [];
    allLinks.forEach((link) => {
        if(link.source === node || link.target === node){
            endpointLinks.push(link);
        }
    });

    document.getElementById("dependencyNum").innerHTML = "<b>Number of Dependencies: </b>" + endpointLinks.length;
    if(endpointLinks.length > 0){
        let endpoints = endpointLinks.map((link) => {
            let funcs = link.requests.map((func) => {
                func = '<li>' + func.type + '<br>' + func.returnData + '<br>' + func.endPointName + '(' + '<br>' + func.arguments + ') </li>';
                return func;
            })
            return funcs.join('');
        })
        //document.getElementById("endpoints").innerHTML = endpoints.join('');
    }

    let found = false;
    let found2 = false;
    let newLinks = [];
    let dependLinks = [];

    // Searching for dependencies to display them
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

    document.getElementById("dependentNum").innerHTML = "<b>Number of Dependents: </b>" + dependLinks.length;

    // Display dependencies in info box
    if (found) {
        newLinks = newLinks.map((data) => {
            let link = '<li> <button class="accordion">' + data.target.nodeName + '</button> <div class="panel" Endpoints: <br> <ul>';
            let funcs = data.requests.map((func) => {
                func = '<li style="margin-left: 20px">' + func.type + '<br>' + func.returnData + '<br>' + func.endPointName + '(' + '<br>' + func.arguments + ') </li>';
                return func;
            })
            return link + funcs.join('') + '</ul></div> </li>';
        });
        dependencies.innerHTML = newLinks.join('');
    } else {
        dependencies.innerHTML = '<li>N/A</li>';
    }

    // Display depends on in info box
    if (found2) {
        dependLinks = dependLinks.map((data) => {
            let link = '<li> <button class="accordion">' + data.source.nodeName + '</button> <div class="panel" Endpoints: <br> <ul>';
            let funcs = data.requests.map((func) => {
                func = '<li style="margin-left: 20px">' + func.type + '<br>' + func.returnData + '<br>' + func.endPointName + '(' + '<br>' + func.arguments + ') </li>';
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
/*
// Add node button
function addNode() {

    // When the add node form is submitted, this happens.
    nodeForm.addEventListener('submit', (event) => {

        event.preventDefault();

        // Data Abstraction
        let {nodes, links} = Graph.graphData();
        let newName = event.target.elements.name.value;
        let found = false;

        // Check if node already exists
        nodes.forEach(node => {
            if (node.nodeName === newName) {
                found = true;
            }
        })

        // If node already exists, warn the user. If not, continue adding node.
        if (found) {
            window.alert("That node already exists! Try again.");
        } else {

            // Extract info about new node.
            let newType = event.target.elements.node_type.value;
            let newDeps = event.target.elements.dependencies.value;
            let deps = newDeps.split(',');

            // Create new node with info from form.
            let node = {
                nodeName: newName,
                nodeType: newType,
                dependencies: deps,
            }
            nodes.push(node);

            // Create new links if new node has dependencies.
            deps.forEach(d => {
                nodes.forEach(n => {
                    if (n.nodeName.toString() === d) {
                        let link = {
                            source: newName,
                            target: n.nodeName
                        }
                        links.push(link);
                    }
                })
            })

            // Update graph data
            Graph.graphData({
                nodes: nodes,
                links: links
            })

            // Update the simulation
            closeNodeForm();
        }
    });

    // Show the add node form
    nodeForm.style.display = 'block';
}

// Close the add node form
function closeNodeForm() {
    nodeForm.style.display = 'none';
}

// Add link button
function addLink() {

    // When the add link form is submitted, this happens
    linkForm.addEventListener('submit', (event) => {

        event.preventDefault();

        // Data Abstraction
        let {nodes, links} = Graph.graphData();
        let newTarget = event.target.elements.target.value;
        let foundNode = false;

        // Check if target node exists
        nodes.forEach(node => {
            if (node.nodeName === newTarget) {
                foundNode = true;
            }
        })

        // If the node doesn't exist, warn the user. If it does, continue adding link
        if (!foundNode) {
            window.alert("The target you selected is not currently a node in this graph. Try again.");
        } else {

            // Check if link already exists
            let found = false;
            links.forEach(link => {
                if (link.source.nodeName === selectedNode.nodeName && link.target.nodeName === newTarget) {
                    found = true;
                }
            })

            // If found, warn the user. If not, continue adding the link
            if (found) {
                window.alert("That link already exists! Try again.");
            } else {

                // Create new link with info from form
                let link = {
                    source: selectedNode,
                    target: newTarget
                }
                links.push(link);

                // Update graph data
                Graph.graphData({
                    nodes: nodes,
                    links: links
                })
                selectedNode = null;

                closeLinkForm();
                resetZoom();
            }
        }
    })

    // Show link form
    linkForm.style.display = 'block';
}

// Close link form
function closeLinkForm() {
    linkForm.style.display = 'none';
}

 */

// Delete node button
function deleteNode() {

    // Data Abstraction
    let { nodes, links } = Graph.graphData();
    let nodesNew = [];
    let newLinks = [];

    // Check with the user to make sure they want to delete
    if (window.confirm("Are you sure you want to delete this node and all its links?")) {

        // Update nodes and links without the node and links that are being deleted
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

        // Update graph data
        Graph.graphData({
            nodes: nodesNew,
            links: newLinks
        });
    }
}

// Delete link button
function deleteLink() {

    // Data Abstraction
    let { nodes, links } = Graph.graphData();
    let linksNew = [];

    // Check with the user to make sure they want to delete the link
    if (window.confirm("Are you sure you want to delete this link?")) {

        // Update the links to not include the link being deleted
        links.forEach((link) => {
            if (link !== selectedLink) {
                linksNew.push(link);
            }
        });

        // Update graph data
        Graph.graphData({
            nodes: nodes,
            links: linksNew
        })

        closeBox();
    } else {
        closeBox();
    }
}

function select(element) {
    if (!removing) {
        let {nodes, links} = Graph.graphData();
        let selectUserData = element.textContent;
        inputBox.value = selectUserData;
        searchWrapper.classList.remove("active2");
        searchWrapper.firstElementChild.firstElementChild.value = "";
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName === selectUserData) {
                nodeClick(nodes[i])
            }
        }
    } else {
        removing = false;
    }
}
/*
function recolor() {
    if (!highlighted) {
        highlighted = true;
        // Create bloom
        bloomPass.strength = 3;
        bloomPass.radius = 1;
        bloomPass.threshold = 0.1;
        // Add bloom to graph
        Graph.postProcessingComposer().addPass(bloomPass);
    } else {
        highlighted = false;
        Graph.postProcessingComposer().removePass(bloomPass);
    }
}

 */

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        let userValue = inputBox.value;
        listData = '<li>' + userValue + '</li>';
    } else {
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
function getHighlightNeighbors(node) {
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
function reset() {
    Graph.nodeVisibility((node) => customNodeVisibility(node)).linkVisibility((link) => customLinkVisibility(link));
    Graph.refresh();
}

// Set camera back to default view
function resetView() {
    const coords = { x: initX, y: initY, z: initZ };
    Graph.cameraPosition(
        coords, // new position
        { x: 0, y: 0, z: 0 }, // lookAt ({ x, y, z })
        2000  // ms transition duration
    );
}

function closeBox() {
    let { nodes, links } = Graph.graphData();
    visibleNodes = nodes;
    reset();
    resetView();
}

// Get neighbors of a selected node
function getNeighborsSelected() {
    let { nodes, links } = Graph.graphData();
    // Set neighbors
    visibleNodes = getNeighbors(selectedNode, links)
    // Refresh visible nodes
    reset();
}

// Node is visible if contained in visibleNodes
function customNodeVisibility(node) {
    return visibleNodes.includes(node);
}

// Link is visible if nodes on either end are visible
function customLinkVisibility(link) {
    return customNodeVisibility(link.source) && customNodeVisibility(link.target);
}

// Run code after a certain delay in ms
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function exportGraph() {
    exportToJsonFile(Graph.graphData())
}

function replacer(key,value) {

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

function lightTheme() {
    Graph.backgroundColor("#FFFFFF");
}

function darkTheme() {
    Graph.backgroundColor("#000000");
}

function track() {
    trackMenu.checked = true;
    if(!connections.innerHTML.includes(selectedNode.nodeName)) {
        connections.innerHTML = connections.innerHTML + "<li for=\"trackMenu\" class=\"md-button-2\" onclick=\"select(this)\">" + selectedNode.nodeName + "<i class=\"fas fa-trash\" onclick=\"removeTrack(this.parentElement.textContent)\"></i></li>";
    }
}

function toggleTrack(){
    if(trackMenu.checked){
        trackMenu.checked = false;
    } else {
        trackMenu.checked = true;
    }
}

function removeTrack(node) {
    removing = true;
    let firstHalf = connections.innerHTML.substring(0, connections.innerHTML.indexOf(node) - 64);
    let secondHalf = connections.innerHTML.substring(connections.innerHTML.indexOf(node) + node.length + 109, connections.innerHTML.length);
    connections.innerHTML = firstHalf + secondHalf;
    resetView();
}

downloads = 0;
function download() {
    cancelAnimationFrame(a);
    // Obviously, you should swap this out for a selector that gets only the 3D graph
    Graph.renderer().domElement.toBlob(function(blob) {
        // Powered by [FileSaver](https://github.com/eligrey/FileSaver.js/)
        saveAs(blob, 'a.png');
    });
}

function forceReset() {
    let { nodes, links } = Graph.graphData();
    cb.checked = false;
    searchWrapper.classList.remove("active");
    visibleNodes = nodes;
    reset();
    resetView();
}

function importGraph() {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        let file = e.target.files[0];

        // setting up the reader
        let reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            let content = readerEvent.target.result; // this is the content!
            let parsedData = JSON.parse(content);
            Graph.graphData(parsedData)
            delay(150).then(() => {
                let { nodes, links } = Graph.graphData();
                allLinks = links;
                visibleNodes = nodes;
                reset();

                Graph.cameraPosition(
                    { x: parsedData.x, y: parsedData.y, z: parsedData.z }, // new position
                    { x: 0, y: 0, z: 0 },//parsedData.lookAt, // lookAt ({ x, y, z })
                    0  // ms transition duration
                );
            })
        }
    }

    input.click();
}

lightTheme();

// Populate graph after 150ms (after async jsonURL runs)
delay(250).then(() => {
    let { nodes, links } = Graph.graphData();
    Graph.d3Force('charge').strength(-150)
    allLinks = links;
    visibleNodes = nodes;
    reset();

    let { x, y, z, lookAt } = Graph.cameraPosition();
    initX = x;
    initY = y;
    initZ = z;

    defLinkColor = Graph.linkColor();
});

// Make functions global (accessible from html)
//window.recolor = recolor;
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
//window.addLink = addLink;
window.track = track;
//window.updateSlider = updateSlider;
//window.addNode = addNode;
window.forceReset = forceReset;
window.removeTrack = removeTrack;
window.toggleTrack = toggleTrack;