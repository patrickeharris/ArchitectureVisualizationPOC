export default function getLinkColor(link, hoverNode, hoverLink) {
    if(link.source === hoverNode){
        return 'green';
    }
    if(link.target === hoverNode){
        return 'magenta';
    }
    if(link === hoverLink){
        return 'hotpink';
    }
    return 'rgba(50, 50, 50, 0.2)';
}