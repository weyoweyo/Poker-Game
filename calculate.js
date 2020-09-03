/*
 * Author: Weiyue Cai
 * Last modification: June 1, 2020
 */


// this is the main function to calculate the points:
// P.S. tab[i] == -1 means that this place is empty
// we consider 5 situations:
// (1) 4 or 5 empty spaces in each row or column: return ""
// (2) 3 empty places: return 2 if there is One Pair; if not ""
// (3) 2 empty places: we follow the order Three of a Kind - One Pair- ""
// (4) 1 empty place: Four of a Kind - Flush - Three of a Kind -
//                    Two Pair - One pair - ""
// (5) 0 empty place: Royal Flush - Straight Flush - Four of a Kind -
//                    Full House - Flush - Straight - Three of a Kind - 
//                    Two Pair - One Pair - ""              

var calculatePoint = function(tab) { 
    tab.sort(function(a, b){return (b-a);}); 
    var negOne = tab.indexOf(-1);
    if (negOne != -1) {tab.splice(negOne, (5-negOne));}
    
    var l = tab.length;

    switch (l) {
        case 0: 
            return "";
        case 1: 
            return ""; 
        case 2:
            return (sameVal(tab[0],tab[1]))? 2 : "";
        case 3:
            return helpCalculate(tab);
        case 4:
            return helpCalculate(tab);
        case 5:
            if (straight(tab)) {
                if (same5col(tab)){
                    return (((tab[4]>>2)==0) && ((tab[0]>>2)==12)) ? 100 : 75;
                } else {
                    return (flush(tab)) ? 20 : 15;
                }
            } else { return helpCalculate(tab); }         
    }
};


// check if 2 cards have the same value
var sameVal = function(x,y) {
    return ((x>>2) == (y>>2));
};

// check if 3 cards have the same value
var same3Val = function(x,y,z) {
    return (sameVal(x,y) && sameVal(y,z)); 
};

// check if 5 cards have the same color 
var same5col = function(tab) {
    var check5coul = true;
    for (var i=0;i<4;i++) {
        if ((tab[i]&3) != (tab[i+1]&3)) { return false; }
    }
    return check5coul;
};

var same = function (x,y) {
    return (x == y); 
};
 
var same4col = function(w,x,y,z) {
     return (same(w,x) && same(x,y) && same(y,z)); 
};
 
var flush = function(tab) {
    var tabCoul = tab.map(function(x) {return x&3; });
    tabCoul.sort(function(a, b){return (a-b);}); 
    var checkFlush = false;
 
    for (var i=0; i<tabCoul.length-3; i++) {
        if (same4col(tabCoul[i],tabCoul[i+1],
             tabCoul[i+2],tabCoul[i+3])) { return true; }
    }
    return checkFlush;   
};


var straight = function(tab) {
    var checkStraight = true;
    if ((tab[0]>>2) != 12) {
        for (var i=0,j=1; j<5; i++,j++) { 
            if (((tab[i]>>2)-1) != (tab[j]>>2)) { return false; }
        }
    } else {
        if (((tab[4]>>2)==8) || ((tab[4]>>2)==0)) {
            for (var i=0,j=1; j<4; i++,j++) {
                if (((tab[i]>>2)-1) != (tab[j]>>2)) { return false; }
            }
        } else { return false; } 
    }
    return checkStraight;
};


var helpCalculate = function(tab) {
    var l = tab.length;
    var i = 0; 
    while (i<l-1) {
        if (sameVal(tab[i],tab[i+1])) {
            if ((i<l-3) && same3Val(tab[i+1],tab[i+2],tab[i+3])) {
                return 50; 
            } else if ((i<l-2) && sameVal(tab[i+1],tab[i+2])) {
                return ((i==0) && (l==5) && sameVal(tab[i+3],tab[i+4])) ? 25 : 10;
            } else {
                return ((i==0) && (l==5) && same3Val(tab[i+2],tab[i+3],tab[i+4])) ? 25
                : ((l>3) && flush(tab)) ? 20
                : ((i<l-3) && sameVal(tab[i+2],tab[i+3])) ? 5
                : ((i==0) && (l==5) && sameVal(tab[i+3],tab[i+4])) ? 5
                : 2; 
            }                 
        }
        i++;                      
    }
    return ((l>3) && (i==(l-1)) && flush(tab)) ? 20 : "";
};
