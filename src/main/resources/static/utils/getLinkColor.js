import isNeighborLink from './isNeighborLink.js'
export default function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
}