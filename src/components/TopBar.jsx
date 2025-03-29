import { DarkThemeToggle, Navbar, NavbarBrand } from 'flowbite-react';

export function TopBar() {
  return (
    <Navbar fluid>
      <NavbarBrand href="">
        <h1 className="text-3xl font-bold text-blue-600">Pokédex</h1>
      </NavbarBrand>
      <div className="flex md:order-2">
        <DarkThemeToggle />
      </div>
    </Navbar>
  );
}
