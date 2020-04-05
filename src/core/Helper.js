import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./config";

// Concatenate 2 static data files
export const ConcatData = props => {
  let batches = [];
  props.data1.batches.map(batch => batches.push(batch));
  props.data2.batches.map(batch => batches.push(batch));
  return { collection: props.data1.collection, batches };
};

export const InitFirebase = () => {
  if (Firebase.apps.length === 0) {
    Firebase.initializeApp(config);
  }
};

export const GetCollection = props => {
  const { name, orderBy, where, callback } = props;
  if (name) {
    let ref = Firebase.firestore().collection(name);
    if (where) {
      ref = ref.where(where.left, where.op, where.right);
    }
    if (orderBy) {
      orderBy.forEach(ob => (ref = ref.orderBy(ob)));
    }
    ref
      .get()
      .then(snapshot => {
        let tmp = [];
        snapshot.forEach(doc => {
          tmp.push({ id: doc.id, ...doc.data() });
        });
        callback(tmp);
      })
      .catch(err => {
        console.log(`Error getting collection ${name}`, err);
      });
  }
};

// Join 2 collections
export const Join = (col1, field, col2) => {
  let col2_array = [];
  col2.docs.forEach(doc => {
    col2_array[doc.id] = { ...doc };
  });
  let result = [];
  col1.docs.forEach(doc => {
    // console.log('field', field);
    let docJson = {
      ...col2_array[doc[field]],
      ...doc,
      name2: col2_array[doc[field]].name,
      time_stamp2: col2_array[doc[field]].time_stamp
    };
    let docStr = JSON.stringify(docJson);
    const prefix = field.replace("id", "");
    docStr = docStr
      .replace("name2", prefix + "name")
      .replace("time_stamp2", prefix + "time_stamp");
    result.push(JSON.parse(docStr));
  });
  return { docs: result };
};
