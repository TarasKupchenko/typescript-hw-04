import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
} from "react";
import noop from "lodash/noop";

type SelectedMenu = { id: MenuIds };

type MenuSelected = { selectedMenu: SelectedMenu };

type MenuAction = { onSelectedMenu: (menu: SelectedMenu) => void };

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type PropsProvider = {
  children: ReactNode;
};

type PropsMenu = {
  menus: Menu[];
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: { id: "first" },
});
const MenuActionContext = createContext<MenuAction>({ onSelectedMenu: noop });

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({
    id: "first",
  });

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext<MenuAction>(MenuActionContext);
  const { selectedMenu } = useContext<MenuSelected>(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{" "}
          {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
