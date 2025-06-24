import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./components/Navbar/Navbar";
import Codie from './components/Codie/Codie';
import Subtitles from './components/Subtitles/Subtitles';




export default function Home() {

  return (
    <div >
      <Navbar />

      <div className="main-content-wrapper">
        <Codie top={"43%"} right={"50%"} />
        <Subtitles text={"Hello world, I am Codie your friendly iCode assistant. Today we are going to be taking a belt assessment. Are you ready for your challenge? Beep boop beep boop beep boop beep boop beep boop beep boop"} />
      </div>

    </div>
  );
}
