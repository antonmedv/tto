#!/usr/bin/env node
const {list, head, tail, foldl, at, update} = require('@medv/list')
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const _ = null

const state =
  list(_, list(_, list(_,
    list(_, list(_, list(_,
      list(_, list(_, list(_)))))))))

console.log('Welcome to Tic-Tac-tOe!\n')
console.log('  Type "a1" or "1a" to make a move.\n')
console.log('  Type "q" to exit.\n')

const turn = (state) => input => {
  if (input) {
    if (input === 'q') {
      process.exit(0)
    }

    const coord = parse(input)
    const i = at(coord, 0)
    const j = at(coord, 1)
    if (i !== -1 && j !== -1) {
      const state1 = update(state, i * 3 + j, _ => 'x')

      if (isWin('x', state1)) {
        printState(state1)
        write(`x won!\n`)
        process.exit(0)
      } else {
        ask(state1)
      }

    } else {
      rl.question('> ', turn(state))
    }
  } else {
    ask(state)
  }
}

const ask = state => {
  printState(state)
  rl.question('> ', turn(state))
}

const parse = input => {
  const parseAbc = i => {
    switch (i) {
      case 'a':
        return 0
      case 'b':
        return 1
      case 'c':
        return 2
    }
  }
  const coord = input.split('')
  const x = list('a', list('b', list('c')))
  const y = list('1', list('2', list('3')))
  const nope = list(-1, list(-1))
  return foldl(x, nope, (i, xs) =>
    foldl(y, xs, (j, ys) =>
      (coord.includes(i) && coord.includes(j)) ?
        list(parseAbc(i), list(parseInt(j) - 1)) : ys))
}

const isWin = (player, state) => {
  const z = i => at(state, i) === player
  const test = (i, j, k) => z(i) && z(j) && z(k)
  return test(0, 1, 2)
    || test(3, 4, 5)
    || test(6, 7, 8)
    || test(0, 3, 6)
    || test(1, 4, 7)
    || test(2, 5, 8)
    || test(0, 4, 8)
    || test(6, 4, 2)
}

const write = text => process.stdout.write(text)

const printState = state => {
  write('   1 2 3\n')

  const printCol = (state, i) => {
    if (i > 0) {
      printAbc(i)
      printRow(state, i, 3)
    }
  }
  const printRow = (state, i, j) => {
    print1(head(state))
    if (j > 1) {
      printRow(tail(state), i, j - 1)
    } else {
      write('\n')
      printCol(tail(state), i - 1)
    }
  }
  const printAbc = i => {
    switch (i) {
      case 3:
        return write('a |')
      case 2:
        return write('b |')
      case 1:
        return write('c |')
    }
  }
  const print1 = cell => (cell ? write(cell) : write('_'), write('|'))

  printCol(state, 3)
}

turn(state)()
