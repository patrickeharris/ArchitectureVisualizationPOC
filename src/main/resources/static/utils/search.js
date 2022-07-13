import nodes from "../data/nodes.js";
import selectNodeExplicit, {selectLinksExplicit} from "../2d/graph.js";
import {resetData, selectSearchNodes, updateSimulation} from "../2d/graph.js";

const searchWrapper = document.querySelector(".search-box")
const inputBox = searchWrapper.querySelector("input")
const suggBox = searchWrapper.querySelector(".autocom_box")

inputBox.onkeyup = (e)=>{
    resetData();
    updateSimulation();
    let userData = e.target.value;
    let emptyArray = [];
    if (userData){
        emptyArray = nodes.filter((data)=>{
           return data.id.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        selectSearchNodes(emptyArray);
        emptyArray = emptyArray.map((data)=>{
            return data = '<li>' + data.id + '</li>';
        });
        selectLinksExplicit()
        searchWrapper.classList.add("active");
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for(let index = 0; index < allList.length; index++){
            //onclick attributes
            allList[index].setAttribute("onclick", "select(this)")
        }
    }
    else{
        searchWrapper.classList.remove("active");
        resetData();
        updateSimulation();
    }
}

function select(element){
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
    let emptyArray = nodes.filter((data)=>{
        return data.id.startsWith(selectUserData);
    });
    selectNodeExplicit(emptyArray.values().next().value);
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        let userValue = inputBox.value;
        listData = '<li>' + userValue + '</li>';
    }
    else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

window.select = select;