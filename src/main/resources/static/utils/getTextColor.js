export default function getTextColor(node, neighbors, selectedNode) {
    if(node === selectedNode){
        return 'blue'
    }
    return Array.isArray(neighbors) && neighbors.indexOf(node) > -1 ? 'green' : 'black'
}