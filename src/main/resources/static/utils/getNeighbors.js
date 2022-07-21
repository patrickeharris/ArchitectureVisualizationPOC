
// find neighbors of node
export default function getNeighbors(node, links) {
    return links.reduce(
        (neighbors, link) => {
            if (link.target.id === node.id) {
                neighbors.push(link.source)
            } else if (link.source.id === node.id) {
                neighbors.push(link.target)
            }
            return neighbors
        },
        [node]
    )
}