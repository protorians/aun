import CoreAppearance from "@protorians/core/appearance";
import { AunConstruct, AunElement, AunState, AunWidget, AunView, AunStackViews } from "./foundations";
import { UnCamelize } from "@protorians/core/utilities";
const aunWindow = Object.assign({}, {
    _CurrentStackViews: undefined,
}, window);
aunWindow.AUNRC = aunWindow.AUNRC || {};
export function useAUNWindow() {
    return Object.assign({}, {
        AUNRC: aunWindow.AUNRC || {},
        // AUNCMQ: new AUNContrustMutations(),
    }, window);
}
/**
 * WidgetWhitelistProps
 * @description Liste des propriétés réservés aux traitement des widgets
 */
export const WidgetWhitelistProps = ('style removeStyle toggleClassname classname removeClassname inlineClassname measure offset html append data attribute removeAttribute toggleAttribute attributeNS').split(' ');
/**
 * setWidgetProperty
 * @param widget Widget cible
 * @param props Propriété à analyser
 */
export function setWidgetProperty(widget, props) {
    Object.entries(props).forEach(({ 0: name, 1: value }) => {
        if (WidgetWhitelistProps.indexOf(name) == -1) {
            name = UnCamelize(name);
            switch (typeof value) {
                case 'number':
                case 'string':
                    widget.element.instance.setAttribute(`${name}`, `${value}`);
                    break;
                case 'boolean':
                    if (value)
                        widget.element.instance.setAttribute(`${name}`, `${name}`);
                    break;
            }
        }
    });
    return widget;
}
/**
 * CreateState
 * @description Instance fonctionnelle d'usage de gestion des états AUN
 * @param state Valeur par default de l'état
 * @example CreateState<StateType>( stateValue )
 */
export function CreateState(state) {
    return new AunState(state);
}
/**
 * DropComponent
 * @param target Balise HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur
 * @param component Composant à deposer
 * @description Lier un composant à une cicle
 * @example DropComponent<PropsType>( '#root', Component( { ... } ) )
 * DropComponent<PropsType>( document.getElementById('root'), Component( { ... } ) )
 */
export function DropComponent(component, target) {
    target.append(component.element.instance);
    return component;
}
/**
 * DropComponents
 * @description Lier plusieurs composants à plusieurs cicles.
 * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant à deposer dans l'élément HTML
 * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
 */
export function DropComponents(component, targets) {
    targets.forEach(target => DropComponent(component, target));
    return component;
}
// /**
//  * InstantiateComponent
//  * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies. À utiliser dans les cas l'IDE n'arrive pas typer correctement les variables.
//  * @param component Composant cible
//  * @example InstantiateComponent( component( props ) )
//  */
// export function InstantiateComponent( component : IWidget<any, any> ){ return component; }
/**
 * AsyncComponent
 * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. Il peut être ajouter aux enfants d'un widget
 * @param callback Fonction de renvoie pour le traitement d'un promesse. Puis renvoyer un composant instancié
 * @example AsyncComponent( ( resolve, reject ) => {
 *    setTimeout( () => resolve( component() ), 3000 )
 * })
 */
export async function AsyncComponent(callback) {
    return (new Promise(callback));
}
/**
 * UseComponent
 * @description Utiliser un composant dans une / plusieurs cibles
 * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant instancié
 * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
 * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
 */
export function UseComponent(component, target) {
    if (typeof target == 'string') {
        DropComponents(component, document.querySelectorAll(target));
    }
    else if (target instanceof NodeList) {
        DropComponents(component, target);
    }
    else if (target instanceof HTMLElement) {
        DropComponent(component, target);
    }
    else if (target instanceof AunElement) {
        DropComponent(component, target.instance);
    }
    return component;
}
/**
 * CreateComponentKit
 * @description Créer un Kit Composant
 * @param definition Définition du Kit
 * @example
 * CreateComponentKit( {
 *    appearance: { ... }
 *    component: ( props : Props ) => ...
 * } )
 */
export function CreateComponentKit(definition) {
    const appearance = (new CoreAppearance());
    return (p) => definition.component(p)
        .manipulate(element => element.classname((typeof definition.appearance == 'string'
        ? appearance.inject(definition.appearance)
        : (Array.isArray(definition.appearance)
            ? appearance.inject(definition.appearance)
            : appearance.sheet(definition.appearance))).mount().uid));
}
/**
 * aune — AUN Virtual Element
 * @description Instance fonctionnelle d'usage des éléments AUN
 * @param tagname Nom de la balise HTML
 * @example aun<HTMLSpanElement>( 'span' )
 */
export function aune(tagname) {
    return (new AunElement(tagname));
}
/**
 * RawWidget
 * @description Instance fonctionnelle d'usage des Widgets AUN
 * @param tagname Nom de la balise HTML
 * @param props Propriétés du widget
 * @example RawWidget<PropsType, HTMLSpanElement>( 'span', props )
 */
export function RawWidget(tagname, props) {
    const widget = (new AunWidget(tagname, props));
    widget.emitter.dispatch('beforeRendering', widget);
    widget.render();
    widget.emitter.dispatch('afterRendering', widget);
    return widget;
}
/**
 * Widget
 * @description Créer une couche de calque
 * @param props Propriétés du widget. La propriété `child` représente les enfants du widget (contenu)
 * @example Widget<PropsType>({
 * child: ...
 * otherProp: ...
 * })
 */
export function Widget(props) {
    return RawWidget('div', props);
}
/**
 * CreateCustomWidget
 * @description Créer un widget Personnalisé
 * @param tagname nom de la balise encapsulé
 * @param props Propriétés
 */
export function CreateCustomWidget(tagname, props) {
    return setWidgetProperty(RawWidget(tagname, props), props);
}
/**
 * Textual
 * @description Calque destiné aux textes
 * @param props Propriétés du widget. La propriété `child` représente contenu de type string
 * @example Textual<PropsType>({
 * child: ...
 * otherProp: ...
 * })
 */
export function TextWidget(props) {
    return RawWidget('span', props);
}
/**
 * Image
 * @description Calque aus images
 * @param props Propriétés du widget.
 * @example ImageWidget<PropsType>({
 * src: ...
 * })
 */
export function ImageWidget(props) {
    return RawWidget('img', props)
        .manipulate(e => {
        Object.entries(props).forEach(({ 0: name, 1: value }) => {
            if (name == 'mode') {
                return;
            }
            const attr = {};
            attr[name] = value;
            e.attribute(attr);
        });
        if (props.mode) {
            e.style({ objectFit: props.mode || '' });
        }
    });
}
/**
 * InputWidget
 * @description Calque de champs de texte
 * @param props Propriétés de champs de texte
 * @example
 * InputWidget({
 *    type: 'text',
 *    value: 'content',
 *    ...
 * })
 */
export function InputWidget(props) {
    return CreateCustomWidget('input', props);
}
/**
 * VideoWidget
 * @param props Propriétés
 */
export function VideoWidget(props) {
    return CreateCustomWidget('video', props);
}
/**
 * VideoWidget
 * @param props Propriétés
 */
export function AudioWidget(props) {
    return CreateCustomWidget('audio', props);
}
/**
 * iFrameWidget
 * @param props Propriétés
 * @example
 * iFrameWidget({
 *    src: 'example.html'
 * })
 */
export function iFrameWidget(props) {
    return CreateCustomWidget('iframe', props);
}
/**
 * ButtonWidget
 * @param props Propriétés
 * @example
 * ButtonWidget({
 *    child: ...
 * })
 */
export function ButtonWidget(props) {
    return RawWidget('button', props);
}
/**
 * FormWidget
 * @description Calque de Formulaire
 * @param props Propriétés de formulaire
 * @example
 * FormWidget({
 *    method: 'post',
 *    action: 'publish',
 * })
 */
export function FormWidget(props) {
    return setWidgetProperty(RawWidget('form', props), props);
}
/**
 * FormWidget
 * @description Calque de Formulaire
 * @param props Propriétés de formulaire
 * @example
 * FormWidget({
 *    method: 'post',
 *    action: 'publish',
 * })
 */
export function AnchorWidget(props) {
    return setWidgetProperty(RawWidget('a', props), props);
}
// export function ModalWidget(props: IModalProps): IWidget<IModalProps, HTMLFormElement> {
//   let modal: IPresenters<IPresenterModalProps> | undefined = undefined;
//   const state = CreateState<IModalStateProps>({
//     open: props.isOpen || false,
//   });
//   const widget = Widget({
//     child: props.child
//   });
//   modal = Presenters.context(
//     new ModalPresenter(widget.element.instance, {
//       host: widget.element.instance.parentElement,
//     })
//   );
//   props.trigger.ready(() => {
//     console.log('Ready Modal->', modal)
//     props.trigger.element.on('click', () => {
//       if (state.value.open) modal?.open()
//       else modal?.close()
//       state.set({ open: !state.value.open });
//     })
//     if (props.isOpen) modal?.open()
//   })
//   return props.trigger;
// }
// export function SheetWidget(){}
// export function ActionSheetWidget(){}
// export function ListSheetWidget(){}
// export function DroplistWidget(){}
// export function ButtonWidget(){}
// export function ImageWidget(){}
// export function ScrollWidget(){}
// export function FormWidget(){}
/**
 * View
 * @param component Composant utilisé pour la vue
 * @param options Options de la vue
 */
export function View(component, options) {
    return new AunView(component, options);
}
export function CreateStackViews(views, options = {}) {
    aunWindow.CurrentStackViews = aunWindow.CurrentStackViews || new AunStackViews(views, options);
    return aunWindow.CurrentStackViews;
}
/**
 * CurrentStackViews
 * @description Obtenir la pile de vues actuelle
 */
export function CurrentStackViews() {
    return aunWindow.CurrentStackViews;
}
/**
 * AUN Construct
 * @description Construire un composant à partir des enfants
 * @param component Composant cible
 * @param child Enfant à injecter
 * @example Construct<ComponentType>( component, child )
 * Construct( component, child )
 */
export function Construct(component, child) { return (new AunConstruct()).make(component, child); }
/**
 * CreateComponent
 * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt.
 * @param name
 * @param widgetConstructor
 * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWidgetStandardProps ) => ... )
 */
export function CreateComponent(name, widgetConstructor) {
    if (!(aunWindow.AUNHW instanceof MutationObserver)) {
        ActiveAutoHydrateComponents();
    }
    HydrateComponentQueue(name, widgetConstructor);
    return widgetConstructor;
}
/**
 * HydrateComponentQueue
 * @description Fil d'attente des hydration des composants AUN
 * @param name CNom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant AUN
 * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
 */
export function HydrateComponentQueue(name, widgetConstructor) {
    if (aunWindow.AUNRC) {
        aunWindow.AUNRC[(name).toUpperCase()] = widgetConstructor;
    }
    HydrateComponent(name, widgetConstructor);
    return widgetConstructor;
}
/**
 * HydrateComponent
 * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant AUN
 * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
 */
export function HydrateComponent(name, widgetConstructor) {
    const refs = document.querySelectorAll(`${name}`);
    /**
     * Références liste
     */
    refs.forEach(ref => {
        /**
         * Extraction des props
         */
        const props = ExtractProps(ref.attributes);
        props.html = ref.innerHTML;
        /**
         * Mise en place du composant
         */
        const widget = widgetConstructor(props);
        /**
         * Remplacement
         */
        ref.parentNode?.replaceChild(widget.element.instance, ref);
    });
    return widgetConstructor;
}
/**
 * ExtractProps
 * @description Extraction des propriétés dans le constructeur d'un composant
 * @param attributes Contenu de la propriété "HTMLElement.attributes"
 * @example ExtractProps<PropsType>( element.attributes )
 */
export function ExtractProps(attributes) {
    const props = {};
    Object.values(attributes).forEach(attribute => {
        props[attribute.name] = attribute.value;
    });
    return props;
}
/**
 * ActiveAutoHydrateComponents
 * @description Active l'hydratation automatique des composants
 * @example ActiveAutoHydrateComponents()
 */
export function ActiveAutoHydrateComponents() {
    aunWindow.AUNHW = aunWindow.AUNHW || new MutationObserver(mutations => {
        const storeKeys = Object.keys(aunWindow.AUNRC || {});
        mutations.forEach(mutation => {
            if (mutation.type == 'childList' &&
                mutation.target instanceof HTMLElement) {
                mutation.addedNodes.forEach(target => {
                    if (target instanceof HTMLElement && storeKeys.includes(target.tagName.toUpperCase())) {
                        HydrateComponent(target.tagName, (aunWindow.AUNRC || {})[target.tagName]);
                    }
                });
            }
        });
    });
    aunWindow.AUNHW.observe(document.body, {
        subtree: true,
        childList: true,
    });
    return aunWindow.AUNHW;
}
/**
 * AUN
 * @description Exportations des fonctionnalités de base du framework
 */
export default class AUN {
}
/**
 * Instance
 * @alias Window aslias de l'object window avec le types des données de AUN
 */
AUN.Instance = aunWindow;
/**
 * aune — AUN Virtual Element
 * @alias aune
 * @description Instance fonctionnelle d'usage des éléments AUN
 */
AUN.Element = aune;
/**
 * RawWidget
 * @alias RawWidget
 * @description Instance fonctionnelle d'usage des Widgets AUN
 */
AUN.RawWidget = RawWidget;
/**
 * Construct
 * @alias Construct
 * @description Construire un composant via AunConstruct
 */
AUN.Construct = Construct;
/**
 * Widget
 * @alias Widget
 * @description Créer une couche de calque
 */
AUN.Widget = Widget;
/**
 *
 */
AUN.InputWidget = InputWidget;
/**
 * Textual
 * @alias TextWidget
 * @description Calque destiné aux textes
 */
AUN.Textual = TextWidget;
/**
 * CreateState
 * @description Instance fonctionnelle d'usage de gestion des états AUN
 */
AUN.CreateState = CreateState;
/**
 * DropComponent
 * @description Lier un composant à une cicle
 */
AUN.DropComponent = DropComponent;
/**
 * DropComponents
 * @description Lier plusieurs composants à plusieurs cicles
 */
AUN.DropComponents = DropComponents;
// /**
//  * InstantiateComponent
//  * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies
//  */
// static InstantiateComponent = InstantiateComponent;
/**
 * AsyncComponent
 * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement.
 */
AUN.AsyncComponent = AsyncComponent;
/**
 * UseComponent
 * @description Utiliser un composant dans une / plusieurs cibles
 */
AUN.UseComponent = UseComponent;
