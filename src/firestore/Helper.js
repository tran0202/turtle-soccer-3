import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from './config'

// Concatenate 2 static data files
export const ConcatData = (props) => {
  let batches = []
  props.data1.batches.map((batch) => batches.push(batch))
  props.data2.batches.map((batch) => batches.push(batch))
  return { collection: props.data1.collection, batches }
}

export const InitFirebase = () => {
  if (Firebase.apps.length === 0) {
    Firebase.initializeApp(config)
  }
}

export const GetDocument = (props) => {
  const { coll, id, callback } = props
  if (coll && id) {
    let ref = Firebase.firestore().collection(coll).doc(id)
    ref
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log('No such document!')
        } else {
          const result = { id: doc.id, ...doc.data() }
          if (callback) {
            callback(result)
          }
        }
      })
      .catch((err) => {
        console.log(`Error getting document ${coll}/${id}`, err)
      })
  }
}

export const GetCollection = (props) => {
  const { name, orderBy, where, callback } = props
  if (name) {
    let ref = Firebase.firestore().collection(name)
    if (where) {
      ref = ref.where(where.left, where.op, where.right)
    }
    if (orderBy) {
      orderBy.forEach((ob) => {
        if (ob.desc) {
          ref = ref.orderBy(ob.field, 'desc')
        } else {
          ref = ref.orderBy(ob)
        }
      })
    }
    ref
      .get()
      .then((snapshot) => {
        let tmp = []
        snapshot.forEach((doc) => {
          tmp.push({ id: doc.id, ...doc.data() })
        })
        if (callback) {
          callback(tmp)
        }
      })
      .catch((err) => {
        console.log(`Error getting collection ${name}`, err)
      })
  }
}

// Join 2 collections
export const Join = (col1, field, col2) => {
  let col2_array = []
  col2.docs.forEach((doc) => {
    col2_array[doc.id] = { ...doc }
  })
  let result = []
  col1.docs.forEach((doc) => {
    // console.log('field', field);
    if (col2_array[doc[field]]) {
      let docJson = {
        ...col2_array[doc[field]],
        ...doc,
        name2: col2_array[doc[field]].name,
        time_stamp2: col2_array[doc[field]].time_stamp,
      }
      let docStr = JSON.stringify(docJson)
      const prefix = field.replace('id', '')
      docStr = docStr.replace('name2', prefix + 'name').replace('time_stamp2', prefix + 'time_stamp')
      result.push(JSON.parse(docStr))
    }
  })
  return { docs: result }
}
