export default function getLinkColor(link, hoverNode) {
    if(link.source === hoverNode){
        return 'green';
    }
    if(link.target === hoverNode){
        return 'magenta';
    }
    return 'rgba(50, 50, 50, 0.2)';
}