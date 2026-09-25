import source from "./NavigationMenuExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function NavigationMenuExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Fondations</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-52">
              <li>
                <NavigationMenuLink href="/design-system/colors">
                  Couleurs
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="/design-system/typography">
                  Typographie
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/design-system/button">
            Composants
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
// @example:end

export const getCode = createExampleCode(source)
