import { Nav } from "react-bootstrap"
const Navbar = () => {
  return (
    <div>
        <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href='/home'>Eventual Navbar</Nav.Link>
        </Nav>
    </div>
  )
}

export default Navbar