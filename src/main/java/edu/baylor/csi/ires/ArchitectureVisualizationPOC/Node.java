package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class Node {
    @SerializedName(value = "id", alternate = "nodeName")
    @Expose(serialize = true, deserialize = true)
    String nodeName;
    @Expose(serialize = true, deserialize = true)
    String nodeType;
    @Expose(serialize = true, deserialize = true)
    String nodeID;
    @Expose(serialize = true, deserialize = true)
    List<Integer> dependencies = new ArrayList<>();
    @Expose(serialize = true, deserialize = true)
    List<String> previousSteps = new ArrayList<>();
    @Expose(serialize = true, deserialize = true)
    List<String> requests = new ArrayList<>();

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

    public String getNodeID() {
        return nodeID;
    }

    public void setNodeID(String nodeID) {
        this.nodeID = nodeID;
    }

    public List<Integer> getDependencies() {
        return dependencies;
    }

    public void setDependencies(List<Integer> dependencies) {
        this.dependencies = dependencies;
    }

    public List<String> getPreviousSteps() {
        return previousSteps;
    }

    public void setPreviousSteps(List<String> previousSteps) {
        this.previousSteps = previousSteps;
    }

    public List<String> getRequests() {
        return requests;
    }

    public void setRequests(List<String> requests) {
        this.requests = requests;
    }

    @Override
    public String toString() {
        return "Node{" +
                "nodeName='" + nodeName + '\'' +
                ", nodeType='" + nodeType + '\'' +
                ", nodeID='" + nodeID + '\'' +
                ", dependencies=" + dependencies +
                ", previousSteps=" + previousSteps +
                ", requests=" + requests +
                '}';
    }
}
