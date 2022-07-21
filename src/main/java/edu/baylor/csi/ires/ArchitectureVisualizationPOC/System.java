package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class System {
    @Expose(serialize = false, deserialize = true)
    String systemName;
    @Expose(serialize = false, deserialize = true)
    String systemVersion;
    @Expose(serialize = true, deserialize = true)
    List<Node> nodes = new ArrayList<>();

    @Expose(serialize = true, deserialize = false)
    private List<Link> links;

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getSystemVersion() {
        return systemVersion;
    }

    public void setSystemVersion(String systemVersion) {
        this.systemVersion = systemVersion;
    }

    public List<Node> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node> nodes) {
        this.nodes = nodes;
    }

    public List<Link> getLinks() {
        return links;
    }

    public void setLinks(List<Link> links) {
        this.links = links;
    }

    @Override
    public String toString() {
        return "System{" +
                "systemName='" + systemName + '\'' +
                ", systemVersion='" + systemVersion + '\'' +
                ", nodes=" + nodes +
                '}';
    }
}
