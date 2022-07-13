export default function getNodeColor(node, neighbors, selectedNode, hoverNode) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node) > -1) {
        if(node === selectedNode || node === hoverNode){
            return 'blue';
        }
        if(neighbors.indexOf(hoverNode) > -1){
            return 'deepskyblue';
        }
        if(neighbors.length > 8){
            return 'red';
        }

        if(neighbors.length > 4){
            return 'orange';
        }

        return 'green';
    }
}