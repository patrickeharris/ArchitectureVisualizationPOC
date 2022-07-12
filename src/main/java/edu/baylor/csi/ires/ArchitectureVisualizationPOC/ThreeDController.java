package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ThreeDController {
    @RequestMapping("/3d/")
    public String get3D(){
        return "3d/index";
    }
}
