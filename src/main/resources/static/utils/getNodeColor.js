
// set node color based on if it is selected, hovered over, or a neighbor
export default function getNodeColor(node, neighbors, selectedNode, hoverNode, threshold) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node) > -1) {
        if(node === selectedNode || node === hoverNode){
            return 'blue';
        }
        if(neighbors.indexOf(hoverNode) > -1){
            return 'deepskyblue';
        }
        if(neighbors.length > threshold){
            return 'red';
        }
        if(neighbors.length > threshold / 2){
            return 'orange';
        }
        return 'green';
    }
}