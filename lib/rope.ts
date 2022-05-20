/*
  Note: this file is in typescript, but you do not need to use typings if you don't want.

  The type annotations are just there in case they are helpful.
*/

type MapBranch = {
  left?: MapRepresentation,
  right?: MapRepresentation,
  size: number,
  kind: 'branch'
}
type MapLeaf = {
  text: string,
  kind: 'leaf'
}
type MapRepresentation = MapBranch | MapLeaf

interface IRope {
  toString: () => string,
  size: () => number,
  height: () => number,
  toMap: () => MapRepresentation,
  isBalanced: () => Boolean,
  isLeaf: () => Boolean
}

export class RopeLeaf implements IRope {
  text: string;

  // Note: depending on your implementation, you may want to to change this constructor
  constructor(text: string) {
    this.text = text;
  }

  // just prints the stored text
  toString(): string {
    return this.text
  }

  size() {
    return this.text.length;
  }

  height() {
    return 1;
  }

  toMap(): MapLeaf {
    return {
      text: this.text,
      kind: 'leaf'
    }
  }

  isBalanced() {
    return true;
  }

  isLeaf() {
    return true
  }
}

export class RopeBranch implements IRope {
  left: IRope;
  right: IRope;
  cachedSize: number;

  constructor(left: IRope, right: IRope) {
    this.left = left;
    this.right = right;
    // Please note that this is defined differently from "weight" in the Wikipedia article.
    // You may wish to rewrite this property or create a different one.
    this.cachedSize = (left ? left.size() : 0) +
      (right ? right.size() : 0)
  }

  // how deep the tree is (I.e. the maximum depth of children)
  height(): number {
    return 1 + Math.max(this.leftHeight(), this.rightHeight())
  }
  
  // Please note that this is defined differently from "weight" in the Wikipedia article.
  // You may wish to rewrite this method or create a different one.
  size() {
    return this.cachedSize;
  }

  /*
    Whether the rope is balanced, i.e. whether any subtrees have branches
    which differ by more than one in height. 
  */
  isBalanced(): boolean {
    const leftBalanced = this.left ? this.left.isBalanced() : true
    const rightBalanced = this.right ? this.right.isBalanced() : true

    return leftBalanced && rightBalanced
      && Math.abs(this.leftHeight() - this.rightHeight()) < 2
  }

  leftHeight(): number {
    if (!this.left) return 0
    return this.left.height()
  }

  rightHeight(): number {
    if (!this.right) return 0
    return this.right.height()
  }

  // Helper method which converts the rope into an associative array
  // 
  // Only used for debugging, this has no functional purpose
  toMap(): MapBranch {
    const mapVersion: MapBranch = {
      size: this.size(),
      kind: 'branch'
    }
    if (this.right) mapVersion.right = this.right.toMap()
    if (this.left) mapVersion.left = this.left.toMap()
    return mapVersion
  }

  toString(): string {
    return (this.left ? this.left.toString() : '')
      + (this.right ? this.right.toString() : '')
  }

  isLeaf(): Boolean { 
    return false
  }
}


export function createRopeFromMap(map: MapRepresentation): IRope {
  if (map.kind == 'leaf') {
    return new RopeLeaf(map.text)
  }

  let left, right = null;
  if (map.left) left = createRopeFromMap(map.left)
  if (map.right) right = createRopeFromMap(map.right)
  return new RopeBranch(left, right);
}


// This is an internal API. You can implement it however you want. 
// (E.g. you can choose to mutate the input rope or not)
export function splitAt(rope: IRope, position: number): { left: IRope, right: IRope } {
  if(rope.size() < position){
    return {left: rope, right: new RopeLeaf("")}
  }

  if(rope.isLeaf()){
    //Split leaf
    const string = rope.toString()
    const left = string.substring(0, position)
    const right = string.substring(position)
    return {left: new RopeLeaf(left), right: new RopeLeaf(right)}
  }

  const branch = rope as RopeBranch
  //Split branch
  //Cases; Split is in left branch, split is in right branch, split is between two branches.

  if(branch.left == null){
    return splitAt(branch.right, position)
  }
  if(branch.right == null){
    return splitAt(branch.left, position)
  }

  //Split is between two branches
  if(branch.left.size() == position){
    return {left: branch.left, right: branch.right}
  }

  //Split is in the left branch
  if(branch.left.size() > position){
    const splitLeft = splitAt(branch.left, position)
    return {left: splitLeft.left, right: new RopeBranch(splitLeft.right, branch.right)}
  }

  //Split is in the right branch
  const splitRight = splitAt(branch.right, position - branch.left.size())
  return {left: new RopeBranch(branch.left, splitRight.left), right: splitRight.right}
}

export function deleteRange(rope: IRope, start: number, end: number): IRope {
  const leftBranch = splitAt(rope, start).left
  const rightBranch = splitAt(rope, end).right
  return new RopeBranch(leftBranch, rightBranch)
}

export function insert(rope: IRope, text: string, location: number): IRope {
  const {left : leftBranch, right} = splitAt(rope, location)
  const rightBranch = new RopeBranch(new RopeLeaf(text), right)
  return new RopeBranch(leftBranch, rightBranch)
}

export function rebalance(rope: IRope): IRope {
  //Recursively splits the tree at the midpoint until you get size 1 leaves
  //You could change the stopping condition below to choose some other target size for leaves.
  if(rope.size() <= 1){
    return rope
  }

  const midpoint = Math.floor(rope.size() / 2)
  const {left, right} = splitAt(rope, midpoint)
  return new RopeBranch(rebalance(left), rebalance(right))
}
