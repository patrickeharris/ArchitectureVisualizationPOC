package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class Node {
    @Expose(serialize = true, deserialize = true)
    String nodeName;
    @Expose(serialize = true, deserialize = true)
    String nodeType;
    @Expose(serialize = false, deserialize = true)
    String nodeShape;
    @Expose(serialize = false, deserialize = true)
    List<Link> dependencies = new ArrayList<>();

    @Expose(serialize = false, deserialize = true)
    List<Link> targets = new ArrayList<>();

    public String getNodeName() {
        return nodeName;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getNodeShape() {
        return nodeShape;
    }

    public void setNodeShape(String nodeShape) {
        this.nodeShape = nodeShape;
    }

    public List<Link> getDependencies() {
        return dependencies;
    }

    public void setDependencies(List<Link> dependencies) {
        this.dependencies = dependencies;
    }

    public List<Link> getTargets() {
        return targets;
    }

    public void setTargets(List<Link> targets) {
        this.targets = targets;
    }


    @Override
    public String toString() {
        return "Node{" +
                "nodeName='" + nodeName + '\'' +
                ", nodeType='" + nodeType + '\'' +
                ", nodeShape='" + nodeShape + '\'' +
                ", dependencies=" + dependencies +
                '}';
    }
}
