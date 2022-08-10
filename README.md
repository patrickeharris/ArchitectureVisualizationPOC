# Architecture Visualization POC
Our architecture visualization proof-of-concept aims to provide an interactive visualization framework for cloud native systems. Currently, the web-based application takes a JSON file describing the microservice-based system in the abstract terms of nodes and links and generates a high-level 2D and 3D perspective of the system. The resulting perspectives are highly customizable and interactive to allow for control over the holistic system view.

**Current features include:**
* A 2D view with 4 axis of movement + zoom in and out
* A 3D view with 6 axis of movement + zoom in and out + tilt
* Parse JSON schema describing system architecture into graph
* Click and drag nodes to manipulate the graph
* Export/import a specific view of the graph
* Responsive search/filtering of nodes
* Visualize neighbors of a node
* Add/delete nodes and links to assess the impact of specific changes as the system evolves
* Detailed info popup for each node
* Detailed info popup for each link
* Directed arrows showing the flow of data (extracted RPCs) throughout the system
* Right click context menu to manipulate nodes/links
* Different colors that relate to high coupling
* Slider that determines high coupling metric
* Shapes indicate different types of nodes (service, database, configuration, proxy, API)
* Download a screenshot of the graph
* Light/Dark Themes
