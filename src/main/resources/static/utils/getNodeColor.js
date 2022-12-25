
// set node color based on if it is selected, hovered over, or a neighbor
export default function getNodeColor(node, neighbors, selectedNode, hoverNode, defNodeColor) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node) > -1) {
        if(node === selectedNode || node === hoverNode){
            return 'blue';
        }
        if(neighbors.indexOf(hoverNode) > -1){
            return 'deepskyblue';
        }

        let randomColor = Math.floor(Math.random()*16777215).toString(16);

        return '#' + randomColor;
    }
}