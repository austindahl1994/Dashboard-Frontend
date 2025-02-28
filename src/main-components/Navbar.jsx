import { Nav } from "react-bootstrap"
const Navbar = () => {
  return (
    <div>
        <Nav defaultActiveKey="/dashboard" className="flex-column">
            {/* <Nav.Link href='/dashboard'>Eventual Navbar</Nav.Link> */}
        </Nav>
    </div>
  )
}

export default Navbar