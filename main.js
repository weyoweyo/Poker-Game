/*
 * Author: Weiyue Cai
 * Last modification: June 1, 2020
 */

document.write('<script type="javascript" src="calculate.js"></script>'); 

var cards = function() {
    var cards = Array(52);
    var color = ['C','D','H','S'];
    var value = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    for (var i=0; i<=12; i++){
        for (var j=0; j<=3; j++){
           cards[(i*4+j)] = value[i] + color[j];
        }
    }
    cards.push('empty');
    cards.push('back');
    
    return cards;
};

var cards = cards();

var cardPath = function(tab,i) {
    return "<img src = \"cards/"+tab[i]+".svg\">";
};

var deck;
var idBack;
var hands;
var select;
var notEmpty;
var pile;

var init = function () {
    document.getElementById("b").innerHTML = 
    "<table><tr><td>"+
    "<button onclick=\"init();\">New Game</button>"+
    "</td></tr></table>"+
    "<table style=\"margin-left:80px;\">"+
    "<tr><td id=0 onclick=\"clic(0);\">" +
    "</td></tr></table>" +
    "<table style=\"margin-left:80px;\">"+initGrid();+"</table>";

    for (var i=1; i<=25; i++) {
        var elem = document.getElementById(i);
        elem.innerHTML = cardPath(cards,52);
    }   
    
    document.getElementById(0).innerHTML = 
    cardPath(cards,53);

    deck = cards.slice(0,51);
    idBack = 53;
    hands = Array(25).fill(-1);
    select;
    notEmpty = [];
    pile = [];
};

var initGrid = function(){
    var str = "";     
    for (var i=1; i<=6;i++){
        str = str + "<tr>";       
        for (var j=1; j<=6; j++){
            if (i<=5 && j<=5) {
                var idGrid = (i-1)*5+j;
                str += "<td id="+"\""+idGrid+"\""+" onclick=\"clic(" + 
                idGrid + ");\"></td>";
            } else if (i<=5 && j==6) {
                str += "<td id=\"pointRow"+i+"\"></td>";
            } else if (j<=5 && i==6) {
                str += "<td id="+"\"pointCol"+j+"\""+"></td>";
            } else {
                str += "<td id="+"\"pointTot\""+">"+0+"</td>";
            }
        }        
        str = str + "</tr>";
    }
    return str;
};


// this function takes two arrays as parameters:
// (1) ID for each row or column;
// (2) "hands" which contains the 25 cards in the grid
// P.S -1 if it is empty
// the function returns the cards' id of each row or each column
var indexcards = function(tab, hands) {
    var tabIndex = [];
        for (var i=0; i<tab.length; i++) {
            tabIndex.push(cards.indexOf(hands[tab[i]]));
        }
    return tabIndex;  
};


var clic = function(id){
    var elem = document.getElementById(id);
    var elemPre = document.getElementById(select);

    var selection = function(){
        if(elem.style.backgroundColor == "lime"){
            elem.style.backgroundColor = "transparent";
        } else {
            elem.style.backgroundColor = "lime";
            elemPre.style.backgroundColor = "transparent";
        }
    };

    var selection1 = function(){
        if(elem.style.backgroundColor == "lime"){
            elem.style.backgroundColor = "transparent";
        } else {
            elem.style.backgroundColor = "lime";
        }
    };   
   
    if (id == 0) {
        select = 0;
            
        if (elem.style.backgroundColor == "lime") {
            elem.style.backgroundColor = "transparent";
        } else if ((elem.style.backgroundColor == "transparent")
            && (idBack !== 53)) {
                elem.style.backgroundColor = "lime";  
                for (var i=1; i<=25; i++) {
                    var elem = document.getElementById(i);
                    elem.style.backgroundColor = "transparent";
            }   
        } else {                
            var len = deck.length;
            var indAlea = Math.floor(Math.random()*len);
                
            var temp = deck[len-1];
            deck[len-1] = deck[indAlea];
            deck[indAlea] = temp;   
            idBack = len-1;
                
            var cardselPath = cardPath(deck,idBack); 
            elem.innerHTML = cardselPath;
            
            selection(); 
        }        
    }

    var showPoint = function(id) {
        var x = Math.ceil(id/5);
        var y = (id % 5 == 0)? 5 : (id % 5);
        var l = (x-1)*5;
        var total = 0;

        var tabRow = [l, l+1, l+2, l+3, l+4];
        var tabCol = [y-1, y+4, y+9, y+14, y+19];

        var indexRow = indexcards(tabRow, hands);
        var indexCol = indexcards(tabCol, hands);

        document.getElementById("pointRow"+x).innerHTML =
        calculatePoint(indexRow);
        document.getElementById("pointCol"+y).innerHTML =
        calculatePoint(indexCol);

        for (var i=1; i<=5; i++) {
            total += +(document.getElementById("pointRow"+i).innerHTML);
            total += +(document.getElementById("pointCol"+i).innerHTML)
        }

        document.getElementById("pointTot").innerHTML = +(total);
    }
 
    // Situation 1: we clicked on the pile of cards the last time

    // Situation 1.1: this time
    // we click on an empty place in the grid
    if(select == 0 && id!==0 && notEmpty.indexOf(id)==-1) {
        hands[id-1] = deck.pop();
        notEmpty.push(id); 
 
        elem.innerHTML = elemPre.innerHTML;
        elemPre.style.backgroundColor="transparent";

        showPoint(id);

        if (deck.length !== 26) {
            elemPre.innerHTML = cardPath(cards,53);
            idBack = 53;      
            select = id;     
        } else { 
            elemPre.innerHTML = cardPath(cards,52);
            setTimeout(function(){ 
                alert ("Your final score is " + 
                document.getElementById("pointTot").innerHTML); 
                init();
            }, 100);
        }                                
    }
     
    // Situation 1.2: this time, we click on a non empty place.
    else if(select == 0 && id!==0 && notEmpty.indexOf(id)!==-1){
        selection();
        select = id;   
    }

    // Situation 2: we selected a non empty place last time.

    // Situation 2.1: this time, we click on the same place in the grid
    else if(id == select && select !== 0){
        selection1();
        select = id;
    }
  
    // Situation 2.2: this time, we click on an empty place.
    else if (notEmpty.indexOf(select)!==-1 && 
            notEmpty.indexOf(id)==-1 && 
            (elemPre.style.backgroundColor == "lime")){
        
        var temp = hands[select-1];
        hands[select-1] = -1;
        hands[id-1] = temp;

        // the update of the notEmpty array
        var idSelect = notEmpty.indexOf(select);
        notEmpty = notEmpty.slice(0, idSelect).
        concat(notEmpty.slice(idSelect+1, notEmpty.length));
        notEmpty.push(id);

        elem.innerHTML = elemPre.innerHTML;       
        elemPre.style.backgroundColor = "transparent";
        elemPre.innerHTML = cardPath(cards, 52);

        showPoint(id);
        showPoint(select);

        select = id;
    }

    // Situation 2.3: swap two cards in the grid
    else if (notEmpty.indexOf(select)!==-1 && 
            notEmpty.indexOf(id) !==-1 && 
            (elemPre.style.backgroundColor == "lime")) {
     
        var temp;
        temp = elemPre.innerHTML;
        elemPre.innerHTML = elem.innerHTML;
        elem.innerHTML = temp;

        var swap = hands[select-1];
        hands[select-1] = hands[id-1];
        hands[id-1] = swap;

        showPoint(id);
        showPoint(select);

        select = id;
        elemPre.style.backgroundColor = "transparent";
    }

    // Situation 3: we could not successfully select a place last time
    // this time, if we click on a non-empty place,
    // we will select successfully this place.
    else if ((elemPre.style.backgroundColor !== "lime")
        &&  notEmpty.indexOf(id) !==-1 ){
        elem.style.backgroundColor = "lime";
        select = id;
    }
};
