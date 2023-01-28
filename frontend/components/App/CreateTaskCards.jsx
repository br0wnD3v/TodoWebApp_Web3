import Card from "./Card";

export default function CreateTaskCards(props) {
  var elements = [];
  const mode = props.mode;
  console.log(mode);
  // 0 - Serial Number
  // 1 - Task
  // 2 - Timestamp
  // 3 - Status
  if (mode == 0) {
    for (var index = 0; index < props.data.length; index++) {
      if (!props.data[index][2].isZero())
        elements.push(<Card data={props.data[index]} key={index} />);
    }
  } else if (mode == 1) {
    for (var index = 0; index < props.data.length; index++) {
      if (!props.data[index][2].isZero() && props.data[index][3] == false)
        elements.push(<Card data={props.data[index]} key={index} />);
    }
  } else {
    for (var index = 0; index < props.data.length; index++) {
      if (!props.data[index][2].isZero() && props.data[index][3] == true)
        elements.push(<Card data={props.data[index]} key={index} />);
    }
  }

  return <>{elements}</>;
}
