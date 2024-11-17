import { useEffect, useState } from "react";
import DropzoneComponent from "./DropzoneComponent"
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [leftFiles, setLeftFiles] = useState<File[]>([]);
  const [rightFiles, setRightFiles] = useState<File[]>([]);

  const [leftFileModified, setLeftFileModified] = useState<number>(0);
  const [rightFileModified, setRightFileModified] = useState<number>(0);

  const handleLeftDrop = (acceptedFiles: File[]) => setLeftFiles(acceptedFiles);
 
  const handleRightDrop = (acceptedFiles: File[]) => setRightFiles(acceptedFiles);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    (async () => {
      let fileName = leftFiles[0].name;
      setLeftFileModified(leftFiles[0].lastModified);
      setGreetMsg(await invoke("greet", { name: fileName }));
    })();
  });

  useEffect(() => {
    (async () => {
      let fileName = rightFiles[0].name;
      setRightFileModified(rightFiles[0].lastModified);
      setGreetMsg(await invoke("greet", { name: fileName }));
    })();
  });

  useEffect(() => {
    const interval = setInterval(() => {
        // 每隔5秒检查下文件是否有变化
        let leftFileModifiedNow = leftFiles[0].lastModified;
        let rightFileModifiedNow = rightFiles[0].lastModified;
        if (leftFileModifiedNow !== leftFileModified) {
          setLeftFileModified(leftFileModifiedNow);
          setGreetMsg("left file modified");
        }
        if (rightFileModifiedNow !== rightFileModified) {
          setRightFileModified(rightFileModifiedNow);
          setGreetMsg("right file modified");
        }
        // invoke('your_rust_command').catch(console.error);
    }, 5000);
    return () => {
      // 清理定时器
      clearInterval(interval);
    };
  });

  return (
    <main className="container">
      

      <div className="row">
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
        <DropzoneComponent onDrop={handleLeftDrop}/>
        <DropzoneComponent onDrop={handleRightDrop}/>
      </div>


      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}



export default App;
