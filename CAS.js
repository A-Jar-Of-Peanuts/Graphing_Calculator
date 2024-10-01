export default class ptree {
    constructor(eq) {
        this.eq = eq;
        this.root = null;
    }
    parse() {

    }

    isolateZ() {
        
    }
}

export class node {
    constructor(left, right, parent){
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
}

export function hi() {
    console.log("hi");
}