export default function getNodeColor(node, neighbors, selectedNode) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node) > -1) {
        if(node === selectedNode){
            return 'blue';
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