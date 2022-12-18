package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class Link {
    @Expose(serialize = false, deserialize = true)
    String nodeName;
    @Expose(serialize = true, deserialize = true)
    List<Request> requests = new ArrayList<>();
    @Expose(serialize = false, deserialize = true)
    Integer length;
    @Expose(serialize = false, deserialize = true)
    Integer width;
    @Expose(serialize = true, deserialize = false)
    String source;
    @Expose(serialize = true, deserialize = false)
    String target;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public List<Request> getRequests() {
        return requests;
    }

    public void setRequests(List<Request> requests) {
        this.requests = requests;
    }

    @Override
    public String toString() {
        return "Link{" +
                "nodeName='" + nodeName + '\'' +
                ", requests=" + requests +
                ", length=" + length +
                ", width=" + width +
                ", source='" + source + '\'' +
                ", target='" + target + '\'' +
                '}';
    }
}
