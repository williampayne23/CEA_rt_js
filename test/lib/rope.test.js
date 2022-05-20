import {
  splitAt, insert, deleteRange,
  createRopeFromMap, rebalance
} from '../../lib/rope'

const createLeaf = (text) => createRopeFromMap({
  text,
  kind: 'leaf'
})

//Moved branch up here so I could use it in a few tests
const branch = createRopeFromMap({
  kind: 'branch',
  left: {
    left: {
      kind: 'leaf',
      text: 't'
    },
    right: {
      kind: 'leaf',
      text: 'e'
    },
    kind: 'branch'
  },
  right: {
    kind: 'branch',
    right: {
      kind: 'leaf',
      text: 'st'
    }
  }
})

const deeplyUnbalanced = createRopeFromMap({
  kind: 'branch',
  right: {
    kind : 'branch',
    right: {
      kind: 'branch',
      right: {
        kind: 'branch',
        right: {
          kind: 'branch', 
          right: {kind: 'leaf', text: ' jumped'},
          left: {kind: 'leaf', text: '  fox'}
      },
        left: {kind: 'leaf', text: ' brown'}
      }
    },
    left: {kind: 'leaf', text: ' quick'}
  },
  left: {kind: 'leaf', text: 'The'}
})


/* 
  These tests are here as a starting point, they are not comprehensive
*/
describe("rope basics", () => {
  test("leaf constructor", () => expect(createLeaf('test').toString()).toEqual('test'));
  test("leaf size", () => expect(createLeaf('test').size()).toEqual(4));

  test("branch constructor", () => expect(branch.toString()).toEqual('test'));
  test("branch size", () => expect(branch.size()).toEqual(4));
});

describe("Split", () => {
  test("Leaf split", () => expect(splitAt(createLeaf('test'), 2).left.toString()).toEqual('te'))

  test("Branch left split", () => expect(splitAt(branch, 1).left.toString()).toEqual('t'))
  test("Branch right split", () => expect(splitAt(branch, 3).left.toString()).toEqual('tes'))


  test("Split past endpoint", () => expect(splitAt(branch, 10).left.toString()).toEqual('test'))
  test("Split at string start", () => expect(splitAt(branch, 0).left.toString()).toEqual(''))
  test("Split before string start", () => expect(splitAt(branch, -100).left.toString()).toEqual(''))
  test("Split null branches", () => expect(splitAt(deeplyUnbalanced, 10).left.toString()).toEqual("The quick "))
})

describe("insertion", () => {
  test("simple insertion", () => expect(insert(createLeaf('test'), '123', 2).toString()).toEqual('te123st'));
  test("ending insertion", () => expect(insert(createLeaf('test'), '123', 4).toString()).toEqual('test123'));
  test("beginning insertion", () => expect(insert(createLeaf('test'), '123', 0).toString()).toEqual('123test'));

  test("simple insertion branch", () => expect(insert(branch, '123', 2).toString()).toEqual('te123st'));
  test("ending insertion branch", () => expect(insert(branch, '123', 4).toString()).toEqual('test123'));
  test("beginning insertion branch", () => expect(insert(branch, '123', 0).toString()).toEqual('123test'));
});

describe("deletion", () => {
  test("simple deletion", () => expect(deleteRange(createLeaf('test'), 1, 3).toString()).toEqual('tt'));
  test("delete until end", () => expect(deleteRange(createLeaf('test'), 2, 4).toString()).toEqual('te'));
  test("delete beginning", () => expect(deleteRange(createLeaf('test'), 0, 2).toString()).toEqual('st'));
  test("delete then insert", () => expect(insert(deleteRange(createLeaf('test'), 1, 3), 'abc', 2).toString()).toEqual('ttabc'));

  test("delete from branch", () => expect(deleteRange(branch, 1, 3).toString()).toEqual('tt'))
  test("delete until end from branch", () => expect(deleteRange(branch, 2, 4).toString()).toEqual('te'));
  test("delete beginning from branch", () => expect(deleteRange(branch, 0, 2).toString()).toEqual('st'));
  test("delete then insert from branch", () => expect(insert(deleteRange(branch, 1, 3), 'abc', 2).toString()).toEqual('ttabc'));
});

describe('Extra Credit: tree is rebalanced', () => {
  test("Leaves with size 1", () => {
    expect(rebalance(createRopeFromMap({
      kind: 'branch',
      left: { kind: 'leaf', text: 'a' },
      right: {
        kind: 'branch',
        left: { kind: 'leaf', text: 'b' },
        right: {
          kind: 'branch',
          left: { kind: 'leaf', text: 'c' },
          right: { kind: 'leaf', text: 'd' }
        }
      },
    }))).toEqual(createRopeFromMap({
      kind: 'branch',
      left: {
        kind: 'branch',
        left: { kind: 'leaf', text: 'a' },
        right: { kind: 'leaf', text: 'b' }
      },
      right: {
        kind: 'branch',
        left: { kind: 'leaf', text: 'c' },
        right: { kind: 'leaf', text: 'd' }
      },
    }))
  })

  test("Leaves with varying size", () => {
    expect(rebalance(branch)).toEqual(createRopeFromMap({
      kind: 'branch',
      left: {
        kind: 'branch',
        left: {kind: 'leaf', text: 't'},
        right: {kind: 'leaf', text: 'e'}
      },
      right: {
        kind: 'branch',
        left: {kind: 'leaf', text: 's'},
        right: {kind: 'leaf', text: 't'}
      }
    }))
  })

  test("Deeply unbalanced", () => {
    expect(rebalance(deeplyUnbalanced).isBalanced()).toEqual(true)
  })
})
