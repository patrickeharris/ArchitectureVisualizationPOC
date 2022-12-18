package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.beans.JavaBean;
import java.util.ArrayList;
import java.util.List;

@Controller
public class ImportController {
    @RequestMapping("/convert")
    public String index(
            @RequestParam(value = "json", required = false) String json,
            Model model
    ) {
        model.addAttribute("json", json);
        System data = new Gson().fromJson(json, System.class);
        if(data != null){
            List<Link> links = new ArrayList<>();
            for(int i = 0; i < data.getNodes().size(); i++) {
                for(int j = 0; j < data.getNodes().get(i).getDependencies().size(); j++){
                    Link l = new Link();
                    l.setSource(data.getNodes().get(i).getNodeName());
                    l.setTarget(data.getNodes().get(i).getDependencies().get(j).getNodeName());
                    l.setRequests(data.getNodes().get(i).getDependencies().get(j).getRequests());
                    links.add(l);
                }
            }
            data.setLinks(links);
            Gson gson = new GsonBuilder()
                    .excludeFieldsWithoutExposeAnnotation()
                    .create();
            String jsonString = gson.toJson(data);
            java.lang.System.out.println(jsonString);
            model.addAttribute("output", jsonString);
        }
        return "convert";
    }

    @RequestMapping("/convert2")
    public String index2(
            @RequestParam(value = "json", required = false) String json,
            Model model
    ) {
        model.addAttribute("json", json);
        System2 data = new Gson().fromJson(json, System2.class);
        if(data != null){
            java.lang.System.out.println("A");
            List<Link> links = new ArrayList<>();
            for(int i = 0; i < data.getNodes().size(); i++) {
                for(int j = 0; j < data.getNodes().get(i).getDependants().size(); j++){
                    Link l = new Link();
                    l.setSource(data.getNodes().get(i).getNodeName());
                    l.setTarget(data.getNodes().get(i).getDependants().get(j));
                    links.add(l);
                }
                java.lang.System.out.println(data.getNodes().get(i).getNodeName());
            }
            data.setLinks(links);
            Gson gson = new GsonBuilder()
                    .excludeFieldsWithoutExposeAnnotation()
                    .create();
            String jsonString = gson.toJson(data);
            java.lang.System.out.println(jsonString);
            model.addAttribute("output", jsonString);
        }
        else{
            java.lang.System.out.println("B");
            java.lang.System.out.println("null");
        }
        return "convert2";
    }

    @RequestMapping("/convert3")
    public String index3(
            @RequestParam(value = "json", required = false) String json,
            Model model
    ) {
        model.addAttribute("json", json);
        System2 data = new Gson().fromJson(json, System2.class);
        if(data != null){
            java.lang.System.out.println("A");
            List<Link> links = new ArrayList<>();
            for(int i = 0; i < data.getNodes().size(); i++) {
                for(int j = 0; j < data.getNodes().get(i).getDependants().size(); j++){
                    Link l = new Link();
                    l.setSource(data.getNodes().get(i).getNodeName());
                    l.setTarget(data.getNodes().get(i).getDependants().get(j));
                    links.add(l);
                }

                for(int j = 0; j < data.getNodes().get(i).getDependsOn().size(); j++){
                    Link l = new Link();
                    l.setTarget(data.getNodes().get(i).getNodeName());
                    l.setSource(data.getNodes().get(i).getDependsOn().get(j));
                    links.add(l);
                }
                java.lang.System.out.println(data.getNodes().get(i).getNodeName());
            }
            data.setLinks(links);
            Gson gson = new GsonBuilder()
                    .excludeFieldsWithoutExposeAnnotation()
                    .create();
            String jsonString = gson.toJson(data);
            java.lang.System.out.println(jsonString);
            model.addAttribute("output", jsonString);
        }
        else{
            java.lang.System.out.println("B");
            java.lang.System.out.println("null");
        }
        return "convert2";
    }
}
