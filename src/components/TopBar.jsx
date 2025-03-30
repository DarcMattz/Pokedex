import { DarkThemeToggle, Navbar, NavbarBrand } from "flowbite-react";

export function TopBar() {
  return (
    <Navbar fluid>
      <NavbarBrand href="">
        <h1 className="text-3xl font-bold text-blue-600">Pokédex</h1>
      </NavbarBrand>
      <DarkThemeToggle className="cursor-pointer" />
    </Navbar>
  );
}
