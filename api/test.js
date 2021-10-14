const async = require('async')
const _ = require('lodash')

const entries = [
  {
    id:'<1>',
    time:1458692752478,
    messaging:[
      {
        sender:{
          id:'1',
        },
        recipient:{
          id:'1',
        },
      },
    ],
  },
  {
    id:'<2>',
    time:1458692752477,
    messaging:[
      {
        sender:{
          id:'2',
        },
        recipient:{
          id:'1',
        },
      },
    ],
  },
  {
    id:'<3>',
    time:1458692752476,
    messaging:[
      {
        sender:{
          id:'1',
        },
        recipient:{
          id:'2',
        },
      },
    ],
  },
]
// console.log(entries)
// const sorted = _.orderBy(entries, ["time",])
// console.log(sorted)
// const jobs = [1,2,3,4,5,]
// (async () => {
//   await async.eachLimit(jobs, 1, async (j) => {
//     await new Promise((res, rej) => {
//       setTimeout(() => {
//         if (j === 3) return rej(new Error("3333333333333"))
//         console.log(j, "done")
//         res(j)
//       }, j * 500)
//     }).catch(console.log)
//   })
// })()

// const ob = { 
//   1:[
//     { sender:{ id:"1", },recipient:{ id:"1", }, },
//     { sender:{ id:"1", },recipient:{ id:"2", }, },
//     { sender:{ id:"1", },recipient:{ id:"3", }, },],
//   2:[
//     { sender:{ id:"2", },recipient:{ id:"1", }, },
//   ],
// }
const ob2 = _.groupBy(entries, 'messaging[0].sender.id')
const body = {
  entry: entries,
}
const sortByTime = _.orderBy(body.entry, ['time',])
console.log(sortByTime)
const groupBySenderId = _.groupBy(sortByTime, 'messaging[0].sender.id')

_.forEach(groupBySenderId, (entriess) => {
  async.eachLimit(entriess, 1, async (entry) => {
    const webhookEvent = entry.messaging[0]
    await new Promise((res,  rej) => {
      setTimeout(() => {
        console.log(entry.id, webhookEvent.sender.id, webhookEvent.recipient.id)
        res()
      }, entry.id === '<2>' ? 3000 : 1000)
    })
  })
})

// Chạy đồng bộ trên các entry có cùng sender Id
