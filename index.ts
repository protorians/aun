
import CoreAppearance from "@protorians/core/appearance";
import {
  AunConstruct,
  AunElement,
  AunState,
  AunWidget,
  AunView,
  AunStackViews,
} from "./foundations";

import {
  AUNWindow,
  IAttributesMap,
  IChildren,
  IComponentConstructor,
  IHydrateComponent,
  IKitProps,
  IImageProps,
  INode,
  IStackViewsList,
  IStackViewsOptions,
  IState,
  IViewOptions,
  IWidget,
  IWidgetAsyncCallback,
  IWTarget,
  ITextProps,
  IWidgetStandardProps,
  IInputProps,
  IFormProps,
  IModalProps,
  IModalStateProps,
  IButtonProps,
  IWidgetProps,
  IStackViews,
  IVideoProps,
  IAudioProps,
  IIFrameProps,
  IWidgetTableCellProps,
  IWidgetTableSectionProps,
  IWidgetGlobalStandardProps,
  IWidgetTableProps,
  IWidgetHTMLGlobalProps,
} from "./types";
import { IPresenterModalProps, IPresenters, IProps } from "@protorians/core/types";
import { UnCamelize } from "@protorians/core/utilities";
import Presenters, { ModalPresenter } from "@protorians/core/presenters";


const aunWindow: AUNWindow = Object.assign({}, {

  _CurrentStackViews: undefined,

}, window)

aunWindow.AUNRC = aunWindow.AUNRC || {}



/**
 * WidgetWhitelistProps
 * @description Liste des propriétés réservés aux traitement des widgets
 */
export const WidgetWhitelistProps: string[] = ('style removeStyle toggleClassname classname removeClassname inlineClassname measure offset html append data attribute removeAttribute toggleAttribute attributeNS').split(' ')


/**
 * setWidgetProperty
 * @param widget Widget cible
 * @param props Propriété à analyser
 */
export function setWidgetProperty<

  P extends IProps,

  H extends HTMLElement

>(widget: IWidget<P, H>, props: IProps): IWidget<P, H> {

  Object.entries(props).forEach(({ 0: name, 1: value }) => {

    if (WidgetWhitelistProps.indexOf(name) > -1) {

      name = UnCamelize(name);

      switch (typeof value) {

        case 'number':

        case 'string':

          widget.element.instance.setAttribute(`${name}`, `${value}`)

          break;


        case 'boolean':

          if (value)

            widget.element.instance.setAttribute(`${name}`, `${name}`)

          break;

      }

    }

  })

  return widget;

}




/**
 * CreateState
 * @description Instance fonctionnelle d'usage de gestion des états AUN
 * @param state Valeur par default de l'état
 * @example CreateState<StateType>( stateValue )
 */
export function CreateState<S extends IState>(state: S) {

  return new AunState<S>(state);

}


/**
 * DropComponent
 * @param target Balise HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur
 * @param component Composant à deposer
 * @description Lier un composant à une cicle 
 * @example DropComponent<PropsType>( '#root', Component( { ... } ) )
 * DropComponent<PropsType>( document.getElementById('root'), Component( { ... } ) )
 */
export function DropComponent<P extends IWidgetStandardProps, E extends INode>(

  component: IWidget<P, E>,

  target: INode,

) {

  target.append(component.element.instance)

  return component

}


/**
 * DropComponents
 * @description Lier plusieurs composants à plusieurs cicles.
 * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant à deposer dans l'élément HTML
 * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
 */
export function DropComponents<P extends IWidgetStandardProps, E extends INode>(

  component: IWidget<P, E>,

  targets: NodeListOf<INode>,

) {

  targets.forEach(target => DropComponent(component, target))

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
export async function AsyncComponent<P extends IWidgetStandardProps, E extends INode>(callback: IWidgetAsyncCallback): Promise<IWidget<P, E>> {

  return (new Promise<IWidget<any, any>>(callback))

}


/**
 * UseComponent
 * @description Utiliser un composant dans une / plusieurs cibles
 * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant instancié
 * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
 * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
 */
export function UseComponent<P extends IWidgetStandardProps, E extends INode>(

  component: IWidget<any, any>,

  target: IWTarget,

) {

  if (typeof target == 'string') {

    DropComponents<P, E>(component, document.querySelectorAll(target))

  }

  else if (target instanceof NodeList) {

    DropComponents<P, E>(component, target)

  }

  else if (target instanceof HTMLElement) {

    DropComponent<P, E>(component, target)

  }

  else if (target instanceof AunElement) {

    DropComponent<P, E>(component, target.instance)

  }

  return component as IWidget<P, E>;

}


/**
 * CreateKit
 * @description Créer un Kit Composant
 * @param definition Définition du Kit
 * @example
 * CreateKit( {
 *    appearance: { ... }
 *    component: ( props : Props ) => ...
 * } )
 */
export function CreateKit(definition: IKitProps) {

  return <P extends IWidgetStandardProps, E extends INode>(p: P) =>

    (definition.component(p) as IWidget<P, E>)

      .manipulate(element => element.classname(

        (new CoreAppearance()).sheet(definition.appearance).mount().uid

      ))

    ;

}


/**
 * aune — AUN Virtual Element
 * @description Instance fonctionnelle d'usage des éléments AUN
 * @param tagname Nom de la balise HTML
 * @example aun<HTMLSpanElement>( 'span' )
 */
export function aune<E extends INode>(tagname: string) {

  return (new AunElement<E>(tagname))

}


/**
 * RawWidget
 * @description Instance fonctionnelle d'usage des Widgets AUN
 * @param tagname Nom de la balise HTML
 * @param props Propriétés du widget
 * @example RawWidget<PropsType, HTMLSpanElement>( 'span', props )
 */
export function RawWidget<P extends IWidgetStandardProps, E extends INode>(tagname: string, props: P) {

  const widget = (new AunWidget<P, E>(tagname, props))

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
export function Widget(props: IWidgetProps): IWidget<IWidgetProps, HTMLDivElement> {

  return RawWidget<IWidgetProps, HTMLDivElement>('div', props);

}

/**
 * CreateCustomWidget
 * @description Créer un widget Personnalisé
 * @param tagname nom de la balise encapsulé
 * @param props Propriétés
 */
export function CreateCustomWidget<

  P extends IProps,

  H extends HTMLElement

>(tagname: string, props: P) {

  return setWidgetProperty<P, H>(

    RawWidget<P, H>(tagname, props),

    props

  );

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
export function TextWidget(props: ITextProps): IWidget<ITextProps, HTMLSpanElement> {

  return RawWidget<ITextProps, HTMLSpanElement>('span', props)

}


/**
 * Image
 * @description Calque aus images
 * @param props Propriétés du widget.
 * @example ImageWidget<PropsType>({
 * src: ...
 * })
 */
export function ImageWidget(props: IImageProps): IWidget<IImageProps, HTMLImageElement> {

  return RawWidget<IImageProps, HTMLImageElement>('img', props)

    .manipulate(e => {

      Object.entries(props).forEach(({ 0: name, 1: value }) => {

        if (name == 'mode') { return; }

        const attr: IAttributesMap = {};

        attr[name] = value;

        e.attribute(attr);

      });

      if (props.mode) {

        e.style({ objectFit: props.mode || '' });

      }

    })

    ;

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
export function InputWidget(props: IInputProps): IWidget<IInputProps, HTMLInputElement> {

  return CreateCustomWidget<IInputProps, HTMLInputElement>('input', props)

}



/**
 * VideoWidget
 * @param props Propriétés
 */
export function VideoWidget(props: IVideoProps): IWidget<IVideoProps, HTMLVideoElement> {

  return CreateCustomWidget<IVideoProps, HTMLVideoElement>('video', props)

}



/**
 * VideoWidget
 * @param props Propriétés
 */
export function AudioWidget(props: IAudioProps): IWidget<IAudioProps, HTMLAudioElement> {

  return CreateCustomWidget<IAudioProps, HTMLAudioElement>('audio', props)

}



/**
 * iFrameWidget
 * @param props Propriétés
 * @example
 * iFrameWidget({
 *    src: 'example.html'
 * })
 */
export function iFrameWidget(props: IIFrameProps): IWidget<IIFrameProps, HTMLIFrameElement> {

  return CreateCustomWidget<IIFrameProps, HTMLIFrameElement>('iframe', props)

}



/**
 * ButtonWidget
 * @param props Propriétés
 * @example 
 * ButtonWidget({
 *    child: ...
 * })
 */
export function ButtonWidget(props: IButtonProps): IWidget<IButtonProps, HTMLButtonElement> {

  return RawWidget<IButtonProps, HTMLButtonElement>('button', props);

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
export function FormWidget(props: IFormProps): IWidget<IFormProps, HTMLFormElement> {

  return setWidgetProperty<IFormProps, HTMLFormElement>(

    RawWidget<IFormProps, HTMLFormElement>('form', props),

    props

  );

}




/**
 * TableCellWidget
 * @param props Propriétés
 */
export function TableCellWidget(props: IWidgetTableCellProps): IWidget<IWidgetTableCellProps, HTMLTableCellElement> {

  return CreateCustomWidget<IWidgetTableCellProps, HTMLTableCellElement>('td', props)

}

/**
 * TableRowWidget
 * @param props Propriétés
 */
export function TableRowWidget(props: IWidgetTableSectionProps): IWidget<IWidgetTableSectionProps, HTMLTableRowElement> {

  return CreateCustomWidget<IWidgetTableSectionProps, HTMLTableRowElement>('tr', props)

}


/**
 * TableHeadWidget
 * @param props Propriétés
 */
export function TableHeaderWidget(props: IWidgetTableCellProps): IWidget<IWidgetTableCellProps, HTMLTableCellElement> {

  return CreateCustomWidget<IWidgetTableCellProps, HTMLTableCellElement>('th', props)

}


/**
 * TableHeadWidget
 * @param props Propriétés
 */
export function TableHeadWidget(props: IWidgetTableCellProps): IWidget<IWidgetTableCellProps, HTMLTableCellElement> {

  return CreateCustomWidget<IWidgetTableCellProps, HTMLTableCellElement>('thead', props)

}


/**
 * TableBodyWidget
 * @param props Propriétés
 */
export function TableBodyWidget(props: IWidgetTableSectionProps): IWidget<IWidgetTableSectionProps, HTMLTableSectionElement> {

  return CreateCustomWidget<IWidgetTableSectionProps, HTMLTableSectionElement>('tbody', props)

}


/**
 * TableFootWidget
 * @param props Propriétés
 */
export function TableFootWidget(props: IWidgetTableSectionProps): IWidget<IWidgetTableSectionProps, HTMLTableSectionElement> {

  return CreateCustomWidget<IWidgetTableSectionProps, HTMLTableSectionElement>('tfoot', props)

}


/**
 * TableCaptionWidget
 * @param props Propriétés
 */
export function TableCaptionWidget(props: IWidgetGlobalStandardProps): IWidget<IWidgetGlobalStandardProps, HTMLTableCaptionElement> {

  return CreateCustomWidget<IWidgetGlobalStandardProps, HTMLTableCaptionElement>('caption', props)

}



/**
 * TableWidget
 * @description Créer un tableau
 * @param props 
 */
export function TableWidget(props: IWidgetTableProps): IWidget<IWidgetHTMLGlobalProps, HTMLTableElement> {

  const table = CreateCustomWidget<IWidgetHTMLGlobalProps, HTMLTableElement>('table', props.table || {})

  const caption = TableCaptionWidget({ child: props.caption || undefined, })

  const head = TableHeadWidget({ child: undefined, })

  const bodies = TableBodyWidget({ child: undefined, })

  const footer = TableFootWidget({ child: undefined, })


  props.headers.forEach((header, index) => {

    // Make Header
    head.element.append(

      TableHeaderWidget({

        child: props.bodyItemWidget ? props.bodyItemWidget({ index, value: header }) : header

      }).element.instance

    );

    // Make Body
    if (props.body && props.body[index]) {

      const body = TableRowWidget({ child: undefined, })

      props.body[index].forEach(bodyContent => {

        body.element.append(

          TableCellWidget({

            child: props.bodyItemWidget ? props.bodyItemWidget({ index, value: bodyContent }) : bodyContent,

          }).element.instance

        )

      });

      bodies.element.append(body.element.instance)

    }

    // Make Footer
    if (props.foots && props.foots[index]) {

      const foot = TableRowWidget({ child: undefined, })

      props.foots[index].forEach(footContent => {

        foot.element.append(

          TableCellWidget({

            child: props.footerItemWidget ? props.footerItemWidget({ index, value: footContent }) : footContent,

          }).element.instance

        )

      });

      footer.element.append(foot.element.instance)

    }


  })

  table.element.append(

    caption.element.instance,

    head.element.instance,

    bodies.element.instance,

    footer.element.instance

  );

  return table;

}




export function ModalWidget(props: IModalProps): IWidget<IModalProps, HTMLFormElement> {

  let modal: IPresenters<IPresenterModalProps> | undefined = undefined;

  const state = CreateState<IModalStateProps>({

    open: props.isOpen || false,

  });

  const widget = Widget({

    child: props.child

  });

  modal = Presenters.context(

    new ModalPresenter(widget.element.instance, {

      host: widget.element.instance.parentElement,

    })

  );

  props.trigger.ready(() => {

    console.log('Ready Modal->', modal)

    props.trigger.element.on('click', () => {

      if (state.value.open) modal?.open()

      else modal?.close()

      state.set({ open: !state.value.open });

    })

    if (props.isOpen) modal?.open()

  })

  return props.trigger;

}


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
export function View<C extends IWidgetStandardProps>(component: IComponentConstructor, options?: IViewOptions<C> | undefined) {

  return new AunView<C>(component, options)

}

export function CreateStackViews<Scheme>(

  views: IStackViewsList<Scheme>,

  options: IStackViewsOptions<Scheme> = {}

) {

  aunWindow.CurrentStackViews = aunWindow.CurrentStackViews || new AunStackViews<Scheme>(views, options)

  return aunWindow.CurrentStackViews as IStackViews<Scheme>;

}





/**
 * CurrentStackViews
 * @description Obtenir la pile de vues actuelle
 */
export function CurrentStackViews<Scheme>() {

  return aunWindow.CurrentStackViews as IStackViews<Scheme>;

}






/**
 * AUN Construct
 * @description Construire un composant à partir des enfants
 * @param component Composant cible
 * @param child Enfant à injecter
 * @example Construct<ComponentType>( component, child )
 * Construct( component, child )
 */
export function Construct<Component extends IWidget<IWidgetStandardProps, INode>>(

  component: Component,

  child: IChildren

) { return (new AunConstruct()).make(component, child) }



/**
 * CreateComponent
 * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt. 
 * @param name 
 * @param widgetConstructor 
 * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWidgetStandardProps ) => ... )
 */
export function CreateComponent<P extends IWidgetStandardProps>(

  name: string,

  widgetConstructor: IHydrateComponent<any, HTMLElement>

): IHydrateComponent<P, HTMLElement> {

  if (!(aunWindow.AUNHW instanceof MutationObserver)) {

    ActiveAutoHydrateComponents()

  }

  HydrateComponentQueue<P>(name, widgetConstructor)

  return widgetConstructor

}



/**
 * HydrateComponentQueue
 * @description Fil d'attente des hydration des composants AUN
 * @param name CNom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant AUN
 * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
 */
export function HydrateComponentQueue<P extends IWidgetStandardProps>(

  name: string,

  widgetConstructor: IHydrateComponent<any, HTMLElement>

) {

  if (aunWindow.AUNRC) {

    aunWindow.AUNRC[(name).toUpperCase()] = widgetConstructor

  }

  HydrateComponent<P>(name, widgetConstructor)

  return widgetConstructor;

}


/**
 * HydrateComponent
 * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant AUN
 * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
 */
export function HydrateComponent<P extends IWidgetStandardProps>(

  name: string,

  widgetConstructor: IHydrateComponent<any, HTMLElement>

) {

  const refs = document.querySelectorAll<Element>(`${name}`)

  /**
   * Références liste
   */
  refs.forEach(ref => {

    /**
     * Extraction des props
     */
    const props = ExtractProps<P>(ref.attributes)

    props.child = ref.innerHTML || undefined;

    /**
     * Mise en place du composant
     */
    const widget = widgetConstructor(props)

    /**
     * Remplacement
     */
    ref.parentNode?.replaceChild(widget.element.instance, ref)

  })


  return widgetConstructor;

}

/**
 * ExtractProps
 * @description Extraction des propriétés dans le constructeur d'un composant
 * @param attributes Contenu de la propriété "HTMLElement.attributes"
 * @example ExtractProps<PropsType>( element.attributes )
 */
export function ExtractProps<P extends IWidgetStandardProps>(attributes: NamedNodeMap): P {

  const props: P = {} as P

  Object.values(attributes).forEach(attribute => {

    props[attribute.name as keyof P] = attribute.value as P[keyof P]

  })

  return props;

}



/**
 * ActiveAutoHydrateComponents
 * @description Active l'hydratation automatique des composants
 * @example ActiveAutoHydrateComponents()
 */
export function ActiveAutoHydrateComponents() {

  aunWindow.AUNHW = aunWindow.AUNHW || new MutationObserver(mutations => {

    const storeKeys = Object.keys(aunWindow.AUNRC || {})

    mutations.forEach(mutation => {

      if (

        mutation.type == 'childList' &&

        mutation.target instanceof HTMLElement

      ) {

        mutation.addedNodes.forEach(target => {

          if (target instanceof HTMLElement && storeKeys.includes(target.tagName.toUpperCase())) {

            HydrateComponent(target.tagName, (aunWindow.AUNRC || {})[target.tagName])

          }

        })

      }

    })

  })

  aunWindow.AUNHW.observe(document.body, {

    subtree: true,

    childList: true,

  })

  return aunWindow.AUNHW;

}




/**
 * AUN
 * @description Exportations des fonctionnalités de base du framework 
 */
export default class AUN {

  /**
   * Instance 
   * @alias Window aslias de l'object window avec le types des données de AUN
   */
  static Instance = aunWindow;



  /**
   * aune — AUN Virtual Element
   * @alias aune
   * @description Instance fonctionnelle d'usage des éléments AUN
   */
  static Element = aune;

  /**
   * RawWidget
   * @alias RawWidget
   * @description Instance fonctionnelle d'usage des Widgets AUN
   */
  static RawWidget = RawWidget;

  /**
   * Construct
   * @alias Construct
   * @description Construire un composant via AunConstruct
   */
  static Construct = Construct;

  /**
   * Widget
   * @alias Widget
   * @description Créer une couche de calque
   */
  static Widget = Widget;

  /**
   * 
   */
  static InputWidget = InputWidget;

  /**
   * Textual
   * @alias TextWidget
   * @description Calque destiné aux textes
   */
  static Textual = TextWidget;

  /**
   * CreateState
   * @description Instance fonctionnelle d'usage de gestion des états AUN
   */
  static CreateState = CreateState;

  /**
   * DropComponent
   * @description Lier un composant à une cicle 
   */
  static DropComponent = DropComponent;

  /**
   * DropComponents
   * @description Lier plusieurs composants à plusieurs cicles 
   */
  static DropComponents = DropComponents;

  // /**
  //  * InstantiateComponent
  //  * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies
  //  */
  // static InstantiateComponent = InstantiateComponent;

  /**
   * AsyncComponent
   * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. 
   */
  static AsyncComponent = AsyncComponent;

  /**
   * UseComponent
   * @description Utiliser un composant dans une / plusieurs cibles
   */
  static UseComponent = UseComponent;


}


