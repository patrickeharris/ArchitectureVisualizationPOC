package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class System2 {
    @Expose(serialize = true, deserialize = true)
    List<Node2> nodes = new ArrayList<>();

    @Expose(serialize = true, deserialize = false)
    private List<Link> links;


    public List<Node2> getNodes() {
        return nodes;
    }

    public void setNodes(List<Node2> nodes) {
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
                "nodes=" + nodes +
                '}';
    }
}
