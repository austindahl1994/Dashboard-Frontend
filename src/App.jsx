import { testDB, getUser } from "./testDB";
import CharacterGeneration from "./widgets/CharGen/CharacterGeneration";
import { Button } from "react-bootstrap";
function App() {
  return (
    <>
      <CharacterGeneration />
      <Button onClick={() => testDB()}>Test Database</Button>
      <div style={{ display: "flex" }}>
        <Button
          onClick={() => {
            getUser(1);
          }}
        >
          User 1
        </Button>
        <Button
          onClick={() => {
            getUser(2);
          }}
        >
          User 2
        </Button>
      </div>
    </>
  );
}

export default App;
