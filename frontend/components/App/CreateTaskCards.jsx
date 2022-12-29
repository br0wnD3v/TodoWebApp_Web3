import Card from "./Card";

export default function CreateTaskCards(props) {
  var elements = [];
  for (var index = 0; index < props.data.length; index++) {
    elements.push(<Card data={props.data[index]} key={index} />);
  }

  return <>{elements}</>;
}
