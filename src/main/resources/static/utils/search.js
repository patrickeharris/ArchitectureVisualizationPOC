import {resetData, selectSearchNodes, selectNode, nodes} from "../2d/graph.js";

const searchWrapper = document.querySelector(".search-box")
const inputBox = searchWrapper.querySelector("input")
const suggBox = searchWrapper.querySelector(".autocom_box")

inputBox.onkeyup = (e)=>{
    resetData();
    let userData = e.target.value;
    let emptyArray = [];
    if (userData){
        emptyArray = nodes.filter((data)=>{
           return data.nodeName.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        selectSearchNodes(emptyArray);
        emptyArray = emptyArray.map((data)=>{
            return data = '<li>' + data.nodeName + '</li>';
        });
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
    }
}

function select(element){
    let selectUserData = element.textContent;
    inputBox.value = selectUserData;
    searchWrapper.classList.remove("active");
    let emptyArray = nodes.filter((data)=>{
        return data.nodeName.startsWith(selectUserData);
    });
    selectNode(emptyArray.values().next().value);
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