
// set link color based on if it selected or hovered over
export default function getLinkColor(link, hoverNode, hoverLink, theme) {
    if(link.source === hoverNode){
        return 'blue';
    }
    /*if(link.target === hoverNode){
        return 'magenta';
    }
     */
    /*
    if(link === hoverLink){
        return 'hotpink';
    }

     */
    return link.source.color;
}