import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./components/Navbar/Navbar";
import Codie from './components/Codie/Codie';
import Subtitles from './components/Subtitles/Subtitles';
import { Conversation } from "./components/Conversation/Conversation";



export default function Home() {

  return (
    <div >
      <Navbar />

      <div className="main-content-wrapper">
        <Codie top={"45%"} right={"50%"} />
        <Conversation />
      </div>

    </div>
  );
}
