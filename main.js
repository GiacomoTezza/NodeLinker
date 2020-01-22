var nodes = [];
var links = [];
var r = 15;
var selected = [];


// Initialization
function setup() {
    createCanvas(1200, 900);
    background(0);

    for (var i = 0; i < random(3, 6); i++) {
        var rX = random(0 + r, width - r);
        var rY = random(0 + r, height - r);
        if (isValidNode(rX, rY)) {
            nodes.push(new Node(rX, rY));
        } else {
            i--;
        }
    }
}


// Game loop
function draw() {
    selected = [];

    // Draws each link
    for (var i=0; i < links.length; i++) {
        links[i].draw();
    }

    // Updates and draws each node. Groups selected nodes
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
        if (nodes[i].isSelected && selected.indexOf(nodes[i]) == -1) {
            selected.push(nodes[i]);
        }
    }

    // Creates new link between 2 selected nodes
    if (selected.length == 2) {
        var linkNode1 = selected[0];
        var linkNode2 = selected[1];
        var newLink = new Link(linkNode1, linkNode2);
        if (isValidLink(linkNode1, linkNode2)) {
            links.push(newLink);
            newLink.node1.addLinks(1);
            newLink.node2.addLinks(1);
            // if (isValidNode(newLink.getMidpoint()[0], newLink.getMidpoint()[1])) {
            var middleNode = new Node(newLink.getMidpoint()[0], newLink.getMidpoint()[1]);
            middleNode.addLinks(2);
            nodes.push(middleNode);
            // }
        }
        linkNode1.toggleSelection();
        linkNode2.toggleSelection();
    }
}


function mouseClicked() {
    if (selected.length < 2) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].isAlive && Math.pow(nodes[i].x - mouseX, 2) + Math.pow(nodes[i].y - mouseY, 2) < Math.pow(r, 2)) {
                nodes[i].toggleSelection();
            }
        }
    }
    
    console.log(selected);
    console.log(links)
}


// Check if a new node collide to others
function isValidNode(x, y) {
    if (nodes.length == 0) {
        return true;
    } else {
        for (var i = 0; i < nodes.length; i++) {
            if (!Math.pow(nodes[i].x - x, 2) + Math.pow(nodes[i].y - y, 2) <= Math.pow(2*r, 2)) {
                return false;
            }
        }
    }
    return true;
}


// Check if a new link collide to others
function isValidLink(node1, node2) {
    if (links.length == 0) {
        return true;
    } else {
        for (var i = 0; i < links.length; i++) {
            if (isIntersecting(node1.x, node1.y, node2.x, node2.y, links[i].node1.x, links[i].node1.y, links[i].node2.x, links[i].node2.y)) {
                console.log("Collision!")
                return false;
            }
        }
    }
    return true;
}


// Return true if the segment are colliding
function isIntersecting(x1, y1, x2, y2, x3, y3, x4, y4) {
    var isP1OnLine = dist(x1, y1, x3, y3) + dist(x1, y1, x4, y4) == dist(x3, y3, x4, y4);
    var isP2OnLine = dist(x2, y2, x3, y3) + dist(x2, y2, x4, y4) == dist(x3, y3, x4, y4);
    var isP3OnLine = dist(x3, y3, x1, y1) + dist(x3, y3, x2, y2) == dist(x1, y1, x2, y2);
    var isP4OnLine = dist(x3, y3, x1, y1) + dist(x3, y3, x2, y2) == dist(x1, y1, x2, y2);
    // if ( myXOR(myXOR(x1 == x3 && y1 == y3, x1 == x4 && y1 == y4), myXOR(x2 == x3 && y2 == y3, x2 == x4 && y2 == y4) )) {
    if (myXOR(isP1OnLine, isP2OnLine) || myXOR(isP3OnLine, isP4OnLine)) {
        return false;
    }
    var denominator = ((x2 - x1) * (y4 - y3)) - ((y2 - y1) * (x4 - x3));
    var numerator1 = ((y1 - y3) * (x4 - x3)) - ((x1 - x3) * (y4 - y3));
    var numerator2 = ((y1 - y3) * (x2 - x1)) - ((x1 - x3) * (y2 - y1));

    if (denominator == 0) {
        return numerator1 == 0 && numerator2 == 0;
    }

    var r = numerator1 / denominator;
    var s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
}


// logic XOR, nothing more... what were you expecting?
function myXOR(a, b) {
    return ( a || b ) && !( a && b );
}


// ---------------------------------------------


class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isNew = true;
        this.isSelected = false;
        this.isAlive = true;
        this.linksNumber = 0;
    }

    update() {
        if (this.linksNumber >= 3) {
            this.isAlive = false;
        }
    }

    draw() {
        strokeWeight(2);
        stroke(255);
        if (this.isSelected) {
            fill(240, 145, 10);
        } else if (!this.isAlive) {
            fill(255, 0, 0);
        } else {
            fill(88)
        }
        ellipse(this.x, this.y, r*2);
    }

    toggleSelection() {
        if (this.isAlive) {
            this.isSelected = !this.isSelected;
        }
    }

    addLinks(n) {
        this.linksNumber += n;
    }
}


class Link {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
    }

    draw() {
        strokeWeight(5);
        stroke(255);
        line(this.node1.x, this.node1.y, this.node2.x, this.node2.y);
    }

    getMidpoint() {
        return [ (this.node1.x + this.node2.x)/2, (this.node1.y + this.node2.y)/2 ];
    }
}