package edu.baylor.csi.ires.ArchitectureVisualizationPOC;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TwoDController {
    @RequestMapping("/2d/")
    public String get2D(){
        return "2d/index";
    }
}
