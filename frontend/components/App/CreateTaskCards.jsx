import { BigNumber } from "ethers";
import Card from "./Card";

export default function CreateTaskCards(props) {
  var elements = [];
  const invalidTimestamp = BigNumber.from(0);
  for (var index = 0; index < props.data.length; index++) {
    console.log(props.data[index][2]);

    if (!props.data[index][2].isZero())
      elements.push(<Card data={props.data[index]} key={index} />);
  }

  return <>{elements}</>;
}
