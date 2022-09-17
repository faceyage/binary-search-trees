class Tree {
  constructor(arr) {
    //bst must be sorted so first sort the array
    arr.sort((a, b) => a - b);
    this.root = this.buildTree(arr);
  }

  buildTree(arr) {
    if (arr.length === 0) {
      return null;
    }
    const mid = Math.floor(arr.length / 2);
    const node = new Node(arr[mid]);
    node.left = this.buildTree(arr.slice(0, mid));
    node.right = this.buildTree(arr.slice(mid + 1, arr.length));
    return node;
  }

  prettyPrint = (node = this.root, prefix = "", isLeft = true) => {
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  insert(value) {
    const node = new Node(value);
    let previous;
    let curr = this.root;

    while (curr !== null) {
      previous = curr;
      if (value >= curr.value) {
        curr = curr.right;
      } else {
        curr = curr.left;
      }
    }

    if (value >= previous.value) {
      previous.right = node;
    } else {
      previous.left = node;
    }
  }

  delete(value) {
    this.root = this.#deleteRec(this.root, value);
  }

  #deleteRec(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.value) {
      node.left = this.#deleteRec(node.left, value);
    } else if (value > node.value) {
      node.right = this.#deleteRec(node.right, value);
    }
    //found value to be deleted
    else {
      //node has 0 or 1 child so return other node
      if (node.left === null) return node.right;
      else if (node.right === null) return node.left;
      //node has 2 child so replace with minimum child of right child
      node.value = this.minValue(node.right);
      node.right = this.#deleteRec(node.right, value);
    }
    return node;
  }

  //finds the first node with given value. returns -1 if can't find
  find(value) {
    let curr = this.root;
    while (curr !== null) {
      if (curr.value === value) return curr;
      else if (value > curr.value) curr = curr.right;
      else curr = curr.left;
    }
    return null;
  }

  levelOrder() {
    const list = [];

    const queue = [];
    queue.push(this.root);
    while (queue.length !== 0) {
      const curr = queue.shift();
      list.push(curr.value);
      if (curr.left !== null) queue.push(curr.left);
      if (curr.right !== null) queue.push(curr.right);
    }
    return list;
  }

  levelOrderRec() {
    const list = [];
    const h = this.height();
    for (let i = 1; i <= h; i++) {
      printCurrentLevel(this.root, i);
    }
    function printCurrentLevel(node, level) {
      if (node === null) {
        return;
      }
      if (level === 1) {
        list.push(node.value);
      } else if (level > 1) {
        printCurrentLevel(node.left, level - 1);
        printCurrentLevel(node.right, level - 1);
      }
    }
    return list;
  }

  preOrder(node = this.root) {
    if (node === null) return [];
    return [
      ...[node.value],
      ...this.preOrder(node.left),
      ...this.preOrder(node.right),
    ];
  }

  inOrder(node = this.root) {
    if (node === null) return [];
    return [
      ...this.inOrder(node.left),
      ...[node.value],
      ...this.inOrder(node.right),
    ];
  }

  postOrder(node = this.root) {
    if (node === null) return [];
    return [
      ...this.postOrder(node.left),
      ...this.postOrder(node.right),
      ...[node.value],
    ];
  }

  //returns height of the tree
  height(node = this.root) {
    if (node === null) {
      return 0;
    }
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  depth(node) {
    let curr = this.root;
    let depth = 0;

    while (curr !== null) {
      if (node.value > curr.value) {
        curr = curr.right;
      } else if (node.value < curr.value) {
        curr = curr.left;
      } else if (node === curr) {
        return depth;
      }
      depth++;
    }
    return depth;
  }

  //returns true if tree is balanced false otherwise
  isBalanced() {
    if (this.root === null) {
      return true;
    }
    const hLeft = this.height(this.root.left);
    const hRight = this.height(this.root.right);

    if (Math.abs(hLeft - hRight) > 1) return false;
    else return true;
  }

  reBalance() {
    //use any traversal method to give array of tree
    this.root = this.buildTree(this.levelOrder());
  }

  //returns minimum value in tree with given root
  minValue(node) {
    if (node === null) {
      return node;
    }

    let curr = node;
    while (curr.left !== null) {
      curr = curr.left;
    }

    return curr.value;
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function randomArr(amount, min, max) {
  const arr = [];
  for (let i = 0; i < amount; i++) {
    const randomNum = getRandomNumberBetween(min, max);
    arr.push(randomNum);
  }
  return arr;
}

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function driver() {
  const arr = randomArr(5, 0, 100);
  const tree = new Tree(arr);
  // tree.prettyPrint();
  console.log(`Tree is balanced: ${tree.isBalanced() ? "Yes" : "No"}`);
  console.log(`Level Order: ${tree.levelOrder()}`);
  console.log(`In Order: ${tree.inOrder()}`);
  console.log(`Pre Order: ${tree.preOrder()}`);
  console.log(`Post Order: ${tree.postOrder()}`);
  tree.insert(getRandomNumberBetween(200, 300));
  tree.insert(getRandomNumberBetween(200, 300));
  tree.insert(getRandomNumberBetween(200, 300));
  tree.insert(getRandomNumberBetween(200, 300));
  console.log(
    `Tree is balanced after add: ${tree.isBalanced() ? "Yes" : "No"}`
  );
  tree.prettyPrint();
  console.log("Tree is re-balancing ...");
  tree.reBalance();
  console.log(
    `Tree is balanced after re-balance: ${tree.isBalanced() ? "Yes" : "No"}`
  );
  console.log(`In Order: ${tree.inOrder()}`);
  console.log(`Pre Order: ${tree.preOrder()}`);
  console.log(`Post Order: ${tree.postOrder()}`);
  tree.prettyPrint();
}

driver();
