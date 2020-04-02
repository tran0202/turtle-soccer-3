const ConcatData = props => {
  let batches = [];
  props.data1.batches.map(batch => batches.push(batch));
  props.data2.batches.map(batch => batches.push(batch));
  return { collection: props.data1.collection, batches };
};

export default ConcatData;
