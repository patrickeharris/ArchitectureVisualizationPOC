export default function getLinkColor(link, hoverNode, hoverLink, theme) {
    if(link.source === hoverNode){
        return 'green';
    }
    if(link.target === hoverNode){
        return 'magenta';
    }
    if(link === hoverLink){
        return 'hotpink';
    }
    if(theme === 1){
        return 'rgba(255,255,255,1)';
    }
    return 'rgba(50, 50, 50, 0.2)';
}