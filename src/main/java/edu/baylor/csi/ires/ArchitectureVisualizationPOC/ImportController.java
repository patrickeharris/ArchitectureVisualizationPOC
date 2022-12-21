package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
}
