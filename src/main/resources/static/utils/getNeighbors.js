
// find neighbors of node
export default function getNeighbors(node, links) {
    return links.reduce(
        (neighbors, link) => {
            if (link.target.nodeName === node.nodeName) {
                neighbors.push(link.source)
                console.log(link.source)
            } else if (link.source.nodeName === node.nodeName) {
                neighbors.push(link.target)
                console.log(link.target)
            }
            return neighbors
        },
        [node]
    )
}