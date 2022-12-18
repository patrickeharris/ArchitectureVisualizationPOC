package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class Request {
    @Expose(serialize = true, deserialize = true)
    String type;
    @Expose(serialize = true, deserialize = true)
    String argument;
    @Expose(serialize = true, deserialize = true)
    String msReturn;
    @Expose(serialize = true, deserialize = true)
    String endpointFunction;
    @Expose(serialize = true, deserialize = true)
    String path;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getArgument() {
        return argument;
    }

    public void setArgument(String argument) {
        this.argument = argument;
    }

    public String getMsReturn() {
        return msReturn;
    }

    public void setMsReturn(String msReturn) {
        this.msReturn = msReturn;
    }

    public String getEndpointFunction() {
        return endpointFunction;
    }

    public void setEndpointFunction(String endpointFunction) {
        this.endpointFunction = endpointFunction;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "Request{" +
                "type='" + type + '\'' +
                ", argument='" + argument + '\'' +
                ", msReturn='" + msReturn + '\'' +
                ", endpointFunction='" + endpointFunction + '\'' +
                ", path='" + path + '\'' +
                '}';
    }
}
