# Protorians AUN

Protorian AUN est une librairie JavaScript pour la conception de l'interface utilisateur WEB.
Il est écrit en `TypeScript` et a été crée en utilisant l'outils `ViteJS`.
Le fonctionnement est basé sur l'imbrication de fonctions widgets et composants.
Les Widgets sont des représentant des balise native en HTML. Par contre les composants sont des blocs de widgets en vue d'une réutilisation et d'une personnalisation par usage par le biais de propriétés.

# Aperçu

Pour cet exemple nous allons créer un composant pour afficher `Hello World`

```javascript
import type { IWProps } from "@protorians/aun/types";
import { Widget } from "@protorians/aun/index";

// Typage de propriétés
interface IHelloProps extends IWProps {
  name: string;
}
// Composant
const myComponent = (props: IHelloProps) =>
  Widget({
    children: `Hello ${props.name}`,
  });

// Hydrater sur la balise HTML "<HelloWorld name="Me"></HelloWorld>"
HydrateComponentQueue("HelloWorld", myComponent);

// Deposer le composant dans la balise HTML avec l'id "root" (<div id="root"></div>)
DropComponent(myComponent, "#root");
DropComponent(myComponent, document.querySelector("#root"));
```

## License

Copyright 2023 — Protorians

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
