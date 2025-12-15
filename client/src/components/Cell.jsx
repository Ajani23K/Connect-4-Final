import { HUMAN, AI } from "../constants";


export default function Cell({ value }) {
let className = "cell";


if (value === HUMAN) className += " human";
if (value === AI) className += " ai";


return <div className={className} />;
}